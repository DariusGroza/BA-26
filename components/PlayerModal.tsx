
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
}

const PlayerModal: React.FC<PlayerModalProps> = ({ 
  player, team, teams, onClose, onSign, reputation, trainingPoints, onTrainAttribute, onNegotiate, onInteract 
}) => {
  const reqRep = getRequiredReputation(player);
  const canSign = !player.isClient && reputation >= reqRep;
  const isAcademy = !!player.isYouth;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-[#111114] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        
        <div className={`p-4 ${isAcademy ? 'bg-blue-600/10 border-blue-500/20' : 'bg-white/5'} flex items-center justify-between border-b border-white/5`}>
          <div className="flex items-center space-x-3">
             <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-4xl shadow-inner relative border border-white/5">
               {player.face}
               <div className="absolute -top-1 -right-1 bg-orange-600 text-white font-sporty text-lg px-1.5 rounded-lg border border-white/10">
                 {player.rating}
               </div>
             </div>
             <div>
                <h2 className="text-lg font-bold text-white leading-tight">{player.name}</h2>
                <div className="flex items-center space-x-2">
                   <span className="text-orange-500 text-[8px] font-black uppercase">
                     {player.position} • {player.role} • {player.age}y
                   </span>
                   {player.isChronic && (
                     <span className="bg-red-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase animate-pulse">Chronic Injury</span>
                   )}
                   {isAcademy && (
                     <span className="bg-blue-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase">Academy Prospect</span>
                   )}
                </div>
             </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white bg-white/5 rounded-lg transition-colors">✕</button>
        </div>

        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5 overflow-y-auto no-scrollbar">
           
           <div className="w-full md:w-5/12 p-4 space-y-4 shrink-0">
              {/* Financial Dashboard */}
              <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-3">
                 <h4 className="text-[7px] font-black text-orange-500 uppercase tracking-widest">Financial Profile</h4>
                 <div className="space-y-3">
                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                       <p className="text-[8px] text-gray-500 font-black uppercase">Annual Salary</p>
                       <p className={`text-sm font-sporty ${player.salary > 20000000 ? 'text-yellow-400' : 'text-white'}`}>
                        {formatCurrency(player.salary).split('.')[0]}
                       </p>
                    </div>
                    <div className="flex justify-between items-end">
                       <p className="text-[8px] text-gray-500 font-black uppercase">Market Value</p>
                       <p className="text-sm font-sporty text-green-500">
                        {formatCurrency(player.marketValue).split('.')[0]}
                       </p>
                    </div>
                    {player.isClient && (
                      <div className="pt-1 flex justify-between items-center bg-white/5 p-1.5 rounded">
                         <p className="text-[6px] text-gray-400 font-black uppercase">Your Commission ({(player.agentCommission * 100).toFixed(0)}%)</p>
                         <p className="text-[9px] font-bold text-white">~{formatCurrency(player.salary * player.agentCommission / 52).split('.')[0]}/wk</p>
                      </div>
                    )}
                 </div>
              </div>

              {/* Internal Dynamics */}
              <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-3">
                 <div className="flex justify-between items-center">
                    <h4 className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Athlete Health</h4>
                    <span className={`text-[6px] font-black px-1.5 py-0.5 rounded uppercase ${player.loyalty > 70 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      Loyalty: {player.loyalty}%
                    </span>
                 </div>
                 <div className="space-y-2">
                    <div>
                       <div className="flex justify-between text-[8px] font-black uppercase mb-1">
                          <span className="text-gray-500">Coach Trust</span>
                          <span className="text-blue-400">{player.coachTrust}%</span>
                       </div>
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${player.coachTrust}%` }}></div>
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between text-[8px] font-black uppercase mb-1">
                          <span className="text-gray-500">Moral Support</span>
                          <span className="text-green-500">{player.morale}%</span>
                       </div>
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: `${player.morale}%` }}></div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-2">
                {player.isClient ? (
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={onInteract} 
                      className="w-full py-3 bg-orange-600 text-white text-[9px] font-black uppercase rounded-lg shadow-lg shadow-orange-900/20 flex items-center justify-center space-x-2"
                    >
                      <span>🎁</span> <span>Gifting & Relations</span>
                    </button>
                    <button 
                      onClick={onNegotiate} 
                      className="w-full py-3 bg-white/5 text-white text-[9px] font-black uppercase rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                    >
                      Contract Terms
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => onSign(player.id)}
                    disabled={!canSign}
                    className={`w-full py-3 text-[9px] font-black uppercase rounded-lg transition-all ${canSign ? 'bg-orange-600 text-white shadow-xl' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
                  >
                    {canSign ? (isAcademy ? 'SIGN FOR FREE' : 'APPROACH PLAYER') : `NEED REP ${reqRep}`}
                  </button>
                )}
              </div>
           </div>

           <div className="flex-1 p-4 bg-black/10">
              <h4 className="text-[8px] font-black text-purple-400 uppercase tracking-widest mb-3">Skill Matrix</h4>
              <div className="space-y-3">
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
                    <div key={attr.key} className="bg-white/5 p-2 rounded-xl border border-white/5 flex items-center justify-between">
                       <div className="flex-1 mr-4">
                          <div className="flex justify-between text-[8px] font-black uppercase mb-1">
                             <span className="text-gray-400">{attr.label}</span>
                             <span className="text-white">{val}</span>
                          </div>
                          <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                             <div className={`${attr.color} h-full`} style={{ width: `${val}%` }}></div>
                          </div>
                       </div>
                       <button 
                         onClick={() => onTrainAttribute(player.id, attr.key)}
                         disabled={!canAfford}
                         className="px-2 py-2 min-w-[50px] rounded-lg bg-white text-black text-[9px] font-black flex flex-col items-center justify-center disabled:opacity-20 shadow-sm active:scale-95 transition-all"
                       >
                          <span className="leading-none">+1</span>
                          <span className="text-[6px] opacity-60 mt-0.5">{cost} TP</span>
                       </button>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 bg-black/20 p-3 rounded-xl border border-white/5">
                 <h4 className="text-[7px] font-black text-gray-500 uppercase tracking-widest mb-2">Seasonal Performance</h4>
                 <div className="grid grid-cols-3 gap-1 text-center">
                    <div><p className="text-xs font-bold text-white">{(player.seasonStats.pts/(player.seasonStats.gamesPlayed || 1)).toFixed(1)}</p><p className="text-[6px] text-gray-600 uppercase">PPG</p></div>
                    <div><p className="text-xs font-bold text-white">{player.seasonStats.minutesPerGame?.toFixed(0) || '0'}</p><p className="text-[6px] text-gray-600 uppercase">MIN</p></div>
                    <div><p className="text-xs font-bold text-white">{player.seasonStats.gamesPlayed}</p><p className="text-[6px] text-gray-600 uppercase">GP</p></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
