
import React from 'react';
import { Match, Team } from '../types';

interface MatchModalProps {
  match: Match;
  teams: Team[];
  onClose: () => void;
}

const MatchModal: React.FC<MatchModalProps> = ({ match, teams, onClose }) => {
  if (match.isDunkContest) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose}></div>
        <div className="relative bg-[#111114] border border-blue-500/20 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
          <div className="bg-gradient-to-b from-blue-600/20 to-transparent p-8 text-center border-b border-white/5">
             <div className="flex justify-between items-center mb-6">
               <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Special Event • Week 26</span>
               <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
             </div>
             <h2 className="text-5xl font-sporty text-white leading-none uppercase tracking-tight">Slam Dunk Contest</h2>
             <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2">The highest flyers in the league</p>
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
          <div className="p-6 bg-blue-600/5 text-center">
             <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Winner awarded 25 REP bonus</p>
          </div>
        </div>
      </div>
    );
  }

  const home = teams.find(t => t.id === match.homeTeamId) || { name: 'East Stars', logo: '⭐' };
  const away = teams.find(t => t.id === match.awayTeamId) || { name: 'West Stars', logo: '🌟' };
  const homeWinner = match.homeScore > match.awayScore;
  const potg = match.details?.playerOfTheGame;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative bg-[#111114] border border-white/10 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        
        <div className="bg-gradient-to-b from-white/[0.05] to-transparent p-8 md:p-12 border-b border-white/5">
          <div className="flex justify-between items-center mb-8">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Game Recap • Week {match.week}</span>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors font-black text-xs">✕ CLOSE</button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center flex-1 space-y-4">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-5xl shadow-xl border border-white/10">{home.logo}</div>
              <p className="text-[9px] text-gray-600 font-bold uppercase">{home.name}</p>
            </div>

            <div className="px-8 flex flex-col items-center">
              <div className="flex items-center space-x-6">
                <span className={`text-6xl font-sporty ${homeWinner ? 'text-white' : 'text-gray-700'}`}>{match.homeScore}</span>
                <span className="text-orange-500 font-black text-4xl opacity-20">:</span>
                <span className={`text-6xl font-sporty ${!homeWinner ? 'text-white' : 'text-gray-700'}`}>{match.awayScore}</span>
              </div>
            </div>

            <div className="flex flex-col items-center flex-1 space-y-4">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-5xl shadow-xl border border-white/10">{away.logo}</div>
              <p className="text-[9px] text-gray-600 font-bold uppercase">{away.name}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          {potg && (
            <section className="bg-orange-600/10 border border-orange-500/30 p-6 rounded-3xl flex items-center justify-between">
               <div className="flex items-center space-x-5">
                  <div className="text-5xl">🏆</div>
                  <div>
                     <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Player of the Game</p>
                     <h4 className="text-2xl font-sporty text-white uppercase">{potg.name}</h4>
                  </div>
               </div>
               <div className="flex space-x-4">
                  <div className="text-center">
                     <p className="text-[8px] text-gray-500 uppercase font-black">PTS</p>
                     <p className="text-2xl font-sporty text-white">{potg.pts}</p>
                  </div>
                  <div className="text-center">
                     <p className="text-[8px] text-gray-500 uppercase font-black">REB</p>
                     <p className="text-2xl font-sporty text-white">{potg.reb}</p>
                  </div>
                  <div className="text-center">
                     <p className="text-[8px] text-gray-500 uppercase font-black">AST</p>
                     <p className="text-2xl font-sporty text-white">{potg.ast}</p>
                  </div>
               </div>
            </section>
          )}

          <section className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Game Summary</h4>
            <div className="p-6 bg-black/40 rounded-3xl border border-white/5 italic text-sm text-gray-400">
               {match.isAllStarMatch ? "A high-scoring showcase of the league's absolute best talent." : "A hard-fought battle with major implications for the standings."}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;
