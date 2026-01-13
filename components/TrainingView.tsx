
import React from 'react';
import { Player } from '../types';
import { formatCurrency } from '../utils';

interface TrainingViewProps {
  clients: Player[];
  onTrain: (playerId: string, attr: keyof Player['stats']) => void;
  cash: number;
}

const TrainingView: React.FC<TrainingViewProps> = ({ clients, onTrain, cash }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-sporty tracking-wider">Player Development</h2>
        <p className="text-gray-500 text-sm">Invest in your clients' future stars</p>
      </div>

      {clients.length === 0 ? (
        <div className="bg-[#111114] border border-dashed border-white/10 rounded-2xl p-12 text-center">
          <p className="text-gray-500">You need to sign clients before you can train them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {clients.map(p => (
            <div key={p.id} className="bg-[#111114] rounded-2xl border border-white/5 overflow-hidden flex flex-col">
              <div className="p-6 bg-white/5 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-xl bg-orange-600/20 flex items-center justify-center text-4xl mr-4 shadow-lg border border-white/5">
                    {p.face}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{p.name}</h3>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">{p.position} • {p.rating} OVR</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Potential</p>
                  <p className="text-lg font-bold text-blue-400">A+</p>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Scoring', key: 'scoring', color: 'bg-red-500' },
                  { label: 'Defense', key: 'defense', color: 'bg-blue-500' },
                  { label: 'Playmaking', key: 'playmaking', color: 'bg-green-500' },
                  { label: 'Athleticism', key: 'athleticism', color: 'bg-orange-500' },
                ].map(attr => (
                  <div key={attr.key} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold">{attr.label}</span>
                      <span className="text-lg font-sporty">{p.stats[attr.key as keyof Player['stats']]}</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-4">
                      <div className={`${attr.color} h-full transition-all`} style={{ width: `${p.stats[attr.key as keyof Player['stats']]}%` }}></div>
                    </div>
                    <button 
                      onClick={() => onTrain(p.id, attr.key as any)}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
                        cash >= 2000 ? 'bg-white text-black hover:bg-orange-600 hover:text-white' : 'bg-white/5 text-white/20 cursor-not-allowed'
                      }`}
                      disabled={cash < 2000}
                    >
                      TRAIN ($2,000)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingView;
