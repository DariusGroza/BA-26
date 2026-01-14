
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
  onSelectMatch: (m: Match) => void;
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
  onSelectMatch,
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
      points: [...activeUniPlayers].sort((a, b) => (b.seasonStats.pts / (b.seasonStats.gamesPlayed || 1)) - (a.seasonStats.pts / (a.seasonStats.gamesPlayed || 1))).slice(0, 5),
      rebounds: [...activeUniPlayers].sort((a, b) => (b.seasonStats.reb / (b.seasonStats.gamesPlayed || 1)) - (a.seasonStats.reb / (a.seasonStats.gamesPlayed || 1))).slice(0, 5),
      assists: [...activeUniPlayers].sort((a, b) => (b.seasonStats.ast / (b.seasonStats.gamesPlayed || 1)) - (a.seasonStats.ast / (a.seasonStats.gamesPlayed || 1))).slice(0, 5),
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
    <div className="max-w-full mx-auto space-y-2 animate-in slide-in-from-right-4 duration-500">
      {/* Academy Header Tabs - Improved Fit */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 bg-[#111114] p-1 rounded-xl border border-white/5 sticky top-0 z-30 shadow-xl backdrop-blur-md">
        <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/5 w-full md:w-auto gap-0.5 justify-between md:justify-start">
          {(['SCOUTING', 'YOUNG_TALENTS', 'STANDINGS', 'HONORS'] as AcademyTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-1.5 text-[7px] md:text-[8px] font-black uppercase tracking-tighter rounded-md transition-all whitespace-nowrap flex-1 md:flex-initial ${
                activeTab === tab ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'
              }`}
            >
              {tab === 'STANDINGS' ? 'NCAB YVI' : tab.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-1.5 shrink-0 px-1 justify-end">
          <div className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5 text-center min-w-[32px]">
             <p className="text-[5px] text-gray-500 font-black uppercase leading-none">SP</p>
             <p className="text-[8px] font-bold text-white leading-none">{gameState.scoutingPoints}</p>
          </div>
          <div className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5 text-center min-w-[32px]">
             <p className="text-[5px] text-gray-500 font-black uppercase leading-none">INF</p>
             <p className="text-[8px] font-bold text-orange-500 leading-none">{gameState.influencePoints}</p>
          </div>
        </div>
      </div>

      {activeTab === 'SCOUTING' && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {gameState.scouts.map(scout => (
            <div key={scout.id} className="bg-[#111114] border border-white/5 rounded-xl p-3 relative group shadow-lg">
               <div className="flex justify-between items-start mb-2">
                 <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center text-lg">🕵️</div>
                 <div className="text-right">
                   <p className="text-[5px] text-gray-600 font-black uppercase">Tier {scout.level}</p>
                   <p className="text-[7px] font-bold text-white uppercase">{scout.age}y</p>
                 </div>
               </div>
               <h4 className="text-[10px] font-bold text-white mb-1 truncate">{scout.name}</h4>
               <div className="space-y-1">
                 <div className="flex justify-between text-[6px] font-black uppercase text-gray-500">
                   <span>Efficiency</span>
                   <span className="text-orange-500">{(scout.efficiency * 100).toFixed(0)}%</span>
                 </div>
               </div>
               {getRecommendation(scout) && (
                 <button 
                  onClick={() => setViewingScoutReportId(scout.id)}
                  className="w-full mt-2 p-1.5 bg-blue-600/10 border border-blue-500/20 rounded-lg text-center animate-pulse"
                 >
                   <p className="text-[7px] font-black text-blue-400 uppercase">View Report</p>
                 </button>
               )}
            </div>
          ))}
          {gameState.scouts.length < 3 && (
            <div className="bg-black/20 border border-dashed border-white/5 rounded-xl p-3 flex flex-col justify-center gap-1.5">
               {[1, 2, 3].map(lvl => {
                 const cost = SCOUT_HIRE_COSTS[lvl - 1];
                 const canAfford = gameState.cash >= cost;
                 return (
                   <button 
                    key={lvl}
                    onClick={() => hireScout(lvl as any)}
                    disabled={!canAfford}
                    className={`w-full text-[7px] font-black py-2 rounded-lg uppercase tracking-widest border transition-all ${
                      canAfford ? 'bg-white text-black hover:bg-orange-600 hover:text-white border-transparent' : 'bg-white/5 text-gray-700 border-white/5 cursor-not-allowed opacity-50'
                    }`}
                   >
                     {canAfford ? `Hire Lvl ${lvl} ($${cost.toLocaleString()})` : `Lvl ${lvl} (Need $${cost.toLocaleString()})`}
                   </button>
                 );
               })}
            </div>
          )}
        </section>
      )}

      {activeTab === 'YOUNG_TALENTS' && (
        <section className="bg-[#111114] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left table-fixed">
            <thead className="bg-white/5 text-[6.5px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="px-2 py-1.5 w-4/12">Prospect</th>
                <th className="px-1 py-1.5 text-center w-4/12">Reqs</th>
                <th className="px-1 py-1.5 text-center w-2/12">OVR</th>
                <th className="px-2 py-1.5 text-right w-2/12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {talentPool.slice(0, 40).map(p => {
                const reqRep = getRequiredReputation(p);
                const potential = p.stats.potential;
                const influenceCost = potential >= 90 ? 15 : potential >= 85 ? 5 : 0;
                
                const meetsRep = gameState.reputation >= reqRep;
                const meetsInf = gameState.influencePoints >= influenceCost;
                const canAfford = meetsRep && meetsInf;

                return (
                  <tr key={p.id} className={`hover:bg-white/[0.01] transition-colors ${!canAfford ? 'opacity-30' : ''}`}>
                    <td className="px-2 py-0.5 flex items-center cursor-pointer" onClick={() => onSelectPlayer(p)}>
                      <span className="text-sm mr-1 shrink-0">{p.face}</span>
                      <div className="min-w-0">
                        <p className="text-[7.5px] font-bold text-white leading-none truncate">{p.name.split(' ')[1]}</p>
                        <p className="text-[5px] text-gray-600 font-black uppercase">{p.position} • {p.age}y</p>
                      </div>
                    </td>
                    <td className="px-1 py-0.5 text-center">
                      <div className="flex justify-center gap-0.5">
                         <span className={`text-[5px] font-black uppercase ${meetsRep ? 'text-blue-500' : 'text-red-500'}`}>R{reqRep}</span>
                         {influenceCost > 0 && <span className={`text-[5px] font-black uppercase ${meetsInf ? 'text-orange-500' : 'text-red-500'}`}>I{influenceCost}</span>}
                      </div>
                    </td>
                    <td className="px-1 py-0.5 text-center">
                      <span className={`font-sporty text-[10px] ${p.scoutingLevel > 0 ? 'text-white' : 'text-gray-800'}`}>{p.scoutingLevel > 0 ? p.rating : '??'}</span>
                    </td>
                    <td className="px-2 py-0.5 text-right">
                      <button 
                        onClick={() => setAssigningPlayerId(p.id)} 
                        disabled={!canAfford}
                        className={`text-[5.5px] font-black px-1.5 py-0.5 rounded uppercase transition-all ${canAfford ? 'bg-orange-600 text-white shadow-sm' : 'bg-white/5 text-gray-700'}`}
                      >
                        SIGN
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === 'STANDINGS' && (
        <div className="grid grid-cols-2 gap-2 items-start">
          {/* LEFT: Standings */}
          <div className="bg-[#111114] border border-white/5 rounded-xl overflow-hidden shadow-xl">
            <div className="bg-orange-600/10 px-2 py-2 border-b border-white/5">
              <h3 className="text-[7px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
                🏆 STANDINGS
              </h3>
            </div>
            <table className="w-full text-left table-fixed">
              <thead className="bg-black/20 text-[5.5px] font-black text-gray-600 uppercase">
                <tr>
                  <th className="px-2 py-1 w-6">#</th>
                  <th className="px-1 py-1">TEAM</th>
                  <th className="px-2 py-1 text-center w-10">W-L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {uniStandings.map((t, i) => (
                  <tr key={t.id} onClick={() => onSelectTeam(t)} className="hover:bg-white/[0.04] cursor-pointer">
                    <td className="px-2 py-1 text-[7px] font-black text-gray-600">{i + 1}</td>
                    <td className="px-1 py-1 flex items-center space-x-1 min-w-0">
                      <span className="text-base shrink-0">{t.logo}</span>
                      <p className="text-[8px] font-bold text-white uppercase truncate">{t.name.split(' ')[0]}</p>
                    </td>
                    <td className="px-2 py-1 text-center">
                       <span className="text-[10px] font-sporty text-orange-400">{t.wins}-{t.losses}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RIGHT: Results */}
          <div className="bg-[#111114] border border-white/5 rounded-xl overflow-hidden shadow-xl">
             <div className="bg-blue-600/10 px-2 py-2 border-b border-white/5">
               <h3 className="text-[7px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                 📡 RESULTS
               </h3>
             </div>
             <div className="p-1 space-y-1 max-h-[50vh] overflow-y-auto no-scrollbar">
                {recentUniMatches.length > 0 ? recentUniMatches.map(m => {
                  const home = teams.find(t => t.id === m.homeTeamId);
                  const away = teams.find(t => t.id === m.awayTeamId);
                  return (
                    <div 
                      key={m.id} 
                      onClick={() => onSelectMatch(m)}
                      className="bg-black/20 border border-white/[0.02] p-1 rounded-lg flex flex-col items-center hover:bg-white/[0.05] transition-all cursor-pointer"
                    >
                       <div className="flex items-center justify-between w-full px-0.5">
                          <div className="flex flex-col items-center w-2/5">
                             <span className="text-xs">{home?.logo}</span>
                             <span className="text-[6px] font-bold text-gray-500 uppercase truncate w-full text-center">{home?.name.substring(0,3)}</span>
                          </div>
                          <div className="flex items-center gap-0.5 font-sporty text-[10px] w-1/5 justify-center shrink-0">
                            <span className={m.homeScore > m.awayScore ? 'text-blue-400' : 'text-gray-500'}>{m.homeScore}</span>
                            <span className="text-gray-800 text-[5px]">:</span>
                            <span className={m.awayScore > m.homeScore ? 'text-blue-400' : 'text-gray-500'}>{m.awayScore}</span>
                          </div>
                          <div className="flex flex-col items-center w-2/5">
                             <span className="text-xs">{away?.logo}</span>
                             <span className="text-[6px] font-bold text-gray-500 uppercase truncate w-full text-center">{away?.name.substring(0,3)}</span>
                          </div>
                       </div>
                    </div>
                  );
                }) : (
                  <div className="py-20 text-center italic text-gray-700 text-[8px] uppercase">Awaiting Matches</div>
                )}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'HONORS' && (
        <div className="space-y-3 animate-in fade-in duration-500 pb-12">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {[
                { title: 'Points', data: ivyLeaders.points, label: 'PPG', fn: (p: Player) => (p.seasonStats.pts / (p.seasonStats.gamesPlayed || 1)).toFixed(1), color: 'text-red-500' },
                { title: 'Rebounds', data: ivyLeaders.rebounds, label: 'RPG', fn: (p: Player) => (p.seasonStats.reb / (p.seasonStats.gamesPlayed || 1)).toFixed(1), color: 'text-emerald-500' },
                { title: 'Assists', data: ivyLeaders.assists, label: 'APG', fn: (p: Player) => (p.seasonStats.ast / (p.seasonStats.gamesPlayed || 1)).toFixed(1), color: 'text-blue-500' }
              ].map((leaderGroup, idx) => (
                <div key={idx} className="bg-[#111114] border border-white/5 rounded-xl p-3 flex flex-col shadow-lg">
                   <h4 className="text-[7px] font-black text-gray-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">{leaderGroup.title}</h4>
                   <div className="space-y-2">
                      {leaderGroup.data.map((p, i) => (
                        <div key={p.id} className="flex items-center justify-between group cursor-pointer" onClick={() => onSelectPlayer(p)}>
                           <div className="flex items-center space-x-2">
                              <span className="text-[6px] font-black text-gray-700 w-2">{i+1}</span>
                              <span className="text-xl">{p.face}</span>
                              <p className="text-[8px] font-bold text-gray-200 truncate w-16">{p.name.split(' ')[1]}</p>
                           </div>
                           <span className={`text-xs font-sporty ${leaderGroup.color}`}>{leaderGroup.fn(p)}</span>
                        </div>
                      ))}
                      {leaderGroup.data.length === 0 && <p className="text-[6px] text-gray-700 font-black text-center py-2 uppercase">Awaiting Data</p>}
                   </div>
                </div>
              ))}
           </div>

           <div className="bg-[#111114] border border-white/5 rounded-xl p-4 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-sporty text-white uppercase">Pro Scouts Watchlist</h3>
                 <div className="px-2 py-0.5 bg-orange-600/10 border border-orange-500/20 rounded text-[7px] font-black text-orange-500">CLASS OF {gameState.year + 1}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                 {ivyLeaders.prospects.map((p, i) => {
                    const team = teams.find(t => t.id === p.teamId);
                    return (
                      <div key={p.id} onClick={() => onSelectPlayer(p)} className="flex items-center justify-between p-2 bg-black/30 rounded-lg border border-white/5 hover:border-orange-500/30 transition-all cursor-pointer group">
                         <div className="flex items-center space-x-3">
                            <span className="text-xs font-black text-gray-700">#{i+1}</span>
                            <span className="text-2xl">{p.face}</span>
                            <div>
                               <p className="text-[9px] font-bold text-white group-hover:text-orange-500">{p.name}</p>
                               <span className="text-[6px] text-gray-500 font-black uppercase">{team?.name}</span>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-sporty text-orange-500">{p.stats.potential}</p>
                            <p className="text-[5px] text-gray-700 font-black uppercase">POT</p>
                         </div>
                      </div>
                    );
                 })}
              </div>
           </div>
        </div>
      )}

      {/* University Selection Modal */}
      {assigningPlayerId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setAssigningPlayerId(null)}></div>
           <div className="relative bg-[#111114] border border-white/10 w-full max-w-sm rounded-[2rem] p-6 space-y-4 animate-in zoom-in-95 shadow-2xl">
              <h3 className="text-xl font-sporty text-white uppercase text-center">Assign to NCAB Program</h3>
              <div className="grid grid-cols-1 gap-1.5 max-h-[300px] overflow-y-auto no-scrollbar">
                {uniTeams.map(uni => (
                  <button
                    key={uni.id}
                    onClick={() => {
                      onSignAcademy(assigningPlayerId);
                      onAssignToUniversity(assigningPlayerId, uni.id);
                      setAssigningPlayerId(null);
                    }}
                    className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-xl hover:bg-orange-600 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{uni.logo}</span>
                      <span className="text-[10px] font-bold text-white uppercase">{uni.name}</span>
                    </div>
                    <span className="text-[7px] font-black text-gray-600 uppercase">Enroll</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setAssigningPlayerId(null)} className="w-full py-3 bg-white/5 text-gray-600 font-black text-[9px] uppercase rounded-xl transition-colors">Cancel</button>
           </div>
        </div>
      )}

      {/* Scout Discovery Modal */}
      {viewingScoutReportId && recommendationPlayer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setViewingScoutReportId(null)}></div>
           <div className="relative bg-[#111114] border border-blue-500/30 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
              <div className="bg-blue-600 p-6 text-center">
                 <h2 className="text-3xl font-sporty text-white leading-none uppercase">Hidden Gem Detected</h2>
              </div>
              <div className="p-8 space-y-6">
                 <div className="flex items-center space-x-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                    <span className="text-5xl">{recommendationPlayer.face}</span>
                    <div>
                       <h3 className="text-xl font-bold text-white">{recommendationPlayer.name}</h3>
                       <p className="text-[8px] font-black text-blue-400 uppercase">{recommendationPlayer.position} • {recommendationPlayer.age}y</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => setViewingScoutReportId(null)} className="flex-1 py-4 bg-white/5 text-gray-500 font-black text-[10px] uppercase rounded-xl hover:text-white transition-colors">Pass</button>
                    <button onClick={() => { setAssigningPlayerId(recommendationPlayer.id); setViewingScoutReportId(null); }} className="flex-1 py-4 bg-blue-600 text-white font-black text-[10px] uppercase rounded-xl transition-all">Represent</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AcademyView;
