
import React from 'react';
import { GameState, ViewType } from '../types';
import { formatCurrency } from '../utils';

interface HeaderProps {
  gameState: GameState;
  onNextWeek: () => void;
  onViewChange: (view: ViewType) => void;
  onExit: () => void;
  onSave: () => void;
  isSaving: boolean;
  onShowFinance: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const Header: React.FC<HeaderProps> = ({ gameState, onNextWeek, onViewChange, onExit, onSave, isSaving, onShowFinance, isMuted, onToggleMute }) => {
  const isTransferSeason = gameState.week >= 48 || gameState.week <= 4;
  
  return (
    <header className="bg-[#111114]/90 backdrop-blur-md border-b border-white/5 px-4 md:px-6 py-3 z-40 sticky top-0 pt-safe">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-orange-600 to-orange-400 w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-orange-900/20">
              🏀
            </div>
            <div>
              <h1 className="text-sm font-black text-white leading-none flex items-center">
                {gameState.managerName}
                <span className="mx-2 text-gray-700 font-normal">|</span>
                <span className="text-orange-500">{gameState.agencyName}</span>
                {gameState.isPremium && (
                  <span className="ml-2 bg-orange-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase shadow-lg animate-pulse">VIP</span>
                )}
              </h1>
              <div className="flex items-center mt-1 space-x-3">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">REP: <span className="text-blue-400">{gameState.reputation}</span></span>
                <button 
                  onClick={onShowFinance}
                  className="text-[9px] font-black text-gray-500 uppercase tracking-widest group hover:text-white transition-colors"
                >
                  CASH: <span className="text-green-500 group-hover:underline">{formatCurrency(gameState.cash)}</span>
                </button>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">TP: <span className="text-purple-400">{gameState.trainingPoints}</span></span>
              </div>
            </div>
          </div>
          {/* Mobile Utility Buttons */}
          <div className="flex items-center space-x-2 md:hidden">
            <button 
              onClick={onToggleMute}
              className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-500"
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            <button 
              onClick={onSave}
              disabled={isSaving}
              className={`w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 active:bg-white/10 ${isSaving ? 'text-green-500 animate-pulse' : ''}`}
            >
              {isSaving ? '✅' : '💾'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end md:space-x-4 flex-1">
          <div className="flex space-x-4 items-center">
            <button 
              onClick={onToggleMute}
              className="hidden md:flex w-10 h-10 rounded-xl bg-white/5 border border-white/5 items-center justify-center text-gray-400 hover:text-white transition-all"
            >
              {isMuted ? '🔇' : '🔊'}
            </button>

            <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <div className="flex flex-col items-start group transition-all">
                <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest group-hover:text-orange-500">AGENCY STATUS</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs md:text-sm font-bold flex items-center ${gameState.isPremium ? 'text-orange-500' : 'text-gray-300'}`}>
                    {gameState.isPremium ? '★ ELITE' : 'STANDARD'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => onViewChange('STORE')}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white text-[8px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-widest transition-all shadow-lg shadow-orange-900/40 animate-pulse"
              >
                UPGRADE
              </button>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">WEEK</span>
              <span className="text-sm font-bold text-white">{gameState.week}<span className="text-[10px] text-gray-600">/52</span></span>
            </div>
          </div>

          <button 
            onClick={onNextWeek}
            className="bg-orange-600 hover:bg-orange-500 text-white font-black text-[10px] py-2 md:py-3 px-6 rounded-xl transition-all shadow-lg active:scale-95 flex items-center uppercase tracking-widest"
          >
            NEXT WEEK
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
