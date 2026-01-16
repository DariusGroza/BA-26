import React from 'react';
import { Match, Team, Player } from '../types';

interface MatchModalProps {
  match: Match;
  teams: Team[];
  players: Player[];
  onClose: () => void;
  onSelectPlayer: (p: Player) => void;
}

const MatchModal: React.FC<MatchModalProps> = ({ match, teams, players, onClose, onSelectPlayer }) => {
  const handlePlayerClick = (playerId: string) => {
    // Robust lookup using the ID provided by the simulator
    const playerObj = players.find(p => p.id === playerId);
    if (playerObj) {
      onSelectPlayer(playerObj);
    }
  };

  if (match.isDunkContest) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose}></div>
        <div className="relative bg-[#111114] border border-blue-500/20 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
          <div className="bg-gradient-to-b from-blue-600/20 to-transparent p-8 text-center border-b border-white/5">
             <div className="flex justify-between items-center mb-6">
               <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Special Event • Week {match.week}</span>
               <button onClick={onClose} className="text-gray-500 hover:text-white text-xl p-2">✕</button>
             </div>
             <h2 className="text-5xl font-sporty text-white leading-none uppercase tracking-tight">Slam Dunk Contest</h2>
          </div>
          <div className="p-8 space-y-3">
             {match.dunkContestants?.map((c, i) => (
               <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${i === 0 ? 'bg-orange-600/10 border-orange-500/30 scale-105 shadow-xl' : 'bg-black/20 border-white/5'}`}>
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{c.face}</span>
                    <span className="text-xs font-bold text-white uppercase">{c.name}</span>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-sporty ${i === 0 ? 'text-orange-500' : 'text-gray-400'}`}>{c.score}</p>
                    <p className="text-[6px] font-black text-gray-700 uppercase">Score</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    );
  }

  const home = teams.find(t => t.id === match.homeTeamId) || { name: 'Home', logo: '🏠' };
  const away = teams.find(t => t.id === match.awayTeamId) || { name: 'Away', logo: '✈️' };
  const potg = match.details?.playerOfTheGame;
  const topPerformers = match.details?.topPerformers || [];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative bg-[#111114] border border-white/10 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95">
        
        {/* Header - Scoreboard */}
        <div className="bg-gradient-to-b from-white/[0.05] to-transparent p-5 md:p-10 border-b border-white/5 shrink-0">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <span className="text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">Recap • Week {match.week}</span>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors font-black text-lg p-1">✕</button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center flex-1 min-w-0">
              <span className="text-4xl md:text-5xl mb-1 md:2">{home.logo}</span>
              <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase text-center truncate w-full">{home.name}</p>
            </div>

            <div className="px-4 md:px-8 flex flex-col items-center shrink-0">
              <div className="flex items-center space-x-3 md:space-x-5">
                <span className={`text-4xl md:text-6xl font-sporty ${match.homeScore > match.awayScore ? 'text-white' : 'text-gray-700'}`}>{match.homeScore}</span>
                <span className="text-orange-500 font-black text-2xl md:text-4xl opacity-20">:</span>
                <span className={`text-4xl md:text-6xl font-sporty ${match.awayScore > match.homeScore ? 'text-white' : 'text-gray-700'}`}>{match.awayScore}</span>
              </div>
              <p className="text-[6px] md:text-[7px] text-orange-500 font-black tracking-widest uppercase mt-1 md:mt-2">FINAL</p>
            </div>

            <div className="flex flex-col items-center flex-1 min-w-0">
              <span className="text-4xl md:text-5xl mb-1 md:2">{away.logo}</span>
              <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase text-center truncate w-full">{away.name}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Stats */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-8 no-scrollbar">
          {/* Player of the Game */}
          {potg && (
            <div 
              onClick={() => handlePlayerClick(potg.id)}
              className="bg-orange-600/10 border border-orange-500/30 p-4 md:p-6 rounded-2xl md:rounded-3xl relative overflow-hidden group cursor-pointer hover:bg-orange-600/20 transition-all"
            >
               <div className="absolute top-0 right-0 p-4 opacity-10 text-5xl md:text-6xl pointer-events-none">⭐</div>
               <p className="text-[7px] md:text-[8px] font-black text-orange-500 uppercase tracking-widest mb-3 md:mb-4">Player of the Game</p>
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 md:space-x-4 min-w-0">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center text-3xl md:text-4xl border border-white/10 group-hover:scale-105 transition-transform shrink-0">
                      {potg.face || '🔥'}
                    </div>
                    <div className="min-w-0 overflow-hidden">
                       <h4 className="text-lg md:text-2xl font-sporty text-white uppercase group-hover:text-orange-500 transition-colors truncate">{potg.name}</h4>
                       <p className="text-[7px] md:text-[8px] text-gray-500 font-bold uppercase truncate">{teams.find(t => t.id === potg.teamId)?.name}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3 md:space-x-6 ml-2">
                    <div className="text-center">
                       <p className="text-[6px] md:text-[7px] text-gray-600 font-black uppercase">PTS</p>
                       <p className="text-lg md:text-2xl font-sporty text-white">{potg.pts}</p>
                    </div>
                    <div className="text-center hidden sm:block">
                       <p className="text-[6px] md:text-[7px] text-gray-600 font-black uppercase">REB</p>
                       <p className="text-lg md:text-2xl font-sporty text-white">{potg.reb}</p>
                    </div>
                    <div className="text-center hidden sm:block">
                       <p className="text-[6px] md:text-[7px] text-gray-600 font-black uppercase">AST</p>
                       <p className="text-lg md:text-2xl font-sporty text-white">{potg.ast}</p>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* Box Score Table */}
          <section className="space-y-3">
            <h4 className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Box Score Leaders</h4>
            <div className="bg-black/20 rounded-xl md:rounded-2xl border border-white/5 overflow-hidden">
               <table className="w-full text-left table-auto">
                  <thead className="bg-white/5 text-[7px] md:text-[8px] font-black text-gray-500 uppercase tracking-widest">
                     <tr>
                        <th className="px-3 md:px-4 py-3">Player</th>
                        <th className="px-1 py-3 text-center">M</th>
                        <th className="px-1 py-3 text-center">P</th>
                        <th className="px-1 py-3 text-center">R</th>
                        <th className="px-1 py-3 text-center">A</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                     {topPerformers.map((p, i) => (
                       <tr 
                        key={i} 
                        onClick={() => handlePlayerClick(p.id)}
                        className="hover:bg-white/[0.05] transition-colors cursor-pointer group"
                       >
                          <td className="px-3 md:px-4 py-2.5 flex items-center min-w-0 max-w-[120px] md:max-w-none">
                             <span className="text-xl shrink-0 grayscale group-hover:grayscale-0 mr-2 md:mr-3">{p.face}</span>
                             <div className="min-w-0 overflow-hidden">
                                <p className="text-[10px] md:text-[11px] font-bold text-white group-hover:text-orange-500 transition-colors uppercase truncate">{p.name.split(' ')[1] || p.name}</p>
                                <p className="text-[6px] text-gray-600 font-black uppercase">{teams.find(t => t.id === p.teamId)?.name.substring(0,3)}</p>
                             </div>
                          </td>
                          <td className="px-1 py-2.5 text-center text-[10px] text-gray-500 font-sporty">{p.minutes.toFixed(0)}</td>
                          <td className="px-1 py-2.5 text-center text-[11px] md:text-xs text-white font-sporty">{p.pts}</td>
                          <td className="px-1 py-2.5 text-center text-[11px] md:text-xs text-gray-500 font-sporty">{p.reb}</td>
                          <td className="px-1 py-2.5 text-center text-[11px] md:text-xs text-gray-500 font-sporty">{p.ast}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </section>
        </div>

        <div className="p-3 bg-black/40 text-center text-[7px] text-gray-700 font-black uppercase tracking-[0.4em] shrink-0">
          Official morningstar simulation data
        </div>
      </div>
    </div>
  );
};

export default MatchModal;