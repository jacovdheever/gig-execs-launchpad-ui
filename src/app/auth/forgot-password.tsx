import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (value: string) => {
    setEmail(value)
    // Clear error when user starts typing
    if (error) {
      setError('')
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate email
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        console.error('Password reset error:', error)
        
        // Handle specific error cases
        if (error.message.includes('rate limit')) {
          setError('Too many attempts. Please wait a moment and try again.')
        } else if (error.message.includes('not found')) {
          // Don't reveal if email exists or not for security
          setIsEmailSent(true)
        } else {
          setError(error.message || 'Failed to send reset email. Please try again.')
        }
        return
      }

      // Success - show confirmation message
      setIsEmailSent(true)
      
    } catch (err) {
      console.error('Password reset error:', err)
      setError('Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show success message after email is sent
  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#012E46] mb-2">GigExecs</h1>
            <p className="text-slate-600">Password Reset</p>
          </div>

          {/* Success Card */}
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-center text-[#012E46]">
                Check your email
              </CardTitle>
              <CardDescription className="text-center text-slate-600">
                We've sent a password reset link to your email address
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-slate-600">
                  If an account with the email <strong>{email}</strong> exists, 
                  you'll receive a password reset link shortly.
                </p>
                
                <p className="text-sm text-slate-500">
                  Don't see the email? Check your spam folder or try again.
                </p>
              </div>

              {/* Back to Login */}
              <div className="pt-4">
                <Link to="/auth/login">
                  <Button
                    variant="outline"
                    className="w-full h-11 border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#012E46] mb-2">GigExecs</h1>
          <p className="text-slate-600">Reset your password</p>
        </div>

        {/* Forgot Password Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-[#012E46]">
              Forgot your password?
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="pl-10 h-11 border-slate-200 focus:border-[#4885AA] focus:ring-[#4885AA]"
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-[#012E46] hover:bg-[#012E46]/90 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="pt-4">
              <Link to="/auth/login">
                <Button
                  variant="outline"
                  className="w-full h-11 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
