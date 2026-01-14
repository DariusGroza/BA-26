import React, { useState } from 'react';
import { Team, Sponsorship, Player, LifestyleItem, Loan } from '../types';
import { formatCurrency } from '../utils';
import { LIFESTYLE_ITEMS } from '../constants';

interface FinanceViewProps {
  teams: Team[];
  players: Player[];
  cash: number;
  inventory: string[];
  onBuyShares: (teamId: string, amount: number) => void;
  onBuyLifestyle: (item: LifestyleItem) => void;
  onSignSponsorship: (teamId: string, sponsorship: Sponsorship) => void;
  onUpdateTeamFinance: (teamId: string, updates: Partial<Team>) => void;
  managedTeamId: string | null;
  onBecomeOwner: (teamId: string) => void;
  onResign: () => void;
  onSelectPlayer: (p: Player) => void;
  onTakeLoan: (amount: number, interest: number) => void;
  onRepayLoan: (loanId: string, amount: number) => void;
  loans: Loan[];
}

const FinanceView: React.FC<FinanceViewProps> = ({ 
  teams, players, cash, inventory, onBuyShares, onBuyLifestyle, onSignSponsorship, 
  onUpdateTeamFinance, managedTeamId, onBecomeOwner, onResign, onSelectPlayer,
  onTakeLoan, onRepayLoan, loans
}) => {
  const [activeTab, setActiveTab] = useState<'INVEST' | 'PORTFOLIO' | 'LOANS' | 'LIFESTYLE'>('INVEST');
  const [lifestyleFilter, setLifestyleFilter] = useState<LifestyleItem['category'] | 'All'>('All');

  const totalDebt = loans.reduce((acc, l) => acc + l.balance, 0);
  const userEquity = teams.filter(t => t.userShares > 0);
  
  const filteredLifestyle = LIFESTYLE_ITEMS.filter(item => 
    lifestyleFilter === 'All' || item.category === lifestyleFilter
  ).sort((a,b) => a.price - b.price);

  const getTierColor = (price: number) => {
    if (price >= 1000000000) return 'border-yellow-500/40 text-yellow-500 shadow-yellow-900/20';
    if (price >= 50000000) return 'border-purple-500/40 text-purple-400 shadow-purple-900/20';
    if (price >= 1000000) return 'border-blue-500/40 text-blue-400 shadow-blue-900/20';
    return 'border-white/5 text-gray-400';
  };

  const getTierName = (price: number) => {
    if (price >= 1000000000) return 'LEGENDARY';
    if (price >= 50000000) return 'ELITE';
    if (price >= 1000000) return 'PREMIUM';
    return 'BASIC';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in slide-in-from-bottom-8 duration-500 pb-32">
      {/* Header Sticky Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111114] p-3 rounded-2xl border border-white/5 sticky top-0 z-30 shadow-2xl backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-600/20 border border-orange-500/30 rounded-xl flex items-center justify-center text-xl shadow-lg">💹</div>
          <div>
            <h2 className="text-xl font-sporty tracking-wider text-white uppercase leading-none">Venture Hub</h2>
            <p className="text-gray-500 text-[7px] font-black tracking-[0.4em] uppercase mt-1">Global Economic Grid</p>
          </div>
        </div>
        <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 gap-1 overflow-x-auto no-scrollbar">
          {['INVEST', 'PORTFOLIO', 'LOANS', 'LIFESTYLE'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 md:px-6 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'LOANS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="bg-[#111114] border border-red-500/20 p-6 rounded-3xl space-y-6">
              <h3 className="text-lg font-sporty text-red-500 uppercase">Capital Injection</h3>
              <p className="text-[10px] text-gray-500 uppercase leading-relaxed font-bold">WARNING: Weekly interest is compounding. High default risk reduces agency reputation.</p>
              <div className="grid grid-cols-1 gap-2">
                 {[
                   { amt: 100000, int: 2.5, label: 'Micro-Venture' },
                   { amt: 500000, int: 5.0, label: 'Series A' },
                   { amt: 1000000, int: 8.0, label: 'Shadow Capital' }
                 ].map(tier => (
                   <button 
                     key={tier.amt}
                     onClick={() => onTakeLoan(tier.amt, tier.int)}
                     className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center hover:bg-red-600/10 transition-all group"
                   >
                      <div className="text-left">
                         <p className="text-[10px] font-bold text-white uppercase group-hover:text-red-400">{tier.label}</p>
                         <p className="text-[7px] text-gray-600 font-black uppercase">{tier.int}% Weekly Int.</p>
                      </div>
                      <span className="text-sm font-sporty text-white">{formatCurrency(tier.amt)}</span>
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-[#111114] border border-white/5 p-6 rounded-3xl flex flex-col h-[400px]">
              <h3 className="text-lg font-sporty text-white uppercase mb-6">Active Liabilities</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                 {loans.map(loan => (
                   <div key={loan.id} className="p-4 bg-black/40 rounded-2xl border border-white/5 flex justify-between items-center">
                      <div>
                         <p className="text-[10px] font-bold text-white">{formatCurrency(loan.balance).split('.')[0]}</p>
                         <p className="text-[6px] text-gray-600 font-black uppercase">Balance (Interest Accruing)</p>
                      </div>
                      <button 
                        onClick={() => onRepayLoan(loan.id, Math.min(cash, loan.balance))}
                        disabled={cash <= 0}
                        className="bg-green-600 text-white text-[7px] font-black px-4 py-2 rounded-lg uppercase shadow-lg hover:bg-green-500 disabled:opacity-30"
                      >
                        Repay {formatCurrency(Math.min(cash, loan.balance)).split('.')[0]}
                      </button>
                   </div>
                 ))}
                 {loans.length === 0 && (
                   <div className="flex flex-col items-center justify-center h-full opacity-20">
                      <span className="text-4xl mb-2">📉</span>
                      <p className="text-[8px] font-black uppercase tracking-widest">No active debt</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'INVEST' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.filter(t => !t.isUniversity).sort((a,b) => b.valuation - a.valuation).map(t => {
            const marketStatus = t.marketTrend || 'STABLE';
            const isManagingThis = managedTeamId === t.id;
            const hasGovernorEquity = t.userShares >= 51;
            const canTakeover = hasGovernorEquity && !isManagingThis;
            const isFullOwner = t.userShares >= 100;
            
            return (
              <div key={t.id} className={`bg-[#111114] border rounded-2xl p-4 flex flex-col group relative overflow-hidden transition-all hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-900/10 ${hasGovernorEquity ? 'border-orange-500/50 ring-1 ring-orange-500/10 bg-orange-600/5' : 'border-white/5'}`}>
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-7xl font-sporty pointer-events-none uppercase">{t.id}</div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 shadow-inner">
                      {t.logo}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-white uppercase truncate tracking-tight">{t.name}</h3>
                      <p className="text-[7px] text-gray-500 font-black uppercase tracking-widest">{t.city} Franchise</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-[7px] font-black px-2 py-0.5 rounded-md inline-block flex items-center gap-1 ${marketStatus === 'BULLISH' ? 'bg-green-500/20 text-green-400 animate-pulse' : marketStatus === 'BEARISH' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {marketStatus === 'BULLISH' ? '↗' : marketStatus === 'BEARISH' ? '↘' : '→'} {marketStatus}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 relative z-10">
                   <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                      <p className="text-[6px] text-gray-600 font-black uppercase mb-1">Mkt. Valuation</p>
                      <p className="text-xs font-sporty text-white">{(t.valuation / 1000000000).toFixed(1)}B</p>
                   </div>
                   <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                      <p className="text-[6px] text-gray-600 font-black uppercase mb-1">Share Price (1%)</p>
                      <p className="text-xs font-sporty text-orange-500">{formatCurrency(t.sharePrice).split('.')[0]}</p>
                   </div>
                </div>

                <div className="mb-4 space-y-1">
                  <div className="flex justify-between text-[7px] font-black uppercase text-gray-500">
                    <span className={hasGovernorEquity ? 'text-orange-500' : ''}>
                      {isFullOwner ? 'SOLE OWNER' : hasGovernorEquity ? 'GOVERNOR EQUITY' : 'Your Equity'}
                    </span>
                    <span className={hasGovernorEquity ? 'text-orange-500 font-black animate-pulse text-xs' : 'text-blue-400'}>{t.userShares}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-700 ${hasGovernorEquity ? 'bg-orange-600 shadow-[0_0_12px_rgba(234,88,12,0.8)]' : 'bg-blue-600'}`} style={{ width: `${t.userShares}%` }}></div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 relative z-10">
                  {!isFullOwner && (
                    <div className="grid grid-cols-3 gap-1.5 mt-auto">
                      {[1, 5, 10].map(amt => {
                        const price = t.sharePrice * amt;
                        const canAfford = cash >= price;
                        const isFull = t.userShares + amt > 100;
                        return (
                          <button
                            key={amt}
                            onClick={() => onBuyShares(t.id, amt)}
                            disabled={!canAfford || isFull}
                            className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all border ${
                              isFull 
                              ? 'bg-gray-800 border-gray-700 opacity-20 cursor-not-allowed'
                              : canAfford 
                                ? 'bg-white text-black hover:bg-orange-600 hover:text-white border-transparent shadow-lg active:scale-95' 
                                : 'bg-white/5 text-gray-700 border-white/5 cursor-not-allowed'
                            }`}
                          >
                            <span className="text-[9px] font-black uppercase">{amt}%</span>
                            <span className="text-[6px] font-bold opacity-60">Buy</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {canTakeover && (
                    <div className="space-y-1 mt-1">
                      <button 
                        onClick={() => onBecomeOwner(t.id)}
                        className="w-full py-3 bg-orange-600 text-white font-black rounded-xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-orange-900/40 animate-pulse hover:bg-white hover:text-orange-600 transition-all border border-transparent"
                      >
                        TAKE OVER
                      </button>
                      {managedTeamId !== null && (
                        <p className="text-[6px] text-red-500 font-black uppercase text-center animate-bounce">Resign penalty (-15 REP, -20 INF) will apply</p>
                      )}
                    </div>
                  )}
                  
                  {isManagingThis && (
                    <span className="w-full text-center py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl text-[7px] font-black uppercase tracking-widest mt-1">Control Active</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'PORTFOLIO' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Equity Portfolio */}
           <div className="bg-[#111114] border border-white/5 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Equity Portfolio</h3>
                <span className="text-[8px] font-bold text-orange-500 bg-orange-600/10 px-2 py-1 rounded">Stakes: {userEquity.length}</span>
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar">
                 {userEquity.map(t => {
                   const isManagingThis = managedTeamId === t.id;
                   const canTakeover = t.userShares >= 51 && !isManagingThis;

                   return (
                    <div key={t.id} className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${canTakeover ? 'bg-orange-600/10 border-orange-500/50 ring-2 ring-orange-500/20' : 'bg-black/40 border-white/5 hover:border-orange-500/30'}`}>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl group-hover:scale-110 transition-transform">{t.logo}</span>
                          <div>
                              <p className="text-[10px] font-bold text-white uppercase">{t.name}</p>
                              <p className={`text-[7px] font-black uppercase ${t.userShares >= 51 ? 'text-orange-500 animate-pulse' : 'text-blue-500'}`}>
                                {t.userShares}% {t.userShares >= 100 ? 'SOLE OWNER' : t.userShares >= 51 ? 'MAJORITY OWNER' : 'SHAREHOLDER'}
                              </p>
                              {canTakeover && (
                                <div className="mt-2 space-y-1">
                                  <button 
                                    onClick={() => onBecomeOwner(t.id)}
                                    className="bg-orange-600 hover:bg-white hover:text-orange-600 text-white text-[10px] font-black px-4 py-2 rounded-lg uppercase transition-all shadow-xl shadow-orange-900/40"
                                  >
                                    TAKE OVER
                                  </button>
                                  {managedTeamId !== null && (
                                    <p className="text-[5px] text-red-500 font-black uppercase">Switch penalty: -15 REP / -20 INF</p>
                                  )}
                                </div>
                              )}
                              {isManagingThis && (
                                <div className="flex flex-col gap-1 mt-1">
                                  <span className="text-[7px] font-black text-green-500 uppercase bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">Executive Governor</span>
                                  <button onClick={onResign} className="text-[7px] font-black text-red-500 uppercase hover:text-white transition-colors text-left w-fit flex items-center gap-1 group/btn">
                                     Resign Control
                                     <span className="opacity-0 group-hover/btn:opacity-100 text-[6px] transition-opacity">(-15 REP, -20 INF)</span>
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-sporty text-white">{formatCurrency(t.valuation * (t.userShares/100)).split('.')[0]}</p>
                          <p className="text-[6px] text-gray-600 font-black uppercase">Asset Value</p>
                        </div>
                    </div>
                   );
                 })}
                 {userEquity.length === 0 && (
                   <div className="text-center py-20 opacity-20">
                      <span className="text-4xl mb-4 block">📈</span>
                      <p className="text-[8px] font-black uppercase tracking-[0.3em]">Market position empty</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Personal Assets */}
           <div className="bg-[#111114] border border-white/5 p-6 rounded-3xl space-y-4 shadow-xl">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Personal Assets</h3>
              <div className="grid grid-cols-4 gap-2 max-h-[500px] overflow-y-auto no-scrollbar">
                 {inventory.map(itemId => {
                    const item = LIFESTYLE_ITEMS.find(li => li.id === itemId);
                    if (!item) return null;
                    const tierColor = getTierColor(item.price);
                    return (
                      <div key={itemId} className={`aspect-square bg-black/40 rounded-2xl border ${tierColor.split(' ')[0]} flex flex-col items-center justify-center p-1 text-center group hover:bg-white/5 transition-all shadow-lg`}>
                         <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{item.image}</span>
                         <p className="text-[6px] font-bold text-white uppercase truncate w-full px-1">{item.name}</p>
                      </div>
                    );
                 })}
                 {inventory.length === 0 && (
                   <div className="col-span-4 text-center py-20 opacity-20">
                      <span className="text-4xl mb-4 block">🏠</span>
                      <p className="text-[8px] font-black uppercase tracking-[0.3em]">No personal assets</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'LIFESTYLE' && (
        <div className="space-y-2 animate-in slide-in-from-right-4 duration-500">
           <div className="flex bg-black/40 p-0.5 rounded-xl border border-white/5 gap-0.5 overflow-x-auto no-scrollbar sticky top-[52px] z-20 backdrop-blur-md">
              {['All', 'Housing', 'Vehicle', 'Education', 'Luxury'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setLifestyleFilter(cat as any)}
                  className={`px-4 py-1.5 rounded-lg text-[7px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex-1 ${lifestyleFilter === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
                >
                  {cat}
                </button>
              ))}
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-2">
              {filteredLifestyle.map(item => {
                const isOwned = inventory.includes(item.id);
                const canAfford = cash >= item.price;
                const tierColorClass = getTierColor(item.price);
                const tierName = getTierName(item.price);

                return (
                  <div key={item.id} className={`bg-[#111114] border-2 rounded-2xl p-2 flex flex-col transition-all relative overflow-hidden group h-[140px] ${isOwned ? 'border-green-500/30 bg-green-500/5' : `${tierColorClass.split(' ')[0]} hover:border-blue-500/50`}`}>
                    <div className="flex justify-between items-start mb-1">
                       <span className={`text-[5px] font-black px-1 py-0.5 rounded bg-black/40 ${tierColorClass.split(' ')[1]}`}>{tierName}</span>
                       {isOwned && <span className="text-[6px] font-black text-green-500">OWNED</span>}
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                       <span className="text-3xl mb-1 group-hover:scale-125 transition-transform duration-500">{item.image}</span>
                       <h4 className="text-[8px] font-bold text-white uppercase truncate w-full px-1">{item.name}</h4>
                       <p className="text-[10px] font-sporty text-gray-400 mt-1 leading-none">{formatCurrency(item.price).split('.')[0]}</p>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-1.5">
                       <span className="text-[6px] font-black text-blue-400">+{item.reputationGain} REP</span>
                       <button 
                        onClick={() => !isOwned && canAfford && onBuyLifestyle(item)}
                        disabled={isOwned || !canAfford}
                        className={`px-3 py-1 rounded text-[6px] font-black uppercase transition-all ${
                          isOwned 
                          ? 'hidden' 
                          : canAfford 
                            ? 'bg-white text-black hover:bg-blue-600 hover:text-white shadow-lg active:scale-95' 
                            : 'bg-white/5 text-gray-700 cursor-not-allowed'
                        }`}
                       >
                         {canAfford ? 'BUY' : 'LOCKED'}
                       </button>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      )}
    </div>
  );
};

export default FinanceView;