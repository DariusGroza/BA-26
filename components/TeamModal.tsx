
import React from 'react';
import { Team, Player } from '../types';
import { formatCurrency } from '../utils';

interface TeamModalProps {
  team: Team;
  players: Player[];
  onClose: () => void;
  onSelectPlayer: (p: Player) => void;
}

const TeamModal: React.FC<TeamModalProps> = ({ team, players, onClose, onSelectPlayer }) => {
  const isUni = !!team.isUniversity;

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-[#0a0a0c]/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative bg-[#111114] border border-white/10 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-full max-h-[800px] animate-in slide-in-from-bottom-12 duration-300">
        {/* Banner */}
        <div className={`h-48 bg-gradient-to-r ${isUni ? 'from-blue-700 to-blue-900' : 'from-orange-600 to-orange-400'} p-8 flex items-end relative`}>
          <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white font-black text-xs">✕ CLOSE</button>
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-5xl shadow-2xl">{team.logo}</div>
            <div>
               <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] mb-1">{isUni ? 'UNIVERSITY PROGRAM' : team.city.toUpperCase()}</p>
               <h2 className="text-5xl font-sporty text-white leading-none">{team.name.toUpperCase()}</h2>
            </div>
          </div>
          <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-10 text-9xl font-sporty text-white pointer-events-none uppercase">
            {isUni ? 'NCAA' : team.id}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
           {/* Stats Summary */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                 <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Season Record</p>
                 <p className="text-xl font-sporty text-white">{team.wins} - {team.losses}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                 <p className="text-[8px] text-gray-500 font-black uppercase mb-1">{isUni ? 'Program Rank' : 'Team Chemistry'}</p>
                 <p className={`text-xl font-sporty ${isUni ? 'text-blue-400' : 'text-orange-500'}`}>{isUni ? `#${(team.wins > 10 ? 1 : 12)} Nationally` : `${team.chemistry}%`}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                 <p className="text-[8px] text-gray-500 font-black uppercase mb-1">{isUni ? 'Recruitment' : 'Championships'}</p>
                 <p className="text-xl font-sporty text-blue-400">{isUni ? `${team.rating} OVR` : `${team.championships} TITLES`}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                 <p className="text-[8px] text-gray-500 font-black uppercase mb-1">{isUni ? 'Prestige' : 'Valuation'}</p>
                 <p className="text-xl font-sporty text-white truncate">{isUni ? 'ELITE' : formatCurrency(team.valuation)}</p>
              </div>
           </div>

           {/* Roster Table */}
           <section className="space-y-4">
              <div className="flex justify-between items-center px-2">
                 <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">{isUni ? 'University Roster' : 'Active Roster'}</h3>
                 {isUni && <span className="text-[8px] font-black text-blue-500 uppercase">Youth Development Pool</span>}
              </div>
              <div className="bg-black/20 rounded-3xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                     <tr className="bg-white/5 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                        <th className="px-6 py-4">Student Athlete</th>
                        <th className="px-6 py-4 text-center">Pos</th>
                        <th className="px-6 py-4 text-center">Year</th>
                        <th className="px-6 py-4 text-center">OVR</th>
                        <th className="px-6 py-4 text-right">Draft Stock</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {players.sort((a,b) => b.rating - a.rating).map(p => (
                      <tr 
                        key={p.id} 
                        onClick={() => onSelectPlayer(p)}
                        className="hover:bg-white/[0.03] cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 flex items-center">
                           <span className="text-2xl mr-3">{p.face}</span>
                           <span className="font-bold text-gray-200">{p.name}</span>
                        </td>
                        <td className="px-6 py-4 text-center text-[10px] font-bold text-gray-500">{p.position}</td>
                        <td className="px-6 py-4 text-center text-xs font-medium text-gray-400">
                          {isUni ? `YEAR ${p.age - 14}` : `${p.age}y`}
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className={`font-sporty text-lg ${isUni ? 'text-blue-400' : 'text-white'}`}>{p.rating}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex flex-col items-end">
                              <span className="text-[9px] font-sporty text-white">{(p.seasonStats.pts / (p.seasonStats.gamesPlayed || 1)).toFixed(1)} PPG</span>
                              <span className="text-[7px] font-black text-gray-600 uppercase">{(p.rating + (p.stats.potential/2)).toFixed(0)} PROJ.</span>
                           </div>
                        </td>
                      </tr>
                    ))}
                    {players.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-20 text-center text-gray-700 italic text-[10px] font-black uppercase tracking-widest">
                           No student athletes currently listed.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default TeamModal;
