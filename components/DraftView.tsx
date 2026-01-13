
import React, { useState, useEffect } from 'react';
import { GameState, Player, DraftPhase, ScoutingLevel, Team } from '../types';
import { formatCurrency } from '../utils';

interface DraftViewProps {
  gameState: GameState;
  teams: Team[];
  prospects: Player[];
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onPick: (prospectId: string) => void;
  onSign: (playerId: string) => void;
  onSelectPlayer: (p: Player) => void;
  onSelectTeam: (t: Team) => void;
  onFinishDraft: () => void;
}

const DraftView: React.FC<DraftViewProps> = ({ gameState, teams, prospects, setGameState, onPick, onSign, onSelectPlayer, onSelectTeam, onFinishDraft }) => {
  const [lotteryRevealed, setLotteryRevealed] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Automatic simulation loop
  useEffect(() => {
    let timer: any;
    if (isSimulating && gameState.draftPhase === DraftPhase.DRAFT_NIGHT && gameState.currentDraftPick <= 60) {
      timer = setTimeout(() => {
        const available = [...prospects].sort((a, b) => {
          const aValue = (a.rating * 0.7) + ((a.draftStock || 50) * 0.3);
          const bValue = (b.rating * 0.7) + ((b.draftStock || 50) * 0.3);
          return bValue - aValue;
        });

        if (available.length > 0) {
          onPick(available[0].id);
        } else {
          setIsSimulating(false);
        }
      }, 300);
    } else if (gameState.currentDraftPick > 60) {
      setIsSimulating(false);
    }
    return () => clearTimeout(timer);
  }, [isSimulating, gameState.currentDraftPick, gameState.draftPhase, prospects, onPick]);

  if (gameState.draftPhase === DraftPhase.PRE_DRAFT) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in">
        <div className="flex items-center justify-between bg-[#111114] p-6 rounded-2xl border border-white/5">
          <div>
            <h2 className="text-2xl font-sporty tracking-wider text-white">Prospect Scouting</h2>
            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mt-1">Preparation Phase • Draft in Week 52</p>
          </div>
          <div className="text-right">
            <p className="text-[7px] text-gray-500 font-black uppercase">Influence</p>
            <p className="text-xl font-bold text-orange-500">{gameState.influencePoints} INF</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {prospects.sort((a,b) => b.rating - a.rating).slice(0, 20).map((p, idx) => (
            <div key={p.id} className={`bg-[#111114] border p-3 rounded-xl transition-all relative group ${p.isClient ? 'border-orange-500/50' : 'border-white/5'}`}>
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-2 cursor-pointer" onClick={() => onSelectPlayer(p)}>{p.face}</span>
                <h4 className="text-[10px] font-bold text-white text-center leading-tight truncate w-full">{p.name}</h4>
                <p className="text-[8px] text-orange-500 font-black mt-1">{p.position}</p>
                <div className="mt-3 w-full space-y-1">
                  <button onClick={() => onSign(p.id)} disabled={p.isClient} className={`w-full py-1.5 text-[8px] font-black uppercase rounded-lg ${p.isClient ? 'bg-green-500/20 text-green-500' : 'bg-white text-black hover:bg-orange-600 hover:text-white'}`}>
                    {p.isClient ? 'REPRESENTED' : 'SIGN'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (gameState.draftPhase === DraftPhase.DRAFT_NIGHT) {
    const currentPick = gameState.currentDraftPick;
    const teamId = gameState.draftOrder[currentPick - 1];
    const team = teams.find(t => t.id === teamId);

    return (
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-orange-600 p-8 rounded-3xl shadow-xl flex justify-between items-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-[8rem] font-sporty leading-none pointer-events-none">DRAFT</div>
             <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">PICK {currentPick} / 60</p>
                <h2 className="text-5xl font-sporty tracking-tight uppercase leading-none">Live Draft Room</h2>
             </div>
             <div className="relative z-10 text-right">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">ON THE CLOCK</p>
                <p className="text-xl font-bold uppercase">{team?.city} {team?.name}</p>
             </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setIsSimulating(!isSimulating)}
              disabled={currentPick > 60}
              className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 ${isSimulating ? 'bg-red-500 text-white' : 'bg-green-600 text-white hover:bg-green-500'}`}
            >
              <span className="text-xl">{isSimulating ? '⏸' : '▶'}</span>
              <span>{isSimulating ? 'Pause Simulation' : 'Start Auto-Draft'}</span>
            </button>
            <button 
              onClick={() => {
                let p = gameState.currentDraftPick;
                while(p <= 60) {
                  const best = [...prospects].sort((a,b) => b.rating - a.rating)[0];
                  if(best) onPick(best.id);
                  p++;
                }
                setGameState(prev => ({ ...prev, draftPhase: DraftPhase.POST_DRAFT }));
              }}
              disabled={currentPick > 60}
              className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Instant Skip
            </button>
          </div>

          <div className="bg-[#111114] border border-white/5 rounded-3xl p-6">
             <h4 className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest">Available Talent Pool</h4>
             <div className="grid grid-cols-2 gap-3">
              {prospects.sort((a,b) => b.rating - a.rating).slice(0, 10).map((p, i) => (
                <div key={p.id} className={`p-4 bg-black/40 rounded-2xl border flex items-center space-x-4 transition-all ${p.isClient ? 'border-orange-500/50 bg-orange-500/5' : 'border-white/5'}`}>
                    <span className="text-4xl">{p.face}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{p.name}</p>
                      <p className="text-[9px] text-orange-500 font-black uppercase">{p.position} • {p.rating} OVR</p>
                    </div>
                    {p.isClient && <span className="bg-orange-600 text-white text-[7px] font-black px-2 py-1 rounded-full uppercase">Client</span>}
                </div>
              ))}
             </div>
          </div>
        </div>

        <div className="bg-[#111114] border border-white/5 rounded-3xl p-6 flex flex-col h-[700px] shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xs font-black text-orange-500 tracking-widest uppercase">Live Draft Tracker</h4>
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
            {gameState.draftHistory.slice().reverse().map((h, i) => {
              const t = teams.find(team => team.id === h.teamId);
              return (
                <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/[0.05] flex items-center justify-between text-[11px] animate-in slide-in-from-right-4">
                  <span className="font-sporty text-xl text-gray-700 w-10">#{h.pick}</span>
                  <div className="flex-1 px-3 min-w-0">
                    <p className="text-[8px] font-black text-orange-500 uppercase mb-0.5">{t?.name}</p>
                    <p className="font-bold text-gray-200 truncate">Rookie Selected</p>
                  </div>
                  <div className="text-[8px] text-gray-600 font-black bg-white/5 px-2 py-1 rounded uppercase">Logged</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-20 text-center space-y-12 animate-in fade-in pb-32">
      <div className="relative">
        <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-5xl mx-auto border-2 border-green-500/20">✓</div>
        <div className="absolute inset-0 bg-green-500/10 blur-3xl rounded-full -z-10 animate-pulse"></div>
      </div>
      <div>
        <h2 className="text-6xl font-sporty text-white uppercase tracking-tighter leading-none">Draft Night Concluded</h2>
        <p className="text-gray-500 text-sm mt-4 uppercase tracking-[0.3em] font-bold">The class of {gameState.year} has been distributed.</p>
      </div>

      <div className="bg-[#111114] rounded-[3rem] border border-white/5 p-10 shadow-2xl">
         <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-10">Agency Summary</h3>
         <div className="col-span-2 py-10 text-center text-gray-600 text-[10px] font-black uppercase tracking-widest bg-black/20 rounded-3xl border border-dashed border-white/5">
           Review your agency portfolio to see your new rookies' contracts.
         </div>
      </div>

      <button 
        onClick={onFinishDraft}
        className="px-16 py-6 bg-white text-black font-black text-xs uppercase rounded-2xl hover:bg-orange-600 hover:text-white transition-all shadow-2xl active:scale-95"
      >
        Start New Regular Season
      </button>
    </div>
  );
};

export default DraftView;
