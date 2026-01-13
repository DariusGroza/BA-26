
import React from 'react';

interface BankruptcyModalProps {
  onBailout: () => void;
  onRestart: () => void;
}

const BankruptcyModal: React.FC<BankruptcyModalProps> = ({ onBailout, onRestart }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="max-w-md w-full space-y-10">
        <div className="relative">
          <div className="w-32 h-32 bg-red-600/20 border border-red-500/50 rounded-full flex items-center justify-center text-6xl mx-auto mb-8 animate-pulse shadow-[0_0_50px_rgba(239,68,68,0.3)]">
            📉
          </div>
          <h1 className="text-6xl font-sporty text-red-500 uppercase tracking-tighter leading-none mb-4">Agency Bankrupt</h1>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">Solvency Protocol Initiated</p>
        </div>

        <div className="bg-red-600/5 border border-red-500/20 p-8 rounded-[2.5rem] space-y-6">
           <p className="text-gray-400 text-sm leading-relaxed font-medium px-4">
             The league has frozen your assets. With cash reserves below <span className="text-white">-$200,000</span>, your management license is now invalid.
           </p>
           
           <div className="space-y-4 pt-4">
              <button 
                onClick={onBailout}
                className="w-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-white font-black py-5 rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(234,179,8,0.3)] hover:scale-[1.02] transition-all group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                Emergency Equity Bailout
                <span className="block text-[8px] opacity-80 mt-1 tracking-widest">Reset Cash to $1,000,000 • Lose 20 Reputation</span>
              </button>

              <button 
                onClick={onRestart}
                className="w-full bg-white/5 text-gray-400 font-black py-4 rounded-2xl text-[9px] uppercase tracking-widest border border-white/5 hover:bg-white/10 hover:text-white transition-all"
              >
                Liquidate Portfolio & Retire
              </button>
           </div>
        </div>

        <p className="text-[7px] text-gray-700 font-black uppercase tracking-[0.5em]">Morningstar Financial Recovery Bureau • 2026</p>
      </div>
    </div>
  );
};

export default BankruptcyModal;
