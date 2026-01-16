
import React, { useEffect } from 'react';

interface SaveSuccessModalProps {
  onClose: () => void;
}

const SaveSuccessModal: React.FC<SaveSuccessModalProps> = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000); // Auto close after 2 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#111114] border border-green-500/30 px-10 py-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(34,197,94,0.15)] flex flex-col items-center animate-in zoom-in-95 scale-100">
        <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center text-4xl mb-6 border border-green-500/20 shadow-inner animate-pulse">
          💾
        </div>
        <h3 className="text-2xl font-sporty text-white uppercase tracking-wider mb-1">System Synced</h3>
        <p className="text-[9px] font-black text-green-500 uppercase tracking-[0.3em]">Data Securely Encrypted</p>
        
        <div className="mt-6 flex items-center space-x-2">
           <div className="h-1 w-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
           <div className="h-1 w-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
           <div className="h-1 w-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SaveSuccessModal;
