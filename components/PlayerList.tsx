
import React, { useState } from 'react';
import { Player, Position, Manager } from '../types';
import { formatCurrency, getRequiredReputation } from '../utils';

interface PlayerListProps {
  players: Player[];
  managers: Manager[];
  onSign: (id: string) => void;
  onHireManager: (id: string) => void;
  reputation: number;
  onSelectPlayer: (p: Player) => void;
  onSelectManager: (m: Manager) => void;
  isOwner: boolean;
}

type MainTab = 'ELITE' | 'PRO' | 'ROOKIES' | 'COACHES';

const PlayerList: React.FC<PlayerListProps> = ({ players, managers, onSign, onHireManager, reputation, onSelectPlayer, onSelectManager, isOwner }) => {
  const [activeTab, setActiveTab] = useState<MainTab>('ELITE');
  const [filter, setFilter] = useState<Position | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const eliteCount = players.filter(p => p.rating >= 85 && !p.isRookie).length;
  const proCount = players.filter(p => p.rating < 85 && !p.isRookie).length;
  const rookieCount = players.filter(p => p.isRookie).length;
  const coachCount = managers.length;

  const getFilteredPlayers = () => {
    return players.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesPos = filter === 'ALL' || p.position === filter;
      
      let matchesTab = false;
      if (activeTab === 'ELITE') matchesTab = p.rating >= 85 && !p.isRookie;
      if (activeTab === 'PRO') matchesTab = p.rating < 85 && !p.isRookie;
      if (activeTab === 'ROOKIES') matchesTab = p.isRookie === true;
      
      return matchesSearch && matchesPos && matchesTab;
    }).sort((a, b) => b.rating - a.rating);
  };

  const getFilteredManagers = () => {
    return managers.filter(m => 
      m.name.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => b.rating - a.rating);
  };

  const displayList = activeTab === 'COACHES' ? getFilteredManagers() : getFilteredPlayers();

  const getTabCount = (tab: MainTab) => {
    if (tab === 'ELITE') return eliteCount;
    if (tab === 'PRO') return proCount;
    if (tab === 'ROOKIES') return rookieCount;
    if (tab === 'COACHES') return coachCount;
    return 0;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-3 animate-in slide-in-from-bottom-4 duration-500 pb-24 md:pb-6">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#111114] p-3 rounded-2xl border border-white/5 sticky top-0 z-30 shadow-2xl backdrop-blur-xl gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-lg shadow-lg">🏀</div>
          <div>
            <h2 className="text-sm font-sporty tracking-widest text-white uppercase leading-none">Scouting Hub</h2>
            <p className="text-[6px] text-gray-500 font-black tracking-[0.4em] uppercase">Global Database</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input 
            type="text" 
            placeholder="Search..."
            className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-[9px] focus:outline-none focus:border-orange-500/50 w-full md:w-40 font-bold text-white placeholder:text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {activeTab !== 'COACHES' && (
            <select 
              className="bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-[9px] focus:outline-none h-8 font-bold text-white uppercase tracking-widest"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="ALL">POS</option>
              {Object.values(Position).map(pos => <option key={pos} value={pos}>{pos}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#111114] p-1 rounded-xl border border-white/5 shadow-lg gap-1">
        {(['ELITE', 'PRO', 'ROOKIES', 'COACHES'] as MainTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all duration-200 flex flex-col items-center justify-center ${
              activeTab === tab ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
            }`}
          >
            <span>{tab}</span>
            <span className={`text-[6px] opacity-60 ${activeTab === tab ? 'text-black' : 'text-gray-600'}`}>{getTabCount(tab)}</span>
          </button>
        ))}
      </div>

      {/* Talent List */}
      <div className="bg-[#111114] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="max-h-[68vh] overflow-y-auto no-scrollbar divide-y divide-white/[0.02]">
          {displayList.length > 0 ? (
            displayList.map((item: any) => {
              const isCoach = activeTab === 'COACHES';
              const reqRep = isCoach ? 0 : getRequiredReputation(item);
              
              return (
                <div key={item.id} className="flex items-center justify-between px-4 py-2 hover:bg-white/[0.01] transition-colors group">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div 
                      className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-xl group-hover:scale-105 transition-transform cursor-pointer shrink-0"
                      onClick={() => isCoach ? onSelectManager(item) : onSelectPlayer(item)}
                    >
                      {item.face}
                    </div>
                    <div className="truncate cursor-pointer" onClick={() => isCoach ? onSelectManager(item) : onSelectPlayer(item)}>
                      <div className="flex items-center space-x-2">
                        <p className="text-[10px] font-bold text-white truncate group-hover:text-orange-500 transition-colors">
                          {item.name}
                        </p>
                        {isCoach && item.isFormerPlayer && (
                          <span className="bg-blue-600/20 text-blue-400 text-[5px] font-black px-1 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest">Former Pro</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[7px] text-gray-600 font-black uppercase tracking-tighter">
                          {isCoach ? `Coach • ${item.age}y` : `${item.position} • ${item.age}y`}
                        </span>
                        <span className={`text-[7px] font-bold ${isCoach ? 'text-blue-400' : 'text-green-600/80'}`}>
                          {formatCurrency(item.salary)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 pl-4">
                    <div className="text-center w-8">
                      <p className={`text-sm font-sporty leading-none ${item.rating >= 90 ? 'text-orange-500' : item.rating >= 80 ? 'text-white' : 'text-gray-500'}`}>
                        {item.rating}
                      </p>
                      <p className="text-[6px] text-gray-700 font-black uppercase tracking-tighter">OVR</p>
                    </div>

                    <div className="w-20 flex justify-end">
                      {isCoach ? (
                        <button 
                          onClick={() => onHireManager(item.id)}
                          disabled={!isOwner || item.isClient}
                          className={`w-full py-1.5 rounded-md text-[7px] font-black uppercase tracking-widest transition-all ${
                            item.isClient ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : isOwner ? 'bg-white text-black hover:bg-blue-600 hover:text-white' : 'bg-white/5 text-gray-700 cursor-not-allowed'
                          }`}
                        >
                          {item.isClient ? 'SIGNED' : isOwner ? 'APPOINT' : 'LOCKED'}
                        </button>
                      ) : (
                        <button 
                          onClick={() => onSign(item.id)}
                          disabled={item.isClient || reputation < reqRep}
                          className={`w-full py-1.5 rounded-md text-[7px] font-black uppercase tracking-widest transition-all ${
                            item.isClient ? 'bg-green-600/20 text-green-500 border border-green-500/20' : reputation >= reqRep ? 'bg-white text-black hover:bg-orange-600 hover:text-white shadow-sm' : 'bg-white/5 text-gray-700 cursor-not-allowed'
                          }`}
                        >
                          {item.isClient ? 'SIGNED' : reputation >= reqRep ? 'APPROACH' : `REP ${reqRep}`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-gray-700 italic text-[9px] uppercase font-black tracking-widest bg-black/10">
              No matching talent found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerList;
