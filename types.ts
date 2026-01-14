
export enum Position {
  PG = 'PG',
  SG = 'SG',
  SF = 'SF',
  PF = 'PF',
  C = 'C'
}

export enum DraftPhase {
  PRE_DRAFT = 'PRE_DRAFT',
  LOTTERY = 'LOTTERY',
  DRAFT_NIGHT = 'DRAFT_NIGHT',
  POST_DRAFT = 'POST_DRAFT'
}

export enum LeaguePhase {
  REGULAR_SEASON = 'REGULAR_SEASON',
  ALL_STAR_WEEKEND = 'ALL_STAR_WEEKEND',
  PLAY_IN = 'PLAY_IN',
  PLAYOFFS = 'PLAYOFFS',
  FINALS = 'FINALS',
  OFFSEASON = 'OFFSEASON'
}

export enum Conference {
  EAST = 'EAST',
  WEST = 'WEST'
}

export enum ScoutingLevel {
  NONE = 0,
  BASIC = 1,
  ADVANCED = 2,
  ELITE = 3
}

export interface PlayerStats {
  scoring: number;
  defense: number;
  playmaking: number;
  athleticism: number;
  potential: number; 
}

export interface ManagerStats {
  tactics: number;
  coaching: number;
  leadership: number;
  playerDev: number;
}

export interface SeasonStats {
  pts: number;
  reb: number;
  ast: number;
  gamesPlayed: number;
  minutesPerGame: number;
}

export interface PlayerHistory {
  year: number;
  teamId: string | null;
  teamName: string;
  pts: number;
  reb: number;
  ast: number;
  rating: number;
  awards?: string[];
}

export interface PlayerSponsorship {
  brand: string;
  weeklyPayout: number;
  remainingWeeks: number;
}

export interface Player {
  id: string;
  name: string;
  face: string;
  age: number;
  position: Position;
  rating: number;
  stats: PlayerStats;
  teamId: string | null;
  salary: number;
  marketValue: number;
  morale: number;
  loyalty: number;
  fatigue: number;
  contractYears: number;
  agentCommission: number;
  transferCommission: number;
  timesTransferred: number;
  
  history: PlayerHistory[];
  seasonStats: SeasonStats;
  awards: string[]; 

  hasPlayerOption: boolean;
  hasTeamOption: boolean;
  hasNoTradeClause: boolean;
  buyoutClause: number | null;
  usageRate: number; 
  
  injuryWeeks: number;
  injuryType: string | null;
  injurySeverity?: 'Minor' | 'Moderate' | 'Severe';
  injuryDecisionPending?: boolean;
  isChronic?: boolean; 
  isClient: boolean;
  isRookie: boolean;
  isYouth?: boolean;
  isLateBloomer?: boolean; 
  peakAgeReached?: boolean;
  draftYear?: number;
  draftStock?: number;
  personality: 'Professional' | 'Ego' | 'Hard Worker' | 'Relaxed';
  injuryRisk: number;
  workEthic: number;
  scoutingLevel: ScoutingLevel;
  retirementAge: number;
  suspensionWeeks?: number;
  activeSponsorship?: PlayerSponsorship;
  isRetired?: boolean;

  coachTrust: number; 
  systemProficiency: number; 
  tradeRumorIntensity: number; 
  role: 'Star' | 'Starter' | 'Sixth Man' | 'Rotation' | 'Prospect';
}

export interface Manager {
  id: string;
  name: string;
  face: string;
  age: number;
  rating: number;
  stats: ManagerStats;
  salary: number;
  teamId: string | null;
  isClient: boolean;
  isFormerPlayer?: boolean;
}

export interface Team {
  id: string;
  name: string;
  city: string;
  logo: string;
  conference: Conference;
  division: string;
  rating: number;
  wins: number;
  losses: number;
  budget: number;
  roster: string[];
  chemistry: number; 
  championships: number;
  isUniversity?: boolean;
  
  managerId: string | null;
  valuation: number;
  sharePrice: number;
  userShares: number;
  weeklyRevenue: number;
  activeSponsorship?: Sponsorship;
  marketTrend: 'BULLISH' | 'BEARISH' | 'STABLE';

  ticketPrice?: number;
  marketingBudget?: number;
  attendance?: number;

  stadiumLevel: number;
  medicalLevel: number;
  scoutingLevel: number;
  academyLevel: number;
  systemType: 'Pace & Space' | 'Grit & Grind' | 'Triangle' | 'Seven Seconds';
}

export interface Sponsorship {
  id: string;
  brand: string;
  weeklyPayout: number;
  termWeeks: number;
  remainingWeeks: number;
}

export interface Loan {
  id: string;
  principal: number;
  balance: number;
  weeklyInterest: number;
  originationWeek: number;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  week: number;
  isPlayed: boolean;
  isYouthMatch?: boolean;
  isPlayoffMatch?: boolean;
  isAllStarMatch?: boolean;
  isDunkContest?: boolean;
  dunkContestants?: { name: string; score: number; face: string }[];
  seriesGame?: number;
  details?: {
    playerOfTheGame?: {
      name: string;
      face: string;
      pts: number;
      reb: number;
      ast: number;
      teamId: string;
    };
    quarterScores: number[][];
    topPerformers: {
      name: string;
      face: string;
      pts: number;
      reb: number;
      ast: number;
      teamId: string;
      minutes: number;
    }[];
  };
}

export interface GameDecisionOption {
  id: string;
  label: string;
  description: string;
  effects: {
    cash?: number;
    reputation?: number;
    loyalty?: number;
    morale?: number;
    rating?: number;
    suspension?: number;
    influence?: number;
    sponsorship?: PlayerSponsorship;
    retirePlayer?: boolean;
    potential?: number;
    coachTrust?: number;
    chemistry?: number;
    tradeRumors?: number;
  };
}

export interface GameDecision {
  id: string;
  playerId: string;
  title: string;
  description: string;
  category: 'LEGAL' | 'MEDIA' | 'SOCIAL' | 'INTERNAL' | 'COMMERCIAL' | 'LEGACY';
  options: GameDecisionOption[];
}

export interface Scout {
  id: string;
  name: string;
  age: number;
  level: 1 | 2 | 3;
  efficiency: number; 
  salary: number;
  hiredWeek: number;
}

export interface PlayoffSeries {
  id: string;
  team1Id: string;
  team2Id: string;
  team1Wins: number;
  team2Wins: number;
  round: number; 
  conference: Conference | 'NBA';
  winnerId: string | null;
}

export interface SeasonAwards {
  mvpId: string | null;
  scoringChampId: string | null;
  rookieOfYearId: string | null;
  dpoyId: string | null;
  dunkChampName?: string;
}

export interface OfficeUpgrade {
  id: string;
  name: string;
  cost: number;
  repGain: number;
  capacityGain: number;
  icon: string;
}

export interface GameState {
  week: number;
  year: number;
  cash: number;
  reputation: number;
  scoutingPoints: number;
  trainingPoints: number;
  scoutingBoostWeeks: number; 
  isScoutingBoostPermanent?: boolean;
  influencePoints: number;
  inventory: string[];
  notifications: GameNotification[];
  breakingNews: GameNotification | null; 
  draftProspects: Player[];
  universityPlayers: Player[]; 
  scouts: Scout[]; 
  scoutingProgress: number; 
  scoutReport: Player[]; 
  draftOrder: string[]; 
  activeOffers: TransferOffer[];
  draftPhase: DraftPhase;
  leaguePhase: LeaguePhase;
  playoffBracket: PlayoffSeries[];
  currentDraftPick: number;
  draftHistory: { pick: number; teamId: string; playerId: string; round: number }[];
  lastSeasonAwards?: SeasonAwards;
  awardHistory: { year: number, awards: SeasonAwards }[];
  managerName: string;
  agencyName: string;
  isPremium: boolean;
  saveSlot: number;
  lastAdWeek: 0;
  managedTeamId: string | null;
  isBankrupt?: boolean;
  managers: Manager[];
  transfersThisSeason: number;
  officeLevel: number;
  officeItems: string[];
  maxClients: number;
  activeDecision: GameDecision | null;
  globalLockoutWeeks: number;
  globalPandemicWeeks: number;
  capSpikeMultiplier: number;
  loans: Loan[];
  inflationRate: number;
  unlockedAchievements: string[];
}

export interface TransferOffer {
  id: string;
  playerId: string;
  teamId: string;
  fee: number;
  salaryOffer: number;
  years: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

export interface LifestyleItem {
  id: string;
  name: string;
  price: number;
  reputationGain: number;
  influenceGain: number;
  category: 'Housing' | 'Vehicle' | 'Education' | 'Luxury';
  image: string;
  owned: boolean;
}

export interface GameNotification {
  id: string;
  title: string;
  message: string;
  week: number;
  type: 'info' | 'success' | 'warning' | 'danger';
}

export type ViewType = 'DASHBOARD' | 'PLAYERS' | 'LEAGUE' | 'AGENCY' | 'MARKET' | 'DRAFT' | 'TRAINING' | 'LIFESTYLE' | 'SCHEDULE' | 'ACADEMY' | 'STORE' | 'FINANCE';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  check: (state: GameState, players: Player[], teams: Team[]) => boolean;
}
