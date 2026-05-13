'use client';

import { useState } from 'react';
import { Mail, KeyRound, Lock, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { forgotPasswordAction, verifyOtpAction, resetPasswordAction } from '@/modules/auth/auth.controller';
import { useFormState } from 'react-dom';

export function ForgotPasswordFlow({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [state, formAction] = useFormState(resetPasswordAction, null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const res = await forgotPasswordAction(email);
    if (res.error) setError(res.error);
    else setStep('otp');
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const res = await verifyOtpAction(email, otp);
    if (!res.success) setError('Invalid or expired OTP');
    else setStep('reset');
    setIsLoading(false);
  };

  if (step === 'success' || (state && state.success)) {
    return (
      <div className="text-center space-y-6 py-8 animate-in zoom-in-95 duration-300">
        <div className="flex justify-center">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Password Reset!</h2>
          <p className="text-gray-500 font-medium">Your password has been updated successfully.</p>
        </div>
        <button 
          onClick={onBack}
          className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg transition-all"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <header className="space-y-2">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>
        <h1 className="text-3xl font-black text-white tracking-tighter">
          {step === 'email' && 'Forgot Password?'}
          {step === 'otp' && 'Verify OTP'}
          {step === 'reset' && 'New Password'}
        </h1>
        <p className="text-gray-500 font-medium">
          {step === 'email' && "Enter your email to receive a verification code."}
          {step === 'otp' && `We've sent a 4-digit code to ${email}`}
          {step === 'reset' && "Almost there! Set your new secure password."}
        </p>
      </header>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
          {error}
        </div>
      )}

      {step === 'email' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-600 transition-colors" />
            <input 
              required
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-red-600 transition-all"
            />
          </div>
          <button 
            disabled={isLoading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Code'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="relative group">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-600 transition-colors" />
            <input 
              required
              maxLength={4}
              placeholder="4-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-[#1e1e1e] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-center tracking-[20px] text-2xl font-bold focus:outline-none focus:border-red-600 transition-all"
            />
          </div>
          <button 
            disabled={isLoading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
          </button>
        </form>
      )}

      {step === 'reset' && (
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="otp" value={otp} />
          
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-600 transition-colors" />
            <input 
              required
              type="password"
              name="password"
              placeholder="New Password"
              className="w-full bg-[#1e1e1e] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-red-600 transition-all"
            />
          </div>
          
          <button 
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-900/20 transition-all"
          >
            Reset Password
          </button>
          
          {state && state.error && (
            <p className="text-xs text-red-500 text-center font-bold">{state.error}</p>
          )}
        </form>
      )}
    </div>
  );
}
