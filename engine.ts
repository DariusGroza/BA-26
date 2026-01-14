import { GameState, Player, Team, Match, GameNotification, DraftPhase, LeaguePhase, SeasonAwards, Conference, GameDecision, Loan, Manager } from './types';
import { simulateMatch, generateId, convertPlayerToManager, generatePlayer } from './utils';
import { AGENT_COMMISSION, WEEKLY_EXPENSES } from './constants';

const BAD_EVENTS: Omit<GameDecision, 'id' | 'playerId'>[] = [
  {
    title: 'Career-Threatening Snap',
    description: 'A devastating non-contact knee injury. Doctors say he might never be the same. Experimental surgery or call it a career?',
    category: 'LEGACY',
    options: [
      { id: 'b1', label: 'Swiss Biotech Lab', description: 'Massive upfront cost. Low chance to retain peak.', effects: { cash: -1000000, rating: -10, potential: -15, loyalty: 50, morale: -20 } },
      { id: 'b2', label: 'Retirement Payout', description: 'Liquidate the contract. Collect insurance.', effects: { cash: 5000000, retirePlayer: true, reputation: -10 } }
    ]
  },
  {
    title: 'Locker Room Conflict',
    description: 'A heated argument turned physical. The teammate has a massive ego and your client isn\'t backing down. The GM is demanding a public truce.',
    category: 'INTERNAL',
    options: [
      { id: 'i1', label: 'Force an Apology', description: 'Publicly humiliate your client to save team chemistry.', effects: { morale: -30, loyalty: -20, chemistry: 15, coachTrust: 5 } },
      { id: 'i2', label: 'Back the Player', description: 'Demand the teammate be traded instead.', effects: { loyalty: 30, chemistry: -25, tradeRumors: 40, coachTrust: -15 } }
    ]
  },
  {
    title: 'Bank Fraud Accusation',
    description: 'An offshore account tied to your agency is flagged. The league is freezing assets during the probe.',
    category: 'LEGAL',
    options: [
      { id: 'i1', label: 'Cooperate', description: 'Lose 20% of your cash immediately.', effects: { cash: -500000, reputation: 10 } },
      { id: 'i2', label: 'Hide Evidence', description: 'Keep the cash, but lose 50 Influence.', effects: { influence: -50, reputation: -20 } }
    ]
  }
];

const GOOD_EVENTS: Omit<GameDecision, 'id' | 'playerId'>[] = [
  {
    title: 'Unexpected Superstardom',
    description: 'A viral "game of the year" performance has skyrocketed his market value. Brands are knocking.',
    category: 'LEGACY',
    options: [
      { id: 'g1', label: 'Global Media Pivot', description: 'Sign the movie deals.', effects: { cash: 2000000, reputation: 40, potential: 5, coachTrust: -5 } },
      { id: 'g2', label: 'The Grinder Path', description: 'Ignore the fame. Stay in the gym.', effects: { rating: 5, coachTrust: 25, potential: 2, morale: 20 } }
    ]
  }
];

export const advanceWeek = (
  currentState: GameState,
  players: Player[],
  teams: Team[],
  matches: Match[]
): {
  newState: GameState;
  updatedPlayers: Player[];
  updatedTeams: Team[];
  newMatches: Match[];
  newManagers: Manager[];
} => {
  const nextWeek = currentState.week + 1;
  const notifications: GameNotification[] = [];
  let breakingNews: GameNotification | null = null;
  let currentYear = currentState.year;
  let finalNextWeek = nextWeek;
  let isNewYear = false;
  let inflationFactor = 1.0;
  let bonusAcademyPlayers: Player[] = [];
  
  if (nextWeek > 52) {
    finalNextWeek = 1;
    currentYear += 1;
    isNewYear = true;
    inflationFactor = 1.03 + (Math.random() * 0.04);
    notifications.push({ id: generateId(), title: 'Happy New Year!', message: `The ${currentYear} season has officially begun. Annual graduates are arriving.`, week: 1, type: 'success' });
  }

  let loanInterest = 0;
  const updatedLoans = currentState.loans.map(loan => {
    const interest = loan.balance * (loan.weeklyInterest / 100);
    loanInterest += interest;
    return { ...loan, balance: loan.balance + interest };
  });

  const updatedTeams = teams.map(t => {
    if (t.isUniversity) {
      if (isNewYear) return { ...t, wins: 0, losses: 0 };
      return t;
    }
    
    // ACADEMY BENEFIT: Yearly Youth Graduation
    if (isNewYear && t.academyLevel > 0) {
      const graduate = generatePlayer(t.id, true, false);
      const ratingBump = (t.academyLevel - 1) * 6;
      const potentialBump = (t.academyLevel - 1) * 5;
      graduate.rating = Math.min(88, 65 + ratingBump + Math.floor(Math.random() * 5));
      graduate.stats.potential = Math.min(99, 78 + potentialBump);
      graduate.name += " (H.G.)"; // Home Grown
      bonusAcademyPlayers.push(graduate);
      t.roster.push(graduate.id);
      
      if (t.id === currentState.managedTeamId) {
        notifications.push({ id: generateId(), title: 'Academy Graduate', message: `A promising homegrown prospect (${graduate.rating} OVR) has joined your team.`, week: 1, type: 'success' });
      }
    }

    // STADIUM BENEFIT: Revenue Multiplier (25% per level)
    const stadiumMultiplier = 1 + ((t.stadiumLevel - 1) * 0.25);
    const baseRev = ((t.rating * 160 * (t.ticketPrice || 120)) + (t.rating * 1200)) * stadiumMultiplier;

    let performanceFactor = 0;
    const totalGames = t.wins + t.losses;
    if (totalGames > 10) {
      const winPct = t.wins / totalGames;
      if (winPct > 0.70) performanceFactor = 0.04; 
      else if (winPct < 0.30) performanceFactor = -0.04; 
    }

    const randomFluctuation = (Math.random() * 0.02 - 0.01); 
    let valuationChange = 1 + performanceFactor + randomFluctuation;

    if (isNewYear) {
      valuationChange *= (inflationFactor * 1.02); 
    }

    let marketTrend: 'BULLISH' | 'BEARISH' | 'STABLE' = t.marketTrend || 'STABLE';
    const trendRoll = Math.random();
    if (trendRoll < 0.15) {
      marketTrend = Math.random() > 0.5 ? 'BULLISH' : 'BEARISH';
    } else if (trendRoll < 0.30) {
      marketTrend = 'STABLE';
    }

    return { 
      ...t, 
      wins: isNewYear ? 0 : t.wins,
      losses: isNewYear ? 0 : t.losses,
      valuation: t.valuation * valuationChange,
      sharePrice: (t.valuation * valuationChange) / 100,
      weeklyRevenue: baseRev,
      marketTrend
    };
  });

  const newManagers: Manager[] = [];
  let updatedPlayers = [...players, ...bonusAcademyPlayers].map(p => {
    let newP = { ...p };
    const pTeam = updatedTeams.find(t => t.id === p.teamId);

    if (isNewYear) {
      newP.age++;
      newP.salary *= inflationFactor;
      newP.marketValue *= (inflationFactor + (newP.rating > 85 ? 0.05 : 0));
      newP.seasonStats = { pts: 0, reb: 0, ast: 0, gamesPlayed: 0, minutesPerGame: 0 };

      if (newP.age >= newP.retirementAge && !newP.isRetired) {
        newP.isRetired = true;
        newP.teamId = null;
        const retirementNote = { id: generateId(), title: 'Retirement', message: `${newP.name} has hung up his jersey.`, week: 1, type: 'info' as const };
        notifications.push(retirementNote);
        if (newP.rating >= 85) {
          breakingNews = { ...retirementNote, title: 'LEGEND RETIRES', message: `End of an era as ${newP.name} officially retires from professional basketball.` };
        }
        if (newP.rating > 70 || newP.isClient) {
          const m = convertPlayerToManager(newP);
          newManagers.push(m);
        }
      }
    }

    if (newP.injuryWeeks > 0) {
      // MEDICAL BENEFIT: Faster recovery speed (15% per level)
      const recoveryBoost = pTeam ? (pTeam.medicalLevel - 1) * 0.15 : 0;
      if (Math.random() < recoveryBoost) {
        newP.injuryWeeks = Math.max(0, newP.injuryWeeks - 2);
      } else {
        newP.injuryWeeks--;
      }
    }
    return newP;
  });

  const newPlayedMatches: Match[] = [];
  if (currentState.leaguePhase === LeaguePhase.REGULAR_SEASON) {
    const proTeams = updatedTeams.filter(t => !t.isUniversity);
    const shuffledPro = [...proTeams].sort(() => Math.random() - 0.5);
    for (let i = 0; i < shuffledPro.length; i += 2) {
      if (shuffledPro[i + 1]) {
        const m = simulateMatch(shuffledPro[i], shuffledPro[i + 1], finalNextWeek, false, updatedPlayers);
        
        // MEDICAL BENEFIT: Injury Prevention (15% reduction per level)
        m.details?.topPerformers.forEach(tp => {
          const p = updatedPlayers.find(up => up.name === tp.name);
          if (p && p.injuryWeeks > 0) {
             const team = updatedTeams.find(t => t.id === p.teamId);
             if (team && Math.random() < (team.medicalLevel - 1) * 0.15) {
                p.injuryWeeks = 0; // Prevented by medical staff
                p.injuryType = null;
             }
          }
        });

        newPlayedMatches.push(m);
        const winnerId = m.homeScore > m.awayScore ? m.homeTeamId : m.awayTeamId;
        const loserId = m.homeScore > m.awayScore ? m.awayTeamId : m.homeTeamId;
        updatedTeams.find(t => t.id === winnerId)!.wins++; 
        updatedTeams.find(t => t.id === loserId)!.losses++;
      }
    }
  }

  // SCOUTING BENEFIT: Weekly Scouting Point Yield
  const ownedTeam = updatedTeams.find(t => t.id === currentState.managedTeamId);
  const bonusSP = ownedTeam ? Math.floor(ownedTeam.scoutingLevel * 1.5) : 0;

  let activeDecision = currentState.activeDecision;
  const myClients = updatedPlayers.filter(p => p.isClient && p.teamId && !p.isRetired);
  if (!activeDecision && myClients.length > 0 && Math.random() < 0.08) { 
    const pool = Math.random() > 0.65 ? GOOD_EVENTS : BAD_EVENTS;
    const randomEvent = pool[Math.floor(Math.random() * pool.length)];
    activeDecision = { ...randomEvent, id: generateId(), playerId: myClients[0].id };
  }

  let income = updatedPlayers.filter(p => p.isClient && !p.isRetired).reduce((acc, p) => {
    return acc + ((p.salary / 52) * (p.agentCommission || 0.04));
  }, 0);
  
  const investmentYield = updatedTeams.reduce((acc, t) => acc + (t.weeklyRevenue * (t.userShares / 100) * 0.05), 0);
  const totalWeeklyExpenses = (WEEKLY_EXPENSES + (currentState.officeLevel * 12000) + (currentState.officeItems.length * 3500)) * (isNewYear ? inflationFactor : 1);

  return {
    newState: {
      ...currentState, 
      week: finalNextWeek, 
      year: currentYear, 
      cash: currentState.cash + income + investmentYield - totalWeeklyExpenses - loanInterest,
      scoutingPoints: currentState.scoutingPoints + bonusSP,
      loans: updatedLoans, 
      activeDecision, 
      breakingNews: breakingNews || null,
      notifications: notifications.concat(currentState.notifications).slice(0, 30)
    },
    updatedPlayers, 
    updatedTeams, 
    newMatches: newPlayedMatches.concat(matches).slice(0, 400),
    newManagers
  };
};