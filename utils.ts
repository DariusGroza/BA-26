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

export const getSigningFee = (player: Player | null): number => {
  if (!player || player.isYouth) return 0;
  const rating = player.rating;
  if (rating < 60) return 1500;
  if (rating < 65) return 3500;
  const normalized = Math.max(0, (rating - 70) / 23); 
  const fee = Math.floor(Math.pow(normalized, 3.5) * 990000 + 10000);
  return Math.min(1000000, fee);
};

export const getTrainingCost = (val: number) => {
  if (val >= 85) return 25;
  if (val >= 70) return 10;
  return 5;
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
    morale: 70, loyalty: 60, fatigue: 0, contractYears: 2, agentCommission: 0.04, transferCommission: 0.05,
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
    id: generateId(), name: player.name, face: '👨‍💼', age: player.age, rating: avgRating, isClient: player.isClient, teamId: null, salary: 500000 + (avgRating * 20000), isFormerPlayer: true,
    stats: { tactics, coaching, leadership, playerDev }
  };
};

export const simulateMatch = (home: Team, away: Team, week: number, isYouthMatch: boolean = false, allPlayers: Player[] = []): Match => {
  const quarterScores: number[][] = [];
  let homeTotal = 0; let awayTotal = 0;
  const hPower = home.rating + (Math.random() * 10 - 5);
  const aPower = away.rating + (Math.random() * 10 - 5);
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
      const minutes = idx < 5 ? 30 + Math.random() * 10 : 10 + Math.random() * 10;
      const pts = Math.floor((p.rating / 4) * (minutes / 36) + Math.random() * 10);
      const reb = Math.floor((p.stats.athleticism / 10) + Math.random() * 5);
      const ast = Math.floor((p.stats.playmaking / 12) + Math.random() * 4);
      p.seasonStats.pts += pts;
      p.seasonStats.reb += reb;
      p.seasonStats.ast += ast;
      p.seasonStats.gamesPlayed += 1;
      p.seasonStats.minutesPerGame = (p.seasonStats.minutesPerGame * (p.seasonStats.gamesPlayed - 1) + minutes) / p.seasonStats.gamesPlayed;
      topPerformers.push({ name: p.name, face: p.face, pts, reb, ast, teamId: team.id, minutes });
    });
  });
  return {
    id: generateId(), homeTeamId: home.id, awayTeamId: away.id, homeScore: homeTotal, awayScore: awayTotal, week, isPlayed: true, isYouthMatch,
    details: { quarterScores, topPerformers: topPerformers.sort((a,b) => b.pts - a.pts).slice(0, 10), playerOfTheGame: topPerformers.sort((a,b) => b.pts - a.pts)[0] }
  };
};

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgm: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private currentVolume: number = 0.5;

  private async init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      return;
    }
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      // Using a reliably Public Domain / Creative Commons 0 music source (Free Music Archive / Public Domain Project)
      this.bgm = new Audio('https://ia800109.us.archive.org/16/items/pdp_theme_loops/pdp_hiphop_loop_01.mp3');
      this.bgm.loop = true;
      this.bgm.volume = this.currentVolume * 0.3;
    } catch (e) {
      console.warn("Audio Context init failed.");
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    if (this.masterGain) this.masterGain.gain.value = mute ? 0 : 1;
    if (this.bgm) {
      if (mute) this.bgm.pause();
      else this.bgm.play().catch(() => {});
    }
  }

  setVolume(v: number) {
    this.currentVolume = v;
    if (this.bgm) this.bgm.volume = this.isMuted ? 0 : v * 0.3;
  }

  playBGM() {
    this.init().then(() => {
      if (!this.isMuted && this.bgm) {
        this.bgm.play().catch(() => {});
      }
    });
  }

  private async osc(freq: number, type: OscillatorType, dur: number, vol: number = 0.1) {
    await this.init();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, this.ctx.currentTime);
    const scaledVol = vol * this.currentVolume;
    g.gain.setValueAtTime(scaledVol, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
    o.connect(g);
    g.connect(this.masterGain);
    o.start();
    o.stop(this.ctx.currentTime + dur);
  }

  click() { this.osc(600, 'sine', 0.1, 0.05); }
  success() { this.osc(440, 'sine', 0.1, 0.1); setTimeout(() => this.osc(880, 'sine', 0.2, 0.1), 100); }
  swish() { this.osc(1200, 'sine', 0.4, 0.05); }
  cash() { this.osc(1200, 'triangle', 0.05, 0.05); setTimeout(() => this.osc(1600, 'triangle', 0.3, 0.05), 50); }
  error() { this.osc(150, 'sawtooth', 0.3, 0.1); }
  buzzer() { this.osc(100, 'sawtooth', 1.0, 0.2); }
}

export const sounds = new SoundManager();