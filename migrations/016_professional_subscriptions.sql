-- Professional subscriptions (PRD v1.1): Stripe-backed billing + local mirror
-- Run after reviewing; RLS: users read own financial rows; writes via service role / webhooks only

-- Billing customer for Stripe Checkout / Customer Portal (separate from Connect payout account)
ALTER TABLE consultant_profiles
  ADD COLUMN IF NOT EXISTS stripe_billing_customer_id TEXT;

COMMENT ON COLUMN consultant_profiles.stripe_billing_customer_id IS 'Stripe Customer id for subscriptions (Billing), not Connect.';

CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_key TEXT NOT NULL UNIQUE CHECK (plan_key IN ('weekly', 'monthly', 'yearly')),
  name TEXT NOT NULL,
  price_amount NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  interval TEXT NOT NULL CHECK (interval IN ('week', 'month', 'year')),
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  plan_key TEXT REFERENCES subscription_plans(plan_key),
  status TEXT NOT NULL DEFAULT 'inactive',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  canceled_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  grace_period_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_sub ON user_subscriptions(stripe_subscription_id);

CREATE TABLE IF NOT EXISTS subscription_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  stripe_invoice_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  amount NUMERIC(12, 2),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT,
  paid_at TIMESTAMPTZ,
  refunded_amount NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscription_payments_user ON subscription_payments(user_id);

CREATE TABLE IF NOT EXISTS subscription_refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES subscription_payments(id) ON DELETE SET NULL,
  requested_by_user_id UUID REFERENCES users(id),
  requested_by_staff_id UUID,
  stripe_refund_id TEXT,
  amount_requested NUMERIC(12, 2),
  amount_refunded NUMERIC(12, 2),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'requested',
  reason TEXT,
  staff_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscription_email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending',
  provider_message_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscription_email_dedupe
  ON subscription_email_events(user_id, event_type, scheduled_for)
  WHERE scheduled_for IS NOT NULL;

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  livemode BOOLEAN
);

-- Seed plans (Stripe price/product ids set in Dashboard + optional UPDATE or env in app)
INSERT INTO subscription_plans (plan_key, name, price_amount, currency, interval, sort_order)
VALUES
  ('weekly', '7-Day Access Pass', 15.99, 'USD', 'week', 1),
  ('monthly', 'Monthly Access', 44.99, 'USD', 'month', 2),
  ('yearly', 'Annual Access', 399.00, 'USD', 'year', 3)
ON CONFLICT (plan_key) DO NOTHING;

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- subscription_plans: public read for active plans only
DROP POLICY IF EXISTS subscription_plans_select_active ON subscription_plans;
CREATE POLICY subscription_plans_select_active ON subscription_plans
  FOR SELECT USING (is_active = true);

-- Own rows read
DROP POLICY IF EXISTS user_subscriptions_select_own ON user_subscriptions;
CREATE POLICY user_subscriptions_select_own ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS subscription_payments_select_own ON subscription_payments;
CREATE POLICY subscription_payments_select_own ON subscription_payments
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS subscription_refunds_select_own ON subscription_refunds;
CREATE POLICY subscription_refunds_select_own ON subscription_refunds
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS subscription_email_events_select_own ON subscription_email_events;
CREATE POLICY subscription_email_events_select_own ON subscription_email_events
  FOR SELECT USING (auth.uid() = user_id);

-- No direct INSERT/UPDATE/DELETE for authenticated users on financial tables (service role bypasses RLS)
DROP POLICY IF EXISTS user_subscriptions_no_mutate ON user_subscriptions;
CREATE POLICY user_subscriptions_no_mutate ON user_subscriptions FOR ALL USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS subscription_payments_no_mutate ON subscription_payments;
CREATE POLICY subscription_payments_no_mutate ON subscription_payments FOR ALL USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS subscription_refunds_no_mutate ON subscription_refunds;
CREATE POLICY subscription_refunds_no_mutate ON subscription_refunds FOR ALL USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS subscription_email_events_no_mutate ON subscription_email_events;
CREATE POLICY subscription_email_events_no_mutate ON subscription_email_events FOR ALL USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS stripe_webhook_events_no_access ON stripe_webhook_events;
CREATE POLICY stripe_webhook_events_no_access ON stripe_webhook_events FOR ALL USING (false) WITH CHECK (false);

COMMENT ON TABLE user_subscriptions IS 'Mirror of Stripe subscription; updated only via webhooks / Netlify service role.';
