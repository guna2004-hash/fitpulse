
import React, { useState } from 'react';
import { UserProfile, SubscriptionTier } from '../types';
import { 
  ShieldCheck, Check, Zap, Sparkles, ChefHat, 
  Camera, Brain, Lock, CreditCard, LockKeyhole, 
  ArrowRight, Loader2, CheckCircle2 
} from 'lucide-react';

interface UpgradeProps {
  profile: UserProfile;
  onUpgrade: (tier: SubscriptionTier) => void;
}

const Upgrade: React.FC<UpgradeProps> = ({ profile, onUpgrade }) => {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [step, setStep] = useState<'pricing' | 'checkout' | 'success'>('pricing');
  const [processing, setProcessing] = useState(false);

  const tiers = [
    {
      id: 'free' as SubscriptionTier,
      name: 'Free',
      price: '$0',
      description: 'Basic tracking for beginners',
      features: ['Log Meals & Water', 'Exercise Journal', 'Basic Charts'],
      cta: 'Current Plan',
      popular: false,
    },
    {
      id: 'pro' as SubscriptionTier,
      name: 'Pro',
      price: '$9.99',
      period: '/mo',
      description: 'Advanced analytics & goals',
      features: ['Barcode Scanner', 'Custom Macro Goals', 'Advanced Nutrition Insights', 'Intermittent Fasting'],
      cta: 'Upgrade to Pro',
      popular: true,
      color: 'bg-indigo-600',
    },
    {
      id: 'elite' as SubscriptionTier,
      name: 'Premium+ Elite',
      price: '$19.99',
      period: '/mo',
      description: 'Ultimate AI performance',
      features: ['AI Vision Meal Scan', 'Elite Recipe Engine', 'Personalized AI Coach', 'Priority Support'],
      cta: 'Go Elite',
      popular: false,
      color: 'bg-slate-900',
      isElite: true,
    }
  ];

  const handleCheckout = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep('success');
      if (selectedTier) onUpgrade(selectedTier);
    }, 2500);
  };

  if (step === 'success') {
    return (
      <div className="max-w-xl mx-auto py-20 text-center animate-in zoom-in-95">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-50">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4">Welcome to {selectedTier === 'elite' ? 'Elite' : 'Pro'}!</h2>
        <p className="text-slate-500 font-medium text-lg mb-10">Your account has been upgraded successfully. All features are now unlocked.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
        >
          Explore Premium Features
        </button>
      </div>
    );
  }

  if (step === 'checkout') {
    const tier = tiers.find(t => t.id === selectedTier);
    return (
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 animate-in slide-in-from-bottom-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
              <CreditCard className="text-indigo-600" /> Secure Checkout
            </h3>
            
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Cardholder Name</label>
                <input placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Card Number</label>
                <div className="relative">
                  <input placeholder="0000 0000 0000 0000" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold" />
                  <div className="absolute right-4 top-4 flex gap-2">
                    <div className="w-8 h-5 bg-slate-200 rounded" />
                    <div className="w-8 h-5 bg-slate-200 rounded" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Expiry</label>
                  <input placeholder="MM/YY" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">CVC</label>
                  <input placeholder="123" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold" />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="button"
                  disabled={processing}
                  onClick={handleCheckout}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-2xl shadow-slate-200"
                >
                  {processing ? <Loader2 className="animate-spin" /> : <LockKeyhole size={20} />}
                  {processing ? 'Processing Payment...' : `Pay ${tier?.price}`}
                </button>
              </div>
            </form>
            
            <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale">
               <div className="text-[10px] font-black uppercase">Encrypted by AES-256</div>
               <ShieldCheck size={20} />
               <Lock size={20} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
            <h4 className="font-black text-slate-900 mb-6 uppercase text-xs tracking-widest">Order Summary</h4>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500">{tier?.name} Subscription</span>
                <span className="font-black text-slate-900">{tier?.price}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-emerald-600">
                <span>Annual Discount Applied</span>
                <span>-$0.00</span>
              </div>
              <div className="h-px bg-slate-200" />
              <div className="flex justify-between items-center text-xl font-black text-slate-900 pt-2">
                <span>Total</span>
                <span>{tier?.price}</span>
              </div>
            </div>
            
            <div className="space-y-4">
               <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unlocked Features</h5>
               {tier?.features.map((f, i) => (
                 <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-600">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> {f}
                 </div>
               ))}
            </div>
          </div>
          
          <button 
            onClick={() => setStep('pricing')}
            className="w-full text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
          >
            Change Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Unlock Your Full Potential</h2>
        <p className="text-slate-500 font-medium text-lg leading-relaxed">
          Choose the plan that fits your ambition. From basic logging to AI-powered vision scanning and macro planning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div 
            key={tier.id} 
            className={`relative flex flex-col p-10 rounded-[40px] border transition-all ${
              tier.isElite 
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xl shadow-slate-200 scale-105 z-10' 
                : tier.popular 
                  ? 'bg-white border-indigo-500 shadow-xl shadow-indigo-50 scale-105 z-10' 
                  : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">Most Popular</div>
            )}
            {tier.isElite && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <Sparkles size={12} /> Elite Tier
              </div>
            )}

            <div className="mb-8">
              <h3 className={`text-2xl font-black mb-2 ${tier.isElite ? 'text-white' : 'text-slate-900'}`}>{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`text-5xl font-black ${tier.isElite ? 'text-white' : 'text-slate-900'}`}>{tier.price}</span>
                {tier.period && <span className={`text-sm font-bold ${tier.isElite ? 'text-slate-400' : 'text-slate-400'}`}>{tier.period}</span>}
              </div>
              <p className={`text-sm font-medium ${tier.isElite ? 'text-slate-400' : 'text-slate-500'}`}>{tier.description}</p>
            </div>

            <div className="flex-1 space-y-5 mb-10">
              {tier.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1 flex-shrink-0 ${tier.isElite ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    <Check size={18} />
                  </div>
                  <span className={`text-sm font-bold ${tier.isElite ? 'text-slate-300' : 'text-slate-700'}`}>{feature}</span>
                </div>
              ))}
            </div>

            <button 
              disabled={profile.subscriptionTier === tier.id}
              onClick={() => {
                if (tier.id === 'free') return;
                setSelectedTier(tier.id);
                setStep('checkout');
              }}
              className={`w-full py-5 rounded-3xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                profile.subscriptionTier === tier.id
                  ? 'bg-slate-100 text-slate-400 cursor-default'
                  : tier.isElite
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : tier.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {profile.subscriptionTier === tier.id ? 'Active Plan' : tier.cta}
              {tier.id !== 'free' && profile.subscriptionTier !== tier.id && <ArrowRight size={18} />}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-100">
        <FeatureInfo icon={<Brain className="text-indigo-600" />} title="AI Nutritionist" desc="Gemini-powered personalized insights." />
        <FeatureInfo icon={<Camera className="text-indigo-600" />} title="Vision Logging" desc="Scan any meal in seconds." />
        <FeatureInfo icon={<ChefHat className="text-indigo-600" />} title="Macro Recipes" desc="Meals matched to your daily goals." />
      </div>
    </div>
  );
};

const FeatureInfo = ({ icon, title, desc }: any) => (
  <div className="flex gap-4">
    <div className="bg-slate-100 p-3 rounded-2xl flex-shrink-0">{icon}</div>
    <div>
      <h5 className="font-black text-slate-900">{title}</h5>
      <p className="text-xs font-medium text-slate-500">{desc}</p>
    </div>
  </div>
);

export default Upgrade;
