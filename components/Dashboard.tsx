import React, { useState } from 'react';
import { GameState, Player, Team, Match, Manager } from '../types';
import { formatCurrency } from '../utils';
import { INFRASTRUCTURE_UPGRADE_COSTS } from '../constants';

interface DashboardProps {
  gameState: GameState;
  players: Player[];
  teams: Team[];
  matches: Match[];
  onViewChange: (view: any) => void;
  onSelectPlayer: (p: Player) => void;
  onSelectTeam: (t: Team) => void;
  onSelectMatch: (m: Match) => void;
  onShowAwardHistory: (category: 'MVP' | 'SCORING' | 'ROOKIE' | 'ALL') => void;
  onUpgradeFacility: (teamId: string, type: 'stadium' | 'medical' | 'scouting' | 'academy') => void;
  onFireManager: (teamId: string) => void;
  onFirePlayer: (playerId: string) => void;
  onShowFinance: () => void;
}

type RaceType = 'MVP' | 'SCORING' | 'REBOUNDS' | 'ASSISTS';

const Dashboard: React.FC<DashboardProps> = ({ 
  gameState, players, teams, matches, onViewChange, onSelectPlayer, onSelectTeam, onSelectMatch, onUpgradeFacility, onFireManager, onFirePlayer, onShowFinance
}) => {
  const [inspectedRace, setInspectedRace] = useState<RaceType | null>(null);
  
  const managedTeam = teams.find(t => t.id === gameState.managedTeamId);
  const isOwner = !!managedTeam;
  const activePlayers = players.filter(p => p.seasonStats.gamesPlayed > 0);
  const teamRoster = players.filter(p => p.teamId === gameState.managedTeamId).sort((a,b) => b.rating - a.rating);
  const headCoach = gameState.managers.find(m => m.id === managedTeam?.managerId);
  
  const getTop5 = (sortFn: (a: Player, b: Player) => number) => [...activePlayers].sort(sortFn).slice(0, 5);
  
  const mvpRace = getTop5((a, b) => {
    const score = (p: Player) => (p.rating * 0.4) + ((p.seasonStats.pts + p.seasonStats.reb + p.seasonStats.ast) / (p.seasonStats.gamesPlayed || 1)) * 0.6;
    return score(b) - score(a);
  });

  const scoringRace = getTop5((a, b) => (b.seasonStats.pts / b.seasonStats.gamesPlayed) - (a.seasonStats.pts / a.seasonStats.gamesPlayed));
  const reboundingRace = getTop5((a, b) => (b.seasonStats.reb / b.seasonStats.gamesPlayed) - (a.seasonStats.reb / a.seasonStats.gamesPlayed));
  const assistingRace = getTop5((a, b) => (b.seasonStats.ast / b.seasonStats.gamesPlayed) - (a.seasonStats.ast / a.seasonStats.gamesPlayed));
  
  const leaders = {
    MVP: mvpRace,
    SCORING: scoringRace,
    REBOUNDS: reboundingRace,
    ASSISTS: assistingRace
  };

  const getRaceValue = (p: Player, type: RaceType) => {
    const gp = p.seasonStats.gamesPlayed || 1;
    if (type === 'MVP') return ((p.rating * 0.4) + ((p.seasonStats.pts + p.seasonStats.reb + p.seasonStats.ast) / gp) * 0.6).toFixed(1);
    if (type === 'SCORING') return (p.seasonStats.pts / gp).toFixed(1);
    if (type === 'REBOUNDS') return (p.seasonStats.reb / gp).toFixed(1);
    if (type === 'ASSISTS') return (p.seasonStats.ast / gp).toFixed(1);
    return '0.0';
  };

  const getRaceLabel = (type: RaceType) => {
    if (type === 'MVP') return 'Score';
    if (type === 'SCORING') return 'PPG';
    if (type === 'REBOUNDS') return 'RPG';
    if (type === 'ASSISTS') return 'APG';
    return '';
  };

  const teamMatches = matches.filter(m => !managedTeam ? true : (m.homeTeamId === managedTeam.id || m.awayTeamId === managedTeam.id)).slice(0, 12);
  const standings = [...teams].filter(t => !t.isUniversity).sort((a, b) => b.wins - a.wins).slice(0, 15);

  const getTeamTheme = (id: string) => {
    const themes: Record<string, { from: string; to: string; text: string; shadow: string; border: string; bg: string }> = {
      bos: { from: 'from-green-600', to: 'to-green-950', text: 'text-green-400', shadow: 'shadow-green-900/30', border: 'border-green-500/40', bg: 'bg-green-600/5' },
      lal: { from: 'from-purple-600', to: 'to-yellow-700', text: 'text-yellow-400', shadow: 'shadow-purple-900/30', border: 'border-yellow-500/40', bg: 'bg-purple-600/5' },
      chi: { from: 'from-red-600', to: 'to-red-950', text: 'text-red-400', shadow: 'shadow-red-900/30', border: 'border-red-500/40', bg: 'bg-red-600/5' },
      gsw: { from: 'from-blue-600', to: 'to-yellow-500', text: 'text-blue-400', shadow: 'shadow-blue-900/30', border: 'border-blue-500/40', bg: 'bg-blue-600/5' },
      nyk: { from: 'from-blue-700', to: 'to-orange-600', text: 'text-orange-400', shadow: 'shadow-blue-900/30', border: 'border-orange-500/40', bg: 'bg-blue-600/5' },
    };
    return themes[id] || { from: 'from-zinc-600', to: 'to-zinc-950', text: 'text-zinc-400', shadow: 'shadow-zinc-900/20', border: 'border-white/10', bg: 'bg-white/5' };
  };

  const theme = isOwner ? getTeamTheme(managedTeam.id) : getTeamTheme('default');

  const StatLeaderCard = ({ title, type, player, color }: { title: string, type: RaceType, player: Player | undefined, color: string }) => (
    <div 
      className="bg-[#111114] border border-white/5 p-1.5 rounded-xl flex items-center space-x-2 hover:border-white/20 transition-all cursor-pointer group" 
      onClick={() => setInspectedRace(type)}
    >
      <div className="text-xl shrink-0 grayscale group-hover:grayscale-0">{player?.face || '👤'}</div>
      <div className="min-w-0">
        <p className={`text-[5px] font-black uppercase tracking-widest text-${color}-500 mb-0.5`}>{title}</p>
        <p className="text-[8px] font-bold text-white truncate leading-none mb-1">{player?.name.split(' ')[1] || '---'}</p>
        <p className="text-[9px] font-sporty text-white leading-none">
          {player ? getRaceValue(player, type) : '0.0'} <span className="text-[5px] text-gray-600 uppercase">{getRaceLabel(type)}</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-full mx-auto space-y-3 animate-in fade-in duration-500 px-1 relative pb-20">
      {inspectedRace && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setInspectedRace(null)}></div>
          <div className="relative bg-[#111114] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-sporty text-white uppercase tracking-wider leading-none">Stat Leaders</h3>
                <p className="text-[7px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Global Database</p>
              </div>
              <button onClick={() => setInspectedRace(null)} className="text-gray-500 text-sm">✕</button>
            </div>
            <div className="p-4 space-y-2">
               {leaders[inspectedRace].map((p, idx) => (
                 <div key={p.id} onClick={() => { onSelectPlayer(p); setInspectedRace(null); }} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-all cursor-pointer group">
                   <div className="flex items-center space-x-4">
                     <span className="text-xs font-black text-gray-700">{idx + 1}</span>
                     <div className="text-2xl">{p.face}</div>
                     <div><p className="text-[10px] font-bold text-white uppercase group-hover:text-orange-500">{p.name}</p></div>
                   </div>
                   <div className="text-right">
                     <p className="text-lg font-sporty text-white">{getRaceValue(p, inspectedRace)}</p>
                     <p className="text-[6px] text-gray-600 font-black uppercase">{getRaceLabel(inspectedRace)}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      <div className={`relative overflow-hidden rounded-xl bg-[#111114] border border-white/10 p-3 shadow-xl ${theme.shadow}`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${theme.from} ${theme.to} opacity-5`}></div>
        <div className="relative z-10 flex items-center justify-between px-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-2xl border border-white/5 shadow-inner">
              {isOwner ? managedTeam.logo : '💼'}
            </div>
            <div>
              <h2 className="text-base font-sporty text-white leading-none uppercase tracking-tight">
                {isOwner ? `${managedTeam.name} Control` : `${gameState.agencyName} Hub`}
              </h2>
              <p className="text-[7px] font-black text-gray-500 uppercase mt-1">WK {gameState.week} • YR {gameState.year} • GLOBAL FEED</p>
            </div>
          </div>
          <div className="flex gap-2">
             <button onClick={onShowFinance} className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 text-center group hover:bg-white/5 transition-all">
                <p className="text-[5px] text-gray-600 uppercase font-black group-hover:text-green-500">Equity</p>
                <p className="text-[11px] font-sporty text-green-500">{formatCurrency(gameState.cash).split('.')[0]}</p>
             </button>
             {isOwner && (
               <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 text-center">
                  <p className="text-[5px] text-gray-600 uppercase font-black">Record</p>
                  <p className="text-[11px] font-sporty text-white">{managedTeam.wins}-{managedTeam.losses}</p>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <div className="bg-[#111114] border border-orange-500/20 p-2.5 rounded-xl flex flex-col justify-between hover:bg-orange-500/5 transition-all cursor-pointer group" onClick={() => setInspectedRace('MVP')}>
           <p className="text-[5px] font-black text-orange-500 uppercase tracking-widest mb-1">MVP FAVORITE</p>
           <div className="flex items-center space-x-2">
              <span className="text-3xl group-hover:scale-110 transition-transform">{mvpRace[0]?.face || '👤'}</span>
              <div className="min-w-0">
                 <p className="text-[9px] font-bold text-white truncate">{mvpRace[0]?.name.split(' ')[1] || '---'}</p>
              </div>
           </div>
        </div>
        <StatLeaderCard title="SCORING" type="SCORING" player={scoringRace[0]} color="red" />
        <StatLeaderCard title="REBOUNDS" type="REBOUNDS" player={reboundingRace[0]} color="emerald" />
        <StatLeaderCard title="ASSISTS" type="ASSISTS" player={assistingRace[0]} color="blue" />
        <div className="hidden md:flex bg-black/30 border border-white/5 p-2 rounded-xl flex-col justify-center text-center">
            <p className="text-[6px] text-gray-600 uppercase font-black">Calendar</p>
            <p className="text-[8px] font-sporty text-gray-400 mt-1">{gameState.week}/52</p>
        </div>
      </div>

      {isOwner && (
        <div className={`relative bg-[#0d0d0f] border-t-2 ${theme.border} rounded-2xl p-4 md:p-6 shadow-2xl overflow-hidden animate-in slide-in-from-top-4`}>
           <div className={`absolute -right-4 -bottom-10 text-[12rem] opacity-5 pointer-events-none font-sporty select-none`}>{managedTeam.logo}</div>
           
           <div className="relative z-10 flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${theme.bg} rounded-xl border ${theme.border} flex items-center justify-center text-xl`}>🏢</div>
                <div>
                   <h3 className="text-xl font-sporty text-white uppercase tracking-wider leading-none">Franchise Commands</h3>
                   <p className="text-[7px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">Governor Access • {managedTeam.name} Board Room</p>
                </div>
              </div>
              <span className={`text-[7px] font-black ${theme.text} bg-black/40 px-3 py-1.5 rounded-lg border ${theme.border} uppercase tracking-widest`}>Governor Active</span>
           </div>
           
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Infrastructure Section */}
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center justify-between px-1">
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Facility upgrades</p>
                   <span className="text-[8px] font-bold text-blue-400">Net Rev: +{(managedTeam.weeklyRevenue/1000).toFixed(0)}k</span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                   {[
                      { type: 'stadium', icon: '🏟️', label: 'Stadium', benefit: 'Income boost' },
                      { type: 'medical', icon: '🏥', label: 'Medical', benefit: 'Heal speed / Prev.' },
                      { type: 'scouting', icon: '📡', label: 'Scouting', benefit: 'Weekly SP yield' },
                      { type: 'academy', icon: '🎓', label: 'Academy', benefit: 'Yearly talent' }
                   ].map(fac => {
                      const level = managedTeam[`${fac.type}Level` as keyof Team] as number;
                      const cost = INFRASTRUCTURE_UPGRADE_COSTS[level];
                      const isMaxed = level >= 5;
                      const canAfford = gameState.cash >= cost;

                      return (
                        <button 
                          key={fac.type}
                          onClick={() => onUpgradeFacility(managedTeam.id, fac.type as any)}
                          disabled={isMaxed || !canAfford}
                          className={`bg-black/60 border rounded-xl p-3 flex flex-col transition-all group ${isMaxed ? 'border-green-500/20' : canAfford ? `hover:${theme.border} border-white/5 shadow-lg` : 'border-white/5 opacity-50'}`}
                        >
                           <div className="flex items-center justify-between mb-1">
                              <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{fac.icon}</span>
                              <span className={`text-[9px] font-sporty ${isMaxed ? 'text-green-500' : 'text-gray-400'}`}>LVL {level}</span>
                           </div>
                           <p className="text-[9px] font-bold text-white uppercase truncate text-left mb-0.5">{fac.label}</p>
                           <p className="text-[6px] text-blue-400 font-black uppercase text-left mb-2 tracking-tighter">+{fac.benefit}</p>
                           
                           {/* Pips */}
                           <div className="flex gap-1 mb-2">
                              {[1,2,3,4,5].map(p => (
                                <div key={p} className={`h-1 flex-1 rounded-full ${p <= level ? (isMaxed ? 'bg-green-500' : 'bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.5)]') : 'bg-white/5'}`}></div>
                              ))}
                           </div>

                           <div className="mt-auto">
                              <p className={`text-[6px] font-black uppercase text-center ${isMaxed ? 'text-green-500' : canAfford ? 'text-gray-500 group-hover:text-white' : 'text-red-500'}`}>
                                 {isMaxed ? 'MAXED' : `$${(cost/1000000).toFixed(0)}M`}
                              </p>
                           </div>
                        </button>
                      )
                   })}
                </div>
              </div>

              {/* Roster & Coaching Section */}
              <div className="lg:col-span-3 space-y-4">
                 <div className="flex justify-between items-center px-1">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Franchise Personnel</p>
                    <div className="flex gap-3">
                       <button onClick={() => onViewChange('PLAYERS')} className="text-[7px] font-bold text-orange-500 hover:underline uppercase tracking-widest">Recruit coaches</button>
                       <button onClick={() => onViewChange('MARKET')} className="text-[7px] font-bold text-blue-400 hover:underline uppercase tracking-widest">Sign FAs</button>
                    </div>
                 </div>

                 <div className="bg-black/60 border border-white/10 rounded-2xl overflow-hidden shadow-inner">
                    <div className="max-h-[300px] overflow-y-auto no-scrollbar divide-y divide-white/[0.03]">
                       {/* Coach Card */}
                       <div className="p-4 flex items-center justify-between bg-white/[0.02]">
                          <div className="flex items-center space-x-4">
                             <div className={`w-12 h-12 bg-blue-600/10 rounded-xl border border-blue-500/20 flex items-center justify-center text-3xl shadow-lg`}>👔</div>
                             <div>
                                <p className="text-xs font-bold text-white uppercase tracking-tight">{headCoach?.name || 'Vacancy: Head Coach'}</p>
                                <p className="text-[8px] text-blue-400 font-black uppercase tracking-widest mt-1">Tactics: {headCoach?.rating || '??'} OVR • Dev: {headCoach?.stats.playerDev || '??'}</p>
                             </div>
                          </div>
                          {headCoach && (
                            <button 
                              onClick={() => onFireManager(managedTeam.id)} 
                              className="px-4 py-2 bg-red-600/10 text-red-500 border border-red-500/20 rounded-lg text-[7px] font-black uppercase hover:bg-red-600 hover:text-white transition-all shadow-lg"
                            >
                              Terminate Contract
                            </button>
                          )}
                       </div>

                       {/* Player List */}
                       <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-1.5">
                          {teamRoster.map(p => (
                            <div key={p.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                               <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectPlayer(p)}>
                                  <span className="text-2xl shrink-0 grayscale group-hover:grayscale-0 transition-all">{p.face}</span>
                                  <div className="min-w-0">
                                     <p className="text-[10px] font-bold text-white truncate uppercase tracking-tighter">{p.name}</p>
                                     <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[6px] font-black text-gray-500 bg-white/5 px-1.5 py-0.5 rounded uppercase">{p.position} • {p.rating} OVR</span>
                                        <span className="text-[7px] font-bold text-blue-400">${(p.salary/1000000).toFixed(1)}M</span>
                                     </div>
                                  </div>
                               </div>
                               <button 
                                 onClick={() => onFirePlayer(p.id)} 
                                 className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-red-600/10 text-red-500 border border-red-500/20 rounded-md text-[6px] font-black uppercase hover:bg-red-600 hover:text-white transition-all"
                               >
                                 Release
                               </button>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-[#111114] border border-white/5 rounded-xl p-3 shadow-lg flex flex-col">
           <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="text-[8px] font-black text-white uppercase tracking-widest">FIXTURES & RESULTS</h3>
              <button onClick={() => onViewChange('SCHEDULE')} className="text-[6px] font-bold text-blue-400 uppercase">View Calendar</button>
           </div>
           <div className="space-y-1">
              {teamMatches.length > 0 ? teamMatches.map(m => {
                const home = teams.find(t => t.id === m.homeTeamId);
                const away = teams.find(t => t.id === m.awayTeamId);
                return (
                  <div key={m.id} onClick={() => onSelectMatch(m)} className="p-2 px-3 bg-black/20 border border-white/[0.03] rounded-lg flex items-center justify-between hover:bg-white/[0.05] transition-all cursor-pointer">
                    <div className="flex items-center space-x-3 flex-1">
                       <span className="text-xl shrink-0">{home?.logo}</span>
                       <span className={`text-[9px] font-bold uppercase truncate w-14 text-gray-500`}>{home?.name.substring(0,3)}</span>
                    </div>
                    <div className="text-center px-4 shrink-0">
                       <p className="text-xs font-sporty text-white leading-none">{m.homeScore}-{m.awayScore}</p>
                    </div>
                    <div className="flex items-center space-x-3 flex-1 justify-end">
                       <span className={`text-[9px] font-bold uppercase truncate w-14 text-right text-gray-500`}>{away?.name.substring(0,3)}</span>
                       <span className="text-xl shrink-0">{away?.logo}</span>
                    </div>
                  </div>
                );
              }) : <div className="py-10 text-center text-[10px] text-gray-700 font-black uppercase">No Recent Fixtures</div>}
           </div>
        </div>

        <div className="bg-[#111114] border border-white/5 rounded-xl p-3 shadow-lg flex flex-col">
           <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="text-[8px] font-black text-white uppercase tracking-widest">GLOBAL STANDINGS</h3>
              <button onClick={() => onViewChange('LEAGUE')} className="text-[6px] font-bold text-orange-500 uppercase">League Standings</button>
           </div>
           <div className="space-y-1">
              {standings.map((t, i) => (
                <div key={t.id} onClick={() => onSelectTeam(t)} className={`flex items-center justify-between p-2 px-3 rounded-lg hover:bg-white/[0.02] cursor-pointer`}>
                   <div className="flex items-center space-x-4 min-w-0">
                      <span className="text-[8px] font-black text-gray-700 w-4">{i+1}</span>
                      <span className="text-lg shrink-0">{t.logo}</span>
                      <p className={`text-[10px] font-bold truncate text-gray-300 uppercase tracking-tighter`}>{t.name}</p>
                   </div>
                   <span className="text-xs font-sporty text-white">{t.wins}-{t.losses}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;