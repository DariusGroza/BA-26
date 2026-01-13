
import React from 'react';
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
}

const Dashboard: React.FC<DashboardProps> = ({ 
  gameState, players, teams, matches, onViewChange, onSelectPlayer, onSelectTeam, onSelectMatch, onUpgradeFacility, onFireManager, onFirePlayer
}) => {
  const managedTeam = teams.find(t => t.id === gameState.managedTeamId);
  const isOwner = !!managedTeam;
  const activePlayers = players.filter(p => p.seasonStats.gamesPlayed > 0);
  const teamRoster = players.filter(p => p.teamId === gameState.managedTeamId);
  const headCoach = gameState.managers.find(m => m.id === managedTeam?.managerId);
  
  // STATS LEADERS
  const getLeader = (sortFn: (a: Player, b: Player) => number) => [...activePlayers].sort(sortFn)[0];
  const ptsLeader = getLeader((a, b) => (b.seasonStats.pts / (b.seasonStats.gamesPlayed || 1)) - (a.seasonStats.pts / (a.seasonStats.gamesPlayed || 1)));
  const rebLeader = getLeader((a, b) => (b.seasonStats.reb / (b.seasonStats.gamesPlayed || 1)) - (a.seasonStats.reb / (a.seasonStats.gamesPlayed || 1)));
  const astLeader = getLeader((a, b) => (b.seasonStats.ast / (b.seasonStats.gamesPlayed || 1)) - (a.seasonStats.ast / (a.seasonStats.gamesPlayed || 1)));
  
  const mvpRace = [...activePlayers].sort((a, b) => {
    const score = (p: Player) => (p.rating * 0.4) + ((p.seasonStats.pts + p.seasonStats.reb + p.seasonStats.ast) / (p.seasonStats.gamesPlayed || 1)) * 0.6;
    return score(b) - score(a);
  }).slice(0, 3);

  // FIXTURES & STANDINGS
  const teamMatches = matches.filter(m => !managedTeam ? true : (m.homeTeamId === managedTeam.id || m.awayTeamId === managedTeam.id)).slice(0, 12);
  const standings = [...teams].filter(t => !t.isUniversity).sort((a, b) => b.wins - a.wins).slice(0, 15);

  const facilityDetails = {
    stadium: { benefit: "Yield: +25% Ticket Rev", icon: "🏟️", color: "text-green-400" },
    medical: { benefit: "Med: -20% Injury Length", icon: "🏥", color: "text-red-400" },
    scouting: { benefit: "Lab: +15% Rating Accuracy", icon: "🧪", color: "text-blue-400" },
    academy: { benefit: "Acad: +10% Rookie POT", icon: "🏫", color: "text-purple-400" }
  };

  const getTeamTheme = (id: string) => {
    const themes: Record<string, { from: string; to: string; text: string; shadow: string }> = {
      bos: { from: 'from-green-600', to: 'to-green-950', text: 'text-green-400', shadow: 'shadow-green-900/20' },
      lal: { from: 'from-purple-600', to: 'to-yellow-700', text: 'text-yellow-400', shadow: 'shadow-purple-900/20' },
      chi: { from: 'from-red-600', to: 'to-red-950', text: 'text-red-400', shadow: 'shadow-red-900/20' },
      gsw: { from: 'from-blue-600', to: 'to-yellow-500', text: 'text-blue-400', shadow: 'shadow-blue-900/20' },
      nyk: { from: 'from-blue-700', to: 'to-orange-600', text: 'text-orange-400', shadow: 'shadow-blue-900/20' },
    };
    return themes[id] || { from: 'from-orange-600', to: 'to-orange-900', text: 'text-orange-500', shadow: 'shadow-orange-900/20' };
  };

  const theme = isOwner ? getTeamTheme(managedTeam.id) : getTeamTheme('default');

  const StatLeaderCard = ({ title, player, stat, label, color }: any) => (
    <div className="bg-[#111114] border border-white/5 p-1.5 rounded-xl flex items-center space-x-2 hover:border-white/20 transition-all cursor-pointer group" onClick={() => player && onSelectPlayer(player)}>
      <div className="text-xl shrink-0 grayscale group-hover:grayscale-0">{player?.face || '👤'}</div>
      <div className="min-w-0">
        <p className={`text-[5px] font-black uppercase tracking-widest text-${color}-500 mb-0.5`}>{title}</p>
        <p className="text-[8px] font-bold text-white truncate leading-none mb-1">{player?.name.split(' ')[1] || '---'}</p>
        <p className="text-[9px] font-sporty text-white leading-none">{stat || '0.0'} <span className="text-[5px] text-gray-600 uppercase">{label}</span></p>
      </div>
    </div>
  );

  return (
    <div className="max-w-full mx-auto space-y-2 animate-in fade-in duration-500 pb-20 px-1">
      
      {/* EXECUTIVE IDENTITY STRIP */}
      <div className={`relative overflow-hidden rounded-xl bg-[#111114] border border-white/10 p-2 shadow-xl ${theme.shadow}`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${theme.from} ${theme.to} opacity-5`}></div>
        <div className="relative z-10 flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-xl border border-white/5">
              {isOwner ? managedTeam.logo : '💼'}
            </div>
            <div>
              <h2 className="text-sm font-sporty text-white leading-none uppercase tracking-tight">
                {isOwner ? `${managedTeam.name} EXECUTIVE WAR ROOM` : `${gameState.agencyName} OPS`}
              </h2>
              <p className="text-[6px] font-black text-gray-500 uppercase mt-0.5">WK {gameState.week} • YR {gameState.year} • {isOwner ? 'GOVERNOR ACCESS' : 'STANDARD'}</p>
            </div>
          </div>
          <div className="flex gap-1.5">
             <div className="bg-black/40 px-2 py-1 rounded-lg border border-white/5 text-center">
                <p className="text-[5px] text-gray-600 uppercase font-black">Capital</p>
                <p className="text-[10px] font-sporty text-green-500">{formatCurrency(gameState.cash).split('.')[0]}</p>
             </div>
             {isOwner && (
               <div className="bg-black/40 px-2 py-1 rounded-lg border border-white/5 text-center">
                  <p className="text-[5px] text-gray-600 uppercase font-black">Record</p>
                  <p className="text-[10px] font-sporty text-white">{managedTeam.wins}-{managedTeam.losses}</p>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* STATS LEADERS & MVP RUNNERS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5">
        <div className="bg-[#111114] border border-orange-500/20 p-2 rounded-xl flex flex-col justify-between hover:bg-orange-500/5 transition-all cursor-pointer group" onClick={() => onSelectPlayer(mvpRace[0])}>
           <p className="text-[5px] font-black text-orange-500 uppercase tracking-widest mb-1">MVP FAVORITE</p>
           <div className="flex items-center space-x-1.5">
              <span className="text-2xl group-hover:scale-110 transition-transform">{mvpRace[0]?.face || '👤'}</span>
              <div className="min-w-0">
                 <p className="text-[8px] font-bold text-white truncate">{mvpRace[0]?.name.split(' ')[1] || '---'}</p>
                 <div className="flex space-x-0.5 opacity-40">
                   {mvpRace.slice(1).map(p => <span key={p.id} className="text-[6px]">{p.face}</span>)}
                 </div>
              </div>
           </div>
        </div>
        <StatLeaderCard title="SCORING" player={ptsLeader} stat={ptsLeader ? (ptsLeader.seasonStats.pts/(ptsLeader.seasonStats.gamesPlayed || 1)).toFixed(1) : '0.0'} label="PPG" color="red" />
        <StatLeaderCard title="REBOUNDS" player={rebLeader} stat={rebLeader ? (rebLeader.seasonStats.reb/(rebLeader.seasonStats.gamesPlayed || 1)).toFixed(1) : '0.0'} label="RPG" color="emerald" />
        <StatLeaderCard title="ASSISTS" player={astLeader} stat={astLeader ? (astLeader.seasonStats.ast/(astLeader.seasonStats.gamesPlayed || 1)).toFixed(1) : '0.0'} label="APG" color="blue" />
        <div className="hidden md:flex bg-black/30 border border-white/5 p-2 rounded-xl flex-col justify-center text-center">
            <p className="text-[6px] text-gray-600 uppercase font-black">Season Progress</p>
            <div className="h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-orange-600" style={{ width: `${(gameState.week / 52) * 100}%` }}></div>
            </div>
            <p className="text-[8px] font-sporty text-gray-400 mt-1">{gameState.week}/52</p>
        </div>
      </div>

      {/* MAIN DATA GRID: RESULTS & STANDINGS SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5">
        {/* Results Wire */}
        <div className="bg-[#111114] border border-white/5 rounded-xl p-2 shadow-lg flex flex-col h-[280px]">
           <div className="flex justify-between items-center mb-1.5 px-1">
              <h3 className="text-[7px] font-black text-white uppercase tracking-widest">{isOwner ? 'TEAM RESULTS' : 'GLOBAL WIRE'}</h3>
              <button onClick={() => onViewChange('SCHEDULE')} className="text-[5px] font-bold text-blue-400 uppercase">Archive</button>
           </div>
           <div className="flex-1 overflow-y-auto no-scrollbar space-y-0.5">
              {teamMatches.length > 0 ? teamMatches.map(m => {
                const home = teams.find(t => t.id === m.homeTeamId);
                const away = teams.find(t => t.id === m.awayTeamId);
                const isManagedHome = managedTeam?.id === m.homeTeamId;
                const isManagedAway = managedTeam?.id === m.awayTeamId;
                const win = (isManagedHome && m.homeScore > m.awayScore) || (isManagedAway && m.awayScore > m.homeScore);
                
                return (
                  <div key={m.id} onClick={() => onSelectMatch(m)} className="p-1 px-2 bg-black/20 border border-white/[0.03] rounded-lg flex items-center justify-between hover:bg-white/[0.05] transition-all cursor-pointer">
                    <div className="flex items-center space-x-2 flex-1">
                       <span className="text-base shrink-0">{home?.logo}</span>
                       <span className={`text-[8px] font-bold uppercase truncate w-12 ${isManagedHome ? 'text-orange-500' : 'text-gray-500'}`}>{home?.name.substring(0,3)}</span>
                    </div>
                    <div className="text-center px-4 shrink-0">
                       <p className="text-[11px] font-sporty text-white leading-none">{m.homeScore}-{m.awayScore}</p>
                       {isOwner && (isManagedHome || isManagedAway) && (
                         <span className={`text-[5px] font-black ${win ? 'text-green-500' : 'text-red-500'}`}>{win ? 'WIN' : 'LOSS'}</span>
                       )}
                    </div>
                    <div className="flex items-center space-x-2 flex-1 justify-end">
                       <span className={`text-[8px] font-bold uppercase truncate w-12 text-right ${isManagedAway ? 'text-orange-500' : 'text-gray-500'}`}>{away?.name.substring(0,3)}</span>
                       <span className="text-base shrink-0">{away?.logo}</span>
                    </div>
                  </div>
                );
              }) : (
                <div className="h-full flex items-center justify-center italic text-gray-700 text-[8px]">No matches recorded in archives.</div>
              )}
           </div>
        </div>

        {/* Global Standings */}
        <div className="bg-[#111114] border border-white/5 rounded-xl p-2 shadow-lg flex flex-col h-[280px]">
           <div className="flex justify-between items-center mb-1.5 px-1">
              <h3 className="text-[7px] font-black text-white uppercase tracking-widest">GLOBAL STANDINGS</h3>
              <button onClick={() => onViewChange('LEAGUE')} className="text-[5px] font-bold text-orange-500 uppercase">Full Table</button>
           </div>
           <div className="flex-1 overflow-y-auto no-scrollbar space-y-0.5">
              {standings.map((t, i) => (
                <div key={t.id} onClick={() => onSelectTeam(t)} className={`flex items-center justify-between p-1 px-3 rounded-lg transition-all cursor-pointer ${t.id === gameState.managedTeamId ? 'bg-orange-600/10 border border-orange-500/20' : 'hover:bg-white/[0.02]'}`}>
                   <div className="flex items-center space-x-3 min-w-0">
                      <span className="text-[7px] font-black text-gray-700 w-3">{i+1}</span>
                      <span className="text-sm shrink-0">{t.logo}</span>
                      <p className={`text-[8px] font-bold truncate ${t.id === gameState.managedTeamId ? 'text-orange-500' : 'text-gray-300'}`}>{t.name}</p>
                   </div>
                   <span className="text-[10px] font-sporty text-white">{t.wins}-{t.losses}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* EXECUTIVE COMMAND CENTER (Owner Only) */}
      {isOwner && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1.5">
          {/* Infrastructure Matrix */}
          <div className="lg:col-span-8 bg-[#111114] border border-white/5 rounded-xl p-2">
             <div className="flex justify-between items-center mb-2 px-1">
                <h3 className="text-[7px] font-black text-white uppercase tracking-widest">FRANCHISE INFRASTRUCTURE</h3>
                <span className="text-[5px] text-gray-500 font-black uppercase">Capital: {formatCurrency(gameState.cash).split('.')[0]}</span>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
                {[
                  { id: 'stadium', label: 'Arena', lvl: managedTeam.stadiumLevel },
                  { id: 'medical', label: 'Medical', lvl: managedTeam.medicalLevel },
                  { id: 'scouting', label: 'Analytics', lvl: managedTeam.scoutingLevel },
                  { id: 'academy', label: 'Academy', lvl: managedTeam.academyLevel },
                ].map(f => {
                  const cost = INFRASTRUCTURE_UPGRADE_COSTS[f.lvl];
                  const info = facilityDetails[f.id as keyof typeof facilityDetails];
                  const canAfford = gameState.cash >= cost;
                  return (
                    <div key={f.id} className="bg-black/20 p-1.5 rounded-lg border border-white/[0.02] flex flex-col justify-between group transition-all hover:bg-black/40">
                       <div className="flex items-center space-x-1.5 mb-1">
                          <span className="text-base">{info.icon}</span>
                          <div className="min-w-0">
                             <p className="text-[7px] font-bold text-white uppercase truncate">{f.label}</p>
                             <p className="text-[5px] text-gray-600 font-black">LVL {f.lvl}</p>
                          </div>
                       </div>
                       <p className={`text-[5px] ${info.color} font-bold mb-1.5 leading-tight`}>{info.benefit}</p>
                       {f.lvl < 5 ? (
                         <button 
                            onClick={() => onUpgradeFacility(managedTeam.id, f.id as any)}
                            disabled={!canAfford}
                            className={`w-full py-1 rounded text-[5px] font-black transition-all ${canAfford ? 'bg-white text-black hover:bg-orange-600 hover:text-white' : 'bg-white/5 text-gray-700 cursor-not-allowed'}`}
                         >
                            UPG {formatCurrency(cost).split('.')[0]}
                         </button>
                       ) : <span className="text-[6px] font-black text-green-500 uppercase text-center bg-green-500/10 py-0.5 rounded">ELITE TIER</span>}
                    </div>
                  );
                })}
             </div>
          </div>

          {/* Front Office Command */}
          <div className="lg:col-span-4 bg-[#111114] border border-white/5 rounded-xl p-2 flex flex-col justify-center">
             <h3 className="text-[7px] font-black text-blue-500 uppercase tracking-widest mb-1.5 px-1">FRONT OFFICE</h3>
             {headCoach ? (
               <div className="bg-black/30 p-1.5 rounded-lg border border-white/[0.02] space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{headCoach.face}</span>
                    <div className="min-w-0">
                      <p className="text-[8px] font-bold text-white truncate">{headCoach.name}</p>
                      <p className="text-[5px] text-gray-500 font-black uppercase">Head Coach • {headCoach.rating} OVR</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[5px] font-black uppercase">
                      <div className="bg-white/5 p-1 rounded"><p className="text-gray-600">Tac</p><p className="text-white">{headCoach.stats.tactics}</p></div>
                      <div className="bg-white/5 p-1 rounded"><p className="text-gray-600">Dev</p><p className="text-white">{headCoach.stats.playerDev}</p></div>
                  </div>
                  <button onClick={() => onFireManager(managedTeam.id)} className="w-full py-1 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded border border-red-500/20 transition-all text-[7px] font-black uppercase">Terminate Contract</button>
               </div>
             ) : (
               <button onClick={() => onViewChange('PLAYERS')} className="w-full py-6 border border-dashed border-white/10 rounded-lg text-[7px] font-black text-gray-600 uppercase hover:text-white hover:border-white/30 transition-all">HIRE HEAD COACH</button>
             )}
          </div>
        </div>
      )}

      {/* ROSTER MANAGEMENT STRIP (Owner Only) */}
      {isOwner && (
        <div className="bg-[#111114] border border-white/5 rounded-xl p-2 shadow-inner">
           <div className="flex justify-between items-center mb-1.5 px-1">
              <h3 className="text-[7px] font-black text-white uppercase tracking-widest">ACTIVE ROSTER MANAGEMENT</h3>
              <div className="flex gap-2">
                <button onClick={() => onViewChange('DRAFT')} className="text-[5px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">Draft Board</button>
                <button onClick={() => onViewChange('AGENCY')} className="text-[5px] font-black text-orange-500 uppercase tracking-widest hover:text-white transition-colors">Trade Hub</button>
              </div>
           </div>
           <div className="flex overflow-x-auto no-scrollbar gap-1.5 pb-0.5">
              {teamRoster.sort((a,b) => b.rating - a.rating).map(p => (
                <div key={p.id} className="flex-shrink-0 w-24 bg-black/30 border border-white/[0.02] p-1.5 rounded-lg text-center group hover:border-white/20 transition-all">
                   <div className="cursor-pointer mb-1" onClick={() => onSelectPlayer(p)}>
                      <span className="text-xl block mb-0.5 group-hover:scale-105 transition-transform">{p.face}</span>
                      <p className="text-[7px] font-bold text-white truncate leading-none">{p.name.split(' ')[1]}</p>
                      <p className="text-[5px] text-gray-600 font-black mt-0.5 uppercase">{p.position} • {p.rating} RTG</p>
                   </div>
                   <div className="grid grid-cols-2 gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onViewChange('AGENCY')} className="bg-orange-600 text-white text-[5px] font-black p-1 rounded uppercase hover:bg-orange-500">TRADE</button>
                      <button onClick={() => onFirePlayer(p.id)} className="bg-red-600 text-white text-[5px] font-black p-1 rounded uppercase hover:bg-red-500">RELEASE</button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* QUICK FOOTER LINKS */}
      {!isOwner && (
        <div className="grid grid-cols-2 gap-1.5">
           <div onClick={() => onViewChange('FINANCE')} className="bg-green-600/10 border border-green-500/20 p-2 rounded-xl flex items-center justify-between cursor-pointer hover:bg-green-600/20">
              <div className="flex items-center space-x-2">
                 <span className="text-xl">💰</span>
                 <div><p className="text-[6px] font-black text-green-500 uppercase">Capital Management</p><p className="text-[8px] font-bold text-white uppercase">Invest in Teams</p></div>
              </div>
           </div>
           <div onClick={() => onViewChange('PLAYERS')} className="bg-blue-600/10 border border-blue-500/20 p-2 rounded-xl flex items-center justify-between cursor-pointer hover:bg-blue-600/20">
              <div className="flex items-center space-x-2">
                 <span className="text-xl">🏀</span>
                 <div><p className="text-[6px] font-black text-blue-400 uppercase">Pro Scouting</p><p className="text-[8px] font-bold text-white uppercase">Browse Free Agents</p></div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
