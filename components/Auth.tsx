
import React, { useState } from 'react';
import { Activity, Mail, Lock, User, ArrowRight, Loader2, Sparkles, ArrowLeft, CheckCircle2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { API } from '../services/api';

interface AuthProps {
  onAuthComplete: (profile: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthComplete }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    try {
      if (mode === 'forgot') {
        // Simulate forgot password
        await new Promise(r => setTimeout(r, 1200));
        setMessage({ type: 'success', text: `A reset link has been sent to ${formData.email}` });
        setTimeout(() => {
          setMode('login');
          setMessage(null);
        }, 3000);
      } else if (mode === 'signup') {
        const profile = await API.auth.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        setMessage({ type: 'success', text: 'Account created! Entering FitPulse...' });
        setTimeout(() => onAuthComplete(profile), 1000);
      } else {
        const profile = await API.auth.login(formData.email);
        onAuthComplete(profile);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Authentication failed. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-200 mx-auto mb-6 transform -rotate-6 transition-transform hover:rotate-0">
            <Activity size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">FitPulse AI</h1>
          <p className="text-slate-500 font-medium">Your metabolic evolution starts here.</p>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Sparkles size={160} />
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <p className="text-xs font-bold">{message.text}</p>
            </div>
          )}
          
          {mode !== 'forgot' && (
            <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-8">
              <button 
                onClick={() => { setMode('login'); setMessage(null); }}
                className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Login
              </button>
              <button 
                onClick={() => { setMode('signup'); setMessage(null); }}
                className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Sign Up
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <button 
              onClick={() => { setMode('login'); setMessage(null); }}
              className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors mb-6 uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Back to Login
            </button>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-4 text-slate-300" size={18} />
                  <input 
                    required
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-300" size={18} />
                <input 
                  required
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                  {mode === 'login' && (
                    <button 
                      type="button" 
                      onClick={() => { setMode('forgot'); setMessage(null); }}
                      className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-600"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 text-slate-300" size={18} />
                  <input 
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-12 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-slate-300 hover:text-slate-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            <button 
              disabled={isLoading}
              className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl mt-4 ${
                isLoading 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
              }`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {mode === 'login' && 'Enter Dashboard'}
                  {mode === 'signup' && 'Create Elite Account'}
                  {mode === 'forgot' && 'Send Reset Link'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {mode !== 'forgot' && (
            <p className="text-center text-xs font-bold text-slate-400 mt-8">
              {mode === 'login' ? "Don't have an account?" : "Already a member?"}
              <button 
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(null); }}
                className="text-indigo-600 ml-1 hover:underline font-black"
              >
                {mode === 'login' ? 'Register here' : 'Login now'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
