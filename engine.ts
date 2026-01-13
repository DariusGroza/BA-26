
import { GameState, Player, Team, Match, GameNotification, DraftPhase, LeaguePhase, SeasonAwards, Conference, GameDecision, Loan, Manager } from './types';
import { simulateMatch, generateId, convertPlayerToManager } from './utils';
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
  
  if (nextWeek > 52) {
    finalNextWeek = 1;
    currentYear += 1;
    isNewYear = true;
    inflationFactor = 1.03 + (Math.random() * 0.04);
    notifications.push({ id: generateId(), title: 'Economic Shift', message: `Annual inflation is ${(inflationFactor*100-100).toFixed(1)}%. Costs increased.`, week: 1, type: 'warning' });
  }

  let loanInterest = 0;
  const updatedLoans = currentState.loans.map(loan => {
    const interest = loan.balance * (loan.weeklyInterest / 100);
    loanInterest += interest;
    return { ...loan, balance: loan.balance + interest };
  });

  const updatedTeams = teams.map(t => {
    if (t.isUniversity) return t;
    
    let performanceFactor = 0;
    const totalGames = t.wins + t.losses;
    if (totalGames > 10) {
      const winPct = t.wins / totalGames;
      if (winPct > 0.70) performanceFactor = 0.04; 
      else if (winPct < 0.30) performanceFactor = -0.04; 
    }

    const randomFluctuation = (Math.random() * 0.02 - 0.01); 
    let valuationChange = 1 + performanceFactor + randomFluctuation;

    if (isNewYear) valuationChange *= (inflationFactor * 1.02); 

    const updatedValuation = t.valuation * valuationChange;
    const baseRev = (t.rating * 150 * (t.ticketPrice || 120)) + (t.rating * 1000);

    // Dynamic Market Trends
    let marketTrend: 'BULLISH' | 'BEARISH' | 'STABLE' = t.marketTrend || 'STABLE';
    const trendRoll = Math.random();
    if (trendRoll < 0.15) {
      marketTrend = Math.random() > 0.5 ? 'BULLISH' : 'BEARISH';
    } else if (trendRoll < 0.30) {
      marketTrend = 'STABLE';
    }

    return { 
      ...t, 
      valuation: updatedValuation,
      sharePrice: updatedValuation / 100,
      weeklyRevenue: baseRev,
      marketTrend
    };
  });

  const newManagers: Manager[] = [];
  const updatedPlayers = players.map(p => {
    let newP = { ...p };
    if (isNewYear) {
      newP.age++;
      newP.salary *= inflationFactor;
      newP.marketValue *= (inflationFactor + (newP.rating > 85 ? 0.05 : 0));
      
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
          if (m.isClient) {
            notifications.push({ id: generateId(), title: 'New Career', message: `Your former client ${newP.name} is now open for coaching representation.`, week: 1, type: 'success' });
          }
        }
      }
    }

    if (newP.injuryWeeks > 0) {
      newP.injuryWeeks--;
      if (newP.injuryWeeks === 0 && newP.injurySeverity === 'Severe' && Math.random() < 0.25) {
        newP.isChronic = true;
        newP.stats.athleticism = Math.max(30, newP.stats.athleticism - 4);
        newP.stats.defense = Math.max(30, newP.stats.defense - 2);
        newP.rating = Math.floor((newP.stats.scoring + newP.stats.defense + newP.stats.playmaking + newP.stats.athleticism) / 4);
        notifications.push({ id: generateId(), title: 'Medical Report', message: `${newP.name}'s ${newP.injuryType} has left permanent physical scarring.`, week: currentState.week, type: 'danger' });
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
        newPlayedMatches.push(m);
        const winnerId = m.homeScore > m.awayScore ? m.homeTeamId : m.awayTeamId;
        const loserId = m.homeScore > m.awayScore ? m.awayTeamId : m.homeTeamId;
        
        const winner = updatedTeams.find(t => t.id === winnerId)!;
        const loser = updatedTeams.find(t => t.id === loserId)!;
        
        winner.wins++; 
        loser.losses++;
        winner.chemistry = Math.min(100, winner.chemistry + 0.5);
        loser.chemistry = Math.max(0, loser.chemistry - 0.5);

        const topPerformersWithInjuries = m.details?.topPerformers.filter(tp => {
          const p = updatedPlayers.find(up => up.name === tp.name);
          return p && p.injuryWeeks > 0 && p.injurySeverity === 'Severe';
        });
        if (topPerformersWithInjuries && topPerformersWithInjuries.length > 0 && !breakingNews) {
          breakingNews = { id: generateId(), title: 'BREAKING: INJURY ALERT', message: `${topPerformersWithInjuries[0].name} has sustained a potentially season-ending injury.`, week: currentState.week, type: 'danger' };
        }
      }
    }
  }

  let activeDecision = currentState.activeDecision;
  const myClients = updatedPlayers.filter(p => p.isClient && p.teamId && !p.isRetired);
  if (!activeDecision && myClients.length > 0 && Math.random() < 0.08) { 
    const isGood = Math.random() > 0.65;
    const pool = isGood ? GOOD_EVENTS : BAD_EVENTS;
    const randomEvent = pool[Math.floor(Math.random() * pool.length)];
    activeDecision = { ...randomEvent, id: generateId(), playerId: myClients[0].id };
  }

  // BALANCED INCOME: (Salary % Comm) + Flat Weekly Retainer
  let income = updatedPlayers.filter(p => p.isClient && !p.isRetired).reduce((acc, p) => {
    const commission = (p.salary / 52) * (p.agentCommission || 0.04);
    const retainer = p.agentRetainer || 0;
    return acc + commission + retainer;
  }, 0);
  
  const investmentYield = updatedTeams.reduce((acc, t) => acc + (t.weeklyRevenue * (t.userShares / 100) * 0.05), 0);
  
  // BALANCED EXPENSES: Base + Level-based scalability (more aggressive scaling)
  const totalWeeklyExpenses = (WEEKLY_EXPENSES + (currentState.officeLevel * 12000) + (currentState.officeItems.length * 3500)) * (isNewYear ? inflationFactor : 1);

  return {
    newState: {
      ...currentState, 
      week: finalNextWeek, 
      year: currentYear, 
      cash: currentState.cash + income + investmentYield - totalWeeklyExpenses - loanInterest,
      reputation: currentState.reputation, 
      loans: updatedLoans, 
      activeDecision, 
      breakingNews: breakingNews || null,
      notifications: notifications.concat(currentState.notifications).slice(0, 30)
    },
    updatedPlayers, 
    updatedTeams, 
    newMatches: newPlayedMatches.concat(matches).slice(0, 200),
    newManagers
  };
};
