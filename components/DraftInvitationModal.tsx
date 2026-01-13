
import React from 'react';

interface DraftInvitationModalProps {
  onAttend: () => void;
  onSimulate: () => void;
}

const DraftInvitationModal: React.FC<DraftInvitationModalProps> = ({ onAttend, onSimulate }) => {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl"></div>
      
      <div className="relative bg-[#111114] border border-orange-500/30 w-full max-w-xl rounded-[3rem] shadow-[0_0_100px_rgba(249,115,22,0.2)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="bg-orange-600 p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
          <p className="text-[12px] font-black text-white/80 uppercase tracking-[0.5em] mb-3 relative z-10">Live Event</p>
          <h2 className="text-7xl font-sporty text-white leading-none uppercase tracking-tighter relative z-10">Draft Night</h2>
          <div className="absolute -bottom-8 -right-8 text-[12rem] font-sporty text-black/10 pointer-events-none select-none">2026</div>
        </div>

        <div className="p-10 space-y-8">
           <div className="text-center space-y-4">
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                The lights are bright at the <span className="text-white">Global Arena</span>. Your university prospects have arrived, suited up, and are ready to hear their names called. 
              </p>
              <div className="flex items-center justify-center space-x-4 pt-2">
                 <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <p className="text-[8px] text-gray-500 font-black uppercase">Prospects</p>
                    <p className="text-xl font-sporty text-orange-500">60</p>
                 </div>
                 <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <p className="text-[8px] text-gray-500 font-black uppercase">Rounds</p>
                    <p className="text-xl font-sporty text-blue-400">2</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={onAttend}
                className="group w-full bg-white text-black hover:bg-orange-600 hover:text-white transition-all font-black py-6 rounded-2xl text-[11px] uppercase tracking-[0.3em] shadow-xl flex items-center justify-center space-x-3 active:scale-95"
              >
                <span>Attend Draft Room</span>
                <span className="text-xl group-hover:translate-x-1 transition-transform">➡️</span>
              </button>

              <button 
                onClick={onSimulate}
                className="w-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all font-black py-5 rounded-2xl text-[9px] uppercase tracking-widest active:scale-95"
              >
                Simulate Entire Draft Instantly
              </button>
           </div>
        </div>

        <div className="p-6 bg-black/40 text-center border-t border-white/5">
           <p className="text-[7px] text-gray-700 font-black uppercase tracking-[0.5em]">Exclusive Coverage • Morningstar Sports Network</p>
        </div>
      </div>
    </div>
  );
};

export default DraftInvitationModal;
