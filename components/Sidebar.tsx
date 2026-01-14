
import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  isPremium: boolean;
  onExit: () => void;
  onSave: () => void;
  isSaving: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isPremium, onExit, onSave, isSaving }) => {
  const menuItems: { id: ViewType | 'EXIT'; label: string; icon: string }[] = [
    { id: 'DASHBOARD', label: 'Home', icon: '📊' },
    { id: 'PLAYERS', label: 'Pro', icon: '🏀' },
    { id: 'AGENCY', label: 'Agency', icon: '💼' },
    { id: 'ACADEMY', label: 'Academy', icon: '🎓' },
    { id: 'FINANCE', label: 'Finance', icon: '💰' },
    { id: 'EXIT', label: 'Exit', icon: '🏠' },
  ];

  const desktopItems: { id: ViewType; label: string; icon: string }[] = [
    { id: 'DASHBOARD', label: 'Home', icon: '📊' },
    { id: 'PLAYERS', label: 'Pro', icon: '🏀' },
    { id: 'AGENCY', label: 'Agency', icon: '💼' },
    { id: 'ACADEMY', label: 'Academy', icon: '🎓' },
    { id: 'FINANCE', label: 'Finance', icon: '💰' },
    { id: 'LEAGUE', label: 'League', icon: '🏆' },
    { id: 'SCHEDULE', label: 'Schedule', icon: '📅' },
    { id: 'TRAINING', label: 'Training', icon: '🏋️' },
    { id: 'DRAFT', label: 'The Draft', icon: '📜' },
    { id: 'LIFESTYLE', label: 'Life', icon: '🏠' },
  ];

  return (
    <>
      <div className="hidden md:flex w-64 bg-[#111114] border-r border-white/5 flex-col z-20">
        <div className="p-8">
          <h1 className="text-3xl font-sporty tracking-wider leading-none">
            <span className="text-orange-500">BASKETBALL</span> <span className="text-white block">AGENT 2026</span>
          </h1>
          <div className="flex items-center space-x-2 mt-3">
             <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">v1.0 Release</p>
             {isPremium && (
               <span className="bg-orange-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase shadow-lg shadow-orange-900/50">VIP</span>
             )}
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          {desktopItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center px-5 py-4 text-sm font-medium rounded-2xl transition-all duration-300 group ${
                currentView === item.id 
                  ? 'bg-orange-600 text-white shadow-xl shadow-orange-900/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <span className={`mr-4 text-xl transition-transform group-hover:scale-110 ${currentView === item.id ? 'opacity-100' : 'opacity-60'}`}>
                {item.icon}
              </span>
              <span className="tracking-[0.2em] uppercase text-[10px] font-black">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 mt-auto space-y-2">
           <button 
             onClick={onSave}
             disabled={isSaving}
             className={`w-full flex items-center justify-center space-x-3 py-3 rounded-xl transition-all border border-white/5 group ${isSaving ? 'bg-green-600/20 text-green-400 border-green-500/20' : 'bg-white/5 hover:bg-green-600/10 hover:text-green-500'}`}
           >
              <span className={`text-lg transition-all ${isSaving ? 'animate-bounce' : 'opacity-60 group-hover:opacity-100'}`}>{isSaving ? '💾' : '💾'}</span>
              <span className="text-[9px] font-black uppercase tracking-widest">{isSaving ? 'Syncing...' : 'Save Game'}</span>
           </button>
           <button 
             onClick={onExit}
             className="w-full flex items-center justify-center space-x-3 py-3 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white transition-all border border-red-500/20 group"
           >
              <span className="text-lg opacity-60 group-hover:opacity-100">🚪</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Quit Game</span>
           </button>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111114]/98 backdrop-blur-2xl border-t border-white/10 z-50 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <nav className="flex items-center justify-around h-20">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.id === 'EXIT' ? onExit() : setView(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${
                currentView === item.id ? 'text-orange-500 scale-110' : item.id === 'EXIT' ? 'text-red-500/60' : 'text-gray-500'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-[9px] font-black uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
