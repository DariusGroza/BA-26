
import React, { useState } from 'react';
import { Team, Match, Conference, GameState, LeaguePhase, PlayoffSeries, Player } from '../types';

interface LeagueViewProps {
  teams: Team[];
  matches: Match[];
  gameState: GameState;
  players: Player[];
  onSelectTeam: (t: Team) => void;
  onSelectPlayer: (p: Player) => void;
  onShowAwardHistory: (category: 'MVP' | 'SCORING' | 'ROOKIE' | 'ALL') => void;
}

const LeagueView: React.FC<LeagueViewProps> = ({ teams, matches, gameState, players, onSelectTeam, onSelectPlayer, onShowAwardHistory }) => {
  const [activeTab, setActiveTab] = useState<'EAST' | 'WEST' | 'PLAYOFFS' | 'HONORS'>('EAST');

  const eastStandings = teams.filter(t => !t.isUniversity && t.conference === Conference.EAST).sort((a, b) => b.wins - a.wins);
  const westStandings = teams.filter(t => !t.isUniversity && t.conference === Conference.WEST).sort((a, b) => b.wins - a.wins);

  const renderStandingsTable = (standings: Team[]) => (
    <div className="bg-[#111114] rounded-2xl border border-white/5 overflow-hidden shadow-2xl animate-in fade-in duration-500">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-white/5 text-[10px] uppercase font-bold text-gray-500 tracking-widest">
            <th className="px-6 py-4">Seed</th>
            <th className="px-6 py-4">Team</th>
            <th className="px-6 py-4 text-center">W</th>
            <th className="px-6 py-4 text-center">L</th>
            <th className="px-6 py-4 text-center">GB</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {standings.map((t, idx) => {
            const gb = (standings[0].wins - t.wins);
            return (
              <tr key={t.id} className={`hover:bg-white/[0.02] cursor-pointer group ${idx < 6 ? 'bg-green-500/5' : idx < 10 ? 'bg-blue-500/5' : ''}`} onClick={() => onSelectTeam(t)}>
                <td className="px-6 py-4 font-sporty text-xl text-gray-500">
                  {idx + 1}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3 bg-white/5 w-10 h-10 flex items-center justify-center rounded-xl border border-white/5 group-hover:border-orange-500/50 transition-colors">{t.logo}</span>
                    <div>
                      <div className="font-bold text-gray-200 group-hover:text-orange-500 transition-colors">
                        {t.city} <span className="text-orange-500">{t.name}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-sporty text-xl">{t.wins}</td>
                <td className="px-6 py-4 text-center font-sporty text-xl text-gray-600">{t.losses}</td>
                <td className="px-6 py-4 text-center font-bold text-gray-700 text-xs">{gb === 0 ? '-' : gb}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderHonors = () => {
    const statsLeaders = [...players].filter(p => p.seasonStats.gamesPlayed > 0).sort((a,b) => (b.seasonStats.pts/b.seasonStats.gamesPlayed) - (a.seasonStats.pts/a.seasonStats.gamesPlayed)).slice(0, 5);
    const mvp = players.find(p => p.id === gameState.lastSeasonAwards?.mvpId);
    const scoringChamp = players.find(p => p.id === gameState.lastSeasonAwards?.scoringChampId);
    const roy = players.find(p => p.id === gameState.lastSeasonAwards?.rookieOfYearId);

    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div 
            onClick={() => onShowAwardHistory('MVP')}
            className="bg-[#111114] border border-orange-500/30 p-8 rounded-3xl text-center shadow-xl relative overflow-hidden cursor-pointer group hover:bg-white/[0.02] transition-all"
           >
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🏆</div>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">League MVP</p>
              {mvp ? (
                <div className="group-hover:scale-105 transition-transform">
                  <div className="text-6xl mb-4">{mvp.face}</div>
                  <h4 className="text-xl font-bold text-white uppercase group-hover:text-orange-500">{mvp.name}</h4>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">{teams.find(t => t.id === mvp.teamId)?.name}</p>
                </div>
              ) : <p className="text-gray-700 italic text-sm">Awaiting Season End</p>}
              <p className="mt-4 text-[8px] font-black text-gray-700 uppercase">View Past MVPs</p>
           </div>

           <div 
            onClick={() => onShowAwardHistory('SCORING')}
            className="bg-[#111114] border border-blue-500/30 p-8 rounded-3xl text-center shadow-xl relative overflow-hidden cursor-pointer group hover:bg-white/[0.02] transition-all"
           >
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🎯</div>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Scoring Champion</p>
              {scoringChamp ? (
                <div className="group-hover:scale-105 transition-transform">
                  <div className="text-6xl mb-4">{scoringChamp.face}</div>
                  <h4 className="text-xl font-bold text-white uppercase group-hover:text-blue-500">{scoringChamp.name}</h4>
                  <p className="text-xl font-sporty text-blue-400 mt-2">{(scoringChamp.seasonStats.pts/scoringChamp.seasonStats.gamesPlayed).toFixed(1)} PPG</p>
                </div>
              ) : <p className="text-gray-700 italic text-sm">Awaiting Season End</p>}
              <p className="mt-4 text-[8px] font-black text-gray-700 uppercase">View Past Champs</p>
           </div>

           <div 
            onClick={() => onShowAwardHistory('ROOKIE')}
            className="bg-[#111114] border border-purple-500/30 p-8 rounded-3xl text-center shadow-xl relative overflow-hidden cursor-pointer group hover:bg-white/[0.02] transition-all"
           >
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">✨</div>
              <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-4">Rookie of the Year</p>
              {roy ? (
                <div className="group-hover:scale-105 transition-transform">
                  <div className="text-6xl mb-4">{roy.face}</div>
                  <h4 className="text-xl font-bold text-white uppercase group-hover:text-purple-500">{roy.name}</h4>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">{teams.find(t => t.id === roy.teamId)?.name}</p>
                </div>
              ) : <p className="text-gray-700 italic text-sm">Awaiting Season End</p>}
              <p className="mt-4 text-[8px] font-black text-gray-700 uppercase">View Past Rookies</p>
           </div>
        </div>

        <div className="bg-[#111114] rounded-3xl border border-white/5 p-8">
           <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Current Stat Leaders</h3>
           <div className="space-y-3">
              {statsLeaders.map((p, idx) => (
                <div key={p.id} onClick={() => onSelectPlayer(p)} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/[0.03] hover:border-orange-500/30 cursor-pointer transition-all">
                   <div className="flex items-center space-x-4">
                      <span className="text-[10px] font-black text-gray-700">#{idx+1}</span>
                      <span className="text-3xl">{p.face}</span>
                      <div>
                         <p className="text-sm font-bold text-white">{p.name}</p>
                         <p className="text-[9px] text-gray-500 uppercase font-black">{teams.find(t => t.id === p.teamId)?.name}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-2xl font-sporty text-white">{(p.seasonStats.pts/p.seasonStats.gamesPlayed).toFixed(1)}</p>
                      <p className="text-[8px] text-gray-600 font-black uppercase">Points / Game</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h2 className="text-4xl font-sporty tracking-wider text-white uppercase">{gameState.leaguePhase.replace('_', ' ')}</h2>
          </div>
          <p className="text-gray-500 text-[10px] font-black tracking-[0.4em] uppercase">NBA Season {gameState.year}</p>
        </div>
        <div className="flex bg-[#111114] p-1.5 rounded-2xl border border-white/5">
          {['EAST', 'WEST', 'PLAYOFFS', 'HONORS'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'HONORS' ? renderHonors() : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {activeTab === 'EAST' && renderStandingsTable(eastStandings)}
            {activeTab === 'WEST' && renderStandingsTable(westStandings)}
            {activeTab === 'PLAYOFFS' && (
                <div className="text-center py-20 bg-[#111114] rounded-3xl opacity-20 border border-white/5">Playoff Bracket logic active Week 42+</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeagueView;
