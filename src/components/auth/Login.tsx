import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        // Store tokens securely in application state or localStorage
        localStorage.setItem('avenir_token', data.accessToken);
        // Redirect to homepage
        navigate('/');
      } else {
        setError(data.error?.message || 'Invalid login details');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white border border-zinc-200 shadow-2xl rounded-3xl overflow-hidden">
        
        {/* Banner Section */}
        <div className="bg-[#092215] p-8 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-[#E5C158] font-serif font-black text-3xl tracking-tight mb-2">Welcome Back</h2>
            <p className="text-zinc-300 text-xs font-mono tracking-wider uppercase">Vetted Corporate Login</p>
          </div>
          <div className="absolute opacity-10 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] inset-0"></div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex gap-3 items-center text-rose-800 text-sm">
              <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">Corporate Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@avenir.et"
                className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl focus:border-[#115C34] focus:bg-white focus:ring-1 focus:ring-[#115C34] transition-all text-sm outline-none font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">Password</label>
                <Link to="/forgot-password" className="text-[10px] text-[#A4843B] font-bold hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl focus:border-[#115C34] focus:bg-white focus:ring-1 focus:ring-[#115C34] transition-all text-sm outline-none font-medium pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#092215] hover:bg-[#113a26] text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-serif font-black uppercase tracking-widest text-xs transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#E5C158]" />
              ) : (
                <>Sign In Securely <ArrowRight className="w-4 h-4 text-[#E5C158]" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-zinc-500 text-xs">
            New to Avenir?{' '}
            <Link to="/register" className="text-[#092215] font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
