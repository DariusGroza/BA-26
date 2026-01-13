
import React from 'react';
import { Player } from '../types';

interface InjuryDecisionModalProps {
  player: Player;
  onDecision: (decision: 'REST' | 'AGGRESSIVE' | 'SURGERY') => void;
  onClose: () => void;
}

const InjuryDecisionModal: React.FC<InjuryDecisionModalProps> = ({ player, onDecision, onClose }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose}></div>
      
      <div className="relative bg-[#111114] border border-red-500/20 w-full max-w-4xl rounded-[3rem] shadow-[0_0_100px_rgba(239,68,68,0.15)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="bg-red-600 p-10 flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.4em] mb-2">Medical Crisis</p>
              <h2 className="text-5xl font-sporty text-white leading-none uppercase">Injury Management</h2>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Status</p>
              <p className="text-xl font-bold text-white uppercase">{player.injurySeverity} {player.injuryType}</p>
           </div>
        </div>

        <div className="p-10 space-y-8">
           <div className="flex items-center space-x-8 bg-white/5 p-8 rounded-3xl border border-white/5">
              <div className="w-24 h-24 bg-red-900/40 rounded-2xl flex items-center justify-center text-6xl shadow-inner">
                🩹
              </div>
              <div className="flex-1">
                 <h3 className="text-2xl font-bold text-white mb-2">{player.name}</h3>
                 <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                    Our medical staff has evaluated the {player.injuryType}. As his agent, you must decide on the recovery path. 
                    Your choice will impact his availability, future health, and morale. Choose wisely.
                 </p>
              </div>
              <div className="text-center bg-black/40 px-6 py-4 rounded-2xl">
                 <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Risk Level</p>
                 <p className="text-2xl font-sporty text-red-500">{player.injuryRisk}%</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* REST */}
              <button 
                onClick={() => onDecision('REST')}
                className="group relative bg-[#1a1a1e] border border-white/5 p-8 rounded-[2rem] text-left transition-all hover:bg-white/5 hover:border-green-500/50 hover:-translate-y-2"
              >
                 <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center text-2xl mb-6">🧘</div>
                 <h4 className="text-xl font-bold text-white mb-2">Conservative Rest</h4>
                 <p className="text-[10px] text-gray-500 mb-6 leading-relaxed">Prioritize long-term health. Extended recovery time but significantly reduces future injury risk.</p>
                 <div className="space-y-2 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-[10px]"><span className="text-gray-500">Recovery</span> <span className="text-white">+50% Time</span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-gray-500">Injury Risk</span> <span className="text-green-500">-10% Base</span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-gray-500">Morale</span> <span className="text-green-500">Stable</span></div>
                 </div>
              </button>

              {/* AGGRESSIVE */}
              <button 
                onClick={() => onDecision('AGGRESSIVE')}
                className="group relative bg-[#1a1a1e] border border-white/5 p-8 rounded-[2rem] text-left transition-all hover:bg-white/5 hover:border-orange-500/50 hover:-translate-y-2"
              >
                 <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center text-2xl mb-6">⚡</div>
                 <h4 className="text-xl font-bold text-white mb-2">Aggressive Treatment</h4>
                 <p className="text-[10px] text-gray-500 mb-6 leading-relaxed">Get him back on the court fast. Pain management and therapy, but high risk of aggravation.</p>
                 <div className="space-y-2 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-[10px]"><span className="text-gray-500">Recovery</span> <span className="text-orange-500">-50% Time</span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-gray-500">Injury Risk</span> <span className="text-red-500">+25% Base</span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-gray-500">Morale</span> <span className="text-red-500">Anxious</span></div>
                 </div>
              </button>

              {/* SURGERY */}
              <button 
                onClick={() => onDecision('SURGERY')}
                className="group relative bg-[#1a1a1e] border border-white/5 p-8 rounded-[2rem] text-left transition-all hover:bg-white/5 hover:border-blue-500/50 hover:-translate-y-2"
              >
                 <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-2xl mb-6">🔬</div>
                 <h4 className="text-xl font-bold text-white mb-2">Major Surgery</h4>
                 <p className="text-[10px] text-gray-500 mb-6 leading-relaxed">Permanent fix for underlying issues. Long absence and skill loss, but resets physical risk to zero.</p>
                 <div className="space-y-2 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-[10px]"><span className="text-gray-500">Recovery</span> <span className="text-blue-500">Full Season</span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-gray-500">Injury Risk</span> <span className="text-blue-400">RESET TO 0</span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-gray-500">Performance</span> <span className="text-red-500">Permanent -4</span></div>
                 </div>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InjuryDecisionModal;
