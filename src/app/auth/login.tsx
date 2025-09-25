import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import RecaptchaWrapper, { RecaptchaWrapperRef } from '@/components/auth/RecaptchaWrapper'

export default function LoginPage() {
  const navigate = useNavigate()
  const recaptchaRef = useRef<RecaptchaWrapperRef>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleCaptchaVerify = (token: string | null) => {
    setCaptchaToken(token)
    if (errors.captcha) {
      setErrors(prev => ({ ...prev, captcha: '' }))
    }
  }

  const handleCaptchaExpire = () => {
    setCaptchaToken(null)
  }

  const handleCaptchaError = () => {
    setCaptchaToken(null)
    setErrors(prev => ({ ...prev, captcha: 'CAPTCHA verification failed. Please try again.' }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    // Temporarily disable CAPTCHA validation for testing
    // if (!captchaToken) newErrors.captcha = 'Please complete the CAPTCHA verification'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      // Temporarily skip CAPTCHA validation for testing
      console.log('🔍 Skipping CAPTCHA validation for testing - proceeding with login');
      // TODO: Re-enable CAPTCHA validation once we fix the verify-captcha function

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        console.error('Login error:', error)
        
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ general: 'Invalid email or password' })
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ general: 'Please check your email and click the confirmation link' })
        } else if (error.message.includes('rate limit')) {
          setErrors({ general: 'Too many attempts. Please wait a moment and try again.' })
        } else {
          setErrors({ general: error.message || 'Login failed. Please try again.' })
        }
        return
      }

      if (data.user) {
        console.log('Login successful:', data.user)
        
        // Redirect to dashboard
        navigate('/dashboard', { replace: true })
      }
      
    } catch (err) {
      console.error('Login error:', err)
      setErrors({ general: 'Login failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#012E46] mb-2">GigExecs</h1>
          <p className="text-slate-600">Welcome back</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-[#012E46]">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Enter your credentials to access your dashboard
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
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 h-11 border-slate-200 focus:border-[#4885AA] focus:ring-[#4885AA]"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10 h-11 border-slate-200 focus:border-[#4885AA] focus:ring-[#4885AA]"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* CAPTCHA */}
              <div className="space-y-2">
                <RecaptchaWrapper
                  ref={recaptchaRef}
                  onVerify={handleCaptchaVerify}
                  onExpire={handleCaptchaExpire}
                  onError={handleCaptchaError}
                  className="flex justify-center"
                />
                {errors.captcha && (
                  <p className="text-sm text-red-600 text-center">{errors.captcha}</p>
                )}
              </div>

              {/* General Error */}
              {errors.general && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-[#012E46] hover:bg-[#012E46]/90 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            {/* Links */}
            <div className="space-y-3 pt-4">
              <div className="text-center">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-[#4885AA] hover:text-[#012E46] font-medium transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
              
              <div className="text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <Link
                  to="/auth/register"
                  className="text-[#4885AA] hover:text-[#012E46] font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
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

