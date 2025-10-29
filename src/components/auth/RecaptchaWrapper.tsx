import React, { useRef, forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

// Declare grecaptcha global
declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface RecaptchaWrapperProps {
  onVerify: (token: string | null) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
}

export interface RecaptchaWrapperRef {
  reset: () => void;
  execute: () => void;
}

const RecaptchaWrapper = forwardRef<RecaptchaWrapperRef, RecaptchaWrapperProps>(
  ({ onVerify, onExpire, onError, className = '' }, ref) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useImperativeHandle(ref, () => ({
      reset: () => {
        recaptchaRef.current?.reset();
      },
      execute: () => {
        recaptchaRef.current?.execute();
      },
    }));

    const handleVerify = (token: string | null) => {
      onVerify(token);
    };

    const handleExpire = () => {
      onExpire?.();
    };

    const handleError = () => {
      setHasError(true);
      onError?.();
    };

    useEffect(() => {
      // Check if reCAPTCHA script is loaded
      const checkRecaptchaLoaded = () => {
        if (window.grecaptcha && window.grecaptcha.render) {
          setIsLoaded(true);
        } else {
          setTimeout(checkRecaptchaLoaded, 100);
        }
      };
      
      checkRecaptchaLoaded();
    }, []);

    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
    
    // Only log once when component mounts
    useEffect(() => {
      const isTestKey = siteKey === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
      console.log('🔍 CAPTCHA Debug:', {
        hasSiteKey: !!import.meta.env.VITE_RECAPTCHA_SITE_KEY,
        siteKey: siteKey,
        isTestKey: isTestKey
      });
      
      if (isTestKey) {
        console.warn('⚠️ SECURITY WARNING: Using Google test CAPTCHA key. This will ALWAYS pass without user interaction. Use a production key for real security!');
      }
    }, [siteKey]);

    return (
      <div className={`recaptcha-wrapper ${className}`}>
        {!isLoaded && (
          <div className="flex items-center justify-center p-4 border border-gray-300 rounded bg-gray-50">
            <div className="text-sm text-gray-600">Loading CAPTCHA...</div>
          </div>
        )}
        
        {hasError && (
          <div className="flex items-center justify-center p-4 border border-red-300 rounded bg-red-50">
            <div className="text-sm text-red-600">CAPTCHA failed to load. Please refresh the page.</div>
          </div>
        )}
        
        {isLoaded && !hasError && (
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={siteKey}
            onChange={handleVerify}
            onExpired={handleExpire}
            onErrored={handleError}
            theme="light"
            size="normal"
          />
        )}
      </div>
    );
  }
);

RecaptchaWrapper.displayName = 'RecaptchaWrapper';

export default RecaptchaWrapper;
