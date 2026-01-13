
import React, { useState, useEffect, useCallback } from 'react';
import { ViewType, GameState, Player, Team, Match, Position, DraftPhase, ScoutingLevel, Scout, LeaguePhase, Sponsorship, Manager, LifestyleItem, OfficeUpgrade, GameDecisionOption, Loan } from './types';
import { TEAMS_DATA, UNIVERSITY_TEAMS_DATA, INITIAL_CASH, INITIAL_REPUTATION, SCOUT_HIRE_COSTS, SCOUT_WEEKLY_SALARY, INFRASTRUCTURE_UPGRADE_COSTS, OFFICE_UPGRADES, OFFICE_DECOR } from './constants';
import { generatePlayer, generateId, formatCurrency, generateManager, getRequiredReputation } from './utils';
import { advanceWeek } from './engine';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PlayerList from './components/PlayerList';
import LeagueView from './components/LeagueView';
import AgencyView from './components/AgencyView';
import MarketView from './components/MarketView';
import DraftView from './components/DraftView';
import TrainingView from './components/TrainingView';
import ScheduleView from './components/ScheduleView';
import AcademyView from './components/AcademyView';
import FinanceView from './components/FinanceView';
import LandingPage from './components/LandingPage';
import PlayerModal from './components/PlayerModal';
import TeamModal from './components/TeamModal';
import ManagerModal from './components/ManagerModal';
import MatchModal from './components/MatchModal';
import InjuryDecisionModal from './components/InjuryDecisionModal';
import NegotiationModal from './components/NegotiationModal';
import InteractionModal from './components/InteractionModal';
import BankruptcyModal from './components/BankruptcyModal';
import AwardHistoryModal from './components/AwardHistoryModal';
import LifestyleView from './components/LifestyleView';
import DraftInvitationModal from './components/DraftInvitationModal';
import StoreView from './components/StoreView';
import DecisionModal from './components/DecisionModal';
import BreakingNewsOverlay from './components/BreakingNewsOverlay';

const SAVE_KEY_PREFIX = 'basketball_agent_2026_save_slot_';

const App: React.FC = () => {
  const [activeSlot, setActiveSlot] = useState(1);
  const [isPremiumGlobal, setIsPremiumGlobal] = useState(() => localStorage.getItem('ba2026_premium') === 'true');
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [gameState, setGameState] = useState<GameState>({
    week: 1, year: 2026, cash: INITIAL_CASH, reputation: INITIAL_REPUTATION, scoutingPoints: 20, trainingPoints: 50, scoutingBoostWeeks: 0, influencePoints: 10,
    inventory: [], notifications: [], breakingNews: null, draftProspects: [], universityPlayers: [], scouts: [], scoutingProgress: 0, scoutReport: [], draftOrder: [], activeOffers: [],
    draftPhase: DraftPhase.PRE_DRAFT, leaguePhase: LeaguePhase.REGULAR_SEASON, playoffBracket: [], currentDraftPick: 1, draftHistory: [], managerName: '', agencyName: '',
    isPremium: isPremiumGlobal, saveSlot: 1, lastAdWeek: 0, managedTeamId: null, isScoutingBoostPermanent: false, isBankrupt: false, awardHistory: [], managers: [],
    transfersThisSeason: 0, officeLevel: 1, officeItems: [], maxClients: 5, activeDecision: null, globalLockoutWeeks: 0, globalPandemicWeeks: 0, capSpikeMultiplier: 1.0,
    loans: [], inflationRate: 0
  });

  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [view, setView] = useState<ViewType>('DASHBOARD');
  const [gameStarted, setGameStarted] = useState(false);
  
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [negotiatingPlayer, setNegotiatingPlayer] = useState<Player | null>(null);
  const [interactionPlayer, setInteractionPlayer] = useState<Player | null>(null);
  const [awardHistoryCategory, setAwardHistoryCategory] = useState<'MVP' | 'SCORING' | 'ROOKIE' | 'ALL' | null>(null);

  const handleBailout = () => {
    setGameState(prev => ({
      ...prev,
      cash: 1000000,
      isBankrupt: false,
      reputation: Math.max(10, prev.reputation - 20),
      notifications: [{
        id: generateId(),
        title: 'Emergency Bailout',
        message: 'Agency salvaged by external investors. $1.0M injected.',
        week: prev.week,
        type: 'success'
      }, ...prev.notifications]
    }));
  };

  const handleWatchAdReward = (type: 'INFLUENCE' | 'SCOUTING_POINTS' | 'SCOUTING_BOOST' | 'CASH' | 'REPUTATION') => {
    setGameState(prev => {
      const updates: Partial<GameState> = {};
      if (type === 'CASH') updates.cash = prev.cash + 50000;
      if (type === 'REPUTATION') updates.reputation = prev.reputation + 5;
      if (type === 'INFLUENCE') updates.influencePoints = prev.influencePoints + 10;
      if (type === 'SCOUTING_POINTS') updates.scoutingPoints = prev.scoutingPoints + 20;

      return {
        ...prev,
        ...updates,
        notifications: [{
          id: generateId(),
          title: 'Premium Reward',
          message: `Injected bonus resources via Agency sponsor.`,
          week: prev.week,
          type: 'success'
        }, ...prev.notifications]
      };
    });
  };

  const handleInteract = (playerId: string, type: 'TALK' | 'DINNER' | 'WATCH' | 'CAR') => {
    const costs = { TALK: 0, DINNER: 1500, WATCH: 25000, CAR: 250000 };
    const gains = { TALK: 3, DINNER: 8, WATCH: 20, CAR: 50 };
    const cost = costs[type];

    if (gameState.cash < cost) return;

    setGameState(prev => ({ ...prev, cash: prev.cash - cost }));
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return { 
          ...p, 
          loyalty: Math.min(100, p.loyalty + gains[type]),
          morale: Math.min(100, p.morale + Math.floor(gains[type] / 2))
        };
      }
      return p;
    }));
    setInteractionPlayer(null);
  };

  const handleTransferPlayer = (playerId: string, targetTeamId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player || !player.isClient) return;

    const fee = player.marketValue;
    const agentCut = fee * player.transferCommission;

    setGameState(prev => ({
      ...prev,
      cash: prev.cash + agentCut,
      notifications: [{
        id: generateId(),
        title: 'Transfer Completed',
        message: `${player.name} moved to new franchise. Fee: ${formatCurrency(fee)}. Commission: ${formatCurrency(agentCut)}.`,
        week: prev.week,
        type: 'success'
      }, ...prev.notifications]
    }));

    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return { 
          ...p, 
          teamId: targetTeamId, 
          timesTransferred: p.timesTransferred + 1,
          loyalty: Math.max(0, p.loyalty - 10),
          morale: Math.max(0, p.morale - 15)
        };
      }
      return p;
    }));
  };

  const handleTakeLoan = (amount: number, interest: number) => {
    const newLoan: Loan = { id: generateId(), principal: amount, balance: amount, weeklyInterest: interest, originationWeek: gameState.week };
    setGameState(prev => ({ 
      ...prev, 
      cash: prev.cash + amount, 
      loans: [...prev.loans, newLoan],
      notifications: [{
        id: generateId(),
        title: 'Loan Disbursed',
        message: `Capital injection of ${formatCurrency(amount)} approved.`,
        week: prev.week,
        type: 'warning'
      }, ...prev.notifications]
    }));
  };

  const handleRepayLoan = (loanId: string, amount: number) => {
    setGameState(prev => ({
      ...prev,
      cash: prev.cash - amount,
      loans: prev.loans.map(l => l.id === loanId ? { ...l, balance: l.balance - amount } : l).filter(l => l.balance > 0)
    }));
  };

  const handleBuyLifestyle = (item: LifestyleItem) => {
    if (gameState.cash < item.price) return;
    setGameState(prev => ({
      ...prev,
      cash: prev.cash - item.price,
      inventory: [...prev.inventory, item.id],
      reputation: prev.reputation + item.reputationGain,
      influencePoints: prev.influencePoints + (item.influenceGain || 0),
      notifications: [{
        id: generateId(),
        title: 'Asset Acquired',
        message: `Purchased ${item.name}. Status upgraded.`,
        week: prev.week,
        type: 'success'
      }, ...prev.notifications]
    }));
  };

  const handleUpgradeOffice = (upgrade: OfficeUpgrade) => {
    if (gameState.cash < upgrade.cost) return;
    setGameState(prev => ({
      ...prev,
      cash: prev.cash - upgrade.cost,
      officeLevel: prev.officeLevel + 1,
      reputation: prev.reputation + upgrade.repGain,
      maxClients: upgrade.capacityGain + prev.officeItems.reduce((acc, itemID) => {
        const item = OFFICE_DECOR.find(d => d.id === itemID);
        return acc + (item?.capacityGain || 0);
      }, 0),
      notifications: [{
        id: generateId(),
        title: 'HQ Expanded',
        message: `Agency moved to ${upgrade.name}. Base capacity is now ${upgrade.capacityGain}.`,
        week: prev.week,
        type: 'success'
      }, ...prev.notifications]
    }));
  };

  const handleBuyOfficeItem = (item: OfficeUpgrade) => {
    const repCost = item.cost / 1000;
    if (gameState.reputation < repCost) {
      alert("Insufficient Reputation to unlock this status item.");
      return;
    }

    setGameState(prev => ({
      ...prev,
      reputation: prev.reputation - repCost,
      officeItems: [...prev.officeItems, item.id],
      maxClients: prev.maxClients + item.capacityGain,
      notifications: [{
        id: generateId(),
        title: 'Status Unlocked',
        message: `Acquired ${item.name}. Client capacity increased by ${item.capacityGain}.`,
        week: prev.week,
        type: 'success'
      }, ...prev.notifications]
    }));
  };

  const handleStorePurchase = (item: any) => {
    const { type, amount } = item.benefit;
    setGameState(prev => {
      const newState = { ...prev };
      if (type === 'CASH') newState.cash += amount;
      if (type === 'REPUTATION') newState.reputation += amount;
      if (type === 'TP') newState.trainingPoints += amount;
      if (type === 'INFLUENCE') newState.influencePoints += amount;

      return {
        ...newState,
        notifications: [{
          id: generateId(),
          title: 'Premium Order Processed',
          message: `Injected ${amount.toLocaleString()} ${type} from ${item.name}.`,
          week: prev.week,
          type: 'success'
        }, ...prev.notifications]
      };
    });
  };

  const handleUpgradeFacility = (teamId: string, type: 'stadium' | 'medical' | 'scouting' | 'academy') => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    const currentLevel = team[`${type}Level` as keyof Team] as number;
    const cost = INFRASTRUCTURE_UPGRADE_COSTS[currentLevel];
    
    if (gameState.cash < cost) {
      alert("Insufficient capital for infrastructure upgrade.");
      return;
    }

    setGameState(prev => ({ ...prev, cash: prev.cash - cost }));
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return { ...t, [`${type}Level`]: currentLevel + 1 };
      }
      return t;
    }));
    
    setGameState(prev => ({
      ...prev,
      notifications: [{
        id: generateId(),
        title: 'Facility Upgraded',
        message: `${team.name} ${type} department is now Level ${currentLevel + 1}.`,
        week: prev.week,
        type: 'success'
      }, ...prev.notifications]
    }));
  };

  const handleFirePlayer = (playerId: string) => {
    const p = players.find(p => p.id === playerId);
    if (!p || !p.teamId) return;
    
    const confirmRelease = window.confirm(`Are you sure you want to release ${p.name}? This will clear roster space but may impact chemistry.`);
    if (!confirmRelease) return;

    setPlayers(prev => prev.map(player => player.id === playerId ? { ...player, teamId: null } : player));
    setTeams(prev => prev.map(team => team.id === p.teamId ? { ...team, roster: team.roster.filter(rid => rid !== playerId), chemistry: Math.max(0, team.chemistry - 5) } : team));
  };

  const handleFireManager = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team || !team.managerId) return;

    const confirmFire = window.confirm(`Terminate Head Coach's contract? You will need to hire a replacement.`);
    if (!confirmFire) return;

    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, managerId: null } : t));
  };

  const handleDecision = (option: GameDecisionOption) => {
    if (!gameState.activeDecision) return;
    const player = players.find(p => p.id === gameState.activeDecision!.playerId);
    if (!player) return;
    const { effects } = option;

    setGameState(prev => ({
      ...prev,
      cash: prev.cash + (effects.cash || 0),
      reputation: Math.max(0, prev.reputation + (effects.reputation || 0)),
      influencePoints: Math.max(0, prev.influencePoints + (effects.influence || 0)),
      activeDecision: null
    }));

    setPlayers(prev => prev.map(p => {
      if (p.id === player.id) {
        return {
          ...p,
          loyalty: Math.min(100, Math.max(0, p.loyalty + (effects.loyalty || 0))),
          morale: Math.min(100, Math.max(0, p.morale + (effects.morale || 0))),
          rating: Math.max(40, p.rating + (effects.rating || 0)),
          coachTrust: Math.max(0, Math.min(100, (p.coachTrust || 50) + (effects.coachTrust || 0))),
          tradeRumorIntensity: Math.max(0, Math.min(100, (p.tradeRumorIntensity || 0) + (effects.tradeRumors || 0))),
          activeSponsorship: effects.sponsorship || p.activeSponsorship,
          isRetired: effects.retirePlayer || p.isRetired,
        };
      }
      return p;
    }));
  };

  const handleNextWeek = () => {
    if (gameState.activeDecision) {
      alert("Crisis management required.");
      return;
    }
    const { newState, updatedPlayers, updatedTeams, newMatches, newManagers } = advanceWeek(gameState, players, teams, matches);
    
    setGameState({
      ...newState,
      managers: [...newState.managers, ...newManagers]
    }); 
    setPlayers(updatedPlayers); 
    setTeams(updatedTeams); 
    setMatches(newMatches);
    if (newState.cash < -200000) setGameState(prev => ({ ...prev, isBankrupt: true }));
  };

  const handleStartNew = (managerName: string, agencyName: string, slot: number) => {
    const proTeams: Team[] = TEAMS_DATA.map(t => ({
      ...t as Team, 
      wins: 0, 
      losses: 0, 
      budget: 150000000, 
      roster: [], 
      chemistry: 70, 
      championships: 0, 
      valuation: t.valuation || 3000000000, 
      sharePrice: (t.valuation || 3000000000) / 100, 
      userShares: 0, 
      weeklyRevenue: 100000, 
      systemType: 'Pace & Space', 
      stadiumLevel: 1, 
      medicalLevel: 1, 
      scoutingLevel: 1, 
      academyLevel: 1,
      marketTrend: (Math.random() > 0.5 ? 'BULLISH' : 'STABLE') as any
    }));
    const uniTeams: Team[] = UNIVERSITY_TEAMS_DATA.map(t => ({
      ...t as Team, wins: 0, losses: 0, budget: 0, roster: [], chemistry: 70, championships: 0, valuation: 0, 
      sharePrice: 0, userShares: 0, weeklyRevenue: 0, systemType: 'Grit & Grind', stadiumLevel: 1, medicalLevel: 1, scoutingLevel: 1, academyLevel: 1,
      marketTrend: 'STABLE' as any
    }));
    
    const allPlayers: Player[] = [];
    
    proTeams.forEach(team => { 
      for (let i = 0; i < 12; i++) { 
        const p = generatePlayer(team.id); 
        allPlayers.push(p); 
        team.roster.push(p.id); 
      } 
    });

    uniTeams.forEach(team => {
      for (let i = 0; i < 12; i++) {
        const p = generatePlayer(team.id, false, true);
        allPlayers.push(p);
        team.roster.push(p.id);
      }
    });

    for (let i = 0; i < 60; i++) {
      allPlayers.push(generatePlayer(null, false, true));
    }

    setTeams([...proTeams, ...uniTeams]); 
    setPlayers(allPlayers);
    setGameState({ 
      ...gameState, 
      managerName, 
      agencyName, 
      saveSlot: slot,
      managers: Array.from({ length: 40 }, () => generateManager(null))
    });
    setGameStarted(true);
  };

  const handleBuyShares = (teamId: string, amount: number) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    const cost = team.sharePrice * amount;
    if (gameState.cash < cost) return;
    setGameState(prev => ({ ...prev, cash: prev.cash - cost }));
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, userShares: t.userShares + amount } : t));
  };

  const handleBecomeOwner = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    setGameState(prev => ({ 
      ...prev, 
      managedTeamId: teamId,
      notifications: [{
        id: generateId(),
        title: 'Executive Takeover',
        message: `You have assumed control of the ${team.name} organization.`,
        week: prev.week,
        type: 'success'
      }, ...prev.notifications]
    }));
    setView('DASHBOARD'); // Jump back to home to see the new dashboard features
  };

  const handleResign = () => {
    setGameState(prev => ({ 
      ...prev, 
      managedTeamId: null,
      notifications: [{
        id: generateId(),
        title: 'Resignation Submitted',
        message: `You have stepped down from your role in the front office.`,
        week: prev.week,
        type: 'warning'
      }, ...prev.notifications]
    }));
  };

  if (!gameStarted) return <LandingPage onStartNew={handleStartNew} onLoadSave={() => {}} onConnectGoogle={() => {}} onPurchasePremium={() => {}} isPremium={isPremiumGlobal} saveSlots={{1: false, 2: false}} />;

  return (
    <div className="flex h-screen bg-[#050507] text-gray-100 overflow-hidden relative">
      <Sidebar currentView={view} setView={setView} isPremium={gameState.isPremium} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header gameState={gameState} onNextWeek={handleNextWeek} onViewChange={setView} />
        <main className="flex-1 overflow-y-auto p-3 no-scrollbar">
          {view === 'DASHBOARD' && <Dashboard gameState={gameState} players={players} teams={teams} matches={matches} onViewChange={setView} onSelectPlayer={setSelectedPlayer} onSelectTeam={setSelectedTeam} onSelectMatch={setSelectedMatch} onShowAwardHistory={setAwardHistoryCategory} onUpgradeFacility={handleUpgradeFacility} onFireManager={handleFireManager} onFirePlayer={handleFirePlayer} />}
          {view === 'PLAYERS' && <PlayerList players={players.filter(p => !p.isYouth && !p.isRetired)} managers={gameState.managers} onSign={(id) => setNegotiatingPlayer(players.find(p => p.id === id) || null)} onHireManager={() => {}} reputation={gameState.reputation} onSelectPlayer={setSelectedPlayer} onSelectManager={setSelectedManager} isOwner={!!gameState.managedTeamId} />}
          {view === 'AGENCY' && <AgencyView players={players.filter(p => p.isClient && !p.isRetired)} offers={[]} teams={teams} onTrain={(id) => setSelectedPlayer(players.find(p => p.id === id) || null)} onSelectPlayer={setSelectedPlayer} gameState={gameState} onUpgradeOffice={handleUpgradeOffice} onBuyOfficeItem={handleBuyOfficeItem} onTransferPlayer={handleTransferPlayer} onWatchAdReward={handleWatchAdReward} />}
          {view === 'ACADEMY' && <AcademyView gameState={gameState} teams={teams} players={players} matches={matches} hireScout={() => {}} academyPlayers={players.filter(p => p.isYouth && p.isClient)} talentPool={players.filter(p => p.isYouth && !p.teamId)} onSignAcademy={(id) => setNegotiatingPlayer(players.find(p => p.id === id) || null)} onScoutAcademy={() => {}} onSelectPlayer={setSelectedPlayer} onSelectTeam={setSelectedTeam} onWatchAdReward={handleWatchAdReward} onAssignToUniversity={(pid, tid) => { setPlayers(prev => prev.map(p => p.id === pid ? {...p, teamId: tid} : p)) }} />}
          {view === 'FINANCE' && <FinanceView teams={teams} players={players} cash={gameState.cash} inventory={gameState.inventory} onBuyShares={handleBuyShares} onBuyLifestyle={handleBuyLifestyle} onSignSponsorship={() => {}} onUpdateTeamFinance={() => {}} managedTeamId={gameState.managedTeamId} onBecomeOwner={handleBecomeOwner} onResign={handleResign} onSelectPlayer={setSelectedPlayer} onTakeLoan={handleTakeLoan} onRepayLoan={handleRepayLoan} loans={gameState.loans} />}
          {view === 'LEAGUE' && <LeagueView teams={teams} matches={matches} gameState={gameState} players={players} onSelectTeam={setSelectedTeam} onSelectPlayer={setSelectedPlayer} onShowAwardHistory={setAwardHistoryCategory} />}
          {view === 'SCHEDULE' && <ScheduleView matches={matches} teams={teams} onSelectMatch={setSelectedMatch} />}
          {view === 'LIFESTYLE' && <LifestyleView inventory={gameState.inventory} cash={gameState.cash} onBuy={handleBuyLifestyle} />}
          {view === 'STORE' && <StoreView onPurchase={handleStorePurchase} />}
        </main>
      </div>
      {gameState.breakingNews && <BreakingNewsOverlay news={gameState.breakingNews} onClose={() => setGameState(prev => ({ ...prev, breakingNews: null }))} />}
      {gameState.activeDecision && <DecisionModal decision={gameState.activeDecision} player={players.find(p => p.id === gameState.activeDecision!.playerId)!} onResolve={handleDecision} />}
      
      {selectedPlayer && (
        <PlayerModal 
          player={selectedPlayer} 
          teams={teams} 
          onClose={() => setSelectedPlayer(null)} 
          onSign={(id) => setNegotiatingPlayer(players.find(p => p.id === id) || null)} 
          reputation={gameState.reputation} 
          matches={[]} 
          trainingPoints={gameState.trainingPoints} 
          onTrainAttribute={() => {}} 
          onNegotiate={() => { setNegotiatingPlayer(selectedPlayer); setSelectedPlayer(null); }}
          onInteract={() => { setInteractionPlayer(selectedPlayer); setSelectedPlayer(null); }}
        />
      )}
      
      {interactionPlayer && (
        <InteractionModal 
          player={interactionPlayer} 
          onInteract={handleInteract} 
          onClose={() => setInteractionPlayer(null)} 
          cash={gameState.cash} 
        />
      )}

      {selectedTeam && <TeamModal team={selectedTeam} players={players.filter(p => p.teamId === selectedTeam.id)} onClose={() => setSelectedTeam(null)} onSelectPlayer={setSelectedPlayer} />}
      
      {negotiatingPlayer && (
        <NegotiationModal 
          player={negotiatingPlayer} 
          managerName={gameState.managerName}
          agencyName={gameState.agencyName}
          onNegotiate={(pid, ret, com, tcom) => { 
            setPlayers(p => p.map(x => x.id === pid ? {...x, isClient: true, agentRetainer: ret, agentCommission: com, transferCommission: tcom} : x)); 
            setNegotiatingPlayer(null); 
            setGameState(prev => ({ ...prev, reputation: prev.reputation + (negotiatingPlayer.rating > 85 ? 10 : 5) }));
          }} 
          onClose={() => setNegotiatingPlayer(null)} 
        />
      )}
      
      {selectedMatch && <MatchModal match={selectedMatch} teams={teams} onClose={() => setSelectedMatch(null)} />}
      {gameState.isBankrupt && <BankruptcyModal onBailout={handleBailout} onRestart={() => window.location.reload()} />}
    </div>
  );
};

export default App;
