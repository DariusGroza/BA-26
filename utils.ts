
import { Position, Player, Team, Match, ScoutingLevel, Manager, Scout } from './types';
import { FIRST_NAMES, LAST_NAMES, TEAMS_DATA } from './constants';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getRequiredReputation = (player: Player): number => {
  const rating = player.rating;
  if (player.isYouth) return 10 + Math.max(0, (player.stats.potential - 70) * 2);
  if (rating < 80) return Math.max(0, rating - 60);
  if (rating < 90) return (rating - 80) * 4 + 20;
  return (rating - 90) * 15 + 60;
};

const PERSONALITIES: Player['personality'][] = ['Professional', 'Ego', 'Hard Worker', 'Relaxed'];
const ROLES: Player['role'][] = ['Star', 'Starter', 'Sixth Man', 'Rotation', 'Prospect'];

const PLAYER_FACES = [
  '👨🏾‍🦱', '👨🏼‍🦱', '👨🏻‍🦰', '👨🏽‍🦲', '👱‍♂️', '👨🏾‍🦲', '👨🏿', '🧔', '🧔🏾', '👨🏽‍🦱', 
  '👨🏿‍🦱', '👨🏼‍🦰', '👨🏻‍🦱', '👨🏾‍🦰', '👱🏾‍♂️', '👱🏻‍♂️', '👨🏾', '👨🏽', '👨🏻', '👨🏼'
];

const boxMullerTransform = () => {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

const getNormalDist = (mean: number, stdDev: number) => {
  return Math.floor(mean + boxMullerTransform() * stdDev);
};

export const generatePlayer = (teamId: string | null = null, isRookie = false, isYouth = false): Player => {
  const fName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const posKeys = Object.values(Position);
  const position = posKeys[Math.floor(Math.random() * posKeys.length)] as Position;
  
  let age = isRookie ? 19 + Math.floor(Math.random() * 3) : 20 + Math.floor(Math.random() * 15);
  if (isYouth) age = 15 + Math.floor(Math.random() * 4); 

  const mean = isYouth ? 52 : isRookie ? 70 : 76;
  const stdDev = isYouth ? 5 : isRookie ? 4 : 6;
  const baseRating = getNormalDist(mean, stdDev);
  
  const stats = {
    scoring: Math.max(20, Math.min(99, baseRating + getNormalDist(0, 8))),
    defense: Math.max(20, Math.min(99, baseRating + getNormalDist(0, 8))),
    playmaking: Math.max(20, Math.min(99, baseRating + getNormalDist(0, 8))),
    athleticism: Math.max(20, Math.min(99, baseRating + getNormalDist(0, 8))),
    potential: isYouth ? 78 + Math.floor(Math.random() * 20) : 70 + Math.floor(Math.random() * 25),
  };

  const rating = Math.floor((stats.scoring + stats.defense + stats.playmaking + stats.athleticism) / 4);
  const marketValue = Math.floor(Math.pow(rating - 50, 2.2) * 15000 + (stats.potential * 10000));
  
  return {
    id: generateId(), name: `${fName} ${lName}`, face: PLAYER_FACES[Math.floor(Math.random() * PLAYER_FACES.length)],
    age, position, rating, stats, teamId, salary: Math.floor(Math.pow(rating - 60, 2) * 35000) + 1100000, marketValue,
    morale: 70, loyalty: 60, fatigue: 0, contractYears: 2, agentCommission: 0.04, agentRetainer: 0, transferCommission: 0.05,
    timesTransferred: 0, history: [], awards: [], seasonStats: { pts: 0, reb: 0, ast: 0, gamesPlayed: 0, minutesPerGame: 0 },
    hasPlayerOption: false, hasTeamOption: false, hasNoTradeClause: false, buyoutClause: null, usageRate: 20, 
    injuryWeeks: 0, injuryType: null, isClient: false, isRookie, isYouth, personality: PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)],
    injuryRisk: Math.floor(Math.random() * 100), workEthic: Math.floor(Math.random() * 100), scoutingLevel: ScoutingLevel.NONE, retirementAge: 35,
    coachTrust: 50, systemProficiency: 70, tradeRumorIntensity: 0, role: ROLES[Math.floor(Math.random() * ROLES.length)]
  };
};

export const generateManager = (teamId: string | null = null): Manager => {
  const fName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const rating = getNormalDist(75, 8);
  return {
    id: generateId(), name: `${fName} ${lName}`, face: '👔', age: 50, rating, isClient: false, teamId,
    stats: { tactics: rating, coaching: rating, leadership: rating, playerDev: rating }, salary: 2000000
  };
};

export const convertPlayerToManager = (player: Player): Manager => {
  const tactics = Math.floor((player.stats.playmaking + player.stats.defense) / 2);
  const coaching = Math.floor((player.rating + player.stats.potential) / 2);
  const leadership = player.personality === 'Professional' || player.personality === 'Hard Worker' ? 85 : 60;
  const playerDev = Math.floor(player.stats.potential * 0.85);

  const avgRating = Math.floor((tactics + coaching + leadership + playerDev) / 4);

  return {
    id: generateId(),
    name: player.name,
    face: '👨‍💼', 
    age: player.age,
    rating: avgRating,
    isClient: player.isClient,
    teamId: null,
    salary: 500000 + (avgRating * 20000),
    isFormerPlayer: true,
    stats: {
      tactics,
      coaching,
      leadership,
      playerDev
    }
  };
};

export const simulateMatch = (home: Team, away: Team, week: number, isYouthMatch: boolean = false, allPlayers: Player[] = []): Match => {
  const quarterScores: number[][] = [];
  let homeTotal = 0; let awayTotal = 0;

  const getPower = (team: Team) => {
    const chemFactor = 0.9 + (team.chemistry / 100) * 0.2;
    return team.rating * chemFactor + (Math.random() * 10 - 5);
  };

  const hPower = getPower(home);
  const aPower = getPower(away);

  for (let q = 1; q <= 4; q++) {
    const hScore = Math.floor(22 + (hPower - 75) * 0.5 + Math.random() * 10);
    const aScore = Math.floor(22 + (aPower - 75) * 0.5 + Math.random() * 10);
    quarterScores.push([hScore, aScore]);
    homeTotal += hScore; awayTotal += aScore;
  }

  const topPerformers: any[] = [];
  [home, away].forEach(team => {
    const roster = allPlayers.filter(p => p.teamId === team.id && p.injuryWeeks === 0).sort((a,b) => b.rating - a.rating);
    roster.slice(0, 10).forEach((p, idx) => {
      const trustBonus = (p.coachTrust - 50) / 100; 
      const rumorPenalty = (p.tradeRumorIntensity / 100) * 0.15; 
      const systemBonus = (p.systemProficiency - 70) / 100;
      
      const effectiveRating = p.rating * (1 + trustBonus + systemBonus - rumorPenalty);
      const minutes = idx < 5 ? 30 + Math.random() * 10 : 10 + Math.random() * 10;
      const pts = Math.floor((effectiveRating / 4) * (minutes / 36) + Math.random() * 10);
      const reb = Math.floor((p.stats.athleticism / 10) + Math.random() * 5);
      const ast = Math.floor((p.stats.playmaking / 12) + Math.random() * 4);
      
      p.seasonStats.pts += pts;
      p.seasonStats.reb += reb;
      p.seasonStats.ast += ast;
      p.seasonStats.gamesPlayed += 1;
      p.seasonStats.minutesPerGame = (p.seasonStats.minutesPerGame * (p.seasonStats.gamesPlayed - 1) + minutes) / p.seasonStats.gamesPlayed;
      
      if (pts > 20) p.coachTrust = Math.min(100, p.coachTrust + 2);
      if (pts < 5 && idx < 5) p.coachTrust = Math.max(0, p.coachTrust - 3);

      topPerformers.push({ name: p.name, pts, reb, ast, teamId: team.id, minutes });
    });
  });

  return {
    id: generateId(), homeTeamId: home.id, awayTeamId: away.id, homeScore: homeTotal, awayScore: awayTotal,
    week, isPlayed: true, isYouthMatch, details: { 
      quarterScores, topPerformers: topPerformers.sort((a,b) => b.pts - a.pts).slice(0, 10),
      playerOfTheGame: topPerformers.sort((a,b) => b.pts - a.pts)[0]
    }
  };
};
