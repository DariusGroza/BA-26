
import React from 'react';
import { GameNotification } from '../types';

interface BreakingNewsOverlayProps {
  news: GameNotification;
  onClose: () => void;
}

const BreakingNewsOverlay: React.FC<BreakingNewsOverlayProps> = ({ news, onClose }) => {
  return (
    <div className="fixed inset-0 z-[250] flex items-end justify-center pb-20 px-4 animate-in fade-in slide-in-from-bottom-12 duration-500">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl bg-black border-2 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.4)] overflow-hidden">
        
        {/* Ticker Tape Animation Effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
        
        <div className="flex flex-col md:flex-row items-stretch">
           {/* Header / Brand */}
           <div className="bg-red-600 p-4 md:p-8 flex flex-col justify-center items-center md:items-start shrink-0 relative">
              <div className="absolute top-2 left-2 bg-white text-red-600 px-1.5 py-0.5 rounded text-[8px] font-black uppercase animate-pulse">LIVE</div>
              <h2 className="text-3xl md:text-5xl font-sporty text-white leading-none tracking-tighter">BREAKING</h2>
              <h2 className="text-3xl md:text-5xl font-sporty text-black leading-none tracking-tighter -mt-1">NEWS</h2>
           </div>

           {/* Content */}
           <div className="flex-1 p-6 md:p-10 flex flex-col justify-center bg-zinc-900 relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl font-sporty pointer-events-none uppercase italic">Urgent</div>
              <h3 className="text-lg md:text-2xl font-black text-white uppercase tracking-tight mb-2 line-clamp-1">{news.title}</h3>
              <p className="text-sm md:text-xl text-gray-300 font-medium leading-tight">{news.message}</p>
              
              <div className="mt-4 flex items-center space-x-4 border-t border-white/5 pt-4">
                 <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Morningstar Sports Network</p>
                 <div className="h-px flex-1 bg-white/10"></div>
                 <button 
                  onClick={onClose}
                  className="bg-white text-black px-6 py-2 rounded text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all active:scale-95"
                 >
                   Acknowledge
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsOverlay;
