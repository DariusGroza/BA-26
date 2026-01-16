import React, { useState } from 'react';
import { sounds } from '../utils';
import { ACHIEVEMENTS } from '../constants';

interface LandingPageProps {
  onStartNew: (managerName: string, agencyName: string, slot: number) => void;
  onLoadSave: (slot: number) => void;
  onConnectGoogle: () => void;
  onPurchasePremium: () => void;
  isPremium: boolean;
  saveSlots: { [key: number]: boolean };
  isMuted: boolean;
  onToggleMute: () => void;
  volume: number;
  onVolumeChange: (v: number) => void;
  unlockedAchievements?: string[];
}

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: string;
  icon: string;
  benefit: {
    type: 'CASH' | 'REPUTATION' | 'TP' | 'INFLUENCE' | 'VIP';
    amount: number | string;
  };
}

const STORE_ITEMS: StoreItem[] = [
  {
    id: 'grant_1',
    name: 'Small Grant',
    description: 'Quick liquidity for immediate operations.',
    price: '$0.99',
    icon: '💵',
    benefit: { type: 'CASH', amount: 100000 },
  },
  {
    id: 'grant_2',
    name: 'Empire Capital',
    description: 'Massive funding for franchise stakes.',
    price: '$4.99',
    icon: '💰',
    benefit: { type: 'CASH', amount: 1000000 },
  },
  {
    id: 'pr_2',
    name: 'Global PR Agency',
    description: 'Elite standing to sign top-tier icons.',
    price: '$5.99',
    icon: '🌍',
    benefit: { type: 'REPUTATION', amount: 200 },
  },
  {
    id: 'dev_2',
    name: 'Pro Tech Lab',
    description: 'Advanced training boost for all clients.',
    price: '$9.99',
    icon: '🧬',
    benefit: { type: 'TP', amount: 500 },
  }
];

const LandingPage: React.FC<LandingPageProps> = ({ 
  onStartNew, onLoadSave, onConnectGoogle, onPurchasePremium, isPremium, saveSlots, 
  isMuted, onToggleMute, volume, onVolumeChange, unlockedAchievements = []
}) => {
  const [managerName, setManagerName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [showNewGame, setShowNewGame] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [tutorialTab, setTutorialTab] = useState<'AGENCY' | 'TALENT' | 'GOVERNANCE' | 'ECONOMY'>('AGENCY');
  const [selectedSlot, setSelectedSlot] = useState(1);
  const [purchasedId, setPurchasedId] = useState<string | null>(null);

  const handleStart = () => {
    if (!managerName || !agencyName) {
      sounds.error();
      alert("Registration fields incomplete.");
      return;
    }
    sounds.success();
    sounds.playBGM();
    onStartNew(managerName, agencyName, selectedSlot);
  };

  const handlePurchase = (id: string, isVip: boolean = false) => {
    sounds.cash();
    setPurchasedId(id);
    if (isVip) onPurchasePremium();
    setTimeout(() => setPurchasedId(null), 1500);
  };

  const handleShowStore = () => {
    sounds.click();
    setShowStore(true);
  };

  const handleShowTutorial = () => {
    sounds.click();
    setShowTutorial(true);
  };

  const handleShowSettings = () => {
    sounds.click();
    setShowSettings(true);
  };

  const handleShowAchievements = () => {
    sounds.click();
    setShowAchievements(true);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050507] flex flex-col items-center overflow-hidden">
      {/* Visual Background Layers */}
      <div className="fixed inset-0 court-bg opacity-30 pointer-events-none"></div>
      
      {/* High-End Spotlight Effect */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] spotlight pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-orange-600/10 rounded-full blur-[120px] spotlight pointer-events-none" style={{ animationDelay: '-5s' }}></div>

      <div className="relative z-10 w-full max-w-md h-full flex flex-col justify-between p-6 pb-12 pt-4">
        {!showNewGame && !showStore && !showTutorial && !showSettings && !showAchievements ? (
          <>
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-1000">
              <div className="relative w-20 h-20 md:w-24 md:h-24 mb-3 transform transition-all hover:scale-110 duration-500">
                 <div className="absolute inset-0 bg-orange-500/20 rounded-[1.5rem] blur-2xl animate-pulse"></div>
                 <div className="relative w-full h-full bg-gradient-to-br from-zinc-800 to-black rounded-[1.5rem] border-2 border-white/20 shadow-2xl flex flex-col items-center justify-center overflow-hidden group cursor-default">
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 to-transparent opacity-50"></div>
                    <div className="relative z-10 flex flex-col items-center mt-1">
                       <div className="w-8 h-10 md:w-10 md:h-14 bg-gradient-to-b from-white via-zinc-400 to-zinc-600 relative overflow-hidden" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)' }}>
                          <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-black/40 shadow-xl"></div>
                       </div>
                       <span className="text-2xl md:text-3xl filter drop-shadow-[0_0_15px_rgba(249,115,22,0.8)] mt-[-14px] md:mt-[-18px]">🏀</span>
                    </div>
                 </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-sporty tracking-tighter text-white leading-none uppercase italic text-glow text-center">
                BASKETBALL <span className="text-orange-500 block not-italic -mt-1">AGENT 2026</span>
              </h1>
              <div className="flex items-center justify-center space-x-3 mt-2 opacity-80">
                <div className="h-px w-6 bg-gradient-to-r from-transparent to-white/30"></div>
                <p className="text-[8px] font-black tracking-[0.4em] text-gray-400 uppercase">Pro Management Simulation</p>
                <div className="h-px w-6 bg-gradient-to-l from-transparent to-white/30"></div>
              </div>
            </div>

            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-700">
              <button 
                onClick={() => { sounds.click(); sounds.playBGM(); setShowNewGame(true); }}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-4 md:py-5 rounded-2xl text-sm md:text-base uppercase tracking-[0.2em] transition-all hover:brightness-110 active:scale-95 shadow-[0_10px_30px_rgba(234,88,12,0.3)]"
              >
                Launch Career
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleShowTutorial}
                  className="bg-gradient-to-br from-blue-600/20 to-blue-900/40 border border-blue-500/30 text-blue-400 font-black py-3.5 rounded-2xl text-[9px] md:text-[10px] uppercase tracking-widest transition-all active:scale-95 hover:bg-blue-600/30"
                >
                  📖 Agent Manual
                </button>
                <button 
                  onClick={handleShowStore}
                  className="bg-gradient-to-br from-purple-600/20 to-purple-900/40 border border-purple-500/30 text-purple-400 font-black py-3.5 rounded-2xl text-[9px] md:text-[10px] uppercase tracking-widest transition-all active:scale-95 hover:bg-purple-600/30"
                >
                  💎 VIP STORE
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => { sounds.playBGM(); onLoadSave(1); }}
                  disabled={!saveSlots[1]}
                  className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all flex flex-col items-center justify-center space-y-1 ${
                    saveSlots[1] 
                    ? 'bg-cyan-600/10 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                    : 'bg-zinc-900/50 border-white/5 text-zinc-700 opacity-50 grayscale'
                  }`}
                >
                  <span className="text-xl">{saveSlots[1] ? '📂' : '💾'}</span>
                  <span>{saveSlots[1] ? 'Load Sector 01' : 'Slot 01'}</span>
                </button>

                <button 
                  onClick={() => isPremium ? (saveSlots[2] ? (sounds.playBGM(), onLoadSave(2)) : (sounds.playBGM(), setShowNewGame(true))) : handleShowStore()}
                  className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all flex flex-col items-center justify-center space-y-1 ${
                    !isPremium 
                    ? 'bg-zinc-900/80 border-zinc-800 text-zinc-600' 
                    : saveSlots[2]
                      ? 'bg-purple-600/10 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                      : 'bg-yellow-600/10 border-yellow-500/50 text-yellow-500'
                  }`}
                >
                  <span className="text-xl">{isPremium ? (saveSlots[2] ? '📂' : '➕') : '🔒'}</span>
                  <span>{saveSlots[2] ? 'Load Sector 02' : (isPremium ? 'Slot 02' : 'Elite Access')}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleShowSettings}
                  className="w-full bg-white/5 border border-white/5 text-gray-500 font-black py-3 rounded-2xl text-[9px] uppercase tracking-widest transition-all hover:bg-white/10 active:scale-95"
                >
                  ⚙️ Settings
                </button>
                <button 
                  onClick={handleShowAchievements}
                  className="w-full bg-white/5 border border-white/5 text-gray-500 font-black py-3 rounded-2xl text-[9px] uppercase tracking-widest transition-all hover:bg-white/10 active:scale-95"
                >
                  🏆 ACHIEVEMENTS
                </button>
              </div>
            </div>

            {/* Redesigned Centered Integrated Copyright Footer */}
            <div className="flex flex-col items-center mt-12 w-full">
               <div className="flex items-center space-x-4 w-full max-w-[300px] mb-4">
                  <div className="h-[0.5px] flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-zinc-700"></div>
                  <div className="w-1 h-1 rounded-full bg-orange-600/40 shadow-[0_0_8px_rgba(234,88,12,0.8)] animate-pulse"></div>
                  <div className="h-[0.5px] flex-1 bg-gradient-to-l from-transparent via-zinc-800 to-zinc-700"></div>
               </div>
               
               <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.45em] text-center leading-relaxed">
                 © 2026 MORNINGSTAR SIMULATION SYSTEM • ALL RIGHTS RESERVED
               </p>
               
               <div className="flex justify-center items-center space-x-4 mt-4 text-[7px] font-bold text-zinc-700 uppercase tracking-[0.25em] opacity-80">
                  <span className="hover:text-zinc-400 transition-colors cursor-default">V1.0.9-STABLE</span>
                  <div className="w-[1px] h-2 bg-zinc-800"></div>
                  <span className="hover:text-zinc-400 transition-colors cursor-default">LEGAL AGENCY INTERFACE</span>
               </div>
            </div>
          </>
        ) : showTutorial ? (
          <div className="bg-[#0d0d0f]/98 backdrop-blur-3xl p-5 md:p-6 rounded-[2.5rem] border border-blue-500/40 shadow-2xl animate-in zoom-in-95 w-full flex flex-col max-h-[85vh]">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl shadow-lg">📕</div>
                   <div>
                     <h2 className="text-xl font-sporty text-white uppercase tracking-tight leading-none">Agent Field Manual</h2>
                     <p className="text-[7px] text-gray-500 font-black uppercase mt-1 tracking-widest">Master the Bureaucracy</p>
                   </div>
                </div>
                <button onClick={() => { sounds.click(); setShowTutorial(false); }} className="text-gray-500 text-sm p-2">✕</button>
             </div>
             
             <div className="flex bg-black/40 p-1 rounded-xl gap-1 mb-4 overflow-x-auto no-scrollbar shrink-0">
                {['AGENCY', 'TALENT', 'GOVERNANCE', 'ECONOMY'].map((tab) => (
                  <button key={tab} onClick={() => setTutorialTab(tab as any)} className={`flex-1 py-1.5 text-[7px] font-black uppercase tracking-widest rounded-lg transition-all ${tutorialTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-500'}`}>
                    {tab}
                  </button>
                ))}
             </div>

             <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 px-1 text-left">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                   {tutorialTab === 'AGENCY' && (
                     <div className="space-y-3">
                       <p className="text-[10px] text-gray-300 leading-relaxed"><span className="text-blue-400 font-bold">🏢 PORTFOLIO:</span> Sign pros to earn weekly commissions. High <span className="text-white">Reputation</span> allows you to approach Superstars (90+ OVR).</p>
                       <p className="text-[10px] text-gray-300 leading-relaxed"><span className="text-orange-500 font-bold">🏬 OFFICE:</span> Upgrade your HQ to increase client capacity. Buy status items to boost your global Reputation standing.</p>
                       <p className="text-[10px] text-gray-300 leading-relaxed"><span className="text-green-400 font-bold">🔋 RESOURCES:</span> Use <span className="text-white">Training Points (TP)</span> to permanently upgrade client stats. Scout efficiently using <span className="text-white">Scouting Points (SP)</span>.</p>
                     </div>
                   )}
                   {tutorialTab === 'TALENT' && (
                     <div className="space-y-3">
                       <p className="text-[10px] text-gray-300 leading-relaxed"><span className="text-purple-400 font-bold">🏫 ACADEMY:</span> Deploy scouts to NCAB programs. "Hidden Gems" found early have zero signing fees and huge future sell-on value.</p>
                       <p className="text-[10px] text-gray-300 leading-relaxed"><span className="text-blue-500 font-bold">🔄 TRANSFERS:</span> Moving players between franchises earns you a <span className="text-white">Transfer Bonus</span>, but moving too often (2+ times/year) destroys their rating and morale.</p>
                       <p className="text-[10px] text-gray-300 leading-relaxed"><span className="text-red-400 font-bold">🤝 RELATIONS:</span> Gift luxury watches or cars to clients to maintain loyalty. Disloyal clients will drop your agency during the offseason.</p>
                     </div>
                   )}
                   {tutorialTab === 'GOVERNANCE' && (
                     <div className="space-y-3">
                       <p className="text-[10px] text-gray-300 leading-relaxed"><span className="text-yellow-500 font-bold">📈 EQUITY:</span> Buy franchise shares in Finance. At <span className="text-white underline">51% EQUITY</span>, click <span className="text-orange-500">TAKE OVER</span> to become the team Governor.</p>
                       <p className="text-[10px] text-gray-300 leading-relaxed"><span className="text-red-500 font-bold">⚠️ RESIGNATION:</span> Leaving or switching teams costs <span className="text-white font-black">-15 Reputation</span> and <span className="text-white font-black">-20 Influence</span>. Stability matters.</p>
                       <p className="text-[10px] text-gray-300 leading-relaxed"><span className="text-orange-500 font-bold">🏗️ INFRASTRUCTURE:</span> Upgrade Stadium (Income), Medical (Injuries), Scouting (Weekly SP), and Academy (Yearly grads) for massive team-wide bonuses.</p>
                     </div>
                   )}
                   {tutorialTab === 'ECONOMY' && (
                     <div className="space-y-3">
                       <p className="text-[10px] text-gray-300 leading-relaxed"><span className="text-red-500 font-bold">💸 BURN RATE:</span> HQ rent and status items cost cash every week. If you hit <span className="text-white font-black">-$200k</span>, you go Bankrupt.</p>
                       <p className="text-[10px] text-gray-300 leading-relaxed"><span className="text-green-500 font-bold">💎 LIFESTYLE:</span> High-end housing and luxury goods are the fastest way to build Reputation for signing icons.</p>
                       <p className="text-[10px] text-gray-300 leading-relaxed"><span className="text-cyan-500 font-bold">🏦 LOANS:</span> Inject capital using Micro-Venture or Shadow loans, but beware the <span className="text-white">Compound Weekly Interest</span>.</p>
                     </div>
                   )}
                </div>
             </div>
             <button onClick={() => { sounds.click(); setShowTutorial(false); }} className="mt-4 w-full bg-white text-black font-black py-4 rounded-xl text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl">Protocol Acknowledged</button>
          </div>
        ) : showStore ? (
          <div className="bg-[#0d0d0f]/98 backdrop-blur-3xl p-5 md:p-6 rounded-[2.5rem] border border-purple-500/40 shadow-2xl animate-in zoom-in-95 w-full flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3 shrink-0">
              <div>
                <h2 className="text-xl font-sporty text-white uppercase tracking-tight leading-none">VIP STORE</h2>
                <p className="text-[7px] text-gray-500 font-black uppercase tracking-widest mt-1">Authorized Agency Marketplace</p>
              </div>
              <button onClick={() => { sounds.click(); setShowStore(false); }} className="text-gray-500 text-sm p-2">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
              <div className={`bg-gradient-to-br from-zinc-900 to-black border-2 rounded-2xl p-4 transition-all relative overflow-hidden ${isPremium ? 'border-green-500/40' : 'border-purple-500/50'}`}>
                <div className="flex justify-between items-center mb-3">
                   <h3 className="text-xs font-black text-white uppercase tracking-tight">Global VIP EXECUTIVE</h3>
                   {isPremium && <span className="text-[6px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">AUTHORIZED</span>}
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                  <div className="text-[7px] font-bold text-gray-400 uppercase flex items-center gap-1.5"><span>🚫</span> AD BLOCKER</div>
                  <div className="text-[7px] font-bold text-gray-400 uppercase flex items-center gap-1.5"><span>⚡</span> 2X SIM FLOW</div>
                  <div className="text-[7px] font-bold text-gray-400 uppercase flex items-center gap-1.5"><span>📂</span> EXTRA CLOUD SLOT</div>
                  <div className="text-[7px] font-bold text-gray-400 uppercase flex items-center gap-1.5"><span>👑</span> ELITE BUREAU BADGE</div>
                </div>
                {!isPremium ? (
                  <button onClick={() => handlePurchase('vip', true)} className="w-full py-3.5 bg-white text-black font-black rounded-xl text-[9px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-xl">Sign for $4.99</button>
                ) : (
                   <p className="text-[9px] text-gray-500 uppercase font-bold text-center py-2 bg-green-500/5 rounded-lg italic">VIP Credentials Active</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2">
                {STORE_ITEMS.map((item) => (
                  <div key={item.id} className={`bg-zinc-900/50 border rounded-2xl p-3 flex items-center justify-between transition-all ${purchasedId === item.id ? 'border-green-500 bg-green-500/5' : 'border-white/5'}`}>
                    <div className="flex items-center space-x-3">
                       <span className="text-2xl">{item.icon}</span>
                       <div>
                          <h4 className="text-[10px] font-bold text-white uppercase leading-none mb-1">{item.name}</h4>
                          <p className="text-[7px] text-gray-500 leading-tight mb-1 pr-2">{item.description}</p>
                          <p className="text-[7px] font-black text-orange-500 uppercase">
                            OFFER: +{typeof item.benefit.amount === 'number' ? item.benefit.amount.toLocaleString() : item.benefit.amount} {item.benefit.type}
                          </p>
                       </div>
                    </div>
                    <button 
                      onClick={() => handlePurchase(item.id)}
                      className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all shrink-0 ${purchasedId === item.id ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-orange-600 hover:text-white shadow-lg'}`}
                    >
                      {purchasedId === item.id ? 'SECURED' : item.price}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => { sounds.click(); setShowStore(false); }} className="mt-4 text-gray-600 font-black py-2 text-[9px] uppercase tracking-widest text-center">Return to Terminal</button>
          </div>
        ) : showSettings ? (
          <div className="bg-[#0d0d0f]/98 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-gray-500/40 shadow-2xl animate-in zoom-in-95 w-full flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center text-xl shadow-lg">⚙️</div>
                <h2 className="text-xl font-sporty text-white uppercase tracking-tight">System Configuration</h2>
              </div>
              <button onClick={() => { sounds.click(); setShowSettings(false); }} className="text-gray-500 text-sm p-2">✕</button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
               <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Audio Stream</span>
                     <button 
                       onClick={onToggleMute}
                       className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${isMuted ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'bg-green-600 text-white shadow-lg shadow-green-900/40'}`}
                     >
                       {isMuted ? 'MUTED' : 'ACTIVE'}
                     </button>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between text-[8px] font-black text-gray-500 uppercase">
                        <span>Master Volume</span>
                        <span>{Math.round(volume * 100)}%</span>
                     </div>
                     <input 
                       type="range" min="0" max="1" step="0.05"
                       value={volume} onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                       className="w-full h-1.5 bg-zinc-800 rounded-full accent-orange-500 appearance-none cursor-pointer"
                     />
                  </div>
               </div>

               <div className="space-y-3 opacity-60">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                     <span className="text-[9px] font-black text-white uppercase tracking-widest">Haptic Pulse</span>
                     <span className="text-[7px] font-bold text-gray-500 uppercase">Ready</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                     <span className="text-[9px] font-black text-white uppercase tracking-widest">Render Resolution</span>
                     <span className="text-[8px] font-black text-blue-400 uppercase">Pro Elite</span>
                  </div>
               </div>
            </div>

            <button onClick={() => { sounds.click(); setShowSettings(false); }} className="mt-8 w-full bg-white text-black font-black py-4 rounded-xl text-[10px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-xl">Back to HQ</button>
          </div>
        ) : showAchievements ? (
          <div className="bg-[#0d0d0f]/98 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-yellow-500/40 shadow-2xl animate-in zoom-in-95 w-full flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-600 rounded-xl flex items-center justify-center text-xl shadow-lg">🏆</div>
                <h2 className="text-xl font-sporty text-white uppercase tracking-tight">ACHIEVEMENTS</h2>
              </div>
              <button onClick={() => { sounds.click(); setShowAchievements(false); }} className="text-gray-500 text-sm p-2">✕</button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
               {ACHIEVEMENTS.map(achievement => {
                 const isUnlocked = unlockedAchievements.includes(achievement.id);
                 return (
                   <div key={achievement.id} className={`p-4 rounded-2xl border transition-all flex items-center space-x-4 ${isUnlocked ? 'bg-yellow-600/10 border-yellow-500/40 shadow-lg' : 'bg-white/5 border-white/5 opacity-30'}`}>
                      <span className={`text-3xl transition-all ${isUnlocked ? 'grayscale-0 scale-110' : 'grayscale opacity-50'}`}>{achievement.icon}</span>
                      <div className="min-w-0">
                         <p className={`text-[10px] font-bold uppercase ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{achievement.title}</p>
                         <p className="text-[8px] text-gray-400 uppercase tracking-tight leading-tight">{achievement.description}</p>
                         {isUnlocked && <p className="text-[6px] font-black text-yellow-500 uppercase mt-1 tracking-widest">RECORD SECURED</p>}
                      </div>
                   </div>
                 );
               })}
            </div>

            <button onClick={() => { sounds.click(); setShowAchievements(false); }} className="mt-8 w-full bg-white text-black font-black py-4 rounded-xl text-[10px] uppercase tracking-widest hover:bg-yellow-600 hover:text-white transition-all shadow-xl">Back</button>
          </div>
        ) : (
          <div className="bg-[#0d0d0f]/98 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-orange-500/40 animate-in zoom-in-95 w-full shadow-[0_40px_100px_rgba(234,88,12,0.3)] flex flex-col relative overflow-hidden max-h-[85vh]">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 -mx-6 -mt-6 p-6 mb-6 shadow-2xl relative shrink-0">
              <div className="flex items-center space-x-3">
                <span className="text-3xl filter drop-shadow-lg">🕴️</span>
                <div>
                   <h2 className="text-3xl font-sporty text-white uppercase tracking-wider leading-none">Bureau Sign-In</h2>
                   <p className="text-[8px] font-black text-white/60 uppercase tracking-[0.4em] mt-1">Agency Credentials</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-sporty pointer-events-none">ASG</div>
            </div>

            <div className="space-y-4 overflow-y-auto no-scrollbar px-1 pb-4">
              <div className="text-left group">
                <label className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                   Agent Identity
                </label>
                <input 
                  type="text" 
                  className="w-full bg-black/60 border-2 border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-orange-500/50 focus:bg-orange-900/10 transition-all font-bold placeholder:text-zinc-700 shadow-inner" 
                  placeholder="Full Name" 
                  value={managerName} 
                  onChange={(e) => setManagerName(e.target.value)} 
                />
              </div>

              <div className="text-left group">
                <label className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                   Agency Firm
                </label>
                <input 
                  type="text" 
                  className="w-full bg-black/60 border-2 border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-orange-500/50 focus:bg-orange-900/10 transition-all font-bold placeholder:text-zinc-700 shadow-inner" 
                  placeholder="Agency Title" 
                  value={agencyName} 
                  onChange={(e) => setAgencyName(e.target.value)} 
                />
              </div>
              
              <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
                    Saving Sector
                 </label>
                 <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => { sounds.click(); setSelectedSlot(1); }} 
                      className={`group relative overflow-hidden py-4 rounded-2xl text-[9px] font-black border-2 uppercase transition-all shadow-xl flex flex-col items-center justify-center gap-1 ${
                        selectedSlot === 1 
                        ? 'border-blue-500 bg-blue-600/20 text-white shadow-blue-900/20' 
                        : 'border-white/5 bg-white/5 text-gray-600 hover:border-white/10'
                      }`}
                    >
                      <span className="text-lg">🏀</span>
                      <span>Slot-01</span>
                    </button>
                    <button 
                      onClick={() => {
                        if (isPremium) {
                          sounds.click();
                          setSelectedSlot(2);
                        } else {
                          handleShowStore();
                        }
                      }} 
                      className={`group relative overflow-hidden py-4 rounded-2xl text-[9px] font-black border-2 uppercase transition-all shadow-xl flex flex-col items-center justify-center gap-1 ${
                        selectedSlot === 2 
                        ? 'border-yellow-500 bg-yellow-600/20 text-white shadow-orange-900/20' 
                        : 'border-white/5 bg-white/5 text-gray-600 hover:border-white/10'
                      }`}
                    >
                      {isPremium ? (
                        <>
                          <span className="text-lg text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]">🏀</span>
                          <span>Slot-02</span>
                        </>
                      ) : (
                        <>
                          <span className="text-lg opacity-50">🔒</span>
                          <span>VIP Slot</span>
                        </>
                      )}
                    </button>
                 </div>
              </div>

              <div className="flex space-x-3 pt-6 shrink-0">
                <button onClick={() => { sounds.click(); setShowNewGame(false); }} className="px-6 bg-white/5 text-gray-500 font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest border border-white/5 active:scale-95 transition-all hover:bg-white/10">Abort</button>
                <button onClick={handleStart} className="flex-1 bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-[0.3em] shadow-[0_10px_40px_rgba(234,88,12,0.4)] active:scale-95 transition-all group relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  Finalize Contract
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;