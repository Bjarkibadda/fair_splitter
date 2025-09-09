import { Player, Position, GeneratedTeam, SplitOptions } from '@/types'

// Shuffle array using Fisher-Yates algorithm
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Calculate team balance score (lower is better)
function calculateTeamBalance(teams: GeneratedTeam[]): number {
  if (teams.length <= 1) return 0
  
  const ratings = teams.map(team => team.averageRating)
  const maxRating = Math.max(...ratings)
  const minRating = Math.min(...ratings)
  
  return maxRating - minRating
}

// Sort players by position priority for balanced distribution
function sortPlayersByPosition(players: Player[]): Player[] {
  const positionPriority: Record<Position, number> = {
    goalkeeper: 1,
    defender: 2,
    midfielder: 3,
    forward: 4
  }
  
  return [...players].sort((a, b) => {
    const priorityDiff = positionPriority[a.position] - positionPriority[b.position]
    if (priorityDiff !== 0) return priorityDiff
    
    // If same position, sort by rating (highest first)
    return b.rating - a.rating
  })
}

// Generate balanced teams using a greedy algorithm with multiple attempts
export function generateBalancedTeams(
  players: Player[],
  options: SplitOptions
): GeneratedTeam[] {
  const { numberOfTeams } = options
  
  if (players.length < numberOfTeams * 3) {
    throw new Error(`Need at least ${numberOfTeams * 3} players to create ${numberOfTeams} teams`)
  }
  
  if (numberOfTeams < 2) {
    throw new Error('Need at least 2 teams')
  }

  let bestTeams: GeneratedTeam[] = []
  let bestBalance = Infinity
  
  // Try multiple iterations to find the best balance
  for (let attempt = 0; attempt < 50; attempt++) {
    const teams = createTeamsAttempt(players, options)
    const balance = calculateTeamBalance(teams)
    
    if (balance < bestBalance) {
      bestBalance = balance
      bestTeams = teams
    }
    
    // If we found perfect balance, stop
    if (balance === 0) break
  }
  
  return bestTeams
}

function createTeamsAttempt(players: Player[], options: SplitOptions): GeneratedTeam[] {
  const { numberOfTeams } = options
  
  // Initialize empty teams
  const teams: GeneratedTeam[] = Array.from({ length: numberOfTeams }, (_, index) => ({
    id: `team-${index + 1}`,
    name: `Team ${index + 1}`,
    players: [],
    totalRating: 0,
    averageRating: 0,
    positionCount: {
      goalkeeper: 0,
      defender: 0,
      midfielder: 0,
      forward: 0
    }
  }))
  
  let availablePlayers = [...players]
  
  if (options.considerPosition) {
    // First, distribute goalkeepers evenly
    const goalkeepers = availablePlayers.filter(p => p.position === 'goalkeeper')
    availablePlayers = availablePlayers.filter(p => p.position !== 'goalkeeper')
    
    // Shuffle goalkeepers for randomness
    const shuffledGoalkeepers = shuffle(goalkeepers)
    shuffledGoalkeepers.forEach((gk, index) => {
      const teamIndex = index % numberOfTeams
      addPlayerToTeam(teams[teamIndex], gk)
    })
    
    // Sort remaining players by position priority
    availablePlayers = sortPlayersByPosition(availablePlayers)
  } else if (options.considerRating) {
    // Sort by rating (highest first) for snake draft
    availablePlayers.sort((a, b) => b.rating - a.rating)
  } else {
    // Random distribution
    availablePlayers = shuffle(availablePlayers)
  }
  
  // Distribute remaining players
  if (options.considerRating && options.considerPosition) {
    distributePlayersByRatingAndPosition(teams, availablePlayers)
  } else if (options.considerRating) {
    distributePlayersByRating(teams, availablePlayers)
  } else {
    distributePlayersRoundRobin(teams, availablePlayers)
  }
  
  return teams
}

function addPlayerToTeam(team: GeneratedTeam, player: Player) {
  team.players.push(player)
  team.totalRating += player.rating
  team.averageRating = team.players.length > 0 ? team.totalRating / team.players.length : 0
  team.positionCount[player.position]++
}

function distributePlayersByRatingAndPosition(teams: GeneratedTeam[], players: Player[]) {
  // Group players by position
  const playersByPosition = players.reduce((acc, player) => {
    if (!acc[player.position]) acc[player.position] = []
    acc[player.position].push(player)
    return acc
  }, {} as Record<Position, Player[]>)
  
  // Distribute each position group
  Object.entries(playersByPosition).forEach(([position, positionPlayers]) => {
    // Sort by rating within position
    positionPlayers.sort((a, b) => b.rating - a.rating)
    
    positionPlayers.forEach(player => {
      // Find team with least players in this position, then by lowest total rating
      const sortedTeams = teams
        .map((team, index) => ({ team, index }))
        .sort((a, b) => {
          const positionDiff = a.team.positionCount[position as Position] - b.team.positionCount[position as Position]
          if (positionDiff !== 0) return positionDiff
          return a.team.totalRating - b.team.totalRating
        })
      
      addPlayerToTeam(sortedTeams[0].team, player)
    })
  })
}

function distributePlayersByRating(teams: GeneratedTeam[], players: Player[]) {
  // Snake draft: 1,2,3,3,2,1,1,2,3...
  let forward = true
  let currentTeamIndex = 0
  
  players.forEach(player => {
    addPlayerToTeam(teams[currentTeamIndex], player)
    
    if (forward) {
      currentTeamIndex++
      if (currentTeamIndex >= teams.length) {
        currentTeamIndex = teams.length - 1
        forward = false
      }
    } else {
      currentTeamIndex--
      if (currentTeamIndex < 0) {
        currentTeamIndex = 0
        forward = true
      }
    }
  })
}

function distributePlayersRoundRobin(teams: GeneratedTeam[], players: Player[]) {
  players.forEach((player, index) => {
    const teamIndex = index % teams.length
    addPlayerToTeam(teams[teamIndex], player)
  })
}

// Validate that teams meet minimum player requirements
export function validateTeamGeneration(players: Player[], numberOfTeams: number): string[] {
  const errors: string[] = []
  
  if (players.length < numberOfTeams * 3) {
    errors.push(`Need at least ${numberOfTeams * 3} players to create ${numberOfTeams} teams with minimum 3 players each`)
  }
  
  if (numberOfTeams < 2) {
    errors.push('Must create at least 2 teams')
  }
  
  if (numberOfTeams > Math.floor(players.length / 3)) {
    errors.push(`Cannot create ${numberOfTeams} teams with only ${players.length} players`)
  }
  
  return errors
}