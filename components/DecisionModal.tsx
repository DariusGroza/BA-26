
import React from 'react';
import { GameDecision, GameDecisionOption, Player } from '../types';
import { formatCurrency } from '../utils';

interface DecisionModalProps {
  decision: GameDecision;
  player: Player;
  onResolve: (option: GameDecisionOption) => void;
}

const DecisionModal: React.FC<DecisionModalProps> = ({ decision, player, onResolve }) => {
  const getCategoryTheme = (cat: GameDecision['category']) => {
    switch (cat) {
      case 'LEGAL': return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '⚖️' };
      case 'MEDIA': return { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: '🎙️' };
      case 'COMMERCIAL': return { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '💎' };
      case 'INTERNAL': return { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', icon: '🏠' };
      case 'LEGACY': return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: '👑' };
      default: return { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', icon: '📝' };
    }
  };

  const theme = getCategoryTheme(decision.category);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/92 backdrop-blur-sm"></div>
      
      <div className="relative bg-[#0d0d0f] border border-white/10 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Ultra-Compact Header */}
        <div className={`px-3 py-2 ${theme.bg} border-b border-white/5 flex items-center space-x-2`}>
          <div className={`w-6 h-6 rounded ${theme.bg} border ${theme.border} flex items-center justify-center text-sm`}>
            {theme.icon}
          </div>
          <div className="flex-1 min-w-0">
             <p className={`text-[5px] font-black uppercase tracking-widest ${theme.color}`}>Executive Briefing • {decision.category}</p>
             <h2 className="text-[10px] font-bold text-white uppercase truncate tracking-tighter">{decision.title}</h2>
          </div>
        </div>

        {/* Narrative Section - Compact */}
        <div className="px-3 py-2 bg-black/20 border-b border-white/5 flex gap-2 items-center">
           <span className="text-xl shrink-0 grayscale group-hover:grayscale-0">{player.face}</span>
           <div className="flex-1 min-w-0">
              <p className="text-[7px] font-bold text-white truncate leading-none mb-1">{player.name}</p>
              <p className="text-[8px] text-gray-400 leading-tight italic line-clamp-3">"{decision.description}"</p>
           </div>
        </div>

        {/* Action List - High Density */}
        <div className="p-2 space-y-1 overflow-y-auto max-h-[300px] no-scrollbar">
           {decision.options.map(opt => (
             <button 
               key={opt.id}
               onClick={() => onResolve(opt)}
               className="group w-full p-2 bg-white/5 border border-white/5 rounded-lg text-left transition-all hover:bg-orange-600/10 hover:border-orange-500/40 active:scale-[0.98]"
             >
                <div className="flex justify-between items-center mb-0.5">
                   <h4 className="text-[9px] font-bold text-white group-hover:text-orange-500 transition-colors uppercase leading-none">{opt.label}</h4>
                </div>
                <p className="text-[7px] text-gray-500 group-hover:text-gray-300 leading-none mb-1.5">{opt.description}</p>
                
                <div className="flex flex-wrap gap-1">
                   {opt.effects.cash && (
                     <span className={`text-[5px] font-black px-1 py-0.5 rounded uppercase ${opt.effects.cash > 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                       {opt.effects.cash > 0 ? '+' : ''}{formatCurrency(opt.effects.cash).split('.')[0]}
                     </span>
                   )}
                   {opt.effects.reputation && (
                     <span className={`text-[5px] font-black px-1 py-0.5 rounded uppercase ${opt.effects.reputation > 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-500'}`}>
                       REP {opt.effects.reputation > 0 ? '+' : ''}{opt.effects.reputation}
                     </span>
                   )}
                   {opt.effects.rating && (
                     <span className={`text-[5px] font-black px-1 py-0.5 rounded uppercase ${opt.effects.rating > 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-500'}`}>
                       RTG {opt.effects.rating > 0 ? '+' : ''}{opt.effects.rating}
                     </span>
                   )}
                   {opt.effects.potential && (
                     <span className={`text-[5px] font-black px-1 py-0.5 rounded uppercase ${opt.effects.potential > 0 ? 'bg-purple-500/20 text-purple-400' : 'bg-red-500/20 text-red-500'}`}>
                       POT {opt.effects.potential > 0 ? '+' : ''}{opt.effects.potential}
                     </span>
                   )}
                   {opt.effects.retirePlayer && (
                     <span className="text-[5px] font-black px-1 py-0.5 rounded uppercase bg-red-600 text-white animate-pulse">
                       RETIREMENT
                     </span>
                   )}
                   {opt.effects.sponsorship && (
                     <span className="text-[5px] font-black px-1 py-0.5 rounded uppercase bg-green-500 text-white">
                       {opt.effects.sponsorship.brand}
                     </span>
                   )}
                </div>
             </button>
           ))}
        </div>

        <div className="px-3 py-1.5 bg-black/40 text-center">
           <p className="text-[5px] text-gray-700 font-black uppercase tracking-[0.4em]">Decisions shape your legacy and liquidity</p>
        </div>
      </div>
    </div>
  );
};

export default DecisionModal;
