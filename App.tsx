import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ViewType, GameState, Player, Team, Match, Position, DraftPhase, ScoutingLevel, Scout, LeaguePhase, Sponsorship, Manager, LifestyleItem, OfficeUpgrade, GameDecisionOption, Loan, Achievement } from './types';
import { TEAMS_DATA, UNIVERSITY_TEAMS_DATA, INITIAL_CASH, INITIAL_REPUTATION, SCOUT_HIRE_COSTS, SCOUT_WEEKLY_SALARY, INFRASTRUCTURE_UPGRADE_COSTS, OFFICE_UPGRADES, OFFICE_DECOR, FIRST_NAMES, LAST_NAMES, ACHIEVEMENTS } from './constants';
import { generatePlayer, generateId, formatCurrency, generateManager, getRequiredReputation, getTrainingCost, getSigningFee, sounds } from './utils';
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
import FinanceBreakdownModal from './components/FinanceBreakdownModal';
import AchievementToast from './components/AchievementToast';

const SAVE_KEY_PREFIX = 'basketball_agent_2026_save_slot_';

const App: React.FC = () => {
  const [isPremiumGlobal, setIsPremiumGlobal] = useState(() => localStorage.getItem('ba2026_premium') === 'true');
  const [showFinanceBreakdown, setShowFinanceBreakdown] = useState(false);
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('ba2026_muted') === 'true');
  const [volume, setVolume] = useState(() => parseFloat(localStorage.getItem('ba2026_volume') || '0.5'));
  
  const [gameState, setGameState] = useState<GameState>({
    week: 1, year: 2026, cash: INITIAL_CASH, reputation: INITIAL_REPUTATION, scoutingPoints: 20, trainingPoints: 50, scoutingBoostWeeks: 0, influencePoints: 10,
    inventory: [], notifications: [], breakingNews: null, draftProspects: [], universityPlayers: [], scouts: [], scoutingProgress: 0, scoutReport: [], draftOrder: [], activeOffers: [],
    draftPhase: DraftPhase.PRE_DRAFT, leaguePhase: LeaguePhase.REGULAR_SEASON, playoffBracket: [], currentDraftPick: 1, draftHistory: [], managerName: '', agencyName: '',
    isPremium: isPremiumGlobal, saveSlot: 1, lastAdWeek: 0, managedTeamId: null, isScoutingBoostPermanent: false, isBankrupt: false, awardHistory: [], managers: [],
    transfersThisSeason: 0, officeLevel: 1, officeItems: [], maxClients: 5, activeDecision: null, globalLockoutWeeks: 0, globalPandemicWeeks: 0, capSpikeMultiplier: 1.0,
    loans: [], inflationRate: 0, unlockedAchievements: []
  });

  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [view, setView] = useState<ViewType>('DASHBOARD');
  const [gameStarted, setGameStarted] = useState(false);
  const [saveSlotsAvailable, setSaveSlotsAvailable] = useState<{ [key: number]: boolean }>({ 1: false, 2: false });
  
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [negotiatingPlayer, setNegotiatingPlayer] = useState<Player | null>(null);
  const [interactionPlayer, setInteractionPlayer] = useState<Player | null>(null);

  useEffect(() => {
    sounds.setMute(isMuted);
    localStorage.setItem('ba2026_muted', isMuted ? 'true' : 'false');
  }, [isMuted]);

  useEffect(() => {
    sounds.setVolume(volume);
    localStorage.setItem('ba2026_volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    if (!gameStarted) return;
    const newUnlocked: string[] = [];
    const newlyQueued: Achievement[] = [];
    ACHIEVEMENTS.forEach(achievement => {
      if (!gameState.unlockedAchievements.includes(achievement.id) && !newUnlocked.includes(achievement.id)) {
        if (achievement.check(gameState, players, teams)) {
          newUnlocked.push(achievement.id);
          newlyQueued.push(achievement);
        }
      }
    });
    if (newUnlocked.length > 0) {
      setGameState(prev => ({
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, ...newUnlocked]
      }));
      setAchievementQueue(prev => [...prev, ...newlyQueued]);
      sounds.success();
    }
  }, [gameState.cash, gameState.reputation, gameState.managedTeamId, gameState.officeLevel, players.length, gameStarted, teams]);

  useEffect(() => {
    if (!activeAchievement && achievementQueue.length > 0) {
      const next = achievementQueue[0];
      setAchievementQueue(prev => prev.slice(1));
      setActiveAchievement(next);
    }
  }, [achievementQueue, activeAchievement]);

  useEffect(() => {
    const slots = {
      1: !!localStorage.getItem(`${SAVE_KEY_PREFIX}1`),
      2: !!localStorage.getItem(`${SAVE_KEY_PREFIX}2`)
    };
    setSaveSlotsAvailable(slots);
  }, []);

  const handleSaveGame = useCallback((silent: boolean = false) => {
    const saveData = { gameState, players, teams, matches, timestamp: Date.now() };
    localStorage.setItem(`${SAVE_KEY_PREFIX}${gameState.saveSlot}`, JSON.stringify(saveData));
    setSaveSlotsAvailable(prev => ({ ...prev, [gameState.saveSlot]: true }));
    if (!silent) {
      sounds.success();
      setGameState(prev => ({
        ...prev,
        notifications: [{ id: generateId(), title: 'System Synced', message: `Agency data secured to Slot ${gameState.saveSlot}.`, week: prev.week, type: 'success' }, ...prev.notifications]
      }));
    }
  }, [gameState, players, teams, matches]);

  const handleLoadSave = (slot: number) => {
    const savedString = localStorage.getItem(`${SAVE_KEY_PREFIX}${slot}`);
    if (!savedString) return;
    try {
      const data = JSON.parse(savedString);
      setGameState(data.gameState);
      setPlayers(data.players);
      setTeams(data.teams);
      setMatches(data.matches);
      setGameStarted(true);
      setView('DASHBOARD');
      sounds.playBGM();
      sounds.success();
    } catch (e) {
      console.error("Save corruption detected.", e);
      alert("Error loading agency data.");
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    sounds.click();
  };

  const handleSetVolume = (v: number) => {
    setVolume(v);
  };

  const handleExitToMain = () => {
    sounds.click();
    setGameStarted(false);
    setView('DASHBOARD');
  };

  const handleHireScout = (level: 1 | 2 | 3) => {
    const cost = SCOUT_HIRE_COSTS[level - 1];
    if (gameState.cash < cost) { sounds.error(); alert("Insufficient capital."); return; }
    if (gameState.scouts.length >= 3) { sounds.error(); alert("Scouting team full."); return; }
    sounds.cash();
    const fName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const newScout: Scout = { id: generateId(), name: `${fName} ${lName}`, age: 30 + Math.floor(Math.random() * 30), level, efficiency: 0.5 + (level * 0.15) + (Math.random() * 0.1), salary: SCOUT_WEEKLY_SALARY[level - 1], hiredWeek: gameState.week };
    setGameState(prev => ({ ...prev, cash: prev.cash - cost, scouts: [...prev.scouts, newScout], notifications: [{ id: generateId(), title: 'New Scout Hired', message: `${newScout.name} joined the agency.`, week: prev.week, type: 'success' }, ...prev.notifications] }));
  };

  const handleScoutAcademy = (playerId: string, cost: number) => {
    if (gameState.scoutingPoints < cost) { sounds.error(); return; }
    sounds.success();
    setGameState(prev => ({ ...prev, scoutingPoints: prev.scoutingPoints - cost }));
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, scoutingLevel: ScoutingLevel.ELITE } : p));
  };

  const handleBailout = () => {
    sounds.cash();
    setGameState(prev => ({ ...prev, cash: 1000000, isBankrupt: false, reputation: Math.max(10, prev.reputation - 20), notifications: [{ id: generateId(), title: 'Emergency Bailout', message: 'Agency salvaged by external investors.', week: prev.week, type: 'success' }, ...prev.notifications] }));
  };

  const handleWatchAdReward = (type: string) => {
    sounds.success();
    setGameState(prev => {
      const updates: Partial<GameState> = {};
      if (type === 'CASH') updates.cash = prev.cash + 50000;
      if (type === 'REPUTATION') updates.reputation = prev.reputation + 5;
      return { ...prev, ...updates };
    });
  };

  const handleInteract = (playerId: string, type: 'TALK' | 'DINNER' | 'WATCH' | 'CAR') => {
    const costs = { TALK: 0, DINNER: 1500, WATCH: 25000, CAR: 250000 };
    const gains = { TALK: 3, DINNER: 8, WATCH: 20, CAR: 50 };
    const cost = costs[type];
    if (gameState.cash < cost) { sounds.error(); return; }
    sounds.cash();
    setGameState(prev => ({ ...prev, cash: prev.cash - cost }));
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, loyalty: Math.min(100, p.loyalty + gains[type]), morale: Math.min(100, p.morale + Math.floor(gains[type] / 2)) } : p));
  };

  const handleTrainAttribute = (playerId: string, attribute: keyof Player['stats']) => {
    setPlayers(currentPlayers => {
      const player = currentPlayers.find(p => p.id === playerId);
      if (!player) return currentPlayers;
      const statVal = player.stats[attribute];
      const cost = getTrainingCost(statVal);
      if (gameState.trainingPoints < cost) { sounds.error(); return currentPlayers; }
      sounds.success();
      setGameState(prev => ({ ...prev, trainingPoints: prev.trainingPoints - cost }));
      return currentPlayers.map(p => {
        if (p.id === playerId) {
          const newStats = { ...p.stats, [attribute]: p.stats[attribute] + 1 };
          const newRating = Math.floor((newStats.scoring + newStats.defense + newStats.playmaking + newStats.athleticism) / 4);
          return { ...p, stats: newStats, rating: newRating };
        }
        return p;
      });
    });
  };

  const handleUpgradeOffice = (upgrade: OfficeUpgrade) => {
    if (gameState.cash < upgrade.cost) { sounds.error(); return; }
    sounds.cash();
    setGameState(prev => ({ ...prev, cash: prev.officeLevel === 1 ? prev.cash : prev.cash - upgrade.cost, officeLevel: prev.officeLevel + 1, reputation: prev.reputation + upgrade.repGain, maxClients: upgrade.capacityGain }));
  };

  const handleBuyOfficeItem = (item: OfficeUpgrade) => {
    const repCost = item.cost / 1000;
    if (gameState.reputation < repCost) { sounds.error(); return; }
    sounds.success();
    setGameState(prev => ({ ...prev, reputation: prev.reputation - repCost, officeItems: [...prev.officeItems, item.id], maxClients: prev.maxClients + item.capacityGain }));
  };

  const handleTransferPlayer = (playerId: string, targetTeamId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    sounds.cash();
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, teamId: targetTeamId, timesTransferred: p.timesTransferred + 1 } : p));
    setTeams(prev => prev.map(t => {
      if (t.id === player.teamId) return { ...t, roster: t.roster.filter(id => id !== playerId) };
      if (t.id === targetTeamId) return { ...t, roster: [...t.roster, playerId] };
      return t;
    }));
  };

  const handleBuyLifestyle = (item: LifestyleItem) => {
    if (gameState.cash < item.price) { sounds.error(); return; }
    sounds.cash();
    setGameState(prev => ({ ...prev, cash: prev.cash - item.price, inventory: [...prev.inventory, item.id], reputation: prev.reputation + item.reputationGain }));
  };

  const handleStorePurchase = (item: any) => {
    sounds.cash();
    const { type, amount } = item.benefit;
    setGameState(prev => {
      const newState = { ...prev };
      if (type === 'CASH') newState.cash += amount;
      if (type === 'REPUTATION') newState.reputation += amount;
      if (type === 'TP') newState.trainingPoints += amount;
      if (type === 'INFLUENCE') newState.influencePoints += amount;
      return newState;
    });
  };

  const handleTakeLoan = (amount: number, interest: number) => {
    sounds.cash();
    const newLoan: Loan = { id: generateId(), principal: amount, balance: amount, weeklyInterest: interest, originationWeek: gameState.week };
    setGameState(prev => ({ ...prev, cash: prev.cash + amount, loans: [...prev.loans, newLoan] }));
  };

  const handleRepayLoan = (loanId: string, amount: number) => {
    if (gameState.cash < amount) return;
    sounds.cash();
    setGameState(prev => ({ ...prev, cash: prev.cash - amount, loans: prev.loans.map(l => l.id === loanId ? { ...l, balance: l.balance - amount } : l).filter(l => l.balance > 0.01) }));
  };

  const handleDecision = (option: GameDecisionOption) => {
    if (!gameState.activeDecision) return;
    const player = players.find(p => p.id === gameState.activeDecision!.playerId);
    if (!player) return;
    const { effects } = option;
    sounds.success();
    setGameState(prev => ({ ...prev, cash: prev.cash + (effects.cash || 0), reputation: Math.max(0, prev.reputation + (effects.reputation || 0)), influencePoints: Math.max(0, prev.influencePoints + (effects.influence || 0)), activeDecision: null }));
    setPlayers(prev => prev.map(p => p.id === player.id ? { ...p, loyalty: Math.min(100, Math.max(0, p.loyalty + (effects.loyalty || 0))), morale: Math.min(100, Math.max(0, p.morale + (effects.morale || 0))), rating: Math.max(40, p.rating + (effects.rating || 0)), coachTrust: Math.max(0, Math.min(100, (p.coachTrust || 50) + (effects.coachTrust || 0))), activeSponsorship: effects.sponsorship || p.activeSponsorship, isRetired: effects.retirePlayer || p.isRetired } : p));
  };

  const handleUpgradeFacility = (teamId: string, type: 'stadium' | 'medical' | 'scouting' | 'academy') => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    const currentLevel = team[`${type}Level` as keyof Team] as number;
    if (currentLevel >= 5) return;
    const cost = INFRASTRUCTURE_UPGRADE_COSTS[currentLevel];
    if (gameState.cash < cost) { sounds.error(); return; }
    
    sounds.cash();
    setGameState(prev => ({ ...prev, cash: prev.cash - cost }));
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, [`${type}Level`]: currentLevel + 1 } : t));
  };

  const handleFireManager = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team || !team.managerId) return;
    sounds.click();
    setGameState(prev => ({
      ...prev,
      managers: prev.managers.map(m => m.id === team.managerId ? { ...m, teamId: null } : m)
    }));
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, managerId: null } : t));
  };

  const handleFirePlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player || !player.teamId) return;
    sounds.click();
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, teamId: null } : p));
    setTeams(prev => prev.map(t => t.id === player.teamId ? { ...t, roster: t.roster.filter(id => id !== playerId) } : t));
  };

  const handleNextWeek = () => {
    if (gameState.activeDecision) { sounds.error(); alert("Crisis management required."); return; }
    sounds.swish();
    const { newState, updatedPlayers, updatedTeams, newMatches, newManagers } = advanceWeek(gameState, players, teams, matches);
    setGameState({ ...newState, managers: [...newState.managers, ...newManagers] }); 
    setPlayers(updatedPlayers); 
    setTeams(updatedTeams); 
    setMatches(newMatches);
    if (newState.cash < -200000) { sounds.buzzer(); setGameState(prev => ({ ...prev, isBankrupt: true })); }
  };

  const handleStartNew = (managerName: string, agencyName: string, slot: number) => {
    sounds.playBGM();
    sounds.success();
    const proTeams: Team[] = TEAMS_DATA.map(t => ({ ...t as Team, wins: 0, losses: 0, budget: 150000000, roster: [], chemistry: 70, championships: 0, valuation: t.valuation || 3000000000, sharePrice: (t.valuation || 3000000000) / 100, userShares: 0, weeklyRevenue: 100000, systemType: 'Pace & Space', stadiumLevel: 1, medicalLevel: 1, scoutingLevel: 1, academyLevel: 1, marketTrend: 'STABLE' }));
    const uniTeams: Team[] = UNIVERSITY_TEAMS_DATA.map(t => ({ ...t as Team, wins: 0, losses: 0, budget: 0, roster: [], chemistry: 70, championships: 0, valuation: 0, sharePrice: 0, userShares: 0, weeklyRevenue: 0, systemType: 'Grit & Grind', stadiumLevel: 1, medicalLevel: 1, scoutingLevel: 1, academyLevel: 1, marketTrend: 'STABLE' }));
    const allPlayers: Player[] = [];
    proTeams.forEach(team => { for (let i = 0; i < 12; i++) { const p = generatePlayer(team.id); allPlayers.push(p); team.roster.push(p.id); } });
    uniTeams.forEach(team => { for (let i = 0; i < 12; i++) { const p = generatePlayer(team.id, false, true); allPlayers.push(p); team.roster.push(p.id); } });
    for (let i = 0; i < 60; i++) { allPlayers.push(generatePlayer(null, false, true)); }
    setTeams([...proTeams, ...uniTeams]); 
    setPlayers(allPlayers);
    setGameState({ ...gameState, managerName, agencyName, saveSlot: slot, managers: Array.from({ length: 40 }, () => generateManager(null)), unlockedAchievements: [] });
    setGameStarted(true);
  };

  const handleBuyShares = (teamId: string, amount: number) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    const cost = team.sharePrice * amount;
    if (gameState.cash < cost) { sounds.error(); return; }
    sounds.cash();
    setGameState(prev => ({ ...prev, cash: prev.cash - cost }));
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, userShares: Math.min(100, t.userShares + amount) } : t));
  };

  const handleBecomeOwner = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    // PENALTY LOGIC: Switching or resigning affects Rep and Influence
    const hasOldTeam = gameState.managedTeamId !== null && gameState.managedTeamId !== teamId;
    const repHit = hasOldTeam ? 15 : 0;
    const infHit = hasOldTeam ? 20 : 0;

    sounds.success();
    setGameState(prev => ({ 
      ...prev, 
      managedTeamId: teamId, 
      reputation: Math.max(0, prev.reputation - repHit),
      influencePoints: Math.max(0, prev.influencePoints - infHit),
      notifications: [
        { id: generateId(), title: 'Executive Takeover', message: `Control of the ${team.name} secured.${hasOldTeam ? ' (Penalty for jumping ship applied)' : ''}`, week: prev.week, type: 'success' },
        ...prev.notifications
      ] 
    }));
    setView('DASHBOARD'); 
  };

  const handleResign = () => {
    if (!gameState.managedTeamId) return;
    const team = teams.find(t => t.id === gameState.managedTeamId);
    sounds.click();
    setGameState(prev => ({
      ...prev,
      managedTeamId: null,
      reputation: Math.max(0, prev.reputation - 15),
      influencePoints: Math.max(0, prev.influencePoints - 20),
      notifications: [
        { id: generateId(), title: 'Governor Resigned', message: `You have abandoned your post at ${team?.name || 'the franchise'}. (-15 REP, -20 INF)`, week: prev.week, type: 'danger' },
        ...prev.notifications
      ]
    }));
  };

  const handleSelectView = (v: ViewType) => { sounds.click(); setView(v); }

  if (!gameStarted) return <LandingPage onStartNew={handleStartNew} onLoadSave={handleLoadSave} onConnectGoogle={() => {}} onPurchasePremium={() => {}} isPremium={isPremiumGlobal} saveSlots={saveSlotsAvailable} isMuted={isMuted} onToggleMute={handleToggleMute} volume={volume} onVolumeChange={handleSetVolume} unlockedAchievements={gameState.unlockedAchievements} />;

  return (
    <div className="flex h-screen bg-[#050507] text-gray-100 overflow-hidden relative" onClick={() => sounds.playBGM()}>
      <Sidebar currentView={view} setView={handleSelectView} isPremium={gameState.isPremium} onExit={handleExitToMain} onSave={() => handleSaveGame(false)} isSaving={false} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header gameState={gameState} onNextWeek={handleNextWeek} onViewChange={handleSelectView} onExit={handleExitToMain} onSave={() => handleSaveGame(false)} isSaving={false} onShowFinance={() => { sounds.click(); setShowFinanceBreakdown(true); }} isMuted={isMuted} onToggleMute={handleToggleMute} />
        <main className="flex-1 overflow-y-auto p-3 md:p-6 pb-24 md:pb-12 scroll-container">
          {view === 'DASHBOARD' && <Dashboard gameState={gameState} players={players} teams={teams} matches={matches} onViewChange={handleSelectView} onSelectPlayer={setSelectedPlayer} onSelectTeam={setSelectedTeam} onSelectMatch={setSelectedMatch} onShowAwardHistory={()=>{}} onUpgradeFacility={handleUpgradeFacility} onFireManager={handleFireManager} onFirePlayer={handleFirePlayer} onShowFinance={() => setShowFinanceBreakdown(true)} />}
          {view === 'PLAYERS' && <PlayerList players={players.filter(p => !p.isYouth && !p.isRetired)} managers={gameState.managers} onSign={(id) => setNegotiatingPlayer(players.find(p => p.id === id) || null)} onHireManager={(id) => {
             const m = gameState.managers.find(x => x.id === id);
             if (m && gameState.managedTeamId) {
               setTeams(prev => prev.map(t => t.id === gameState.managedTeamId ? { ...t, managerId: id } : t));
               setGameState(prev => ({ ...prev, managers: prev.managers.map(x => x.id === id ? { ...x, teamId: gameState.managedTeamId } : x) }));
               sounds.success();
             }
          }} reputation={gameState.reputation} onSelectPlayer={setSelectedPlayer} onSelectManager={setSelectedManager} isOwner={!!gameState.managedTeamId} />}
          {view === 'AGENCY' && <AgencyView players={players.filter(p => p.isClient && !p.isRetired)} offers={[]} teams={teams} onTrain={setSelectedPlayer} onSelectPlayer={setSelectedPlayer} gameState={gameState} onUpgradeOffice={handleUpgradeOffice} onBuyOfficeItem={handleBuyOfficeItem} onTransferPlayer={handleTransferPlayer} onWatchAdReward={handleWatchAdReward} />}
          {view === 'ACADEMY' && <AcademyView gameState={gameState} teams={teams} players={players} matches={matches} hireScout={handleHireScout} academyPlayers={players.filter(p => p.isYouth && p.isClient)} talentPool={players.filter(p => p.isYouth && !p.teamId)} onSignAcademy={(id) => setNegotiatingPlayer(players.find(p => p.id === id) || null)} onScoutAcademy={handleScoutAcademy} onSelectPlayer={setSelectedPlayer} onSelectTeam={setSelectedTeam} onSelectMatch={setSelectedMatch} onWatchAdReward={handleWatchAdReward} onAssignToUniversity={(pid, tid) => setPlayers(prev => prev.map(p => p.id === pid ? {...p, teamId: tid} : p))} />}
          {view === 'FINANCE' && <FinanceView teams={teams} players={players} cash={gameState.cash} inventory={gameState.inventory} onBuyShares={handleBuyShares} onBuyLifestyle={handleBuyLifestyle} onSignSponsorship={()=>{}} onUpdateTeamFinance={()=>{}} managedTeamId={gameState.managedTeamId} onBecomeOwner={handleBecomeOwner} onResign={handleResign} onSelectPlayer={setSelectedPlayer} onTakeLoan={handleTakeLoan} onRepayLoan={handleRepayLoan} loans={gameState.loans} />}
          {view === 'LEAGUE' && <LeagueView teams={teams} matches={matches} gameState={gameState} players={players} onSelectTeam={setSelectedTeam} onSelectPlayer={setSelectedPlayer} onShowAwardHistory={()=>{}} />}
          {view === 'SCHEDULE' && <ScheduleView matches={matches} teams={teams} onSelectMatch={setSelectedMatch} />}
          {view === 'TRAINING' && <TrainingView clients={players.filter(p => p.isClient && !p.isRetired)} onTrain={handleTrainAttribute} trainingPoints={gameState.trainingPoints} />}
          {view === 'LIFESTYLE' && <LifestyleView inventory={gameState.inventory} cash={gameState.cash} onBuy={handleBuyLifestyle} />}
          {view === 'STORE' && <StoreView onPurchase={handleStorePurchase} />}
        </main>
      </div>
      {gameState.breakingNews && <BreakingNewsOverlay news={gameState.breakingNews} onClose={() => setGameState(prev => ({ ...prev, breakingNews: null }))} />}
      {gameState.activeDecision && <DecisionModal decision={gameState.activeDecision} player={players.find(p => p.id === gameState.activeDecision!.playerId)!} onResolve={handleDecision} />}
      {selectedPlayer && <PlayerModal player={selectedPlayer} teams={teams} onClose={() => setSelectedPlayer(null)} onSign={(id) => setNegotiatingPlayer(players.find(p => p.id === id) || null)} reputation={gameState.reputation} matches={[]} trainingPoints={gameState.trainingPoints} onTrainAttribute={handleTrainAttribute} onNegotiate={() => {setNegotiatingPlayer(selectedPlayer); setSelectedPlayer(null);}} onInteract={() => {setInteractionPlayer(selectedPlayer); setSelectedPlayer(null);}} />}
      {interactionPlayer && <InteractionModal player={interactionPlayer} onInteract={handleInteract} onClose={() => setInteractionPlayer(null)} cash={gameState.cash} />}
      {selectedTeam && <TeamModal team={selectedTeam} players={players.filter(p => p.teamId === selectedTeam.id)} onClose={() => setSelectedTeam(null)} onSelectPlayer={setSelectedPlayer} />}
      {selectedManager && <ManagerModal manager={selectedManager} team={teams.find(t => t.id === selectedManager.teamId)} onClose={() => setSelectedManager(null)} />}
      {negotiatingPlayer && <NegotiationModal player={negotiatingPlayer} managerName={gameState.managerName} agencyName={gameState.agencyName} onNegotiate={(pid, com, tcom) => { const signingFee = getSigningFee(negotiatingPlayer); if (gameState.cash < signingFee) { sounds.error(); alert("Insufficient cash for bonus."); return; } setGameState(prev => ({...prev, cash: prev.cash - signingFee, reputation: prev.reputation + 5})); setPlayers(p => p.map(x => x.id === pid ? {...x, isClient: true, agentCommission: com, transferCommission: tcom} : x)); setNegotiatingPlayer(null); }} onClose={() => setNegotiatingPlayer(null)} />}
      {selectedMatch && <MatchModal match={selectedMatch} teams={teams} players={players} onClose={() => setSelectedMatch(null)} onSelectPlayer={setSelectedPlayer} />}
      {gameState.isBankrupt && <BankruptcyModal onBailout={handleBailout} onRestart={() => window.location.reload()} />}
      {showFinanceBreakdown && <FinanceBreakdownModal gameState={gameState} players={players} teams={teams} onClose={() => setShowFinanceBreakdown(false)} />}
      {activeAchievement && <AchievementToast achievement={activeAchievement} onClose={() => setActiveAchievement(null)} />}
    </div>
  );
};

export default App;