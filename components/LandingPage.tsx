
import React, { useState } from 'react';

interface LandingPageProps {
  onStartNew: (managerName: string, agencyName: string, slot: number) => void;
  onLoadSave: (slot: number) => void;
  onConnectGoogle: () => void;
  onPurchasePremium: () => void;
  isPremium: boolean;
  saveSlots: { [key: number]: boolean };
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartNew, onLoadSave, onConnectGoogle, onPurchasePremium, isPremium, saveSlots }) => {
  const [managerName, setManagerName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [showNewGame, setShowNewGame] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(1);

  const handleStart = () => {
    if (!managerName || !agencyName) {
      alert("Registration incomplete.");
      return;
    }
    onStartNew(managerName, agencyName, selectedSlot);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0c] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-md w-full animate-in fade-in zoom-in duration-700">
        {!showNewGame && !showStore && !showTutorial ? (
          <>
            <div className="mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-400 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-2xl mb-6 shadow-orange-900/30">
                🏀
              </div>
              <h1 className="text-5xl font-sporty tracking-tighter text-white mb-2 leading-none uppercase">Basketball <span className="text-orange-500 text-6xl block mt-1">Agent 2026</span></h1>
              <p className="text-xs font-black tracking-[0.4em] text-gray-500 uppercase">Pro Management Series</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => setShowNewGame(true)}
                className="w-full bg-white text-black font-black py-4 rounded-2xl text-sm uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl"
              >
                New Agency
              </button>

              <button 
                onClick={() => setShowTutorial(true)}
                className="w-full bg-white/5 border border-white/10 text-white font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                How to Play • Tutorial
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => onLoadSave(1)}
                  disabled={!saveSlots[1]}
                  className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${saveSlots[1] ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'border-white/5 text-gray-700 cursor-not-allowed'}`}
                >
                  Load Slot 1
                </button>
                <button 
                  onClick={() => isPremium ? (saveSlots[2] ? onLoadSave(2) : setShowNewGame(true)) : setShowStore(true)}
                  className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${saveSlots[2] ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'border-white/5 text-gray-700 hover:text-orange-500/50'}`}
                >
                  {saveSlots[2] ? 'Load Slot 2' : (isPremium ? 'Empty Slot 2' : 'Unlock Slot 2')}
                </button>
              </div>

              <button 
                onClick={() => setShowStore(true)}
                className="w-full bg-orange-600/10 border border-orange-500/20 text-orange-500 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-orange-600/20 transition-all"
              >
                {isPremium ? '★ VIP Status Active' : 'Get VIP Agent Pass'}
              </button>
            </div>
          </>
        ) : showTutorial ? (
          <div className="bg-[#111114] p-8 rounded-[3rem] border border-blue-500/20 shadow-2xl animate-in zoom-in-95 max-h-[85vh] overflow-y-auto no-scrollbar text-left">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-sporty text-white tracking-widest uppercase">Agent Manual</h2>
                <button onClick={() => setShowTutorial(false)} className="text-gray-600 hover:text-white">✕</button>
             </div>
             
             <div className="space-y-6">
                <section>
                   <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 font-sans">#01. EMPIRE CORE</p>
                   <p className="text-xs text-gray-400 leading-relaxed font-medium">In 2026, agents don't just sign players; they own the game. Use the <span className="text-white">Pro Market</span> to build a roster of superstars. High <span className="text-blue-400 font-bold uppercase">Reputation</span> is your currency—it unlocks access to the league's elite tier and generational icons.</p>
                </section>

                <section>
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 font-sans">#02. NCAB YVI ACADEMY</p>
                   <p className="text-xs text-gray-400 leading-relaxed font-medium">The <span className="text-white font-bold">NCAB YVI League</span> is your scouting ground. Deploy expert scouts to reveal hidden potential in young prospects. Representing athletes early builds lifetime <span className="text-green-400 font-bold uppercase">Loyalty</span>, ensuring they stay in your stable through the Week 52 Draft.</p>
                </section>

                <section>
                   <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-2 font-sans">#03. MAJORITY TAKEOVERS</p>
                   <p className="text-xs text-gray-400 leading-relaxed font-medium">Accumulate capital through commissions and invest it into team shares. At <span className="text-white font-bold uppercase tracking-widest">51% Equity</span>, you assume Majority Control. Once in power, you can fire Head Coaches, upgrade Arena facilities, and dictate the franchise's medical strategy.</p>
                </section>

                <section>
                   <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2 font-sans">#04. FINANCIAL GRID</p>
                   <p className="text-xs text-gray-400 leading-relaxed font-medium">Monitor <span className="text-white font-bold">Market Trends</span> (Bullish/Bearish) to time your share purchases. Beware of annual <span className="text-red-400 font-bold uppercase tracking-widest animate-pulse">Inflation</span> spikes. If your cash falls below -$200k, you face insolvency—liquidation is the only exit.</p>
                </section>

                <section>
                   <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-2 font-sans">#05. STATUS & LIFESTYLE</p>
                   <p className="text-xs text-gray-400 leading-relaxed font-medium">Convert commission into status by acquiring luxury assets—from Malibu Villas to private Mars colonies. High status increases your <span className="text-blue-400 font-bold">HQ Capacity</span>, allowing you to manage a massive global network of up to 1,000 clients.</p>
                </section>
             </div>

             <button 
                onClick={() => setShowTutorial(false)}
                className="w-full mt-8 bg-white text-black font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl"
              >
                Access Agency Console
              </button>
          </div>
        ) : showStore ? (
          <div className="bg-[#111114] p-8 rounded-[3rem] border border-orange-500/30 shadow-[0_0_50px_rgba(249,115,22,0.15)] animate-in zoom-in-95">
             <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">💎</div>
             <h2 className="text-3xl font-sporty text-white mb-2 tracking-widest uppercase">VIP Agent Pass</h2>
             <p className="text-[10px] text-gray-500 font-bold uppercase mb-8 tracking-widest">Upgrade to the Elite tier</p>
             
             <ul className="text-left space-y-4 mb-8">
                {[
                  { t: 'Remove All Ads', d: 'Focus purely on management with instant rewards.' },
                  { t: '2x Scouting Speed', d: 'Uncover talent twice as fast.' },
                  { t: 'Extra Save Slot', d: 'Access Slot 2 for an additional career.' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3">
                     <span className="text-orange-500 mt-1">✦</span>
                     <div>
                        <p className="text-xs font-black text-white uppercase">{item.t}</p>
                        <p className="text-[9px] text-gray-500 font-bold">{item.d}</p>
                     </div>
                  </li>
                ))}
             </ul>

             {isPremium ? (
               <button onClick={() => setShowStore(false)} className="w-full bg-green-500 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest">Active License</button>
             ) : (
               <div className="space-y-3">
                 <button onClick={onPurchasePremium} className="w-full bg-white text-black font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">Unlock All for $4.99</button>
                 <button onClick={() => setShowStore(false)} className="w-full text-gray-600 font-black py-2 text-[10px] uppercase tracking-widest">Not Now</button>
               </div>
             )}
          </div>
        ) : (
          <div className="bg-[#111114] p-8 rounded-[3rem] border border-white/5 shadow-2xl animate-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-sporty text-white mb-6 tracking-wider uppercase">New Agency Setup</h2>
            <div className="space-y-6">
              <div className="text-left">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Manager Identity</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" placeholder="Name" value={managerName} onChange={(e) => setManagerName(e.target.value)} />
              </div>
              <div className="text-left">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Agency Brand</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" placeholder="Agency Name" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} />
              </div>
              
              <div className="text-left">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Save Slot</label>
                 <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setSelectedSlot(1)} className={`py-2 rounded-lg text-[10px] font-black border uppercase ${selectedSlot === 1 ? 'border-orange-500 bg-orange-600/10 text-white' : 'border-white/5 text-gray-600'}`}>Slot 1</button>
                    <button onClick={() => isPremium ? setSelectedSlot(2) : setShowStore(true)} className={`py-2 rounded-lg text-[10px] font-black border uppercase ${selectedSlot === 2 ? 'border-orange-500 bg-orange-600/10 text-white' : 'border-white/5 text-gray-600'}`}>
                      {isPremium ? 'Slot 2' : 'Slot 2 (VIP)'}
                    </button>
                 </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button onClick={() => setShowNewGame(false)} className="flex-1 bg-white/5 text-white font-bold py-4 rounded-2xl text-[10px] uppercase">Cancel</button>
                <button onClick={handleStart} className="flex-1 bg-orange-600 text-white font-bold py-4 rounded-2xl text-[10px] uppercase">Establish</button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-white/5">
           <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">
             Basketball Agent 2026 • Morningstar090
           </p>
           <p className="text-[8px] text-gray-700 font-bold uppercase tracking-widest mt-1 italic">
             This game is a fictional simulation.
           </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
