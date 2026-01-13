
import React, { useState, useMemo } from 'react';
import { GameState, Player, Scout, Team, Match, Position } from '../types';
import { formatCurrency, getRequiredReputation } from '../utils';
import { SCOUT_HIRE_COSTS, SCOUT_WEEKLY_SALARY } from '../constants';

interface AcademyViewProps {
  gameState: GameState;
  teams: Team[];
  players: Player[];
  matches: Match[];
  hireScout: (level: 1 | 2 | 3) => void;
  academyPlayers: Player[];
  talentPool: Player[];
  onSignAcademy: (id: string) => void;
  onScoutAcademy: (id: string, cost: number) => void;
  onSelectPlayer: (p: Player) => void;
  onSelectTeam: (t: Team) => void;
  // Removed duplicate onWatchAdReward definition
  onWatchAdReward: (type: 'INFLUENCE' | 'SCOUTING_POINTS' | 'SCOUTING_BOOST' | 'CASH') => void;
  onAssignToUniversity: (playerId: string, uniTeamId: string) => void;
}

type AcademyTab = 'SCOUTING' | 'YOUNG_TALENTS' | 'STANDINGS' | 'HONORS';

const AcademyView: React.FC<AcademyViewProps> = ({ 
  gameState, 
  teams, 
  players, 
  matches, 
  hireScout, 
  academyPlayers, 
  talentPool, 
  onSignAcademy, 
  onScoutAcademy, 
  onSelectPlayer, 
  onSelectTeam,
  onWatchAdReward,
  onAssignToUniversity
}) => {
  const [activeTab, setActiveTab] = useState<AcademyTab>('STANDINGS');
  const [viewingScoutReportId, setViewingScoutReportId] = useState<string | null>(null);
  const [assigningPlayerId, setAssigningPlayerId] = useState<string | null>(null);

  const getRecommendation = (scout: Scout) => {
    const elapsed = gameState.week - scout.hiredWeek;
    return elapsed > 0 && elapsed % 4 === 0;
  };

  const uniTeams = useMemo(() => teams.filter(t => t.isUniversity), [teams]);
  const uniStandings = useMemo(() => [...uniTeams].sort((a, b) => b.wins - a.wins), [uniTeams]);
  const recentUniMatches = useMemo(() => matches.filter(m => m.isYouthMatch).slice(0, 20), [matches]);
  
  const uniPlayers = useMemo(() => players.filter(p => {
    const t = teams.find(team => team.id === p.teamId);
    return t?.isUniversity;
  }), [players, teams]);

  const ivyLeaders = useMemo(() => {
    const activeUniPlayers = uniPlayers.filter(p => p.seasonStats.gamesPlayed > 0);
    return {
      points: [...activeUniPlayers].sort((a, b) => (b.seasonStats.pts / b.seasonStats.gamesPlayed) - (a.seasonStats.pts / a.seasonStats.gamesPlayed)).slice(0, 5),
      rebounds: [...activeUniPlayers].sort((a, b) => (b.seasonStats.reb / b.seasonStats.gamesPlayed) - (a.seasonStats.reb / a.seasonStats.gamesPlayed)).slice(0, 5),
      assists: [...activeUniPlayers].sort((a, b) => (b.seasonStats.ast / b.seasonStats.gamesPlayed) - (a.seasonStats.ast / a.seasonStats.gamesPlayed)).slice(0, 5),
      prospects: [...uniPlayers].sort((a, b) => b.stats.potential - a.stats.potential).slice(0, 10)
    };
  }, [uniPlayers]);

  const recommendationPlayer = useMemo(() => {
    if (!viewingScoutReportId) return null;
    const scout = gameState.scouts.find(s => s.id === viewingScoutReportId);
    if (!scout) return null;
    const minPotential = scout.level === 3 ? 90 : scout.level === 2 ? 82 : 75;
    const gems = talentPool.filter(p => p.stats.potential >= minPotential);
    return gems.length > 0 ? gems[Math.floor(Math.random() * gems.length)] : talentPool[0];
  }, [viewingScoutReportId, talentPool, gameState.scouts]);

  return (
    <div className="max-w-5xl mx-auto space-y-2 animate-in slide-in-from-right-8 duration-500 pb-24 px-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1.5 bg-[#111114] p-1 rounded-xl border border-white/5 shadow-2xl backdrop-blur-xl sticky top-0 z-30">
        <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/5 overflow-x-auto no-scrollbar w-full md:w-auto gap-0.5">
          {(['SCOUTING', 'YOUNG_TALENTS', 'STANDINGS', 'HONORS'] as AcademyTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-1.5 text-[7px] font-black uppercase tracking-widest rounded-md transition-all whitespace-nowrap flex-1 ${
                activeTab === tab ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
              }`}
            >
              {tab === 'STANDINGS' ? 'NCAB YVI LEAGUE' : tab.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-1 shrink-0 px-1 justify-end">
          <div className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5 text-center min-w-[35px]">
             <p className="text-[5px] text-gray-500 font-black uppercase leading-none">SP</p>
             <p className="text-[9px] font-bold text-white leading-none">{gameState.scoutingPoints}</p>
          </div>
          <div className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5 text-center min-w-[35px]">
             <p className="text-[5px] text-gray-500 font-black uppercase leading-none">INF</p>
             <p className="text-[9px] font-bold text-orange-500 leading-none">{gameState.influencePoints}</p>
          </div>
        </div>
      </div>

      {activeTab === 'SCOUTING' && (
        <section className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {gameState.scouts.map(scout => (
              <div key={scout.id} className="bg-[#111114] border border-white/5 rounded-xl p-3 relative group">
                 <div className="flex justify-between items-start mb-2">
                   <div className="w-7 h-7 bg-white/5 rounded flex items-center justify-center text-sm">🕵️</div>
                   <div className="text-right">
                     <p className="text-[5px] text-gray-600 font-black uppercase">Tier {scout.level}</p>
                     <p className="text-[7px] font-bold text-white uppercase">{scout.age}y</p>
                   </div>
                 </div>
                 <h4 className="text-[9px] font-bold text-white mb-1 truncate">{scout.name}</h4>
                 <div className="space-y-1">
                   <div className="flex justify-between text-[6px] font-black uppercase text-gray-500">
                     <span>Efficiency</span>
                     <span className="text-orange-500">{(scout.efficiency * 100).toFixed(0)}%</span>
                   </div>
                   <div className="flex justify-between text-[6px] font-black uppercase text-gray-500">
                     <span>Salary</span>
                     <span className="text-red-500">${formatCurrency(scout.salary)}/WK</span>
                   </div>
                 </div>
                 {getRecommendation(scout) && (
                   <button 
                    onClick={() => setViewingScoutReportId(scout.id)}
                    className="w-full mt-2 p-1.5 bg-blue-600/10 border border-blue-500/20 rounded text-center animate-pulse hover:bg-blue-600/20 transition-all group"
                   >
                     <p className="text-[7px] font-black text-blue-400 uppercase tracking-widest group-hover:text-white">View Scout Report</p>
                   </button>
                 )}
              </div>
            ))}
            {gameState.scouts.length < 3 && (
              <div className="bg-black/20 border-2 border-dashed border-white/5 rounded-xl p-3 flex flex-col justify-center gap-1.5">
                 {[1, 2, 3].map(lvl => (
                   <button 
                    key={lvl}
                    onClick={() => hireScout(lvl as any)}
                    className="w-full bg-white/5 hover:bg-orange-600 text-white text-[6px] font-black py-1.5 rounded uppercase tracking-widest border border-white/5 transition-all"
                   >
                     Hire Lvl {lvl} (${formatCurrency(SCOUT_HIRE_COSTS[lvl-1])})
                   </button>
                 ))}
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === 'YOUNG_TALENTS' && (
        <section className="bg-[#111114] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          <div className="max-h-[70vh] overflow-y-auto no-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[6px] font-black text-gray-500 uppercase tracking-widest sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2">Prospect</th>
                  <th className="px-3 py-2 text-center">Requirements</th>
                  <th className="px-3 py-2 text-center">Rating</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {talentPool.slice(0, 30).map(p => {
                  const visibilityPercent = (p.scoutingLevel / 3) * 100;
                  const reqRep = getRequiredReputation(p);
                  const potential = p.stats.potential;
                  const influenceCost = potential >= 90 ? 15 : potential >= 85 ? 5 : 0;
                  const minOfficeLevel = potential >= 95 ? 4 : potential >= 90 ? 3 : potential >= 85 ? 2 : 1;
                  
                  const meetsRep = gameState.reputation >= reqRep;
                  const meetsOffice = gameState.officeLevel >= minOfficeLevel;
                  const meetsInf = gameState.influencePoints >= influenceCost;
                  const canAfford = meetsRep && meetsOffice && meetsInf;

                  return (
                    <tr key={p.id} className={`hover:bg-white/[0.01] transition-colors ${!canAfford ? 'opacity-50' : ''}`}>
                      <td className="px-3 py-1.5 flex items-center cursor-pointer" onClick={() => onSelectPlayer(p)}>
                        <span className="text-lg mr-2 shrink-0">{p.face}</span>
                        <div className="min-w-0">
                          <p className="text-[8px] font-bold text-white leading-none truncate">{p.name}</p>
                          <p className="text-[5px] text-gray-600 font-black uppercase mt-0.5">{p.position} • {p.age}y</p>
                        </div>
                      </td>
                      <td className="px-3 py-1.5 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                           <span className={`text-[6px] font-black uppercase ${meetsRep ? 'text-blue-400' : 'text-red-500'}`}>REP: {reqRep}</span>
                           {influenceCost > 0 && <span className={`text-[6px] font-black uppercase ${meetsInf ? 'text-orange-500' : 'text-red-500'}`}>INF: {influenceCost}</span>}
                           {minOfficeLevel > 1 && <span className={`text-[6px] font-black uppercase ${meetsOffice ? 'text-purple-400' : 'text-red-500'}`}>HQ: LVL {minOfficeLevel}</span>}
                        </div>
                      </td>
                      <td className="px-3 py-1.5 text-center">
                        <span className={`font-sporty text-base ${p.scoutingLevel > 0 ? 'text-white' : 'text-gray-800'}`}>{p.scoutingLevel > 0 ? p.rating : '??'}</span>
                      </td>
                      <td className="px-3 py-1.5 text-right flex items-center justify-end gap-1">
                        <button 
                          onClick={() => setAssigningPlayerId(p.id)} 
                          disabled={!canAfford}
                          className={`text-[6px] font-black px-2 py-1 rounded uppercase tracking-widest transition-colors ${canAfford ? 'bg-orange-600 text-white hover:bg-orange-500' : 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5'}`}
                        >
                          RECRUIT
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'STANDINGS' && (
        <div className="grid grid-cols-2 gap-1.5 md:gap-3">
          <div className="bg-[#111114] border border-white/5 rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
            <div className="bg-orange-600/10 px-2 py-2 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-[7px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1">
                <span>🏆</span> NCAB YVI LEAGUE
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar max-h-[65vh]">
              <table className="w-full text-left">
                <thead className="bg-black/20 text-[5px] font-black text-gray-600 uppercase tracking-tighter sticky top-0">
                  <tr>
                    <th className="px-2 py-1">#</th>
                    <th className="px-1 py-1">Pgm</th>
                    <th className="px-2 py-1 text-center">W-L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {uniStandings.map((t, i) => (
                    <tr 
                      key={t.id} 
                      onClick={() => onSelectTeam(t)}
                      className="hover:bg-white/[0.04] transition-colors group cursor-pointer active:bg-white/[0.08]"
                    >
                      <td className="px-2 py-1.5 text-[7px] font-black text-gray-600 w-4">{i + 1}</td>
                      <td className="px-1 py-1.5 flex items-center space-x-1.5 min-w-0">
                        <span className="text-sm shrink-0 grayscale group-hover:grayscale-0 transition-all">{t.logo}</span>
                        <p className="text-[8px] font-bold text-white uppercase leading-none truncate group-hover:text-orange-500">{t.name}</p>
                      </td>
                      <td className="px-2 py-1.5 text-center">
                         <span className="text-[9px] font-sporty text-orange-400">{t.wins}-{t.losses}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#111114] border border-white/5 rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
             <div className="bg-blue-600/10 px-2 py-2 border-b border-white/5 flex items-center justify-between">
               <h3 className="text-[7px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1">
                 <span>📡</span> YVI Results
               </h3>
             </div>
             <div className="flex-1 overflow-y-auto no-scrollbar p-1 space-y-1 max-h-[65vh]">
                {recentUniMatches.map(m => {
                  const home = teams.find(t => t.id === m.homeTeamId);
                  const away = teams.find(t => t.id === m.awayTeamId);
                  return (
                    <div key={m.id} className="bg-black/20 border border-white/[0.02] p-1.5 rounded-lg flex flex-col items-center justify-center hover:bg-white/[0.03] transition-all group relative overflow-hidden">
                       <p className="text-[4px] text-gray-700 font-black uppercase mb-0.5">WK {m.week}</p>
                       <div className="flex items-center justify-between w-full gap-0.5">
                          <span className="text-xs">{home?.logo}</span>
                          <div className="flex items-center gap-0.5 font-sporty text-[10px]">
                            <span className={m.homeScore > m.awayScore ? 'text-blue-400' : 'text-gray-500'}>{m.homeScore}</span>
                            <span className="text-gray-800 text-[6px]">:</span>
                            <span className={m.awayScore > m.homeScore ? 'text-blue-400' : 'text-gray-500'}>{m.awayScore}</span>
                          </div>
                          <span className="text-xs">{away?.logo}</span>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'HONORS' && (
        <div className="space-y-4 animate-in fade-in duration-500 pb-12">
           {/* Ivy League Leaders Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {[
                { title: 'Scoring Leaders', data: ivyLeaders.points, label: 'PPG', fn: (p: Player) => (p.seasonStats.pts / (p.seasonStats.gamesPlayed || 1)).toFixed(1), color: 'text-red-500' },
                { title: 'Rebound Leaders', data: ivyLeaders.rebounds, label: 'RPG', fn: (p: Player) => (p.seasonStats.reb / (p.seasonStats.gamesPlayed || 1)).toFixed(1), color: 'text-emerald-500' },
                { title: 'Assist Leaders', data: ivyLeaders.assists, label: 'APG', fn: (p: Player) => (p.seasonStats.ast / (p.seasonStats.gamesPlayed || 1)).toFixed(1), color: 'text-blue-500' }
              ].map((leaderGroup, idx) => (
                <div key={idx} className="bg-[#111114] border border-white/5 rounded-xl p-3 flex flex-col shadow-lg">
                   <h4 className="text-[7px] font-black text-gray-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">{leaderGroup.title}</h4>
                   <div className="space-y-2">
                      {leaderGroup.data.map((p, i) => (
                        <div key={p.id} className="flex items-center justify-between group cursor-pointer" onClick={() => onSelectPlayer(p)}>
                           <div className="flex items-center space-x-2">
                              <span className="text-[6px] font-black text-gray-700 w-2.5">{i+1}</span>
                              <span className="text-base">{p.face}</span>
                              <p className="text-[8px] font-bold text-gray-200 group-hover:text-orange-500 truncate w-16">{p.name.split(' ')[1]}</p>
                           </div>
                           <span className={`text-[10px] font-sporty ${leaderGroup.color}`}>{leaderGroup.fn(p)} <span className="text-[5px] opacity-40 uppercase">{leaderGroup.label}</span></span>
                        </div>
                      ))}
                      {leaderGroup.data.length === 0 && <p className="text-[6px] text-gray-700 font-black text-center py-2 uppercase">No Data</p>}
                   </div>
                </div>
              ))}
           </div>

           {/* Top Pro Prospects Section */}
           <div className="bg-[#111114] border border-white/5 rounded-2xl p-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-sporty leading-none pointer-events-none uppercase">YVI Elite</div>
              <div className="flex justify-between items-center mb-4">
                 <div>
                    <h3 className="text-lg font-sporty text-white uppercase tracking-tight">Pro Scouts Watchlist</h3>
                    <p className="text-[7px] text-gray-500 font-black uppercase tracking-widest mt-0.5">Elite Potential Rankings</p>
                 </div>
                 <div className="px-2 py-0.5 bg-orange-600/10 border border-orange-500/20 rounded-md text-[6px] font-black text-orange-500 uppercase">Class of {gameState.year + 1}</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                 {ivyLeaders.prospects.map((p, i) => {
                    const team = teams.find(t => t.id === p.teamId);
                    return (
                      <div key={p.id} onClick={() => onSelectPlayer(p)} className="flex items-center justify-between p-2 bg-black/30 rounded-lg border border-white/5 hover:border-orange-500/30 transition-all cursor-pointer group">
                         <div className="flex items-center space-x-3">
                            <span className="text-xs font-black text-gray-700 w-3">#{i+1}</span>
                            <span className="text-2xl">{p.face}</span>
                            <div>
                               <p className="text-[9px] font-bold text-white group-hover:text-orange-500">{p.name}</p>
                               <div className="flex items-center space-x-1.5">
                                  <span className="text-[6px] text-gray-500 font-black uppercase">{team?.name}</span>
                                  <span className="text-[6px] text-blue-400 font-bold uppercase">{p.rating} OVR</span>
                               </div>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-sporty text-orange-500">{p.stats.potential}</p>
                            <p className="text-[5px] text-gray-700 font-black uppercase tracking-tighter">POT</p>
                         </div>
                      </div>
                    );
                 })}
                 {ivyLeaders.prospects.length === 0 && <p className="col-span-2 text-center text-[7px] text-gray-700 uppercase py-10 font-black">Waiting for scout reports</p>}
              </div>
           </div>

           <div className="bg-gradient-to-r from-blue-900/10 to-transparent p-4 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                 <span className="text-3xl">🏛️</span>
                 <div>
                    <p className="text-[7px] font-black text-blue-400 uppercase tracking-widest">YVI Prestige System</p>
                    <p className="text-[9px] text-gray-500 max-w-sm leading-relaxed font-medium">Top programs generate elite draft equity. Build ties with the YVI League elite.</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* University Selection Modal */}
      {assigningPlayerId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setAssigningPlayerId(null)}></div>
           <div className="relative bg-[#111114] border border-white/10 w-full max-w-md rounded-[2rem] p-6 space-y-4 animate-in zoom-in-95">
              <h3 className="text-xl font-sporty text-white uppercase tracking-widest text-center">Commit to NCAB YVI LEAGUE</h3>
              <p className="text-[9px] text-gray-500 text-center uppercase font-black">Select an NCAB program</p>
              <div className="grid grid-cols-1 gap-1.5 max-h-[300px] overflow-y-auto no-scrollbar p-1">
                {uniTeams.map(uni => (
                  <button
                    key={uni.id}
                    onClick={() => {
                      onSignAcademy(assigningPlayerId);
                      onAssignToUniversity(assigningPlayerId, uni.id);
                      setAssigningPlayerId(null);
                    }}
                    className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-xl hover:bg-orange-600 hover:border-orange-500 group transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{uni.logo}</span>
                      <span className="text-[10px] font-bold text-white uppercase">{uni.name}</span>
                    </div>
                    <span className="text-[7px] font-black text-gray-600 group-hover:text-white uppercase tracking-widest">Enroll</span>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setAssigningPlayerId(null)}
                className="w-full py-3 bg-white/5 text-gray-600 font-black text-[10px] uppercase tracking-widest rounded-xl"
              >
                Cancel
              </button>
           </div>
        </div>
      )}

      {/* Scout Discovery Modal */}
      {viewingScoutReportId && recommendationPlayer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setViewingScoutReportId(null)}></div>
           <div className="relative bg-[#111114] border border-blue-500/30 w-full max-w-xl rounded-[2.5rem] shadow-[0_0_50px_rgba(59,130,246,0.2)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              <div className="bg-blue-600 p-8 text-center relative overflow-hidden">
                 <h2 className="text-4xl font-sporty text-white leading-none uppercase">Hidden Gem Detected</h2>
              </div>
              <div className="p-8 space-y-6">
                 <div className="flex items-center space-x-6 bg-white/5 p-6 rounded-3xl border border-white/5">
                    <span className="text-5xl">{recommendationPlayer.face}</span>
                    <div>
                       <h3 className="text-2xl font-bold text-white">{recommendationPlayer.name}</h3>
                       <p className="text-[9px] font-black text-blue-400 uppercase">{recommendationPlayer.position} • {recommendationPlayer.age}y</p>
                    </div>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button onClick={() => setViewingScoutReportId(null)} className="flex-1 py-4 bg-white/5 text-gray-500 font-black text-[10px] uppercase rounded-2xl">Pass</button>
                    <button onClick={() => { setAssigningPlayerId(recommendationPlayer.id); setViewingScoutReportId(null); }} className="flex-1 py-4 bg-blue-600 text-white font-black text-[10px] uppercase rounded-2xl">Represent & Commit</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AcademyView;
