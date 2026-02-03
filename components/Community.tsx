
import React, { useState } from 'react';
import { User, Heart, MessageSquare, Share2, Award, Trophy, Users, Hash, Filter } from 'lucide-react';

const Community: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const posts = [
    { id: 1, user: 'Sarah J.', content: 'Just finished a 10km run! Feeling amazing. 🏃‍♀️✨', stats: '2.4k kcal burned today', likes: 24, comments: 5, avatar: 'SJ', group: 'Runners' },
    { id: 2, user: 'Mike Ross', content: 'Hit my water goal for the 5th day in a row! Hydration is key. 💧', stats: '3L Water Intake', likes: 12, comments: 2, avatar: 'MR', group: 'LifeHacks' },
    { id: 3, user: 'Coach Alex', content: 'Reminder: Protein intake is crucial for muscle recovery. Check out the new high-protein recipes in the AI Coach tab! 🥗', stats: 'Expert Advice', likes: 89, comments: 14, avatar: 'AL', group: 'ProNutri' },
  ];

  const groups = [
    { name: 'Runners Club', members: '12k', icon: '🏃' },
    { name: 'Keto Warriors', members: '45k', icon: '🥩' },
    { name: 'Weight Loss 101', members: '8k', icon: '📉' },
    { name: 'Early Birds', members: '2k', icon: '🌅' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Groups Sidebar */}
      <div className="space-y-6 hidden lg:block">
        <div className="bg-white p-6 rounded-3xl border border-slate-200">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
             <Hash size={14} /> My Groups
           </h3>
           <div className="space-y-4">
              {groups.map(group => (
                <button key={group.name} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                   <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">{group.icon}</div>
                   <div className="text-left">
                      <div className="text-sm font-bold text-slate-800">{group.name}</div>
                      <div className="text-[10px] font-bold text-slate-400">{group.members} members</div>
                   </div>
                </button>
              ))}
           </div>
           <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:border-indigo-200 hover:text-indigo-600 transition-all">Explore All Groups</button>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black">ME</div>
              <input 
                type="text" 
                placeholder="Share your progress..." 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
              <button className="bg-slate-900 text-white px-6 rounded-2xl font-bold hover:bg-slate-800 transition-colors">Post</button>
           </div>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
           {['All', 'Popular', 'Friends', 'Results'].map(f => (
             <button 
               key={f} 
               onClick={() => setActiveFilter(f)}
               className={`px-6 py-2 rounded-full text-xs font-black transition-all whitespace-nowrap ${activeFilter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-600'}`}
             >
               {f}
             </button>
           ))}
        </div>

        {posts.map(post => (
          <div key={post.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500">{post.avatar}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-slate-900">{post.user}</h4>
                    <span className="text-[9px] font-black bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full">Pro Member</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.group}</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Share2 size={18} /></button>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed font-medium">{post.content}</p>
            <div className="flex items-center gap-6 pt-4 border-t border-slate-50 text-slate-400 font-bold text-sm">
               <button className="flex items-center gap-2 hover:text-rose-500 transition-colors"><Heart size={18} /> {post.likes}</button>
               <button className="flex items-center gap-2 hover:text-indigo-600 transition-colors"><MessageSquare size={18} /> {post.comments}</button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
         <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Trophy className="text-amber-400" /> Leaderboard
            </h3>
            <div className="space-y-4">
               <RankItem rank={1} name="Chris W." score="15,402 pts" />
               <RankItem rank={2} name="Elena G." score="14,120 pts" />
               <RankItem rank={3} name="James T." score="12,890 pts" />
            </div>
            <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-sm transition-all border border-white/10">View Global Rankings</button>
         </div>
      </div>
    </div>
  );
};

const RankItem = ({ rank, name, score }: { rank: number, name: string, score: string }) => (
  <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl">
     <div className="flex items-center gap-3">
        <span className="text-xs font-black opacity-40">#{rank}</span>
        <span className="font-bold">{name}</span>
     </div>
     <span className="text-xs font-bold text-indigo-300">{score}</span>
  </div>
);

export default Community;
