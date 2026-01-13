
import React, { useState, useMemo } from 'react';
import { Player } from '../types';
import { formatCurrency } from '../utils';

interface NegotiationModalProps {
  player: Player;
  onNegotiate: (playerId: string, retainer: number, commission: number, transferCommission: number) => void;
  onClose: () => void;
  managerName: string;
  agencyName: string;
}

const NegotiationModal: React.FC<NegotiationModalProps> = ({ player, onNegotiate, onClose, managerName, agencyName }) => {
  const [commission, setCommission] = useState(player.agentCommission || 0.04);
  const [transferComm, setTransferComm] = useState(player.transferCommission || 0.05);
  const [retainer, setRetainer] = useState(player.agentRetainer || 500);
  const [hasSigned, setHasSigned] = useState(false);

  const { totalScore, status, message, sentimentColor, sentimentWidth, totalWeeklyCost } = useMemo(() => {
    const weeklySalary = (player.salary / 52);
    
    // Total cost calculation
    const weeklyCommVal = weeklySalary * commission;
    const totalWeeklyCost = weeklyCommVal + retainer;
    
    // Burden ratio: What % of their paycheck goes to the agent?
    const burdenRatio = totalWeeklyCost / weeklySalary;
    
    // Base sentiment starts high
    let score = 90;
    
    // Penalty for high burden (Over 15% is considered extreme)
    if (burdenRatio > 0.08) score -= (burdenRatio - 0.08) * 450;
    
    // Transfer fee penalty (greedy future outlook)
    if (transferComm > 0.08) score -= (transferComm - 0.08) * 200;
    
    // Leverage based on existing relationship
    const leverage = (player.loyalty / 100) * 30;
    score += leverage;

    score = Math.max(0, Math.min(100, score));
    
    let currentStatus = '😡';
    let currentMsg = 'Predatory terms.';
    let color = 'bg-red-500';

    if (score > 85) {
      currentStatus = '🤩';
      currentMsg = 'Perfect agreement.';
      color = 'bg-emerald-500';
    } else if (score > 65) {
      currentStatus = '🤝';
      currentMsg = 'Fair deal.';
      color = 'bg-green-500';
    } else if (score > 45) {
      currentStatus = '🤨';
      currentMsg = 'Hesitant.';
      color = 'bg-yellow-500';
    } else if (score > 25) {
      currentStatus = '😠';
      currentMsg = 'Greedy offer.';
      color = 'bg-orange-500';
    }

    return { 
      totalScore: score, 
      status: currentStatus, 
      message: currentMsg, 
      sentimentColor: color,
      sentimentWidth: score,
      totalWeeklyCost
    };
  }, [retainer, commission, transferComm, player]);

  const handleSign = () => {
    if (totalScore < 35) {
      alert(`${player.name} refuses to sign: "${message}"`);
      return;
    }
    setHasSigned(true);
    setTimeout(() => {
      onNegotiate(player.id, retainer, commission, transferComm);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/98 backdrop-blur-md" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-lg bg-[#fdfaf5] shadow-[0_20px_80px_rgba(0,0,0,1)] rounded-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 transition-all duration-500 ${hasSigned ? 'scale-105 opacity-0 -translate-y-10' : ''}`}>
        
        <div className="bg-zinc-900 px-6 py-3 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-xl">📜</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{agencyName} EXEC</span>
          </div>
          <div className="flex items-center space-x-1.5">
             <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
             <span className="text-[8px] font-black uppercase opacity-60">Confidential</span>
          </div>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto no-scrollbar space-y-6 text-zinc-900 relative">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

          <div className="flex items-start justify-between border-b-2 border-zinc-200 pb-4 relative z-10">
             <div className="min-w-0 flex-1">
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Lead Representative</p>
                <p className="text-sm font-bold text-zinc-950 uppercase truncate leading-none mb-4">{managerName}</p>
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Contractor</p>
                <p className="text-sm font-bold text-zinc-950 uppercase truncate leading-none">{player.name}</p>
             </div>
             <div className="w-14 h-14 bg-zinc-200/50 rounded-xl flex items-center justify-center text-4xl shadow-inner shrink-0 rotate-3 border border-zinc-300">
                {player.face}
             </div>
          </div>

          <div className="bg-zinc-100/80 p-4 rounded-xl border border-zinc-200 relative z-10">
             <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Athlete Sentiment</span>
                <span className="text-[9px] font-bold text-zinc-900 uppercase">{message}</span>
             </div>
             <div className="flex items-center space-x-3">
                <span className="text-2xl shrink-0">{status}</span>
                <div className="flex-1">
                   <div className="h-2 bg-zinc-300 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${sentimentColor}`} 
                        style={{ width: `${sentimentWidth}%` }}
                      ></div>
                   </div>
                   <div className="flex justify-between mt-1 px-0.5">
                      <span className="text-[7px] font-black text-zinc-400 uppercase">Resentment</span>
                      <span className="text-[7px] font-black text-zinc-400 uppercase">Agreement</span>
                   </div>
                </div>
             </div>
             <div className="mt-3 pt-3 border-t border-zinc-200 flex justify-between items-center">
                <span className="text-[8px] font-black text-zinc-500 uppercase">Estimated Weekly Agency Cost</span>
                <span className="text-[10px] font-bold text-zinc-950">{formatCurrency(totalWeeklyCost).split('.')[0]}</span>
             </div>
          </div>

          <div className="space-y-6 py-2 relative z-10">
            <div className="space-y-2">
              <div className="flex justify-between items-end px-1">
                 <label className="text-[9px] font-black uppercase text-zinc-600">I. Flat Weekly Retainer</label>
                 <span className="text-base font-bold text-zinc-950">{formatCurrency(retainer)}</span>
              </div>
              <input 
                type="range" min="0" max="15000" step="100" 
                value={retainer} onChange={(e) => setRetainer(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 rounded-full accent-zinc-900 appearance-none cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end px-1">
                   <label className="text-[9px] font-black uppercase text-zinc-600">II. Commission %</label>
                   <span className="text-sm font-bold text-zinc-950">{(commission * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0.01" max="0.12" step="0.01" 
                  value={commission} onChange={(e) => setCommission(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 rounded-full accent-zinc-900 appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end px-1">
                   <label className="text-[9px] font-black uppercase text-zinc-600">III. Move/Trans. %</label>
                   <span className="text-sm font-bold text-zinc-950">{(transferComm * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0.01" max="0.15" step="0.01" 
                  value={transferComm} onChange={(e) => setTransferComm(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 rounded-full accent-zinc-900 appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t-2 border-zinc-200 space-y-3 relative z-10">
             <div className="flex items-center space-x-2 justify-center mb-4">
                <div className="w-12 h-px bg-zinc-200"></div>
                <span className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.4em]">Binding Signature</span>
                <div className="w-12 h-px bg-zinc-200"></div>
             </div>
             
             <div className="flex gap-3">
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 border border-zinc-300 text-zinc-500 font-black text-[9px] uppercase tracking-widest hover:bg-zinc-100 transition-all rounded"
                >
                  Withdraw
                </button>
                <button 
                  onClick={handleSign}
                  className={`flex-[2] py-4 font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 rounded ${totalScore >= 35 ? 'bg-zinc-900 text-white hover:bg-black shadow-zinc-900/20' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
                >
                  <span>{totalScore >= 35 ? 'Authorize & Execute' : 'Rejected Terms'}</span>
                </button>
             </div>
          </div>

          <div className="text-[6px] text-zinc-400 uppercase leading-tight text-center font-sans px-8 pt-2">
            Standard Agency Agreement #2026-N. By signing, the Athlete acknowledges high fees reduce morale and long-term agency stability.
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegotiationModal;
