
import React from 'react';
import { Manager, Team } from '../types';

interface ManagerModalProps {
  manager: Manager;
  team?: Team;
  onClose: () => void;
}

const ManagerModal: React.FC<ManagerModalProps> = ({ manager, team, onClose }) => {
  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-[#111114] border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        <div className="p-8 border-b border-white/5 flex items-center space-x-6">
           <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center text-5xl shadow-inner border border-white/5">
             {manager.face}
           </div>
           <div>
              <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1">Executive Profile</p>
              <h2 className="text-3xl font-sporty text-white uppercase tracking-wider leading-none">{manager.name}</h2>
              <p className="text-[9px] text-gray-500 font-bold uppercase mt-2">AGE: {manager.age} • RETIRES AT 71</p>
           </div>
        </div>

        <div className="p-8 space-y-6">
           <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Tactics', val: manager.stats.tactics, color: 'bg-orange-500' },
                { label: 'Coaching', val: manager.stats.coaching, color: 'bg-blue-500' },
                { label: 'Leadership', val: manager.stats.leadership, color: 'bg-green-500' },
                { label: 'Player Dev', val: manager.stats.playerDev, color: 'bg-purple-500' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 p-4 rounded-xl border border-white/5">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{s.label}</span>
                      <span className="text-sm font-bold text-white">{s.val}</span>
                   </div>
                   <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color}`} style={{ width: `${s.val}%` }}></div>
                   </div>
                </div>
              ))}
           </div>

           <div className="bg-black/20 p-5 rounded-2xl flex items-center justify-between">
              <div>
                 <p className="text-[7px] text-gray-600 font-black uppercase mb-1">Current Team</p>
                 <p className="text-xs font-bold text-white uppercase">{team ? `${team.city} ${team.name}` : 'Free Agent'}</p>
              </div>
              <div className="text-right">
                 <p className="text-[7px] text-gray-600 font-black uppercase mb-1">Strat Rating</p>
                 <p className="text-2xl font-sporty text-blue-400">{manager.rating}</p>
              </div>
           </div>
        </div>

        <button onClick={onClose} className="w-full bg-white text-black font-black py-4 rounded-b-[2.5rem] text-[10px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all">Close Profile</button>
      </div>
    </div>
  );
};

export default ManagerModal;
