import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

/**
 * Send welcome/verification emails after email confirmation
 * This triggers the email_verified flow which sends:
 * - email_verified template (all users)
 * - welcome_professional OR welcome_client (based on user_type)
 */
async function sendVerificationEmails(accessToken: string): Promise<void> {
  try {
    const response = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        action: 'trigger',
        trigger: 'email_verified'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Email trigger response not OK:', response.status, errorData);
    } else {
      const result = await response.json();
      console.log('Welcome emails triggered:', result);
    }
  } catch (error) {
    // Don't fail the verification flow if email sending fails
    console.error('Failed to trigger welcome emails:', error);
  }
}

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)
        
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        const type = params.get('type')

        if (type === 'signup' && accessToken && refreshToken) {
          // Set the session
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            console.error('Session error:', error)
            setStatus('error')
            setMessage('Failed to verify your email. Please try again.')
            return
          }

          // Email verification successful - send welcome emails
          // This is fire-and-forget; we don't wait for it or fail if it errors
          sendVerificationEmails(accessToken);

          setStatus('success')
          setMessage('Your email has been verified successfully! You can now sign in to your account.')
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/auth/login', { replace: true })
          }, 3000)
        } else {
          setStatus('error')
          setMessage('Invalid verification link. Please check your email and try again.')
        }
      } catch (error) {
        console.error('Callback error:', error)
        setStatus('error')
        setMessage('An error occurred during verification. Please try again.')
      }
    }

    handleAuthCallback()
  }, [navigate])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#4885AA] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#012E46] mb-2">
              Verifying your email...
            </h2>
            <p className="text-slate-600">
              Please wait while we verify your email address.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-4">
          {status === 'success' ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          )}
          <CardTitle className={`text-2xl font-bold ${
            status === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {status === 'success' ? 'Email Verified!' : 'Verification Failed'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <CardDescription className="text-slate-600">
            {message}
          </CardDescription>
          
          <div className="space-y-3">
            {status === 'success' ? (
              <Button
                onClick={() => navigate('/auth/login')}
                className="w-full bg-[#012E46] hover:bg-[#012E46]/90"
              >
                Sign In to Your Account
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/auth/register')}
                className="w-full bg-[#012E46] hover:bg-[#012E46]/90"
              >
                Try Registration Again
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
