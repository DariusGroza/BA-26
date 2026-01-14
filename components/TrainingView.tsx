
import React from 'react';
import { Player } from '../types';
import { getTrainingCost } from '../utils';

interface TrainingViewProps {
  clients: Player[];
  onTrain: (playerId: string, attr: keyof Player['stats']) => void;
  trainingPoints: number;
}

const TrainingView: React.FC<TrainingViewProps> = ({ clients, onTrain, trainingPoints }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 md:pb-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-[#111114] p-6 rounded-2xl border border-white/5 shadow-xl">
        <div>
          <h2 className="text-3xl font-sporty tracking-wider text-white">Player Development</h2>
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest mt-1">Invest in your clients' progression</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Available Resources</p>
          <span className="text-2xl font-bold text-purple-400">{trainingPoints} TP</span>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="bg-[#111114] border border-dashed border-white/10 rounded-2xl p-12 text-center opacity-40">
          <span className="text-5xl mb-4 block">🏋️</span>
          <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">No professional clients found in agency stable.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {clients.map(p => (
            <div key={p.id} className="bg-[#111114] rounded-2xl border border-white/5 overflow-hidden flex flex-col shadow-2xl hover:border-white/10 transition-all">
              <div className="p-6 bg-white/5 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-xl bg-orange-600/20 flex items-center justify-center text-4xl mr-4 shadow-lg border border-white/5">
                    {p.face}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{p.name}</h3>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">{p.position} • {p.rating} OVR</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Stock POT</p>
                  <p className="text-lg font-bold text-blue-400 font-sporty tracking-widest">{p.stats.potential}</p>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/10">
                {[
                  { label: 'Scoring', key: 'scoring', color: 'bg-red-500' },
                  { label: 'Defense', key: 'defense', color: 'bg-blue-500' },
                  { label: 'Playmaking', key: 'playmaking', color: 'bg-green-500' },
                  { label: 'Athleticism', key: 'athleticism', color: 'bg-orange-500' },
                ].map(attr => {
                  const statVal = p.stats[attr.key as keyof Player['stats']];
                  const cost = getTrainingCost(statVal);
                  const canAfford = trainingPoints >= cost && statVal < 99;
                  
                  return (
                    <div key={attr.key} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-between group hover:bg-white/[0.08] transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black uppercase text-gray-400">{attr.label}</span>
                        <span className="text-lg font-sporty text-white">{statVal}</span>
                      </div>
                      <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mb-4">
                        <div className={`${attr.color} h-full transition-all duration-700`} style={{ width: `${statVal}%` }}></div>
                      </div>
                      <button 
                        onClick={() => onTrain(p.id, attr.key as any)}
                        className={`w-full py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                          canAfford ? 'bg-white text-black hover:bg-orange-600 hover:text-white shadow-lg active:scale-95' : 'bg-white/5 text-gray-700 cursor-not-allowed'
                        }`}
                        disabled={!canAfford}
                      >
                        {statVal >= 99 ? 'MAX' : `TRAIN (${cost} TP)`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingView;
