import { Position, Team, LifestyleItem, Conference, OfficeUpgrade, Achievement } from './types';

export const INITIAL_CASH = 150000; // Reduced from 500k to prevent easy early game boost
export const INITIAL_REPUTATION = 5; 
export const WEEKLY_EXPENSES = 1500; 
export const AGENT_COMMISSION = 0.04;

export const SCOUTING_COSTS = {
  BASIC: 10000,
  ADVANCED: 35000,
  ELITE: 100000
};

export const SCOUT_HIRE_COSTS = [15000, 250000, 1000000]; 
export const SCOUT_WEEKLY_SALARY = [2500, 7500, 25000]; 

export const OFFICE_UPGRADES: OfficeUpgrade[] = [
  { id: 'off_1', name: 'Virtual Workspace', cost: 0, repGain: 0, capacityGain: 5, icon: '💻' },
  { id: 'off_2', name: 'Downtown Studio', cost: 1250000, repGain: 2, capacityGain: 12, icon: '🏢' }, // Rep reduced 8 -> 2
  { id: 'off_3', name: 'Executive Suite', cost: 7500000, repGain: 5, capacityGain: 30, icon: '🌆' }, // Rep reduced 20 -> 5
  { id: 'off_4', name: 'Skyloft HQ', cost: 45000000, repGain: 15, capacityGain: 75, icon: '🏗️' }, // Rep reduced 45 -> 15
  { id: 'off_5', name: 'Global Tower', cost: 250000000, repGain: 40, capacityGain: 999, icon: '🏙️' }, // Rep reduced 80 -> 40
];

export const OFFICE_DECOR: OfficeUpgrade[] = [
  { id: 'dec_1', name: 'Ergonomic Desk', cost: 45000, repGain: 0.1, capacityGain: 1, icon: '🪑' }, // Rep reduced
  { id: 'dec_2', name: 'Coffee Machine', cost: 25000, repGain: 0.1, capacityGain: 0, icon: '☕' }, // Rep reduced
  { id: 'dec_3', name: 'Draft Wall', cost: 350000, repGain: 0.5, capacityGain: 4, icon: '📊' }, // Rep reduced
  { id: 'dec_4', name: 'Trophy Display', cost: 1200000, repGain: 2, capacityGain: 8, icon: '🏆' }, // Rep reduced
  { id: 'dec_5', name: 'Meeting Lounge', cost: 5500000, repGain: 5, capacityGain: 20, icon: '🛋️' }, // Rep reduced
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
  { id: 'h_0', name: 'Studio Apartment', price: 45000, reputationGain: 0.2, influenceGain: 0, category: 'Housing', image: '🏢', owned: false },
  { id: 'h_1', name: 'Luxury Condo', price: 4500000, reputationGain: 3, influenceGain: 2, category: 'Housing', image: '🏙️', owned: false },
  { id: 'h_2', name: 'Malibu Villa', price: 85000000, reputationGain: 12, influenceGain: 10, category: 'Housing', image: '🕌', owned: false },
  { id: 'h_3', name: 'Mega Mansion', price: 750000000, reputationGain: 35, influenceGain: 30, category: 'Housing', image: '🏰', owned: false },
  { id: 'h_4', name: 'Private Island', price: 12000000000, reputationGain: 60, influenceGain: 100, category: 'Housing', image: '🏝️', owned: false },
  { id: 'h_5', name: 'Global Estate', price: 85000000000, reputationGain: 90, influenceGain: 500, category: 'Housing', image: '🏯', owned: false },
  
  { id: 'v_0', name: 'Custom E-Bike', price: 15000, reputationGain: 0, influenceGain: 0, category: 'Vehicle', image: '🚲', owned: false },
  { id: 'v_1', name: 'German Sports Car', price: 450000, reputationGain: 1, influenceGain: 1, category: 'Vehicle', image: '🚗', owned: false },
  { id: 'v_2', name: 'G650 Gulfstream', price: 1250000000, reputationGain: 25, influenceGain: 50, category: 'Vehicle', image: '𛛩️', owned: false },
  { id: 'v_3', name: 'Eclipse Mega Yacht', price: 25000000000, reputationGain: 55, influenceGain: 250, category: 'Vehicle', image: '🚢', owned: false },
  
  { id: 'l_0', name: 'Savile Row Suit', price: 45000, reputationGain: 0.2, influenceGain: 1, category: 'Luxury', image: '👔', owned: false },
  { id: 'l_1', name: 'Nautilus Patek', price: 2500000, reputationGain: 2, influenceGain: 2, category: 'Luxury', image: '⌚', owned: false },
  { id: 'l_2', name: 'Picasso Original', price: 150000000, reputationGain: 15, influenceGain: 20, category: 'Luxury', image: '🎨', owned: false },
  { id: 'l_3', name: 'Tuscany Vineyard', price: 4500000000, reputationGain: 30, influenceGain: 80, category: 'Luxury', image: '🍇', owned: false },
  
  { id: 'e_0', name: 'Public Foundation', price: 75000000, reputationGain: 10, influenceGain: 150, category: 'Education', image: '🤝', owned: false },
  { id: 'e_1', name: 'Surgical Center', price: 4500000000, reputationGain: 40, influenceGain: 400, category: 'Education', image: '🏥', owned: false },
  { id: 'e_2', name: 'Mars colony R&D', price: 500000000000, reputationGain: 80, influenceGain: 5000, category: 'Education', image: '🚀', owned: false },
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
    id: 'youth_movement',
    title: 'The Future',
    description: 'Sign a youth prospect to your academy.',
    icon: '🎓',
    check: (state, players) => players.some(p => p.isClient && p.isYouth)
  },
  {
    id: 'millionaire',
    title: 'The Million Club',
    description: 'Surpassed $1,000,000 in agency liquidity.',
    icon: '💰',
    check: (state) => state.cash >= 1000000
  },
  {
    id: 'scout_squad',
    title: 'Eyes Everywhere',
    description: 'Assemble a full team of 3 scouts.',
    icon: '🔭',
    check: (state) => state.scouts.length >= 3
  },
  {
    id: 'debt_free',
    title: 'Financial Freedom',
    description: 'Have zero debt and over $500k in cash.',
    icon: '💳',
    check: (state) => state.loans.length === 0 && state.cash >= 500000
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
    id: 'loyalty_leader',
    title: 'Blood Brothers',
    description: 'Maintain 100% loyalty with a professional client.',
    icon: '🤞',
    check: (state, players) => players.some(p => p.isClient && !p.isYouth && p.loyalty >= 100)
  },
  {
    id: 'training_guru',
    title: 'Peak Performance',
    description: 'Train a client attribute to the maximum level (99).',
    icon: '💪',
    check: (state, players) => players.some(p => p.isClient && (p.stats.scoring >= 99 || p.stats.defense >= 99 || p.stats.playmaking >= 99 || p.stats.athleticism >= 99))
  },
  {
    id: 'real_estate',
    title: 'Landlord',
    description: 'Own 3 or more housing properties.',
    icon: '🏠',
    check: (state) => state.inventory.filter(id => id.startsWith('h_')).length >= 3
  },
  {
    id: 'champion',
    title: 'Ring Bearer',
    description: 'Win a Championship as a Franchise Governor.',
    icon: '💍',
    check: (state, players, teams) => {
        if (!state.managedTeamId) return false;
        const team = teams.find(t => t.id === state.managedTeamId);
        return !!team && team.championships > 0;
    }
  },
  {
    id: 'full_office',
    title: 'Global Empire',
    description: 'Reached maximum office level.',
    icon: '🏙️',
    check: (state) => state.officeLevel >= 5
  },
  {
    id: 'influence_peddler',
    title: 'Shadow Broker',
    description: 'Amass 100 Influence Points.',
    icon: '🕵️',
    check: (state) => state.influencePoints >= 100
  },
  {
    id: 'monopoly',
    title: 'Total Control',
    description: 'Own 100% of a franchise\'s shares.',
    icon: '🎩',
    check: (state, players, teams) => teams.some(t => t.userShares >= 100)
  },
  {
    id: 'veteran',
    title: 'Five Year Plan',
    description: 'Successfully manage your agency until 2031.',
    icon: '📅',
    check: (state) => state.year >= 2031
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
  },
  {
    id: 'shark',
    title: 'The Shark',
    description: 'Earn over $50,000 in weekly commissions.',
    icon: '🦈',
    check: (state, players) => {
      const weeklyComm = players.filter(p => p.isClient && !p.isRetired).reduce((acc, p) => acc + ((p.salary / 52) * (p.agentCommission || 0.04)), 0);
      return weeklyComm >= 50000;
    }
  },
  {
    id: 'draft_guru',
    title: 'Crystal Ball',
    description: 'Draft a player who develops into an 85+ OVR Star.',
    icon: '🔮',
    check: (state, players) => {
      return state.draftHistory.some(pick => {
        const p = players.find(player => player.id === pick.playerId);
        return p && p.rating >= 85;
      });
    }
  },
  {
    id: 'diversified',
    title: 'Hedge Fund',
    description: 'Own equity in at least 5 different franchises.',
    icon: '🌐',
    check: (state, players, teams) => teams.filter(t => t.userShares > 0).length >= 5
  },
  {
    id: 'marketing_genius',
    title: 'Brand Mogul',
    description: 'Have 3 clients with active sponsorships simultaneously.',
    icon: '📺',
    check: (state, players) => players.filter(p => p.isClient && p.activeSponsorship).length >= 3
  },
  {
    id: 'supermax',
    title: 'Bag Secure',
    description: 'Negotiate a contract worth over $40,000,000 per year.',
    icon: '💰',
    check: (state, players) => players.some(p => p.isClient && p.salary >= 40000000)
  },
  {
    id: 'injury_free',
    title: 'Load Management',
    description: 'Maintain 5+ professional clients with zero active injuries.',
    icon: '🩺',
    check: (state, players) => {
      const clients = players.filter(p => p.isClient && !p.isYouth);
      return clients.length >= 5 && clients.every(p => p.injuryWeeks === 0);
    }
  },
  {
    id: 'centurion',
    title: 'The Centurion',
    description: 'Play for 100 weeks in a single career.',
    icon: '💯',
    check: (state) => (state.year - 2026) * 52 + state.week >= 100
  }
];
