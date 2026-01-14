
import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(onClose, 10000);
    const interval = setInterval(() => {
      setProgress(prev => Math.max(0, prev - (100 / 100))); // roughly 100 steps over 10s
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-[300] animate-in slide-in-from-right-12 duration-500">
      <div className="relative w-80 bg-black/90 backdrop-blur-xl border border-yellow-500/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-4 py-2 flex justify-between items-center">
           <div className="flex items-center space-x-2">
              <span className="text-lg">🏆</span>
              <span className="text-[8px] font-black text-white uppercase tracking-widest">Milestone Achieved</span>
           </div>
           <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">✕</button>
        </div>

        {/* Content */}
        <div className="p-5 flex items-center space-x-5">
           <div className="w-14 h-14 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center text-4xl shadow-inner">
             {achievement.icon}
           </div>
           <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white uppercase truncate tracking-tight">{achievement.title}</h4>
              <p className="text-[10px] text-gray-400 leading-tight mt-1">{achievement.description}</p>
           </div>
        </div>

        {/* Progress Bar (Timer) */}
        <div className="h-1 bg-white/5 w-full">
           <div 
             className="h-full bg-yellow-500 transition-all duration-100 ease-linear" 
             style={{ width: `${progress}%` }}
           ></div>
        </div>
      </div>
    </div>
  );
};

export default AchievementToast;
