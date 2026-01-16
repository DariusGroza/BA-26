import React from 'react';
import { sounds } from '../utils';

interface ExitConfirmModalProps {
  isVIP: boolean;
  onCancel: () => void;
  onExitWithoutSave: () => void;
  onSaveAndExit: (slot: number) => void;
}

const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({ isVIP, onCancel, onExitWithoutSave, onSaveAndExit }) => {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onCancel}></div>
      <div className="relative bg-[#0d0d0f] border-2 border-red-600/30 w-full max-w-md rounded-[2.5rem] shadow-[0_0_100px_rgba(220,38,38,0.2)] overflow-hidden flex flex-col animate-in zoom-in-95">
        
        {/* Warning Header */}
        <div className="bg-red-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-40"></div>
          <div className="relative z-10">
             <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 border border-white/20">⚠️</div>
             <h2 className="text-4xl font-sporty text-white leading-none uppercase tracking-widest">Wipe Alert</h2>
             <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.4em] mt-2">Volatile Memory Detected</p>
          </div>
          <div className="absolute -bottom-4 -right-4 text-9xl font-sporty text-black/10 pointer-events-none select-none">EXIT</div>
        </div>

        <div className="p-10 space-y-6">
           <div className="text-center space-y-4">
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                You are about to terminate the simulation session. Progress not synced to a <span className="text-white underline">Secure Save Slot</span> will be permanently erased.
              </p>
           </div>

           <div className="grid grid-cols-1 gap-3">
              {/* SAVE OPTIONS */}
              {isVIP ? (
                <>
                  <button 
                    onClick={() => { sounds.cash(); onSaveAndExit(1); }}
                    className="w-full bg-white text-black hover:bg-orange-600 hover:text-white transition-all font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center space-x-3 active:scale-95 shadow-xl"
                  >
                    <span>💾 Sync Slot-01 & Exit</span>
                  </button>
                  <button 
                    onClick={() => { sounds.cash(); onSaveAndExit(2); }}
                    className="w-full bg-white text-black hover:bg-purple-600 hover:text-white transition-all font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center space-x-3 active:scale-95 shadow-xl"
                  >
                    <span>💾 Sync Slot-02 & Exit</span>
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { sounds.cash(); onSaveAndExit(1); }}
                  className="w-full bg-white text-black hover:bg-orange-600 hover:text-white transition-all font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center space-x-3 active:scale-95 shadow-xl"
                >
                  <span>💾 Save to Slot-01 & Exit</span>
                </button>
              )}

              {/* DESTRUCTIVE OPTION */}
              <button 
                onClick={() => { sounds.buzzer(); onExitWithoutSave(); }}
                className="w-full bg-red-600/10 border border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white transition-all font-black py-4 rounded-2xl text-[9px] uppercase tracking-widest active:scale-95 mt-2"
              >
                Exit without saving (Lose Data)
              </button>

              <button 
                onClick={onCancel}
                className="w-full bg-white/5 text-gray-500 font-black py-3 rounded-2xl text-[8px] uppercase tracking-widest hover:text-white transition-colors"
              >
                Stay in Simulation
              </button>
           </div>
        </div>

        <div className="p-4 bg-black/40 text-center border-t border-white/5">
           <p className="text-[7px] text-gray-700 font-black uppercase tracking-[0.5em]">Morningstar Data Integrity protocol • 2026</p>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmModal;