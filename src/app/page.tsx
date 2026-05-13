'use client';

import { useActionState, useEffect, useState } from 'react';
import { loginAction } from '@/modules/auth/auth.controller';
import { Music, Mail, Lock, Loader2, Info, ChevronRight } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { ForgotPasswordFlow } from '@/components/auth/ForgotPasswordFlow';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showForgot, setShowForgot] = useState(false);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error, {
        style: { background: '#161b22', color: '#fff', border: '1px solid #f85149' }
      });
    }
  }, [state]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#0f0f0f] relative overflow-hidden">
      <Toaster position="top-center" richColors />
      
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/5 blur-[120px] rounded-full" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FF0000] shadow-xl shadow-red-600/20 mb-4 animate-in zoom-in duration-500">
            <Music className="w-10 h-10 text-white fill-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white animate-in fade-in slide-in-from-bottom-4 duration-700">
            Youtify
          </h1>
          <p className="text-gray-400 font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Personal Music Studio
          </p>
        </div>

        <div className="glass p-8 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 border-white/5">
          {showForgot ? (
            <ForgotPasswordFlow onBack={() => setShowForgot(false)} />
          ) : (
            <>
              <form action={formAction} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-600 transition-colors" />
                    <input
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-[#1e1e1e]/50 border border-[#333] rounded-2xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white placeholder-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Password
                    </label>
                    <button 
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-[10px] font-bold text-red-600 hover:underline uppercase tracking-widest"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-600 transition-colors" />
                    <input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-[#1e1e1e]/50 border border-[#333] rounded-2xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white placeholder-gray-600"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    disabled={isPending}
                    type="submit"
                    className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-800/50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 group"
                  >
                    {isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-8 border-t border-[#30363d] text-center">
                <p className="text-xs text-gray-500 font-medium">
                  Welcome back, Architect.
                </p>
              </div>
            </>
          )}
        </div>

        <p className="mt-8 text-center text-gray-500 text-sm animate-in fade-in duration-1000 delay-500">
          Built for Senior Architects by Antigravity
        </p>
      </div>
    </main>
  );
}
