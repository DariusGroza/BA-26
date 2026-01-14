
import React from 'react';
import { GameState, Player, Team } from '../types';
import { formatCurrency } from '../utils';
import { WEEKLY_EXPENSES } from '../constants';

interface FinanceBreakdownModalProps {
  gameState: GameState;
  players: Player[];
  teams: Team[];
  onClose: () => void;
}

const FinanceBreakdownModal: React.FC<FinanceBreakdownModalProps> = ({ gameState, players, teams, onClose }) => {
  // INCOME CALCS
  const commissions = players.filter(p => p.isClient && !p.isRetired).reduce((acc, p) => {
    return acc + ((p.salary / 52) * (p.agentCommission || 0.04));
  }, 0);
  
  const investmentYield = teams.reduce((acc, t) => acc + (t.weeklyRevenue * (t.userShares / 100) * 0.05), 0);
  const totalIncome = commissions + investmentYield;

  // EXPENSE CALCS
  const baseExpenses = WEEKLY_EXPENSES;
  const officeRent = gameState.officeLevel * 12000;
  const itemUpkeep = gameState.officeItems.length * 3500;
  const loanInterest = gameState.loans.reduce((acc, l) => acc + (l.balance * (l.weeklyInterest / 100)), 0);
  
  const totalExpenses = baseExpenses + officeRent + itemUpkeep + loanInterest;
  const netFlow = totalIncome - totalExpenses;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative bg-[#0d0d0f] border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        
        <div className="p-6 bg-white/5 border-b border-white/5 flex justify-between items-center">
           <div>
              <p className="text-[8px] font-black text-orange-500 uppercase tracking-[0.4em] mb-1">Financial Audit</p>
              <h2 className="text-2xl font-sporty text-white uppercase tracking-wider">Weekly Ledger</h2>
           </div>
           <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto no-scrollbar relative">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center text-8xl font-sporty text-white rotate-12 select-none">AUDIT</div>

           {/* INCOME SECTION */}
           <section className="space-y-2 relative z-10">
              <div className="flex justify-between items-center border-b border-white/5 pb-1">
                 <h3 className="text-[10px] font-black text-green-500 uppercase tracking-widest">Revenue Streams</h3>
                 <span className="text-[8px] text-gray-500 font-bold uppercase">Estimated / Week</span>
              </div>
              <div className="space-y-1.5 pt-1">
                 <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Player Commissions</span>
                    <span className="text-white font-mono">{formatCurrency(commissions)}</span>
                 </div>
                 <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Investment Dividends</span>
                    <span className="text-white font-mono">{formatCurrency(investmentYield)}</span>
                 </div>
                 <div className="flex justify-between text-[11px] pt-1 border-t border-white/5 font-bold">
                    <span className="text-green-500 uppercase text-[9px]">Total Weekly Income</span>
                    <span className="text-green-500 font-mono">{formatCurrency(totalIncome)}</span>
                 </div>
              </div>
           </section>

           {/* EXPENSE SECTION */}
           <section className="space-y-2 relative z-10">
              <div className="flex justify-between items-center border-b border-white/5 pb-1">
                 <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest">Operational Burn</h3>
                 <span className="text-[8px] text-gray-500 font-bold uppercase">Estimated / Week</span>
              </div>
              <div className="space-y-1.5 pt-1">
                 <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Base Burn Rate</span>
                    <span className="text-white font-mono">({formatCurrency(baseExpenses)})</span>
                 </div>
                 <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">HQ Maintenance (LVL {gameState.officeLevel})</span>
                    <span className="text-white font-mono">({formatCurrency(officeRent)})</span>
                 </div>
                 <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Status Item Upkeep ({gameState.officeItems.length})</span>
                    <span className="text-white font-mono">({formatCurrency(itemUpkeep)})</span>
                 </div>
                 {loanInterest > 0 && (
                   <div className="flex justify-between text-[11px] text-red-400/80">
                      <span>Loan Debt Interest</span>
                      <span className="font-mono">({formatCurrency(loanInterest)})</span>
                   </div>
                 )}
                 <div className="flex justify-between text-[11px] pt-1 border-t border-white/5 font-bold">
                    <span className="text-red-500 uppercase text-[9px]">Total Weekly Burn</span>
                    <span className="text-red-500 font-mono">({formatCurrency(totalExpenses)})</span>
                 </div>
              </div>
           </section>

           {/* SUMMARY BLOCK */}
           <div className={`mt-4 p-4 rounded-2xl border flex justify-between items-center relative z-10 ${netFlow >= 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <div>
                 <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Net Weekly Flow</p>
                 <p className={`text-xl font-sporty ${netFlow >= 0 ? 'text-green-500' : 'text-red-500 animate-pulse'}`}>
                    {netFlow >= 0 ? '+' : ''}{formatCurrency(netFlow)}
                 </p>
              </div>
              <div className="text-right">
                 <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Agency Balance</p>
                 <p className="text-xl font-sporty text-white">{formatCurrency(gameState.cash)}</p>
              </div>
           </div>
        </div>

        <div className="p-4 bg-black/40 text-center border-t border-white/5">
           <p className="text-[7px] text-gray-600 font-black uppercase tracking-[0.6em]">Secure Transaction Ledger • 2026</p>
        </div>
      </div>
    </div>
  );
};

export default FinanceBreakdownModal;
