
import React, { useState } from 'react';
import { Player, Team, GameState, OfficeUpgrade } from '../types';
import { formatCurrency } from '../utils';
import { OFFICE_UPGRADES, OFFICE_DECOR } from '../constants';

interface AgencyViewProps {
  players: Player[];
  offers: any[]; 
  teams: Team[];
  onTrain: (id: string) => void;
  onSelectPlayer: (p: Player) => void;
  onResolveInjury?: (p: Player) => void;
  onTransferPlayer?: (playerId: string, targetTeamId: string) => void;
  onUpgradeOffice: (upgrade: OfficeUpgrade) => void;
  onBuyOfficeItem: (item: OfficeUpgrade) => void;
  gameState: GameState;
  onWatchAdReward: (type: 'INFLUENCE' | 'SCOUTING_POINTS' | 'SCOUTING_BOOST' | 'CASH' | 'REPUTATION') => void;
}

type AgencyTab = 'PORTFOLIO' | 'TRANSFERS' | 'OFFICE' | 'ACADEMY';

const AgencyView: React.FC<AgencyViewProps> = ({ 
  players, teams, onTrain, onSelectPlayer, onResolveInjury, onTransferPlayer, onUpgradeOffice, onBuyOfficeItem, gameState, onWatchAdReward
}) => {
  const [activeTab, setActiveTab] = useState<AgencyTab>('PORTFOLIO');
  const [targetTeam, setTargetTeam] = useState<Record<string, string>>({});

  const isTransferSeason = gameState.week >= 48 || gameState.week <= 4;

  const getMoraleColor = (val: number) => {
    if (val > 80) return 'text-green-400';
    if (val > 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const clients = players.filter(p => !p.isYouth);
  const academy = players.filter(p => p.isYouth);

  const nextUpgrade = OFFICE_UPGRADES[gameState.officeLevel];
  const currentClientsCount = players.filter(p => p.isClient).length;

  return (
    <div className="max-w-6xl mx-auto space-y-3 animate-in fade-in duration-500 pb-20">
      {/* Tab Navigation */}
      <div className="flex bg-[#111114] p-1 rounded-xl border border-white/5 shadow-lg gap-1">
        {(['PORTFOLIO', 'TRANSFERS', 'OFFICE', 'ACADEMY'] as AgencyTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all ${
              activeTab === tab ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'PORTFOLIO' && (
        <div className="space-y-3">
           {/* Ad Reward Boxes */}
           <div className="grid grid-cols-2 gap-3 px-1">
              <button 
                onClick={() => onWatchAdReward('CASH')}
                className="bg-green-600/10 border border-green-500/20 p-4 rounded-2xl flex items-center justify-between hover:bg-green-600/20 transition-all group shadow-lg"
              >
                 <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📺</div>
                    <div className="text-left">
                       <p className="text-[6px] font-black text-green-500 uppercase tracking-widest">Agency Sponsor</p>
                       <p className="text-[10px] font-bold text-white uppercase">Watch for $50,000</p>
                    </div>
                 </div>
                 <span className="text-green-500 font-black text-xs">▶</span>
              </button>
              <button 
                onClick={() => onWatchAdReward('REPUTATION')}
                className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl flex items-center justify-between hover:bg-blue-600/20 transition-all group shadow-lg"
              >
                 <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📢</div>
                    <div className="text-left">
                       <p className="text-[6px] font-black text-blue-400 uppercase tracking-widest">Public Relations</p>
                       <p className="text-[10px] font-bold text-white uppercase">Watch for +5 REP</p>
                    </div>
                 </div>
                 <span className="text-blue-400 font-black text-xs">▶</span>
              </button>
           </div>

           <div className="bg-[#111114] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
              <div className="bg-white/5 p-4 border-b border-white/5 flex justify-between items-center">
                  <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Client Roster</span>
                  <span className={`text-[8px] font-black uppercase ${currentClientsCount >= gameState.maxClients ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}>
                    Capacity: {currentClientsCount} / {gameState.maxClients}
                  </span>
              </div>
              <table className="w-full text-left border-collapse">
                  <thead className="bg-white/5 text-[7px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5">
                    <tr>
                        <th className="px-4 py-3">Player</th>
                        <th className="px-4 py-3 text-center">OVR</th>
                        <th className="px-4 py-3 text-center">Team</th>
                        <th className="px-4 py-3 text-center">Morale</th>
                        <th className="px-4 py-3 text-center">Contract</th>
                        <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {clients.map(p => (
                      <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                          <td className="px-4 py-2 flex items-center space-x-3 cursor-pointer" onClick={() => onSelectPlayer(p)}>
                            <span className="text-2xl">{p.face}</span>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold text-white truncate">{p.name}</p>
                                <p className="text-[6px] text-gray-600 font-black uppercase">{p.position} • {p.age}y</p>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-center font-sporty text-lg text-white">{p.rating}</td>
                          <td className="px-4 py-2 text-center text-[9px] font-bold text-gray-400">
                            {teams.find(t => t.id === p.teamId)?.name || 'FA'}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <span className={`text-[9px] font-black ${getMoraleColor(p.morale)}`}>{p.morale}%</span>
                          </td>
                          <td className="px-4 py-2 text-center text-[9px] font-bold text-blue-400">
                            {formatCurrency(p.salary).split('.')[0]}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <button 
                              onClick={() => onSelectPlayer(p)}
                              className="bg-white/5 hover:bg-orange-600 text-white text-[7px] font-black px-2 py-1 rounded uppercase transition-all"
                            >
                              Manage
                            </button>
                          </td>
                      </tr>
                    ))}
                    {clients.length === 0 && (
                      <tr><td colSpan={6} className="py-20 text-center text-gray-700 italic text-[9px] font-black uppercase tracking-widest">No professional clients signed.</td></tr>
                    )}
                  </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'OFFICE' && (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
          {/* Current Office Summary */}
          <div className="bg-gradient-to-br from-orange-600 to-orange-900 p-6 rounded-3xl shadow-xl flex items-center justify-between border border-white/10 relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-1">Agency Headquarters</p>
                <h3 className="text-4xl font-sporty text-white uppercase">{OFFICE_UPGRADES[gameState.officeLevel - 1].name}</h3>
                <div className="flex items-center space-x-3 mt-2">
                   <div className="px-3 py-1 bg-black/30 rounded-lg text-[9px] font-black text-white uppercase">LVL {gameState.officeLevel}</div>
                   <div className="px-3 py-1 bg-black/30 rounded-lg text-[9px] font-black text-white uppercase">{gameState.maxClients} MAX CLIENTS</div>
                </div>
             </div>
             <div className="text-8xl opacity-10 font-sporty absolute -right-4 -bottom-4 select-none">HQ</div>
             <span className="text-6xl relative z-10">{OFFICE_UPGRADES[gameState.officeLevel - 1].icon}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upgrade Section (CASH) */}
            <div className="bg-[#111114] p-5 rounded-3xl border border-white/5 space-y-4">
               <h4 className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Expansion Path (Cash)</h4>
               {nextUpgrade ? (
                 <div className="bg-black/30 p-4 rounded-2xl border border-white/5 flex flex-col justify-between h-40">
                    <div>
                       <div className="flex items-center space-x-3 mb-1">
                          <span className="text-2xl">{nextUpgrade.icon}</span>
                          <p className="text-sm font-bold text-white uppercase">{nextUpgrade.name}</p>
                       </div>
                       <p className="text-[8px] text-gray-500 font-bold uppercase leading-tight">Increase capacity to {nextUpgrade.capacityGain} players and gain +{nextUpgrade.repGain} Reputation.</p>
                    </div>
                    <button 
                      onClick={() => onUpgradeOffice(nextUpgrade)}
                      disabled={gameState.cash < nextUpgrade.cost}
                      className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        gameState.cash >= nextUpgrade.cost ? 'bg-white text-black hover:bg-orange-600 hover:text-white shadow-lg' : 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5'
                      }`}
                    >
                      {gameState.cash >= nextUpgrade.cost ? `Buy for ${formatCurrency(nextUpgrade.cost)}` : `Need ${formatCurrency(nextUpgrade.cost)}`}
                    </button>
                 </div>
               ) : (
                 <div className="py-12 text-center text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 rounded-2xl border border-green-500/20">
                    Global Network Status Achieved
                 </div>
               )}
            </div>

            {/* Office Decor/Furniture (REPUTATION) */}
            <div className="bg-[#111114] p-5 rounded-3xl border border-white/5 space-y-4">
               <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Status Items (Reputation)</h4>
               <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
                  {OFFICE_DECOR.map(item => {
                    const isOwned = gameState.officeItems.includes(item.id);
                    const repCost = item.cost / 1000;
                    return (
                      <div key={item.id} className={`p-3 rounded-xl border flex items-center justify-between transition-all ${isOwned ? 'bg-green-500/10 border-green-500/20' : 'bg-black/20 border-white/5'}`}>
                         <div className="flex items-center space-x-3">
                            <span className="text-xl">{item.icon}</span>
                            <div>
                               <p className="text-[10px] font-bold text-white uppercase">{item.name}</p>
                               <p className="text-[7px] text-blue-400 font-black uppercase">Adds +{item.capacityGain} CAP</p>
                            </div>
                         </div>
                         {isOwned ? (
                           <span className="text-[8px] font-black text-green-500 uppercase px-2">ACTIVE</span>
                         ) : (
                           <button 
                            onClick={() => onBuyOfficeItem(item)}
                            disabled={gameState.reputation < repCost}
                            className={`px-3 py-1.5 rounded-lg text-[7px] font-black uppercase transition-all ${
                              gameState.reputation >= repCost ? 'bg-blue-600 text-white hover:bg-white hover:text-blue-600' : 'bg-white/5 text-gray-700'
                            }`}
                           >
                             {repCost.toFixed(1)} REP
                           </button>
                         )}
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'TRANSFERS' && (
        <div className="space-y-3">
          <div className={`p-4 rounded-xl border flex justify-between items-center ${isTransferSeason ? 'bg-blue-600/10 border-blue-500/20' : 'bg-red-500/10 border-red-500/20 opacity-50'}`}>
             <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Global Transfer Portal</h3>
                <p className="text-[8px] text-gray-500 font-bold uppercase">{isTransferSeason ? 'Window is OPEN (Weeks 48-4)' : 'Window is CLOSED'}</p>
             </div>
             <div className="text-right max-w-xs">
                <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Stability Warning</p>
                <p className="text-[7px] font-bold text-blue-400 uppercase leading-tight">Frequent transfers (2+ per season) will cause permanent rating drops and severe morale penalties for individual clients.</p>
             </div>
          </div>

          <div className="bg-[#111114] rounded-2xl border border-white/5 overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-white/5 text-[7px] font-black text-gray-500 uppercase tracking-widest">
                   <tr>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3 text-center">Moves</th>
                      <th className="px-4 py-3 text-center">Value</th>
                      <th className="px-4 py-3 text-right">Shop to Franchise</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                   {clients.map(p => (
                     <tr key={p.id} className="hover:bg-white/[0.01]">
                        <td className="px-4 py-2 flex items-center space-x-3">
                           <span className="text-2xl">{p.face}</span>
                           <div className="min-w-0">
                              <p className="text-[10px] font-bold text-white truncate">{p.name}</p>
                              <p className="text-[6px] text-gray-600 font-black uppercase">{teams.find(t => t.id === p.teamId)?.name || 'FA'}</p>
                           </div>
                        </td>
                        <td className="px-4 py-2 text-center">
                           <span className={`text-[9px] font-black ${p.timesTransferred > 0 ? 'text-orange-500' : 'text-gray-600'}`}>
                             {p.timesTransferred}
                           </span>
                        </td>
                        <td className="px-4 py-2 text-center text-[9px] font-bold text-green-500">{formatCurrency(p.marketValue).split('.')[0]}</td>
                        <td className="px-4 py-2 text-right">
                           <div className="flex items-center justify-end space-x-2">
                              <select 
                                className="bg-black/50 border border-white/10 rounded px-2 py-1 text-[8px] font-bold text-white outline-none w-28 disabled:opacity-30"
                                disabled={!isTransferSeason}
                                value={targetTeam[p.id] || ''}
                                onChange={(e) => setTargetTeam({...targetTeam, [p.id]: e.target.value})}
                              >
                                 <option value="">Dest.</option>
                                 {teams.filter(t => !t.isUniversity && t.id !== p.teamId).map(t => (
                                   <option key={t.id} value={t.id}>{t.logo} {t.name}</option>
                                 ))}
                              </select>
                              <button 
                                onClick={() => { if(targetTeam[p.id]) onTransferPlayer?.(p.id, targetTeam[p.id]) }}
                                disabled={!isTransferSeason || !targetTeam[p.id]}
                                className="bg-white text-black hover:bg-blue-600 hover:text-white text-[7px] font-black px-3 py-1.5 rounded uppercase transition-all disabled:opacity-20"
                              >
                                Move
                              </button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {activeTab === 'ACADEMY' && (
        <div className="bg-[#111114] rounded-2xl border border-white/5 overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-white/5 text-[7px] font-black text-gray-500 uppercase tracking-widest">
                 <tr>
                    <th className="px-4 py-3">Identity</th>
                    <th className="px-4 py-3 text-center">Rating</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                 {academy.map(p => (
                   <tr key={p.id} className="hover:bg-white/[0.01]">
                      <td className="px-4 py-2 flex items-center space-x-3">
                         <span className="text-2xl">{p.face}</span>
                         <div>
                            <p className="text-[10px] font-bold text-white">{p.name}</p>
                            <p className="text-[6px] text-gray-600 font-black uppercase">{p.position} • {p.age}y</p>
                         </div>
                      </td>
                      <td className="px-4 py-2 text-center font-sporty text-lg text-blue-400">{p.rating}</td>
                      <td className="px-4 py-2 text-right">
                         <button className="bg-white/5 text-gray-500 text-[7px] font-black px-2 py-1 rounded uppercase">Academy Path</button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default AgencyView;
