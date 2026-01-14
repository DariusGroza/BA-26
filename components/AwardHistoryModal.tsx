
import React from 'react';
import { Player, Team, SeasonAwards } from '../types';

interface AwardHistoryModalProps {
  category: 'MVP' | 'SCORING' | 'ROOKIE' | 'ALL';
  history: { year: number, awards: SeasonAwards }[];
  players: Player[];
  teams: Team[];
  onClose: () => void;
  onSelectPlayer: (p: Player) => void;
}

const AwardHistoryModal: React.FC<AwardHistoryModalProps> = ({ category, history, players, teams, onClose, onSelectPlayer }) => {
  const getCategoryInfo = () => {
    switch (category) {
      case 'MVP': return { title: 'Most Valuable Players', color: 'text-orange-500', icon: '🏆' };
      case 'SCORING': return { title: 'Scoring Champions', color: 'text-blue-500', icon: '🎯' };
      case 'ROOKIE': return { title: 'Rookies of the Year', color: 'text-purple-500', icon: '✨' };
      default: return { title: 'Hall of Fame Honors', color: 'text-white', icon: '🏛️' };
    }
  };

  const info = getCategoryInfo();

  const renderAwardRow = (year: number, awards: SeasonAwards) => {
    const awardsToShow = [];
    if (category === 'MVP' || category === 'ALL') awardsToShow.push({ id: awards.mvpId, type: 'MVP', color: 'text-orange-500' });
    if (category === 'SCORING' || category === 'ALL') awardsToShow.push({ id: awards.scoringChampId, type: 'SCORING CHAMP', color: 'text-blue-500' });
    if (category === 'ROOKIE' || category === 'ALL') awardsToShow.push({ id: awards.rookieOfYearId, type: 'ROOKIE OF YEAR', color: 'text-purple-500' });

    return (
      <div key={year} className="bg-white/5 border border-white/5 rounded-3xl p-6 mb-4 animate-in slide-in-from-right-4">
        <div className="flex items-center space-x-4 mb-4">
           <span className="text-xl font-sporty text-gray-500 tracking-widest">SEASON {year}</span>
           <div className="h-px flex-1 bg-white/10"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {awardsToShow.map((aw, i) => {
             const p = players.find(x => x.id === aw.id);
             const t = teams.find(x => x.id === p?.teamId);
             if (!p) return null;
             return (
               <div 
                key={i} 
                onClick={() => onSelectPlayer(p)}
                className="bg-black/40 p-4 rounded-2xl border border-white/[0.03] hover:border-white/20 transition-all cursor-pointer group"
               >
                 <div className="flex items-center space-x-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{p.face}</span>
                    <div className="min-w-0">
                       <p className={`text-[7px] font-black uppercase tracking-widest ${aw.color}`}>{aw.type}</p>
                       <p className="text-xs font-bold text-zinc-200 truncate">{p.name}</p>
                       <p className="text-[8px] text-zinc-600 font-bold uppercase truncate">{t?.name || 'Retired'}</p>
                    </div>
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative bg-[#111114] border border-white/10 w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
        
        <div className="p-10 border-b border-white/5 flex justify-between items-center">
           <div className="flex items-center space-x-6">
              <span className="text-6xl">{info.icon}</span>
              <div>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">APEX Records</p>
                 <h2 className={`text-5xl font-sporty ${info.color} uppercase tracking-tight`}>{info.title}</h2>
              </div>
           </div>
           <button onClick={onClose} className="text-gray-500 hover:text-white font-black text-xs">✕ CLOSE</button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
           {history.length > 0 ? (
             history.map(item => renderAwardRow(item.year, item.awards))
           ) : (
             <div className="py-20 text-center opacity-30 flex flex-col items-center">
                <span className="text-6xl mb-6">📜</span>
                <p className="text-sm font-black uppercase tracking-[0.3em]">No historical records available</p>
             </div>
           )}
        </div>

        <div className="p-6 bg-black/40 text-center border-t border-white/5">
           <p className="text-[7px] text-gray-700 font-black uppercase tracking-[0.5em]">APEX SPORTS GROUP ARCHIVES</p>
        </div>
      </div>
    </div>
  );
};

export default AwardHistoryModal;
