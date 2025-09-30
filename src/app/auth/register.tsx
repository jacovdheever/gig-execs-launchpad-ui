import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Mail, Lock, User, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import RecaptchaWrapper, { RecaptchaWrapperRef } from '@/components/auth/RecaptchaWrapper'

export default function RegisterPage() {
  const navigate = useNavigate()
  const recaptchaRef = useRef<RecaptchaWrapperRef>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'consultant' as 'consultant' | 'client',
    companyName: '',
    acceptTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | boolean) => {
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

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (formData.userType === 'client' && !formData.companyName.trim()) newErrors.companyName = 'Company name is required'
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions'
    // Re-enable CAPTCHA validation now that keys are fixed
    if (!captchaToken) newErrors.captcha = 'Please complete the CAPTCHA verification'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      // Verify CAPTCHA first
      console.log('🔍 CAPTCHA token value:', captchaToken);
      console.log('🔍 CAPTCHA token type:', typeof captchaToken);
      console.log('🔍 CAPTCHA token length:', captchaToken ? captchaToken.length : 'null');

      // Verify CAPTCHA with the fixed keys
      if (captchaToken) {
        console.log('🔍 Verifying CAPTCHA token:', captchaToken.substring(0, 20) + '...');
        
        const captchaResponse = await fetch('/.netlify/functions/verify-captcha', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ captchaToken }),
        });

        const captchaResult = await captchaResponse.json();
        
        if (!captchaResult.success) {
          console.error('🔍 CAPTCHA verification failed:', captchaResult);
          setErrors({ captcha: 'CAPTCHA verification failed. Please try again.' });
          setIsLoading(false);
          return;
        }
        
        console.log('🔍 CAPTCHA verification successful:', captchaResult);
      }

      // Step 1: Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            user_type: formData.userType,
            company_name: formData.companyName || null
          }
        }
      })

      if (authError) {
        console.error('Auth error:', authError)
        
        // Handle specific error cases
        if (authError.message.includes('already registered')) {
          setErrors({ email: 'An account with this email already exists' })
        } else if (authError.message.includes('password')) {
          setErrors({ password: 'Password must be at least 8 characters' })
        } else if (authError.message.includes('email')) {
          setErrors({ email: 'Please enter a valid email address' })
        } else if (authError.message.includes('rate limit')) {
          setErrors({ general: 'Too many attempts. Please wait a moment and try again.' })
        } else {
          setErrors({ general: authError.message || 'Registration failed. Please try again.' })
        }
        return
      }

      if (!authData.user) {
        setErrors({ general: 'Failed to create user account' })
        return
      }

      // Step 2: Create user record in users table
      const userInsertData = {
        id: authData.user.id,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        user_type: formData.userType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      console.log('Attempting to insert user into users table:', userInsertData)
      console.log('User ID type:', typeof userInsertData.id, 'Value:', userInsertData.id)
      console.log('User type value:', userInsertData.user_type)
      
      // Create user record using secure Netlify Function
      // This keeps the service role key server-side only
      const response = await fetch('/.netlify/functions/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userInsertData.id,
          email: userInsertData.email,
          firstName: userInsertData.first_name,
          lastName: userInsertData.last_name,
          userType: userInsertData.user_type,
          companyName: formData.companyName
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Registration function error:', errorData)
        
        // Show detailed error information to help with debugging
        let errorMessage = `User profile creation failed: ${errorData.error}`
        if (errorData.details) {
          if (typeof errorData.details === 'string') {
            errorMessage += `. Details: ${errorData.details}`
          } else if (errorData.details.message) {
            errorMessage += `. Technical details: ${errorData.details.message}`
          }
        }
        
        setErrors({ general: errorMessage })
        return
      }

      const result = await response.json()
      console.log('Registration function result:', result)

      if (!result.success) {
        console.error('Registration failed:', result.error)
        setErrors({ general: `User profile creation failed: ${result.error}. Please contact support.` })
        return
      }

      // Step 3: Success! Show success state
      console.log('Registration successful:', result.user)
      
      setIsSuccess(true)
      
      // Redirect to login page after 3 seconds so they can authenticate
      setTimeout(() => {
        navigate('/auth/login', { replace: true })
      }, 3000)
      
    } catch (err) {
      console.error('Registration error:', err)
      setErrors({ general: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Show success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[#012E46] mb-2">Welcome to GigExecs!</h1>
            <p className="text-slate-600">Your account has been created successfully.</p>
          </div>
          
          <Card className="shadow-xl border-0">
            <CardContent className="p-6">
              <p className="text-slate-600 mb-4">
                We've sent a confirmation email to <strong>{formData.email}</strong>. 
                Please check your inbox and click the verification link.
              </p>
              <p className="text-sm text-slate-500">
                After verifying your email, you'll be redirected to login to access your account.
              </p>
              <p className="text-sm text-slate-500">
                Redirecting to login page in a few seconds...
              </p>
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
          <p className="text-slate-600">Create your account</p>
        </div>

        {/* Registration Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-[#012E46]">
              Join GigExecs
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Start your journey as a professional or client
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">I am a:</Label>
                <RadioGroup
                  value={formData.userType}
                  onValueChange={(value) => handleInputChange('userType', value as 'consultant' | 'client')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="consultant" id="consultant" />
                    <Label htmlFor="consultant" className="flex items-center space-x-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      <span>Professional</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="client" id="client" />
                    <Label htmlFor="client" className="flex items-center space-x-2 cursor-pointer">
                      <Building2 className="h-4 w-4" />
                      <span>Client</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="h-11 border-slate-200 focus:border-[#4885AA] focus:ring-[#4885AA]"
                    required
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="h-11 border-slate-200 focus:border-[#4885AA] focus:ring-[#4885AA]"
                    required
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Company Name (Client only) */}
              {formData.userType === 'client' && (
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium text-slate-700">
                    Company name
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="h-11 border-slate-200 focus:border-[#4885AA] focus:ring-[#4885AA]"
                    required
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-600">{errors.companyName}</p>
                  )}
                </div>
              )}

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

              {/* Password Fields */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                  Confirm password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
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

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleInputChange('acceptTerms', checked as boolean)}
                />
                <Label htmlFor="acceptTerms" className="text-sm text-slate-600 cursor-pointer">
                  I accept the{' '}
                  <Link to="/terms" className="text-[#4885AA] hover:text-[#012E46] underline">
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-[#4885AA] hover:text-[#012E46] underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600">{errors.acceptTerms}</p>
              )}

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
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4">
              <div className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  className="text-[#4885AA] hover:text-[#012E46] font-medium transition-colors"
                >
                  Sign in
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

