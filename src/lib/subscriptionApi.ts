import { supabase } from '@/lib/supabase'

export type PlanKey = 'weekly' | 'monthly' | 'yearly'

export type SubscriptionsMeResponse = {
  user_id: string
  user_type: string | null
  is_consultant: boolean
  basic_profile_complete: boolean
  full_profile_complete: boolean
  vetting_status: string | null
  vetted_approved: boolean
  access_allowed: boolean
  can_bid_internal: boolean
  stripe_billing_customer_id: string | null
  plan_key: string | null
  subscription_status: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  grace_period_ends_at: string | null
  stripe_subscription_id: string | null
}

export async function fetchSubscriptionsMe(): Promise<SubscriptionsMeResponse | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) return null
  const res = await fetch('/.netlify/functions/subscriptions-me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${session.access_token}` },
  })
  if (!res.ok) return null
  return res.json() as Promise<SubscriptionsMeResponse>
}

export async function createCheckoutSession(planKey: PlanKey): Promise<{ url?: string; error?: string }> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) return { error: 'not_authenticated' }
  const siteOrigin = typeof window !== 'undefined' ? window.location.origin : undefined
  const res = await fetch('/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ planKey, ...(siteOrigin ? { siteOrigin } : {}) }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = body as { error?: string; message?: string }
    return { error: err.error || err.message || `checkout_${res.status}` }
  }
  return { url: (body as { url?: string }).url }
}

export async function createPortalSession(): Promise<{ url?: string; error?: string }> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) return { error: 'not_authenticated' }
  const siteOrigin = typeof window !== 'undefined' ? window.location.origin : undefined
  const res = await fetch('/.netlify/functions/create-portal-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ ...(siteOrigin ? { siteOrigin } : {}) }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { error: (body as { error?: string }).error || `portal_${res.status}` }
  }
  return { url: (body as { url?: string }).url }
}

export function normalizePlanKey(raw: string | null): PlanKey | null {
  if (!raw) return null
  const k = raw.toLowerCase()
  if (k === 'weekly' || k === 'monthly') return k
  if (k === 'yearly' || k === 'annual') return 'yearly'
  return null
}
