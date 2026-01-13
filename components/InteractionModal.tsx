
import React from 'react';
import { Player } from '../types';
import { formatCurrency } from '../utils';

interface InteractionModalProps {
  player: Player;
  onInteract: (playerId: string, type: 'TALK' | 'DINNER' | 'WATCH' | 'CAR') => void;
  onClose: () => void;
  cash: number;
}

const InteractionModal: React.FC<InteractionModalProps> = ({ player, onInteract, onClose, cash }) => {
  const options = [
    { id: 'TALK', label: 'Motivational Talk', cost: 0, gain: '+3 Loyalty', icon: '🗣️' },
    { id: 'DINNER', label: 'VIP Steakhouse', cost: 1500, gain: '+8 Loyalty', icon: '🍷' },
    { id: 'WATCH', label: 'Iced Out Timepiece', cost: 25000, gain: '+20 Loyalty', icon: '⌚' },
    { id: 'CAR', label: 'Exotic Sportscar', cost: 250000, gain: '+50 Loyalty', icon: '🏎️' },
  ];

  const getStatus = (l: number) => {
    if (l > 80) return { label: 'Inseparable', color: 'bg-orange-600' };
    if (l > 60) return { label: 'Close Friends', color: 'bg-green-600' };
    if (l > 40) return { label: 'Professional', color: 'bg-blue-600' };
    return { label: 'Distant', color: 'bg-gray-600' };
  };

  const status = getStatus(player.loyalty);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose}></div>
      <div className="relative bg-[#111114] border border-white/10 w-full max-w-xl rounded-[3rem] p-10 space-y-8 animate-in zoom-in-95 shadow-2xl overflow-hidden">
        
        <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-sporty pointer-events-none uppercase">Gift</div>

        <div className="flex items-center space-x-6 relative z-10">
           <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/5">
             {player.face}
           </div>
           <div>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-1">Relations Bureau</p>
              <h2 className="text-3xl font-sporty text-white uppercase tracking-wider leading-none">{player.name}</h2>
              <div className="flex items-center space-x-2 mt-2">
                 <span className={`px-2 py-0.5 rounded text-[8px] font-black text-white uppercase ${status.color}`}>{status.label}</span>
                 <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">LOYALTY: {player.loyalty}%</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-3 relative z-10">
           {options.map(opt => (
             <button 
              key={opt.id}
              onClick={() => onInteract(player.id, opt.id as any)}
              disabled={cash < opt.cost}
              className={`group w-full p-5 rounded-3xl border flex justify-between items-center transition-all ${cash >= opt.cost ? 'bg-white/5 border-white/10 hover:border-orange-500/50 hover:bg-white/[0.08]' : 'bg-black/20 border-white/5 opacity-50 cursor-not-allowed'}`}
             >
                <div className="flex items-center space-x-5">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                     {opt.icon}
                   </div>
                   <div className="text-left">
                      <p className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors uppercase tracking-tight">{opt.label}</p>
                      <p className="text-[9px] text-green-500 font-bold uppercase tracking-widest">{opt.gain}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-sporty text-gray-400">{opt.cost === 0 ? 'FREE' : formatCurrency(opt.cost).split('.')[0]}</p>
                   {cash < opt.cost && <p className="text-[8px] text-red-500 font-black uppercase mt-1">Insufficient Cash</p>}
                </div>
             </button>
           ))}
        </div>

        <button onClick={onClose} className="w-full text-gray-600 font-black text-[10px] uppercase tracking-widest pt-4 hover:text-gray-400 transition-colors relative z-10">Return to Agency Portfolio</button>
      </div>
    </div>
  );
};

export default InteractionModal;
