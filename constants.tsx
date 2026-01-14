
import { Position, Team, LifestyleItem, Conference, OfficeUpgrade, Achievement } from './types';

export const INITIAL_CASH = 50000;
export const INITIAL_REPUTATION = 10;
export const WEEKLY_EXPENSES = 6500; // Increased base burn rate
export const AGENT_COMMISSION = 0.04;

export const SCOUTING_COSTS = {
  BASIC: 10000,
  ADVANCED: 35000,
  ELITE: 100000
};

export const SCOUT_HIRE_COSTS = [15000, 250000, 1000000]; // Tier 1 reduced from 50k to 15k
export const SCOUT_WEEKLY_SALARY = [2500, 7500, 25000]; // Significant expert salaries

export const OFFICE_UPGRADES: OfficeUpgrade[] = [
  { id: 'off_1', name: 'Virtual Workspace', cost: 0, repGain: 0, capacityGain: 5, icon: '💻' },
  { id: 'off_2', name: 'Downtown Studio', cost: 1250000, repGain: 8, capacityGain: 12, icon: '🏢' }, // Bumped from 450k
  { id: 'off_3', name: 'Executive Suite', cost: 7500000, repGain: 20, capacityGain: 30, icon: '🌆' }, // Bumped from 2.5M
  { id: 'off_4', name: 'Skyloft HQ', cost: 45000000, repGain: 45, capacityGain: 75, icon: '🏗️' }, // Bumped from 15M
  { id: 'off_5', name: 'Global Tower', cost: 250000000, repGain: 80, capacityGain: 999, icon: '🏙️' }, // Bumped from 75M
];

export const OFFICE_DECOR: OfficeUpgrade[] = [
  { id: 'dec_1', name: 'Ergonomic Desk', cost: 45000, repGain: 1, capacityGain: 1, icon: '🪑' },
  { id: 'dec_2', name: 'Coffee Machine', cost: 25000, repGain: 1, capacityGain: 0, icon: '☕' },
  { id: 'dec_3', name: 'Draft Wall', cost: 350000, repGain: 3, capacityGain: 4, icon: '📊' },
  { id: 'dec_4', name: 'Trophy Display', cost: 1200000, repGain: 7, capacityGain: 8, icon: '🏆' },
  { id: 'dec_5', name: 'Meeting Lounge', cost: 5500000, repGain: 15, capacityGain: 20, icon: '🛋️' },
];

export const INFRASTRUCTURE_UPGRADE_COSTS = [
  0,
  50000000,
  250000000,
  750000000,
  2000000000
];

export const UNIVERSITY_TEAMS_DATA: Partial<Team>[] = [
  { id: 'u_hav', city: 'Cambridge', name: 'Harvord Crimz', logo: '🏛️', rating: 62, isUniversity: true },
  { id: 'u_yal', city: 'New Haven', name: 'Yaleton Bullz', logo: '🐶', rating: 64, isUniversity: true },
  { id: 'u_pri', city: 'Prinseton', name: 'Prinstun Tigz', logo: '🐯', rating: 65, isUniversity: true },
  { id: 'u_pen', city: 'Philadelphia', name: 'Pennish Quakz', logo: '🔔', rating: 63, isUniversity: true },
  { id: 'u_col', city: 'New York', name: 'Colum Lionz', logo: '🦁', rating: 61, isUniversity: true },
  { id: 'u_cor', city: 'Ithaca', name: 'Cornil Red', logo: '🐻', rating: 60, isUniversity: true },
  { id: 'u_bro', city: 'Providence', name: 'Browner Bearz', logo: '🐻', rating: 59, isUniversity: true },
  { id: 'u_dar', city: 'Hanover', name: 'Dart Green', logo: '🌲', rating: 58, isUniversity: true },
];

export const TEAMS_DATA: Partial<Team>[] = [
  { id: 'atl', city: 'Atlanta', name: 'Hawkz', logo: '🦅', rating: 78, conference: Conference.EAST, division: 'Southeast', valuation: 3300000000 },
  { id: 'bos', city: 'Boston', name: 'Celts', logo: '☘️', rating: 92, conference: Conference.EAST, division: 'Atlantic', valuation: 6100000000 },
  { id: 'bkn', city: 'Brooklyn', name: 'Netz', logo: '🗽', rating: 76, conference: Conference.EAST, division: 'Atlantic', valuation: 4000000000 },
  { id: 'cha', city: 'Charlotte', name: 'Buzz', logo: '🐝', rating: 72, conference: Conference.EAST, division: 'Southeast', valuation: 3100000000 },
  { id: 'chi', city: 'Chicago', name: 'Bulz', logo: '🐂', rating: 79, conference: Conference.EAST, division: 'Central', valuation: 4700000000 },
  { id: 'cle', city: 'Cleveland', name: 'Cavz', logo: '⚔️', rating: 84, conference: Conference.EAST, division: 'Central', valuation: 3400000000 },
  { id: 'det', city: 'Detroit', name: 'Pistonz', logo: '⚙️', rating: 71, conference: Conference.EAST, division: 'Central', valuation: 3200000000 },
  { id: 'ind', city: 'Indiana', name: 'Pacerz', logo: '🏎️', rating: 82, conference: Conference.EAST, division: 'Central', valuation: 3000000000 },
  { id: 'mia', city: 'Miami', name: 'Heet', logo: '☄️', rating: 84, conference: Conference.EAST, division: 'Southeast', valuation: 4200000000 },
  { id: 'mil', city: 'Milwaukee', name: 'Buckz', logo: '🦌', rating: 89, conference: Conference.EAST, division: 'Central', valuation: 3900000000 },
  { id: 'nyk', city: 'New York', name: 'Knickz', logo: '🗽', rating: 89, conference: Conference.EAST, division: 'Atlantic', valuation: 7600000000 },
  { id: 'phi', city: 'Philly', name: 'Sixerz', logo: '🔔', rating: 88, conference: Conference.EAST, division: 'Atlantic', valuation: 4400000000 },
  { id: 'dal', city: 'Dallas', name: 'Mavz', logo: '🐎', rating: 88, conference: Conference.WEST, division: 'Southwest', valuation: 4500000000 },
  { id: 'den', city: 'Denver', name: 'Nugz', logo: '⛏️', rating: 91, conference: Conference.WEST, division: 'Northwest', valuation: 3700000000 },
  { id: 'gsw', city: 'Golden State', name: 'Warz', logo: '🌉', rating: 86, conference: Conference.WEST, division: 'Pacific', valuation: 8400000000 },
  { id: 'hou', city: 'Houston', name: 'Rokz', logo: '🚀', rating: 80, conference: Conference.WEST, division: 'Southwest', valuation: 4600000000 },
  { id: 'lac', city: 'LA', name: 'Clipz', logo: '⛵', rating: 85, conference: Conference.WEST, division: 'Pacific', valuation: 4800000000 },
  { id: 'lal', city: 'LA', name: 'Lakerz', logo: '👑', rating: 87, conference: Conference.WEST, division: 'Pacific', valuation: 7200000000 },
  { id: 'mem', city: 'Memphis', name: 'Grizz', logo: '🐻', rating: 83, conference: Conference.WEST, division: 'Southwest', valuation: 2700000000 },
  { id: 'min', city: 'Minnesota', name: 'Wolfz', logo: '🐺', rating: 87, conference: Conference.WEST, division: 'Northwest', valuation: 3300000000 },
  { id: 'okc', city: 'OKC', name: 'Boltz', logo: '⚡', rating: 90, conference: Conference.WEST, division: 'Northwest', valuation: 3600000000 },
  { id: 'phx', city: 'Phoenix', name: 'Sunz', logo: '☀️', rating: 86, conference: Conference.WEST, division: 'Pacific', valuation: 4300000000 },
  { id: 'por', city: 'Portland', name: 'Blazerz', logo: '🌹', rating: 73, conference: Conference.WEST, division: 'Northwest', valuation: 3100000000 },
  { id: 'sas', city: 'San Antonio', name: 'Spurz', logo: '🤠', rating: 83, conference: Conference.WEST, division: 'Southwest', valuation: 3400000000 },
];

export const LIFESTYLE_ITEMS: LifestyleItem[] = [
  // HOUSING - SCALE TO MATCH HIGH COMMISSION INCOME
  { id: 'h_0', name: 'Studio Apartment', price: 45000, reputationGain: 1, influenceGain: 0, category: 'Housing', image: '🏢', owned: false },
  { id: 'h_1', name: 'Luxury Condo', price: 4500000, reputationGain: 12, influenceGain: 2, category: 'Housing', image: '🏙️', owned: false },
  { id: 'h_2', name: 'Malibu Villa', price: 85000000, reputationGain: 35, influenceGain: 10, category: 'Housing', image: '🕌', owned: false },
  { id: 'h_3', name: 'Mega Mansion', price: 750000000, reputationGain: 75, influenceGain: 30, category: 'Housing', image: '🏰', owned: false },
  { id: 'h_4', name: 'Private Island', price: 12000000000, reputationGain: 120, influenceGain: 100, category: 'Housing', image: '🏝️', owned: false },
  { id: 'h_5', name: 'Global Estate', price: 85000000000, reputationGain: 150, influenceGain: 500, category: 'Housing', image: '🏯', owned: false },

  // VEHICLES
  { id: 'v_0', name: 'Custom E-Bike', price: 15000, reputationGain: 0, influenceGain: 0, category: 'Vehicle', image: '🚲', owned: false },
  { id: 'v_1', name: 'German Sports Car', price: 450000, reputationGain: 5, influenceGain: 1, category: 'Vehicle', image: '🚗', owned: false },
  { id: 'v_2', name: 'G650 Gulfstream', price: 1250000000, reputationGain: 80, influenceGain: 50, category: 'Vehicle', image: '𛛩️', owned: false },
  { id: 'v_3', name: 'Eclipse Mega Yacht', price: 25000000000, reputationGain: 140, influenceGain: 250, category: 'Vehicle', image: '🚢', owned: false },

  // LUXURY
  { id: 'l_0', name: 'Savile Row Suit', price: 45000, reputationGain: 1, influenceGain: 1, category: 'Luxury', image: '👔', owned: false },
  { id: 'l_1', name: 'Nautilus Patek', price: 2500000, reputationGain: 8, influenceGain: 2, category: 'Luxury', image: '⌚', owned: false },
  { id: 'l_2', name: 'Picasso Original', price: 150000000, reputationGain: 45, influenceGain: 20, category: 'Luxury', image: '🎨', owned: false },
  { id: 'l_3', name: 'Tuscany Vineyard', price: 4500000000, reputationGain: 100, influenceGain: 80, category: 'Luxury', image: '🍇', owned: false },

  // LEGACY
  { id: 'e_0', name: 'Public Foundation', price: 75000000, reputationGain: 40, influenceGain: 150, category: 'Education', image: '🤝', owned: false },
  { id: 'e_1', name: 'Surgical Center', price: 4500000000, reputationGain: 90, influenceGain: 400, category: 'Education', image: '🏥', owned: false },
  { id: 'e_2', name: 'Mars colony R&D', price: 500000000000, reputationGain: 150, influenceGain: 5000, category: 'Education', image: '🚀', owned: false },
];

export const FIRST_NAMES = ['Bron', 'Steph', 'Kev', 'Luka', 'Gian', 'Ja', 'Ky', 'Shai', 'Chet', 'Zion', 'Nik', 'Joel', 'Dame', 'Trae', 'Bam'];
export const LAST_NAMES = ['Jams', 'Kurry', 'Tarant', 'Dancic', 'Anteto', 'Embed', 'Lillard', 'Irv', 'Gilyous', 'Holmgrn', 'Willims', 'Morant'];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_client',
    title: 'Representation Protocol',
    description: 'Signed your first professional client.',
    icon: '🤝',
    check: (state, players) => players.some(p => p.isClient)
  },
  {
    id: 'millionaire',
    title: 'The Million Club',
    description: 'Surpassed $1,000,000 in agency liquidity.',
    icon: '💰',
    check: (state) => state.cash >= 1000000
  },
  {
    id: 'governor',
    title: 'Governor Status',
    description: 'Assumed majority control (51%) of a franchise.',
    icon: '🏢',
    check: (state) => !!state.managedTeamId
  },
  {
    id: 'rep_master',
    title: 'Industry Icon',
    description: 'Reached a reputation of 100.',
    icon: '👑',
    check: (state) => state.reputation >= 100
  },
  {
    id: 'full_office',
    title: 'Global Empire',
    description: 'Reached maximum office level.',
    icon: '🏙️',
    check: (state) => state.officeLevel >= 5
  },
  {
    id: 'billionaire',
    title: 'Billionaire Bureau',
    description: 'Amassed $1,000,000,000 in agency cash.',
    icon: '💎',
    check: (state) => state.cash >= 1000000000
  },
  {
    id: 'pro_stable',
    title: 'Talent Titan',
    description: 'Represented 5 or more professional clients simultaneously.',
    icon: '🏀',
    check: (state, players) => players.filter(p => p.isClient && !p.isYouth).length >= 5
  }
];
