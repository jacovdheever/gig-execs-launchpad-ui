import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isValidSession, setIsValidSession] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  // Check if we have a valid password reset session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          console.log('✅ Valid session found:', session.user.email)
          setIsValidSession(true)
        } else {
          console.log('❌ No valid session found')
          setErrors({ general: 'Invalid or expired reset link. Please request a new password reset.' })
        }
      } catch (error) {
        console.error('Session check error:', error)
        setErrors({ general: 'Invalid or expired reset link. Please request a new password reset.' })
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkSession()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validatePassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const minLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    
    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber,
      requirements: {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumber
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (!passwordValidation.isValid) {
        newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number'
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      })

      if (error) {
        console.error('Password update error:', error)
        
        // Handle specific error cases
        if (error.message.includes('rate limit')) {
          setErrors({ general: 'Too many attempts. Please wait a moment and try again.' })
        } else if (error.message.includes('session')) {
          setErrors({ general: 'Session expired. Please request a new password reset.' })
        } else {
          setErrors({ general: error.message || 'Failed to update password. Please try again.' })
        }
        return
      }

      // Success
      setIsSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth/login', { replace: true })
      }, 3000)
      
    } catch (err) {
      console.error('Password update error:', err)
      setErrors({ general: 'Failed to update password. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#012E46] mx-auto mb-4"></div>
              <p className="text-slate-600">Verifying reset link...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show success message
  if (isSuccess) {
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
                Password updated successfully!
              </CardTitle>
              <CardDescription className="text-center text-slate-600">
                Your password has been reset. You can now sign in with your new password.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-4">
                  Redirecting you to the sign in page...
                </p>
                
                <Link to="/auth/login">
                  <Button className="w-full h-11 bg-[#012E46] hover:bg-[#012E46]/90 text-white font-semibold">
                    Go to Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show error if invalid session
  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#012E46] mb-2">GigExecs</h1>
            <p className="text-slate-600">Password Reset</p>
          </div>

          {/* Error Card */}
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-center text-[#012E46]">
                Invalid Reset Link
              </CardTitle>
              <CardDescription className="text-center text-slate-600">
                This password reset link is invalid or has expired
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  {errors.general || 'Please request a new password reset link.'}
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Link to="/auth/forgot-password">
                  <Button className="w-full h-11 bg-[#012E46] hover:bg-[#012E46]/90 text-white font-semibold">
                    Request New Reset Link
                  </Button>
                </Link>
                
                <Link to="/auth/login">
                  <Button variant="outline" className="w-full h-11 border-slate-200 text-slate-700 hover:bg-slate-50">
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
          <p className="text-slate-600">Set your new password</p>
        </div>

        {/* Reset Password Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-[#012E46]">
              Reset your password
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
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
                
                {/* Password Requirements */}
                {formData.password && (
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>Password must contain:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                        At least 8 characters
                      </li>
                      <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                        One uppercase letter
                      </li>
                      <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : ''}>
                        One lowercase letter
                      </li>
                      <li className={/\d/.test(formData.password) ? 'text-green-600' : ''}>
                        One number
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 pr-10 h-11 border-slate-200 focus:border-[#4885AA] focus:ring-[#4885AA]"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword}</p>
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
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="pt-4">
              <Link to="/auth/login">
                <Button
                  variant="outline"
                  className="w-full h-11 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
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
