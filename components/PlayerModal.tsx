import React from 'react';
import { Player, Team, Match } from '../types';
import { formatCurrency, getRequiredReputation, getTrainingCost } from '../utils';

interface PlayerModalProps {
  player: Player;
  team?: Team;
  teams: Team[];
  onClose: () => void;
  onSign: (id: string) => void;
  reputation: number;
  matches: Match[];
  onNegotiate?: () => void;
  onInteract?: () => void;
  trainingPoints: number;
  onTrainAttribute: (playerId: string, attribute: keyof Player['stats']) => void;
  isAgencyFull: boolean;
}

const PlayerModal: React.FC<PlayerModalProps> = ({ 
  player, team, teams, onClose, onSign, reputation, trainingPoints, onTrainAttribute, onNegotiate, onInteract, isAgencyFull
}) => {
  const reqRep = getRequiredReputation(player);
  const canSign = !player.isClient && reputation >= reqRep && !isAgencyFull;
  const isAcademy = !!player.isYouth;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-[#0d0d0f] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        
        {/* Compressed Header */}
        <div className={`px-4 py-3 ${isAcademy ? 'bg-blue-900/20' : 'bg-white/5'} border-b border-white/5 flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
             <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-3xl shadow-inner relative border border-white/5">
               {player.face}
             </div>
             <div className="min-w-0">
                <h2 className="text-sm font-black text-white leading-none truncate uppercase">{player.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                   <span className="text-orange-500 text-[7px] font-black uppercase tracking-tighter">
                     {player.position} • {player.age}y • {player.role}
                   </span>
                   {player.isChronic && (
                     <span className="bg-red-600 text-white text-[5px] font-black px-1 py-0.5 rounded uppercase">Chronic</span>
                   )}
                </div>
             </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[14px] font-sporty text-orange-500 leading-none">{player.rating}</p>
              <p className="text-[6px] text-gray-500 font-black uppercase tracking-widest">OVR</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-white bg-white/5 rounded-lg transition-colors text-xs">✕</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
           
           {/* High-Density Vitals Row */}
           <div className="grid grid-cols-3 gap-2">
              <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                 <p className="text-[6px] text-gray-600 font-black uppercase mb-0.5">Valuation</p>
                 <p className="text-[10px] font-sporty text-green-500 truncate">{formatCurrency(player.marketValue).split('.')[0]}</p>
              </div>
              <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                 <p className="text-[6px] text-gray-600 font-black uppercase mb-0.5">Salary</p>
                 <p className="text-[10px] font-sporty text-white truncate">{formatCurrency(player.salary).split('.')[0]}</p>
              </div>
              <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                 <p className="text-[6px] text-gray-600 font-black uppercase mb-0.5">Loyalty</p>
                 <p className={`text-[10px] font-sporty ${player.loyalty > 70 ? 'text-blue-400' : 'text-red-400'}`}>{player.loyalty}%</p>
              </div>
           </div>

           {/* Skills Grid - More Compact Bars */}
           <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-[7px] font-black text-purple-400 uppercase tracking-widest">Performance Metrics</h4>
                <p className="text-[7px] text-gray-600 font-black uppercase">TP Avail: {trainingPoints}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                {[
                  { label: 'Scoring', key: 'scoring' as const, color: 'bg-red-500' },
                  { label: 'Defense', key: 'defense' as const, color: 'bg-blue-500' },
                  { label: 'Playmaking', key: 'playmaking' as const, color: 'bg-green-500' },
                  { label: 'Athleticism', key: 'athleticism' as const, color: 'bg-orange-500' },
                ].map(attr => {
                  const val = player.stats[attr.key];
                  const cost = getTrainingCost(val);
                  const canAfford = player.isClient && trainingPoints >= cost && val < 99;
                  return (
                    <div key={attr.key} className="flex items-center justify-between gap-3">
                       <div className="flex-1">
                          <div className="flex justify-between text-[7px] font-black uppercase mb-0.5">
                             <span className="text-gray-500">{attr.label}</span>
                             <span className="text-white">{val}</span>
                          </div>
                          <div className="h-0.5 bg-black/40 rounded-full overflow-hidden">
                             <div className={`${attr.color} h-full transition-all duration-500`} style={{ width: `${val}%` }}></div>
                          </div>
                       </div>
                       <button 
                         onClick={() => onTrainAttribute(player.id, attr.key)}
                         disabled={!canAfford}
                         className="px-2 py-1 rounded bg-white text-black text-[8px] font-black disabled:opacity-10 active:scale-90"
                       >
                          +{cost}
                       </button>
                    </div>
                  );
                })}
              </div>
           </div>
           
           {/* Season Stats - Ultra Tight */}
           <div className="bg-black/20 p-2 rounded-xl border border-white/5 grid grid-cols-4 gap-1 text-center">
              <div><p className="text-[10px] font-sporty text-white">{(player.seasonStats.pts/(player.seasonStats.gamesPlayed || 1)).toFixed(1)}</p><p className="text-[5px] text-gray-600 font-black uppercase">PPG</p></div>
              <div><p className="text-[10px] font-sporty text-white">{(player.seasonStats.reb/(player.seasonStats.gamesPlayed || 1)).toFixed(1)}</p><p className="text-[5px] text-gray-600 font-black uppercase">RPG</p></div>
              <div><p className="text-[10px] font-sporty text-white">{(player.seasonStats.ast/(player.seasonStats.gamesPlayed || 1)).toFixed(1)}</p><p className="text-[5px] text-gray-600 font-black uppercase">APG</p></div>
              <div><p className="text-[10px] font-sporty text-white">{player.seasonStats.gamesPlayed}</p><p className="text-[5px] text-gray-600 font-black uppercase">GP</p></div>
           </div>

           {/* Action Section */}
           <div className="pt-1 flex flex-col gap-2">
              {player.isClient ? (
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={onInteract} 
                    className="py-3 bg-orange-600 text-white text-[8px] font-black uppercase rounded-lg shadow-lg flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>🎁</span> RELATIONS
                  </button>
                  <button 
                    onClick={onNegotiate} 
                    className="py-3 bg-white/5 text-white text-[8px] font-black uppercase rounded-lg border border-white/10 hover:bg-white/10 active:scale-95"
                  >
                    CONTRACT
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => onSign(player.id)}
                  disabled={!canSign}
                  className={`w-full py-4 text-[9px] font-black uppercase rounded-lg transition-all ${
                    canSign 
                    ? 'bg-orange-600 text-white shadow-xl animate-pulse' 
                    : isAgencyFull 
                      ? 'bg-red-900/30 text-red-500 border border-red-500/20 cursor-not-allowed'
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isAgencyFull ? 'AGENCY CAPACITY FULL' : canSign ? (isAcademy ? 'ENROLL ATHLETE' : 'START NEGOTIATIONS') : `REPUTATION REQ: ${reqRep}`}
                </button>
              )}
           </div>
        </div>

        <div className="px-4 py-2 bg-black/40 text-center border-t border-white/5">
           <p className="text-[6px] text-gray-700 font-black uppercase tracking-[0.4em]">Official Morningstar Data Stream</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;