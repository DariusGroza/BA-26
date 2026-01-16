import React, { useState, useMemo } from 'react';
import { Player } from '../types';
import { formatCurrency, getSigningFee } from '../utils';

interface NegotiationModalProps {
  player: Player;
  onNegotiate: (playerId: string, commission: number, transferCommission: number) => void;
  onClose: () => void;
  managerName: string;
  agencyName: string;
}

const NegotiationModal: React.FC<NegotiationModalProps> = ({ player, onNegotiate, onClose, managerName, agencyName }) => {
  const [commission, setCommission] = useState(player.agentCommission || 0.03);
  const [transferComm, setTransferComm] = useState(player.transferCommission || 0.05);
  const [hasSigned, setHasSigned] = useState(false);

  const signingFee = useMemo(() => getSigningFee(player), [player]);

  const { totalScore, status, message, sentimentColor, sentimentWidth } = useMemo(() => {
    // HARDER DIFFICULTY ADJUSTMENT
    // Base sentiment lowered to 60. This implies you must offer good terms to pass.
    let score = 60; 
    
    // Commission penalty (BRUTAL): 
    // Standard is 3%. Asking for 4% (0.04) penalizes score by 15 points (0.01 * 1500).
    if (commission > 0.03) score -= (commission - 0.03) * 1500; 
    
    // Transfer fee penalty (Harder)
    if (transferComm > 0.05) score -= (transferComm - 0.05) * 800;
    
    // Relationship leverage (Reduced impact)
    const leverage = (player.loyalty / 100) * 15;
    score += leverage;

    score = Math.max(0, Math.min(100, score));
    
    let currentStatus = '😡';
    let currentMsg = 'Insulting offer.';
    let color = 'bg-red-500';

    if (score > 90) {
      currentStatus = '🤩';
      currentMsg = 'Dream partnership.';
      color = 'bg-emerald-500';
    } else if (score > 75) {
      currentStatus = '🤝';
      currentMsg = 'Acceptable terms.';
      color = 'bg-green-500';
    } else if (score > 50) {
      currentStatus = '🤨';
      currentMsg = 'Needs improvement.';
      color = 'bg-yellow-500';
    } else if (score > 30) {
      currentStatus = '😠';
      currentMsg = 'Greedy.';
      color = 'bg-orange-500';
    }

    return { 
      totalScore: score, 
      status: currentStatus, 
      message: currentMsg, 
      sentimentColor: color,
      sentimentWidth: score
    };
  }, [commission, transferComm, player]);

  const handleSign = () => {
    // Threshold is 50. With base 60, slight greed fails immediately.
    if (totalScore < 50) {
      alert(`${player.name} rejects the contract: "${message}" \n\n(Tip: 3% Agent Commission is standard. Anything higher requires high loyalty.)`);
      return;
    }
    setHasSigned(true);
    setTimeout(() => {
      onNegotiate(player.id, commission, transferComm);
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
                </div>
             </div>
             <div className="mt-3 pt-3 border-t border-zinc-200 flex justify-between items-center">
                <span className="text-[8px] font-black text-red-500 uppercase">Upfront Signing Bonus</span>
                <span className="text-sm font-bold text-zinc-950">
                  {signingFee === 0 ? (
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[8px] tracking-widest">ACADEMY WAIVER</span>
                  ) : formatCurrency(signingFee)}
                </span>
             </div>
          </div>

          <div className="space-y-6 py-2 relative z-10">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end px-1">
                   <label className="text-[9px] font-black uppercase text-zinc-600">I. Commission %</label>
                   <span className="text-sm font-bold text-zinc-950">{(commission * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0.01" max="0.10" step="0.01" 
                  value={commission} onChange={(e) => setCommission(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 rounded-full accent-zinc-900 appearance-none cursor-pointer"
                />
                <p className="text-[8px] text-zinc-400">Standard: 3%</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end px-1">
                   <label className="text-[9px] font-black uppercase text-zinc-600">II. Move/Trans. %</label>
                   <span className="text-sm font-bold text-zinc-950">{(transferComm * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0.01" max="0.10" step="0.01" 
                  value={transferComm} onChange={(e) => setTransferComm(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 rounded-full accent-zinc-900 appearance-none cursor-pointer"
                />
                <p className="text-[8px] text-zinc-400">Standard: 5%</p>
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
                  className={`flex-[2] py-4 font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 rounded ${totalScore >= 50 ? 'bg-zinc-900 text-white hover:bg-black shadow-zinc-900/20' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
                >
                  <span>
                    {totalScore < 50 ? 'Terms Rejected' : (signingFee === 0 ? 'Sign Contract' : 'Sign & Pay Bonus')}
                  </span>
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegotiationModal;