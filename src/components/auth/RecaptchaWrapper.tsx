import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

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
      onError?.();
    };

    return (
      <div className={`recaptcha-wrapper ${className}`}>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
          onChange={handleVerify}
          onExpired={handleExpire}
          onErrored={handleError}
          theme="light"
          size="normal"
        />
      </div>
    );
  }
);

RecaptchaWrapper.displayName = 'RecaptchaWrapper';

export default RecaptchaWrapper;
