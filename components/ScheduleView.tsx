
import React from 'react';
import { Match, Team } from '../types';

interface ScheduleViewProps {
  matches: Match[];
  teams: Team[];
  onSelectMatch: (m: Match) => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ matches, teams, onSelectMatch }) => {
  const groupedMatches: Record<number, Match[]> = {};
  matches.forEach(m => {
    if (!groupedMatches[m.week]) groupedMatches[m.week] = [];
    groupedMatches[m.week].push(m);
  });

  const weeks = Object.keys(groupedMatches).map(Number).sort((a, b) => b - a);

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-sporty tracking-wider text-white uppercase">Game Schedule</h2>
          <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase mt-1">League-wide Results</p>
        </div>
        <div className="flex space-x-2">
           <span className="px-6 py-2 bg-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-900/40">2026 SEASON</span>
        </div>
      </div>

      <div className="space-y-16">
        {weeks.length === 0 ? (
          <div className="p-32 text-center bg-[#111114] rounded-[3rem] border border-white/5 flex flex-col items-center space-y-4 opacity-30">
            <span className="text-6xl">📅</span>
            <p className="text-xs font-black uppercase tracking-[0.4em]">Advance to start the season</p>
          </div>
        ) : (
          weeks.map(week => (
            <section key={week} className="space-y-8">
              <div className="flex items-center space-x-6">
                <div className="h-px flex-1 bg-white/5"></div>
                <div className="text-center">
                  <h3 className="text-2xl font-sporty text-orange-500 tracking-[0.2em]">WEEK {week}</h3>
                  <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">
                    {week >= 42 ? 'POST-SEASON' : week === 41 ? 'PLAY-IN WEEK' : 'REGULAR SEASON'}
                  </p>
                </div>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedMatches[week].map(m => {
                  const home = teams.find(t => t.id === m.homeTeamId);
                  const away = teams.find(t => t.id === m.awayTeamId);
                  const isHomeWinner = m.homeScore > m.awayScore;
                  const isPlayoff = m.isPlayoffMatch || week >= 42;
                  
                  return (
                    <div 
                      key={m.id} 
                      onClick={() => onSelectMatch(m)}
                      className={`bg-[#111114] border rounded-[2rem] p-6 hover:bg-white/[0.05] cursor-pointer transition-all flex items-center justify-between shadow-2xl ${isPlayoff ? 'border-orange-500/20' : 'border-white/5'}`}
                    >
                      <div className={`flex-1 flex flex-col items-center ${isHomeWinner ? 'opacity-100' : 'opacity-40 grayscale-[0.5]'}`}>
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-3 text-2xl border border-white/5">
                          {home?.logo}
                        </div>
                        <span className="text-[10px] font-black text-white text-center uppercase tracking-tight">{home?.name}</span>
                      </div>

                      <div className="px-6 flex flex-col items-center">
                        <div className="flex items-center space-x-3 mb-1">
                          <span className={`text-5xl font-sporty tracking-tighter ${isHomeWinner ? 'text-white' : 'text-gray-700'}`}>
                            {m.homeScore}
                          </span>
                          <span className="text-orange-600 font-black text-2xl opacity-30">-</span>
                          <span className={`text-5xl font-sporty tracking-tighter ${!isHomeWinner ? 'text-white' : 'text-gray-700'}`}>
                            {m.awayScore}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${isPlayoff ? 'bg-orange-600/20 text-orange-500' : 'bg-white/10 text-gray-500'}`}>
                              {isPlayoff ? 'Playoffs' : 'Final'}
                           </span>
                        </div>
                      </div>

                      <div className={`flex-1 flex flex-col items-center ${!isHomeWinner ? 'opacity-100' : 'opacity-40 grayscale-[0.5]'}`}>
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-3 text-2xl border border-white/5">
                          {away?.logo}
                        </div>
                        <span className="text-[10px] font-black text-white text-center uppercase tracking-tight">{away?.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduleView;
