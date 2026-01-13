
import React, { useState } from 'react';
import { LifestyleItem } from '../types';
import { LIFESTYLE_ITEMS } from '../constants';
import { formatCurrency } from '../utils';

interface LifestyleViewProps {
  inventory: string[];
  onBuy: (item: LifestyleItem) => void;
  cash: number;
}

const LifestyleView: React.FC<LifestyleViewProps> = ({ inventory, onBuy, cash }) => {
  const [activeTab, setActiveTab] = useState<LifestyleItem['category'] | 'All'>('All');

  const categories: (LifestyleItem['category'] | 'All')[] = ['All', 'Housing', 'Vehicle', 'Education', 'Luxury'];

  const filteredItems = LIFESTYLE_ITEMS.filter(item => 
    activeTab === 'All' || item.category === activeTab
  );

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-[#0a0a0c] py-2 z-10 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-sporty tracking-wider text-white">Marketplace</h2>
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Upgrade your agency lifestyle</p>
        </div>
        <div className="flex bg-[#111114] p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${
                activeTab === cat ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        {filteredItems.map(item => {
          const isOwned = inventory.includes(item.id);
          const canAfford = cash >= item.price;

          return (
            <div 
              key={item.id} 
              className={`group flex items-center justify-between p-2 md:p-3 rounded-xl border transition-all ${
                isOwned 
                ? 'bg-green-500/10 border-green-500/20 opacity-80' 
                : 'bg-[#111114] border-white/5 hover:border-orange-500/30'
              }`}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg transition-all ${
                  isOwned ? 'bg-green-500/20' : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  {item.image}
                </div>
                <div className="truncate">
                  <h3 className={`font-bold text-xs truncate ${isOwned ? 'text-green-200' : 'text-white'}`}>{item.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{item.category}</span>
                    <span className="text-[8px] font-bold text-blue-400">+{item.reputationGain} REP</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 ml-2">
                {isOwned ? (
                  <div className="w-32 py-2 bg-green-500/20 text-green-500 text-[8px] font-black text-center rounded-lg border border-green-500/30 uppercase tracking-widest">
                    OWNED
                  </div>
                ) : (
                  <button 
                    onClick={() => onBuy(item)}
                    disabled={!canAfford}
                    className={`w-32 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex flex-col items-center justify-center ${
                      canAfford 
                      ? 'bg-white text-black hover:bg-orange-600 hover:text-white shadow-lg active:scale-95' 
                      : 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed'
                    }`}
                  >
                    <span>{canAfford ? 'BUY ITEM' : 'INSUFFICIENT FUNDS'}</span>
                    <span className={`text-[7px] ${canAfford ? 'opacity-60' : 'text-red-500/80'}`}>{formatCurrency(item.price)}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-10 bg-[#111114] rounded-2xl border border-dashed border-white/10">
          <p className="text-gray-600 italic text-xs">Category empty.</p>
        </div>
      )}
    </div>
  );
};

export default LifestyleView;
