
import React, { useState } from 'react';
import { formatCurrency } from '../utils';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: string;
  icon: string;
  benefit: {
    type: 'CASH' | 'REPUTATION' | 'TP' | 'INFLUENCE';
    amount: number;
  };
  color: string;
}

interface StoreViewProps {
  onPurchase: (item: StoreItem) => void;
}

const STORE_ITEMS: StoreItem[] = [
  // CASH OPTIONS
  {
    id: 'grant_1',
    name: 'Small Grant',
    description: 'Quick agency liquidity.',
    price: '$0.99',
    icon: '💵',
    benefit: { type: 'CASH', amount: 100000 },
    color: 'green'
  },
  {
    id: 'grant_2',
    name: 'Empire Capital',
    description: 'Expansion funding.',
    price: '$4.99',
    icon: '💰',
    benefit: { type: 'CASH', amount: 1000000 },
    color: 'green'
  },
  {
    id: 'grant_3',
    name: 'Sovereign Fund',
    description: 'Massive market power.',
    price: '$9.99',
    icon: '🏛️',
    benefit: { type: 'CASH', amount: 100000000 },
    color: 'emerald'
  },
  {
    id: 'grant_4',
    name: 'Global Conglomerate',
    description: 'Ultimate franchise takeover.',
    price: '$25.00',
    icon: '💎',
    benefit: { type: 'CASH', amount: 5000000000 },
    color: 'yellow'
  },
  // REPUTATION OPTIONS
  {
    id: 'pr_1',
    name: 'Publicity Stunt',
    description: 'Local status boost.',
    price: '$1.99',
    icon: '📢',
    benefit: { type: 'REPUTATION', amount: 50 },
    color: 'blue'
  },
  {
    id: 'pr_2',
    name: 'Global PR Agency',
    description: 'Elite industry standing.',
    price: '$5.99',
    icon: '🌍',
    benefit: { type: 'REPUTATION', amount: 200 },
    color: 'blue'
  },
  {
    id: 'pr_3',
    name: 'Iconic Legend',
    description: 'Unmatched global respect.',
    price: '$14.99',
    icon: '👑',
    benefit: { type: 'REPUTATION', amount: 1000 },
    color: 'indigo'
  },
  // TP & INFLUENCE
  {
    id: 'dev_1',
    name: 'Elite Training',
    description: 'Skill development camp.',
    price: '$2.99',
    icon: '🏋️',
    benefit: { type: 'TP', amount: 100 },
    color: 'purple'
  },
  {
    id: 'dev_2',
    name: 'Pro Tech Lab',
    description: 'Advanced player metrics.',
    price: '$9.99',
    icon: '🧬',
    benefit: { type: 'TP', amount: 500 },
    color: 'purple'
  },
  {
    id: 'inf_1',
    name: 'Leverage Boost',
    description: 'Draft floor control.',
    price: '$3.99',
    icon: '🤝',
    benefit: { type: 'INFLUENCE', amount: 50 },
    color: 'orange'
  },
  {
    id: 'inf_2',
    name: 'Shadow Broker',
    description: 'Own the entire league.',
    price: '$12.99',
    icon: '🕵️',
    benefit: { type: 'INFLUENCE', amount: 250 },
    color: 'orange'
  }
];

const StoreView: React.FC<StoreViewProps> = ({ onPurchase }) => {
  const [purchasedId, setPurchasedId] = useState<string | null>(null);

  const handleBuy = (item: StoreItem) => {
    onPurchase(item);
    setPurchasedId(item.id);
    setTimeout(() => setPurchasedId(null), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="flex items-center justify-between bg-[#111114] p-4 rounded-2xl border border-white/5 shadow-2xl">
        <div className="flex items-center space-x-4">
           <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
             💎
           </div>
           <div>
              <h2 className="text-2xl font-sporty text-white uppercase leading-none tracking-tight">Elite Agency Store</h2>
              <p className="text-[7px] text-gray-500 font-black uppercase tracking-[0.4em] mt-1">Resource Injections</p>
           </div>
        </div>
        <div className="text-right hidden sm:block">
           <p className="text-[6px] text-gray-600 font-black uppercase tracking-widest">Secured Node</p>
           <p className="text-[9px] text-orange-500 font-bold uppercase">Morningstar Authorized</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 px-1">
        {STORE_ITEMS.map((item) => (
          <div key={item.id} className={`bg-[#111114] border rounded-xl p-3 flex flex-col transition-all group relative overflow-hidden shadow-md ${purchasedId === item.id ? 'border-green-500 ring-2 ring-green-500/20' : 'border-white/5 hover:border-orange-500/30'}`}>
            <div className="flex items-center space-x-2 mb-2">
               <div className={`w-8 h-8 bg-black/40 rounded-lg flex items-center justify-center text-lg border border-white/5 group-hover:scale-110 transition-transform ${purchasedId === item.id ? 'text-green-500' : ''}`}>
                 {purchasedId === item.id ? '✅' : item.icon}
               </div>
               <div className="min-w-0 flex-1">
                  <h3 className="text-[9px] font-bold text-white truncate uppercase">{item.name}</h3>
               </div>
            </div>

            <p className="text-[7px] text-gray-600 font-bold leading-tight line-clamp-2 mb-3 h-4">
              {item.description}
            </p>

            <div className="mt-auto space-y-2">
              <div className="bg-black/40 py-1 px-2 rounded-lg border border-white/[0.03] flex justify-between items-center">
                <span className={`text-[9px] font-sporty tracking-wider ${purchasedId === item.id ? 'text-green-500' : 'text-orange-500'}`}>
                  +{item.benefit.amount.toLocaleString()} {item.benefit.type}
                </span>
              </div>

              <button 
                onClick={() => handleBuy(item)}
                className={`w-full font-black py-2 rounded-lg text-[8px] uppercase tracking-widest transition-all active:scale-95 ${purchasedId === item.id ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-orange-600 hover:text-white'}`}
              >
                {purchasedId === item.id ? 'PROCESSED' : `Buy ${item.price}`}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center py-2 opacity-20">
        <p className="text-[6px] text-gray-600 font-black uppercase tracking-[0.6em]">Secure Global commerce • 2026</p>
      </div>
    </div>
  );
};

export default StoreView;
