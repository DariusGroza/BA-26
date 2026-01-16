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
  onConsumeScoutReport: (scoutId: string, week: number) => void;
  isAgencyFull: boolean;
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
  onAssignToUniversity,
  onConsumeScoutReport,
  isAgencyFull
}) => {
  const [activeTab, setActiveTab] = useState<AcademyTab>('STANDINGS');
  const [viewingScoutReportId, setViewingScoutReportId] = useState<string | null>(null);
  const [assigningPlayerId, setAssigningPlayerId] = useState<string | null>(null);

  const getRecommendation = (scout: Scout) => {
    const scoutYear = scout.hiredYear || 2026;
    const totalWeeksCurrent = (gameState.year - 2026) * 52 + gameState.week;
    const totalWeeksHired = (scoutYear - 2026) * 52 + scout.hiredWeek;
    const elapsed = totalWeeksCurrent - totalWeeksHired;
    
    // Check if a report exists for this half-season interval (26 weeks)
    const isReportWeek = elapsed > 0 && elapsed % 26 === 0;
    
    // Check if this specific report instance has already been consumed
    const reportId = `${scout.id}_${gameState.year}_${gameState.week}`;
    const isConsumed = gameState.consumedScoutReports.includes(reportId);
    
    return isReportWeek && !isConsumed;
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
      {/* Academy Header Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 bg-[#111114] p-1 rounded-xl border border-white/5 sticky top-0 z-30 shadow-xl backdrop-blur-md">
        <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/5 w-full md:w-auto gap-0.5 justify-between md:justify-start">
          {(['SCOUTING', 'YOUNG_TALENTS', 'STANDINGS', 'HONORS'] as AcademyTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-1.5 text-[8px] font-black uppercase tracking-tighter rounded-md transition-all whitespace-nowrap flex-1 md:flex-initial ${
                activeTab === tab ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'
              }`}
            >
              {tab === 'STANDINGS' ? 'NCAB LEAGUE' : tab.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-1.5 shrink-0 px-1 justify-end">
          <div className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5 text-center min-w-[32px]">
             <p className="text-[6px] text-gray-500 font-black uppercase leading-none">SP</p>
             <p className="text-[9px] font-bold text-white leading-none">{gameState.scoutingPoints}</p>
          </div>
          <div className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5 text-center min-w-[32px]">
             <p className="text-[6px] text-gray-500 font-black uppercase leading-none">INF</p>
             <p className="text-[9px] font-bold text-orange-500 leading-none">{gameState.influencePoints}</p>
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
                   <p className="text-[6px] text-gray-600 font-black uppercase">Tier {scout.level}</p>
                   <p className="text-[8px] font-bold text-white uppercase">{scout.age}y</p>
                 </div>
               </div>
               <h4 className="text-[11px] font-bold text-white mb-1 truncate">{scout.name}</h4>
               <div className="space-y-1">
                 <div className="flex justify-between text-[7px] font-black uppercase text-gray-500">
                   <span>Efficiency</span>
                   <span className="text-orange-500">{(scout.efficiency * 100).toFixed(0)}%</span>
                 </div>
               </div>
               {getRecommendation(scout) && (
                 <button 
                  onClick={() => setViewingScoutReportId(scout.id)}
                  className="w-full mt-2 p-1.5 bg-blue-600/10 border border-blue-500/20 rounded-lg text-center animate-pulse"
                 >
                   <p className="text-[8px] font-black text-blue-400 uppercase">View Report</p>
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
                    className={`w-full text-[8px] font-black py-2.5 rounded-lg uppercase tracking-widest border transition-all ${
                      canAfford ? 'bg-white text-black hover:bg-orange-600 hover:text-white border-transparent' : 'bg-white/5 text-gray-700 border-white/5 cursor-not-allowed opacity-50'
                    }`}
                   >
                     {canAfford ? `Hire Lvl ${lvl} ($${(cost/1000).toFixed(0)}k)` : `Lvl ${lvl} (Need $${(cost/1000).toFixed(0)}k)`}
                   </button>
                 );
               })}
            </div>
          )}
        </section>
      )}

      {activeTab === 'YOUNG_TALENTS' && (
        <section className="bg-[#111114] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-white/5 text-[8px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 flex py-3 px-4">
             <span className="flex-1">Identity</span>
             <span className="w-12 text-center">OVR</span>
             <span className="w-16 text-right">Action</span>
          </div>
          <div className="divide-y divide-white/[0.02] max-h-[60vh] overflow-y-auto no-scrollbar">
            {talentPool.slice(0, 50).map(p => {
              const reqRep = getRequiredReputation(p);
              const potential = p.stats.potential;
              const influenceCost = potential >= 90 ? 15 : potential >= 85 ? 5 : 0;
              
              const meetsRep = gameState.reputation >= reqRep;
              const meetsInf = gameState.influencePoints >= influenceCost;
              const canAfford = meetsRep && meetsInf;

              return (
                <div key={p.id} className={`flex items-center px-4 py-3 hover:bg-white/[0.01] transition-colors ${!canAfford ? 'opacity-40' : ''}`}>
                  <div className="flex-1 flex items-center min-w-0 mr-2 cursor-pointer" onClick={() => onSelectPlayer(p)}>
                    <span className="text-2xl mr-3 shrink-0">{p.face}</span>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="text-[11px] font-bold text-white leading-tight uppercase truncate w-full">{p.name}</p>
                      <div className="flex gap-2 mt-0.5">
                        <span className="text-[6px] font-black uppercase text-gray-500">{p.position} • {p.age}y</span>
                        <span className={`text-[6px] font-black uppercase ${meetsRep ? 'text-blue-500' : 'text-red-500'}`}>R{reqRep}</span>
                        {influenceCost > 0 && <span className={`text-[6px] font-black uppercase ${meetsInf ? 'text-orange-500' : 'text-red-500'}`}>I{influenceCost}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="w-12 text-center shrink-0">
                    <span className={`font-sporty text-xl ${p.scoutingLevel > 0 ? 'text-white' : 'text-gray-800'}`}>{p.scoutingLevel > 0 ? p.rating : '??'}</span>
                  </div>
                  <div className="w-16 text-right shrink-0">
                    <button 
                      onClick={() => setAssigningPlayerId(p.id)} 
                      disabled={!canAfford || isAgencyFull}
                      className={`text-[8px] font-black px-3 py-2 rounded uppercase transition-all ${
                        isAgencyFull 
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20 cursor-not-allowed'
                        : canAfford 
                          ? 'bg-orange-600 text-white shadow-sm' 
                          : 'bg-white/5 text-gray-700'
                      }`}
                    >
                      {isAgencyFull ? 'FULL' : 'SIGN'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === 'STANDINGS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start">
          {/* LEFT: Standings */}
          <div className="bg-[#111114] border border-white/5 rounded-xl overflow-hidden shadow-xl">
            <div className="bg-orange-600/10 px-3 py-3 border-b border-white/5">
              <h3 className="text-[9px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
                🏆 NCAB STANDINGS
              </h3>
            </div>
            <div className="bg-black/20 text-[7px] font-black text-gray-600 uppercase flex py-2 px-3">
               <span className="w-8">#</span>
               <span className="flex-1">TEAM</span>
               <span className="w-16 text-center">RECORD</span>
            </div>
            <div className="divide-y divide-white/[0.02]">
              {uniStandings.map((t, i) => (
                <div key={t.id} onClick={() => onSelectTeam(t)} className="flex items-center py-2.5 px-3 hover:bg-white/[0.04] cursor-pointer">
                  <span className="w-8 text-[9px] font-black text-gray-600">{i + 1}</span>
                  <div className="flex-1 flex items-center space-x-2 min-w-0">
                    <span className="text-xl shrink-0">{t.logo}</span>
                    <p className="text-[10px] font-bold text-white uppercase truncate">{t.name}</p>
                  </div>
                  <span className="w-16 text-center text-[12px] font-sporty text-orange-400">{t.wins}-{t.losses}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="bg-[#111114] border border-white/5 rounded-xl overflow-hidden shadow-xl">
             <div className="bg-blue-600/10 px-3 py-3 border-b border-white/5">
               <h3 className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                 📡 RECENT RESULTS
               </h3>
             </div>
             <div className="p-2 space-y-1.5 max-h-[50vh] overflow-y-auto no-scrollbar">
                {recentUniMatches.length > 0 ? recentUniMatches.map(m => {
                  const home = teams.find(t => t.id === m.homeTeamId);
                  const away = teams.find(t => t.id === m.awayTeamId);
                  return (
                    <div 
                      key={m.id} 
                      onClick={() => onSelectMatch(m)}
                      className="bg-black/20 border border-white/[0.02] p-2 rounded-xl flex items-center justify-between hover:bg-white/[0.05] transition-all cursor-pointer"
                    >
                       <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <span className="text-lg">{home?.logo}</span>
                          <span className="text-[8px] font-bold text-gray-400 uppercase truncate">{home?.name.split(' ')[0]}</span>
                       </div>
                       <div className="px-4 flex items-center gap-2 font-sporty text-lg shrink-0">
                         <span className={m.homeScore > m.awayScore ? 'text-blue-400' : 'text-gray-600'}>{m.homeScore}</span>
                         <span className="text-gray-800 text-[10px] font-black">:</span>
                         <span className={m.awayScore > m.homeScore ? 'text-blue-400' : 'text-gray-600'}>{m.awayScore}</span>
                       </div>
                       <div className="flex items-center space-x-2 flex-1 min-w-0 justify-end">
                          <span className="text-[8px] font-bold text-gray-400 uppercase truncate text-right">{away?.name.split(' ')[0]}</span>
                          <span className="text-lg">{away?.logo}</span>
                       </div>
                    </div>
                  );
                }) : (
                  <div className="py-20 text-center italic text-gray-700 text-[10px] uppercase font-black">Awaiting Matches</div>
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
                   <h4 className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-1">{leaderGroup.title} Leaders</h4>
                   <div className="space-y-3">
                      {leaderGroup.data.map((p, i) => (
                        <div key={p.id} className="flex items-center justify-between group cursor-pointer" onClick={() => onSelectPlayer(p)}>
                           <div className="flex items-center space-x-3 min-w-0">
                              <span className="text-[8px] font-black text-gray-700 w-3">{i+1}</span>
                              <span className="text-2xl shrink-0">{p.face}</span>
                              <p className="text-[10px] font-bold text-gray-200 truncate uppercase leading-none">{p.name.split(' ')[1]}</p>
                           </div>
                           <span className={`text-sm font-sporty ${leaderGroup.color}`}>{leaderGroup.fn(p)}</span>
                        </div>
                      ))}
                      {leaderGroup.data.length === 0 && <p className="text-[8px] text-gray-700 font-black text-center py-4 uppercase">Awaiting League Data</p>}
                   </div>
                </div>
              ))}
           </div>

           <div className="bg-[#111114] border border-white/5 rounded-xl p-4 shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-6">
                 <div>
                    <h3 className="text-xl font-sporty text-white uppercase tracking-wider">Pro Scouting Watchlist</h3>
                    <p className="text-[7px] text-gray-500 font-black uppercase tracking-[0.3em]">Potential Metric Analysis</p>
                 </div>
                 <div className="self-start px-3 py-1 bg-orange-600/10 border border-orange-500/20 rounded text-[8px] font-black text-orange-500 uppercase tracking-widest">Draft Class {gameState.year + 1}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                 {ivyLeaders.prospects.map((p, i) => {
                    const team = teams.find(t => t.id === p.teamId);
                    return (
                      <div key={p.id} onClick={() => onSelectPlayer(p)} className="flex items-center justify-between p-3 bg-black/30 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all cursor-pointer group">
                         <div className="flex items-center space-x-3 min-w-0">
                            <span className="text-[9px] font-black text-gray-700 w-4">#{i+1}</span>
                            <span className="text-3xl shrink-0">{p.face}</span>
                            <div className="min-w-0">
                               <p className="text-[11px] font-bold text-white group-hover:text-orange-500 transition-colors uppercase truncate">{p.name}</p>
                               <span className="text-[7px] text-gray-500 font-black uppercase">{team?.name}</span>
                            </div>
                         </div>
                         <div className="text-right shrink-0">
                            <p className="text-lg font-sporty text-orange-500">{p.stats.potential}</p>
                            <p className="text-[6px] text-gray-700 font-black uppercase">POT</p>
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
              <h3 className="text-2xl font-sporty text-white uppercase text-center tracking-wider">NCAB ENROLLMENT</h3>
              <div className="grid grid-cols-1 gap-1.5 max-h-[300px] overflow-y-auto no-scrollbar">
                {uniTeams.map(uni => (
                  <button
                    key={uni.id}
                    onClick={() => {
                      onSignAcademy(assigningPlayerId);
                      onAssignToUniversity(assigningPlayerId, uni.id);
                      setAssigningPlayerId(null);
                      // Only consume if assignment completes
                      if (viewingScoutReportId) {
                        onConsumeScoutReport(viewingScoutReportId, gameState.week);
                        setViewingScoutReportId(null);
                      }
                    }}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-orange-600 transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{uni.logo}</span>
                      <span className="text-xs font-bold text-white uppercase group-hover:text-white">{uni.name}</span>
                    </div>
                    <span className="text-[8px] font-black text-gray-600 uppercase group-hover:text-white">Select</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setAssigningPlayerId(null)} className="w-full py-4 bg-white/5 text-gray-600 font-black text-[10px] uppercase rounded-xl transition-colors mt-2">Cancel Enrollment</button>
           </div>
        </div>
      )}

      {/* Scout Discovery Modal */}
      {viewingScoutReportId && recommendationPlayer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setViewingScoutReportId(null)}></div>
           <div className="relative bg-[#111114] border border-blue-500/30 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
              <div className="bg-blue-600 p-8 text-center">
                 <h2 className="text-4xl font-sporty text-white leading-none uppercase tracking-widest">High Potential Talent</h2>
                 <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.4em] mt-2">Field Agent Discovery</p>
              </div>
              <div className="p-10 space-y-8">
                 <div className="flex items-center space-x-6 bg-white/5 p-6 rounded-3xl border border-white/5">
                    <span className="text-6xl shrink-0">{recommendationPlayer.face}</span>
                    <div className="min-w-0">
                       <h3 className="text-2xl font-bold text-white truncate uppercase">{recommendationPlayer.name}</h3>
                       <div className="flex gap-3 mt-1">
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{recommendationPlayer.position}</p>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{recommendationPlayer.age} Years Old</p>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        onConsumeScoutReport(viewingScoutReportId, gameState.week);
                        setViewingScoutReportId(null);
                      }} 
                      className="flex-1 py-5 bg-white/5 text-gray-500 font-black text-[11px] uppercase tracking-widest rounded-2xl hover:text-white transition-colors border border-white/5"
                    >
                      Discard
                    </button>
                    <button 
                      onClick={() => {
                        if (isAgencyFull) {
                          alert('Office Full. Cannot secure rights.');
                          return;
                        }
                        setAssigningPlayerId(recommendationPlayer.id);
                      }} 
                      disabled={isAgencyFull}
                      className={`flex-1 py-5 font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all shadow-xl ${isAgencyFull ? 'bg-red-500/20 text-red-500 border border-red-500/20 cursor-not-allowed' : 'bg-blue-600 text-white shadow-blue-900/40'}`}
                    >
                      {isAgencyFull ? 'OFFICE FULL' : 'Secure Rights'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AcademyView;