import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { PlanKey } from '@/lib/subscriptionApi'

export type PricingPlansGridMode = 'marketing' | 'checkout'

export interface PricingPlansGridProps {
  mode: PricingPlansGridMode
  onSubscribe?: (plan: PlanKey) => void | Promise<void>
  checkoutLoadingPlan?: PlanKey | null
  showDisclaimer?: boolean
}

/**
 * Three-tier pricing cards — shared by /pricing and Settings (checkout modal).
 */
export function PricingPlansGrid({
  mode,
  onSubscribe,
  checkoutLoadingPlan = null,
  showDisclaimer = true,
}: PricingPlansGridProps) {
  const busy = checkoutLoadingPlan !== null

  function CheckoutButton(plan: PlanKey, className: string, variant: 'default' | 'outline') {
    const loading = checkoutLoadingPlan === plan
    return (
      <Button
        type="button"
        variant={variant}
        className={className}
        disabled={busy && !loading}
        onClick={() => onSubscribe?.(plan)}
      >
        {loading ? 'Redirecting…' : 'Subscribe'}
      </Button>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 items-stretch">
        <Card className="relative flex flex-col border-slate-200 shadow-md rounded-2xl">
          <CardHeader className="text-center pb-2 pt-8">
            <Badge variant="outline" className="mx-auto mb-3 border-[#0284C7]/40 text-[#0284C7] bg-[#0284C7]/5">
              Easy trial
            </Badge>
            <CardTitle className="text-xl text-[#012E46]">7-Day Access Pass</CardTitle>
            <div className="mt-6">
              <span className="text-4xl font-bold text-[#012E46]">US$15.99</span>
            </div>
            <CardDescription className="text-[#6B7280] text-base mt-1">7 days of full access</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 pt-2 px-6">
            <p className="text-sm text-[#6B7280] text-center">
              A short-term pass for professionals who want to explore current opportunities before committing.
            </p>
            <ul className="space-y-2.5 text-sm text-[#374151]">
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" aria-hidden />
                View full gig details
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" aria-hidden />
                Access internal and external opportunities
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" aria-hidden />
                Apply externally to curated roles
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" aria-hidden />
                Bid on internal gigs once vetted
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" aria-hidden />
                Ideal for testing GigExecs for a week
              </li>
            </ul>
            <p className="text-xs text-[#9CA3AF] text-center italic pt-1">
              Most members switch to monthly after their first week.
            </p>
          </CardContent>
          <CardFooter className="px-6 pb-8 pt-2 flex flex-col gap-2">
            {mode === 'marketing' ? (
              <>
                <Button variant="outline" className="w-full border-[#012E46] text-[#012E46] hover:bg-[#F5F5F5]" asChild>
                  <Link to="/auth/register?userType=consultant&plan=weekly&redirect=/subscribe/continue">Start with 7 days</Link>
                </Button>
                <Link
                  to="/auth/login?plan=weekly&redirect=/subscribe/continue"
                  className="text-center text-sm text-[#0284C7] hover:underline"
                >
                  Already have an account? Log in to subscribe
                </Link>
              </>
            ) : (
              CheckoutButton('weekly', 'w-full border-[#012E46] text-[#012E46] hover:bg-[#F5F5F5]', 'outline')
            )}
          </CardFooter>
        </Card>

        <Card className="relative flex flex-col rounded-2xl border-2 border-[#CC9B0A] shadow-xl lg:scale-[1.03] z-[1] bg-white ring-1 ring-[#CC9B0A]/20">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-[#CC9B0A] hover:bg-[#CC9B0A] text-white border-0 px-4 py-1 shadow-sm">Most popular</Badge>
          </div>
          <CardHeader className="text-center pb-2 pt-10">
            <CardTitle className="text-xl text-[#012E46] pt-1">Monthly Access</CardTitle>
            <div className="mt-6">
              <span className="text-4xl font-bold text-[#012E46]">US$44.99</span>
            </div>
            <CardDescription className="text-[#6B7280] text-base mt-1">per month</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 pt-2 px-6">
            <p className="text-sm text-[#6B7280] text-center">
              Best for professionals actively exploring flexible work and wanting continuous access to new opportunities
              — including fractional work opportunities and contract pathways aligned with your expertise.
            </p>
            <ul className="space-y-2.5 text-sm text-[#374151]">
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#CC9B0A] shrink-0 mt-0.5" aria-hidden />
                Everything in the 7-day pass
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#CC9B0A] shrink-0 mt-0.5" aria-hidden />
                Continuous access to new gigs
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#CC9B0A] shrink-0 mt-0.5" aria-hidden />
                Better value than renewing weekly
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#CC9B0A] shrink-0 mt-0.5" aria-hidden />
                Ideal for active opportunity search
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#CC9B0A] shrink-0 mt-0.5" aria-hidden />
                Stay visible and ready for matched opportunities
              </li>
            </ul>
          </CardContent>
          <CardFooter className="px-6 pb-8 pt-2 flex flex-col gap-2">
            {mode === 'marketing' ? (
              <>
                <Button className="w-full bg-[#CC9B0A] hover:bg-[#B88A09] text-white font-semibold" asChild>
                  <Link to="/auth/register?userType=consultant&plan=monthly&redirect=/subscribe/continue">Choose monthly</Link>
                </Button>
                <Link
                  to="/auth/login?plan=monthly&redirect=/subscribe/continue"
                  className="text-center text-sm text-[#0284C7] hover:underline"
                >
                  Already have an account? Log in to subscribe
                </Link>
              </>
            ) : (
              CheckoutButton('monthly', 'w-full bg-[#CC9B0A] hover:bg-[#B88A09] text-white font-semibold', 'default')
            )}
          </CardFooter>
        </Card>

        <Card className="relative flex flex-col border-slate-200 shadow-md rounded-2xl">
          <CardHeader className="text-center pb-2 pt-8">
            <Badge variant="outline" className="mx-auto mb-3 border-[#012E46]/30 text-[#012E46] bg-[#012E46]/5">
              Best value
            </Badge>
            <CardTitle className="text-xl text-[#012E46]">Annual Access</CardTitle>
            <div className="mt-6">
              <span className="text-4xl font-bold text-[#012E46]">US$399</span>
            </div>
            <CardDescription className="text-[#6B7280] text-base mt-1">per year</CardDescription>
            <p className="text-sm font-medium text-[#0284C7] mt-2">Equivalent to US$33.25/month.</p>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 pt-2 px-6">
            <p className="text-sm text-[#6B7280] text-center">
              The best value for independent professionals who want always-on access to senior flexible work
              opportunities — including advisory, fractional, and portfolio-style careers.
            </p>
            <ul className="space-y-2.5 text-sm text-[#374151]">
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" aria-hidden />
                Everything in Monthly Access
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" aria-hidden />
                Lowest monthly equivalent cost
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" aria-hidden />
                Always-on opportunity access
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" aria-hidden />
                Best for fractional and portfolio professionals
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" aria-hidden />
                Designed for long-term independent careers
              </li>
            </ul>
          </CardContent>
          <CardFooter className="px-6 pb-8 pt-2 flex flex-col gap-2">
            {mode === 'marketing' ? (
              <>
                <Button variant="outline" className="w-full border-[#012E46] text-[#012E46] hover:bg-[#F5F5F5]" asChild>
                  <Link to="/auth/register?userType=consultant&plan=annual&redirect=/subscribe/continue">Save with annual</Link>
                </Button>
                <Link
                  to="/auth/login?plan=annual&redirect=/subscribe/continue"
                  className="text-center text-sm text-[#0284C7] hover:underline"
                >
                  Already have an account? Log in to subscribe
                </Link>
              </>
            ) : (
              CheckoutButton('yearly', 'w-full border-[#012E46] text-[#012E46] hover:bg-[#F5F5F5]', 'outline')
            )}
          </CardFooter>
        </Card>
      </div>

      {showDisclaimer && (
        <div className="mt-10 max-w-3xl mx-auto text-center text-sm text-[#6B7280] space-y-2 px-2">
          <p>
            All plans renew automatically unless you turn off auto-renewal in your subscription settings. You keep access
            until the end of your paid period.
          </p>
          <p>
            Internal gig bidding requires an approved GigExecs profile. External gig access requires an active
            subscription.
          </p>
        </div>
      )}
    </div>
  )
}
