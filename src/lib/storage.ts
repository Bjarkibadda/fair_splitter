import { Team, Player } from '@/types';

const STORAGE_KEY = 'fair-splitter-teams';

// Utility to generate unique IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Load all teams from localStorage
export const loadTeams = (): Team[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const teams = JSON.parse(data) as Team[];
    // Convert date strings back to Date objects
    return teams.map(team => ({
      ...team,
      createdAt: new Date(team.createdAt)
    }));
  } catch (error) {
    console.error('Failed to load teams:', error);
    return [];
  }
};

// Save all teams to localStorage
export const saveTeams = (teams: Team[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  } catch (error) {
    console.error('Failed to save teams:', error);
  }
};

// Get a single team by ID
export const getTeam = (teamId: string): Team | null => {
  const teams = loadTeams();
  return teams.find(team => team.id === teamId) || null;
};

// Create a new team
export const createTeam = (name: string, description: string): Team => {
  const teams = loadTeams();
  const newTeam: Team = {
    id: generateId(),
    name,
    description,
    players: [],
    createdAt: new Date()
  };
  
  teams.push(newTeam);
  saveTeams(teams);
  return newTeam;
};

// Update an existing team
export const updateTeam = (teamId: string, updates: Partial<Omit<Team, 'id' | 'createdAt'>>): Team | null => {
  const teams = loadTeams();
  const teamIndex = teams.findIndex(team => team.id === teamId);
  
  if (teamIndex === -1) return null;
  
  teams[teamIndex] = { ...teams[teamIndex], ...updates };
  saveTeams(teams);
  return teams[teamIndex];
};

// Delete a team
export const deleteTeam = (teamId: string): boolean => {
  const teams = loadTeams();
  const filteredTeams = teams.filter(team => team.id !== teamId);
  
  if (filteredTeams.length === teams.length) return false;
  
  saveTeams(filteredTeams);
  return true;
};

// Add a player to a team
export const addPlayer = (teamId: string, playerData: Omit<Player, 'id' | 'teamId'>): Player | null => {
  const teams = loadTeams();
  const team = teams.find(t => t.id === teamId);
  
  if (!team) return null;
  
  const newPlayer: Player = {
    id: generateId(),
    teamId,
    ...playerData
  };
  
  team.players.push(newPlayer);
  saveTeams(teams);
  return newPlayer;
};

// Update a player
export const updatePlayer = (playerId: string, updates: Partial<Omit<Player, 'id' | 'teamId'>>): Player | null => {
  const teams = loadTeams();
  
  for (const team of teams) {
    const playerIndex = team.players.findIndex(p => p.id === playerId);
    if (playerIndex !== -1) {
      team.players[playerIndex] = { ...team.players[playerIndex], ...updates };
      saveTeams(teams);
      return team.players[playerIndex];
    }
  }
  
  return null;
};

// Delete a player
export const deletePlayer = (playerId: string): boolean => {
  const teams = loadTeams();
  let playerFound = false;
  
  for (const team of teams) {
    const initialLength = team.players.length;
    team.players = team.players.filter(p => p.id !== playerId);
    if (team.players.length < initialLength) {
      playerFound = true;
    }
  }
  
  if (playerFound) {
    saveTeams(teams);
  }
  
  return playerFound;
};

// Get all players from a team
export const getTeamPlayers = (teamId: string): Player[] => {
  const team = getTeam(teamId);
  return team?.players || [];
};

// Validate team data
export const validateTeam = (team: Partial<Team>): string[] => {
  const errors: string[] = [];
  
  if (!team.name || team.name.trim().length === 0) {
    errors.push('Team name is required');
  }
  
  if (team.name && team.name.trim().length > 50) {
    errors.push('Team name must be 50 characters or less');
  }
  
  if (team.description && team.description.length > 200) {
    errors.push('Description must be 200 characters or less');
  }
  
  return errors;
};

// Validate player data
export const validatePlayer = (player: Partial<Player>): string[] => {
  const errors: string[] = [];
  const validPositions = ['goalkeeper', 'defender', 'midfielder', 'forward'];
  
  if (!player.name || player.name.trim().length === 0) {
    errors.push('Player name is required');
  }
  
  if (player.name && player.name.trim().length > 50) {
    errors.push('Player name must be 50 characters or less');
  }
  
  if (!player.position || !validPositions.includes(player.position)) {
    errors.push('Valid position is required');
  }
  
  if (player.rating === undefined || player.rating < 0 || player.rating > 5) {
    errors.push('Rating must be between 0 and 5');
  }
  
  return errors;
};