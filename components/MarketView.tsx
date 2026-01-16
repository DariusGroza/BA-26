import React, { useState } from 'react';
import { Player, Position } from '../types';
import { formatCurrency, getRequiredReputation } from '../utils';

interface MarketViewProps {
  players: Player[];
  onSign: (id: string) => void;
  onSelectPlayer: (p: Player) => void;
  reputation: number;
  isAgencyFull: boolean;
}

const MarketView: React.FC<MarketViewProps> = ({ players, onSign, onSelectPlayer, reputation, isAgencyFull }) => {
  const [filter, setFilter] = useState<Position | 'ALL'>('ALL');

  const filtered = players.filter(p => filter === 'ALL' || p.position === filter)
    .sort((a, b) => b.rating - a.rating);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-sporty tracking-wider text-white uppercase">Free Agent Market</h2>
          <p className="text-gray-500 text-[10px] font-black tracking-[0.3em] uppercase mt-1">Unrepresented Professional Talent</p>
        </div>
        <div className="flex bg-[#111114] p-1.5 rounded-2xl border border-white/5">
          {['ALL', ...Object.values(Position)].map(pos => (
            <button 
              key={pos}
              onClick={() => setFilter(pos as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === pos ? 'bg-orange-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#111114] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">
              <th className="px-8 py-5">Player Identity</th>
              <th className="px-8 py-5 text-center">Position</th>
              <th className="px-8 py-5 text-center">Rating</th>
              <th className="px-8 py-5 text-center">Asking Salary</th>
              <th className="px-8 py-5 text-right">Representation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-8 py-24 text-center text-gray-600 italic uppercase tracking-[0.3em] font-black">No unrepresented free agents available.</td></tr>
            ) : (
              filtered.map(p => {
                // Fix: Pass the player object instead of rating
                const reqRep = getRequiredReputation(p);
                const canSign = reputation >= reqRep && !isAgencyFull;
                
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02] group transition-colors">
                    <td className="px-8 py-6 flex items-center cursor-pointer" onClick={() => onSelectPlayer(p)}>
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-3xl mr-4 group-hover:scale-110 transition-transform">
                        {p.face}
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-orange-500 transition-colors">{p.name}</div>
                        <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{p.age} years old</div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-[10px] font-black text-gray-400 bg-white/5 px-2 py-1 rounded uppercase tracking-widest">{p.position}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="font-sporty text-2xl text-white">{p.rating}</span>
                    </td>
                    <td className="px-8 py-6 text-center text-sm font-bold text-green-500">
                      {formatCurrency(p.salary)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => onSign(p.id)}
                        disabled={!canSign}
                        className={`font-black py-3 px-6 rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                          isAgencyFull 
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20 cursor-not-allowed'
                          : canSign 
                            ? 'bg-white text-black hover:bg-orange-600 hover:text-white' 
                            : 'bg-white/5 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {isAgencyFull ? 'FULL' : reputation >= reqRep ? 'Represent' : `Need ${reqRep} Rep`}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketView;