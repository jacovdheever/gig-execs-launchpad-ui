import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { normalizePlanKey, createCheckoutSession, type PlanKey } from '@/lib/subscriptionApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

/**
 * After login/register with ?plan=…&redirect=/subscribe/continue, starts Stripe Checkout.
 */
export default function SubscribeContinuePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'working' | 'done' | 'error'>('working')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const fromQuery = normalizePlanKey(searchParams.get('plan'))
      const fromStorage =
        typeof sessionStorage !== 'undefined'
          ? normalizePlanKey(sessionStorage.getItem('gigexecs_checkout_plan'))
          : null
      const plan: PlanKey | null = fromQuery || fromStorage
      if (!plan) {
        setError('No plan selected. Choose a plan on the pricing page.')
        setStatus('error')
        return
      }
      sessionStorage.removeItem('gigexecs_checkout_plan')

      const { url, error: checkoutError } = await createCheckoutSession(plan)
      if (cancelled) return
      if (checkoutError === 'not_authenticated') {
        navigate(`/auth/login?plan=${encodeURIComponent(plan)}&redirect=${encodeURIComponent('/subscribe/continue')}`)
        return
      }
      if (checkoutError === 'basic_profile_required') {
        setError('Complete your basic professional profile before subscribing. You can finish this from your dashboard or profile.')
        setStatus('error')
        return
      }
      if (checkoutError === 'already_subscribed') {
        navigate('/settings', { replace: true })
        return
      }
      if (!url) {
        setError(checkoutError || 'Unable to start checkout. Please try again or contact support.')
        setStatus('error')
        return
      }
      setStatus('done')
      window.location.href = url
    })()
    return () => {
      cancelled = true
    }
  }, [navigate, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-[#012E46]">Taking you to secure checkout</CardTitle>
          <CardDescription>
            {status === 'working' && 'Connecting to Stripe…'}
            {status === 'error' && error}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'working' && (
            <div className="flex items-center gap-2 text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Please wait…</span>
            </div>
          )}
          {status === 'error' && (
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={() => navigate('/pricing')}>
                Back to pricing
              </Button>
              <Button onClick={() => navigate('/profile')}>Complete profile</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
