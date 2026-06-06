import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password too short"),
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  phoneNumber: z.string().min(10, "Valid phone needed"),
});

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '', phoneNumber: '', userType: 'buyer', businessName: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    try {
      registerSchema.parse(formData);
    } catch (err: any) {
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message);
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccessMsg(data.message || 'Registration successful!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.error?.message || 'Registration failed');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 py-12 font-sans">
      <div className="w-full max-w-md bg-white border border-zinc-200 shadow-2xl rounded-3xl overflow-hidden">
        
        {/* Banner Section */}
        <div className="bg-[#092215] p-8 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-[#E5C158] font-serif font-black text-2xl md:text-3xl tracking-tight mb-2">Join Avenir Hub</h2>
            <p className="text-zinc-300 text-xs font-mono tracking-wider uppercase">Verified Trade Identity</p>
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

          {successMsg ? (
             <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-black text-xl text-[#092215]">Account Created</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">{successMsg}</p>
                <div className="mt-4 text-xs font-mono uppercase font-bold text-zinc-400">Redirecting to login...</div>
             </div>
          ) : (
             <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl focus:border-[#115C34] focus:bg-white outline-none font-medium text-sm" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl focus:border-[#115C34] focus:bg-white outline-none font-medium text-sm" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">Corporate Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl focus:border-[#115C34] focus:bg-white outline-none font-medium text-sm" required />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">Phone Number</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+251911..." className="w-full bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl focus:border-[#115C34] focus:bg-white outline-none font-medium text-sm" required />
              </div>

              <div className="space-y-1.5">
                 <label className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">Register As</label>
                 <select name="userType" value={formData.userType} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl focus:border-[#115C34] focus:bg-white outline-none font-medium text-sm font-sans">
                    <option value="buyer">Verified Buyer</option>
                    <option value="seller">Merchant (Store Owner)</option>
                 </select>
              </div>

              {formData.userType === 'seller' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">Business Name</label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl focus:border-[#115C34] focus:bg-white outline-none font-medium text-sm" required />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">Set Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl focus:border-[#115C34] focus:bg-white outline-none font-medium text-sm pr-12"
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
                className="w-full bg-[#092215] hover:bg-[#113a26] text-[#FAF9F6] py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-serif font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#E5C158]" />
                ) : (
                  <>Create Secure Identity</>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-zinc-500 text-xs">
            Already registered?{' '}
            <Link to="/login" className="text-[#092215] font-bold hover:underline">
              Sign in to Escrow
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
