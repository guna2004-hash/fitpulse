
import React from 'react';
import { Challenge, UserProfile } from '../types';
import { COMMUNITY_CHALLENGES } from '../constants';
import { Trophy, Users, Star, ArrowRight, ShieldCheck, Award } from 'lucide-react';

interface ChallengesProps {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
}

const Challenges: React.FC<ChallengesProps> = ({ profile, onUpdateProfile }) => {
  const toggleChallenge = (id: string) => {
    const active = profile.activeChallenges.includes(id);
    const newChallenges = active 
      ? profile.activeChallenges.filter(c => c !== id)
      : [...profile.activeChallenges, id];
    onUpdateProfile({ ...profile, activeChallenges: newChallenges });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="bg-indigo-900 p-10 rounded-3xl text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-4 tracking-tight">Community Sprint</h2>
          <p className="text-indigo-200 font-medium max-w-lg mb-8 text-lg">
            Join thousands of users in weekly motivation sprints. Compete for exclusive badges and metabolic rewards.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-900 bg-indigo-500 flex items-center justify-center text-[10px] font-black">U{i}</div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-indigo-900 bg-white/10 flex items-center justify-center text-[10px] font-black">+2k</div>
            </div>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Active Members Online</span>
          </div>
        </div>
        <Trophy className="absolute right-0 top-0 text-white/5 -rotate-12" size={300} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {COMMUNITY_CHALLENGES.map((challenge) => {
          const isActive = profile.activeChallenges.includes(challenge.id);
          return (
            <div key={challenge.id} className={`p-8 rounded-3xl border transition-all ${isActive ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/10' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className="text-4xl">{challenge.icon}</div>
                {isActive && <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Joined</span>}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{challenge.title}</h3>
              <p className="text-slate-500 mb-8 font-medium">{challenge.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Users size={16} /> {challenge.participants.toLocaleString()} joined
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                    <Award size={16} /> {challenge.reward}
                 </div>
              </div>

              <button 
                onClick={() => toggleChallenge(challenge.id)}
                className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
                  isActive ? 'bg-slate-100 text-slate-500' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'
                }`}
              >
                {isActive ? "Leave Challenge" : "Accept Challenge"}
                <ArrowRight size={18} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
         <div className="flex items-center gap-3 mb-8">
            <Star className="text-amber-400 fill-amber-400" />
            <h3 className="text-xl font-black text-slate-900">Your Hall of Fame</h3>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <Badge icon="🏃" label="Speedster" />
            <Badge icon="💧" label="Hydro Master" />
            <Badge icon="🔥" label="Day 10 Streak" />
            <Badge icon="🍎" label="Clean Eater" />
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center aspect-square text-slate-300 font-bold text-[10px] uppercase text-center p-4">Next badge at Day 30</div>
         </div>
      </div>
    </div>
  );
};

const Badge = ({ icon, label }: any) => (
  <div className="flex flex-col items-center gap-3 group">
    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl transition-all border border-transparent group-hover:border-indigo-100">
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">{label}</span>
  </div>
);

export default Challenges;
