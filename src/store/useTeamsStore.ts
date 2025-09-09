import { create } from 'zustand'
import { Team, Player } from '@/types'
import { 
  loadTeams, 
  createTeam, 
  updateTeam, 
  deleteTeam,
  addPlayer,
  updatePlayer,
  deletePlayer
} from '@/lib/storage'

interface TeamsState {
  teams: Team[]
  isLoading: boolean
  
  // Actions
  loadTeamsFromStorage: () => void
  addTeam: (name: string, description: string) => Promise<Team>
  editTeam: (teamId: string, updates: Partial<Omit<Team, 'id' | 'createdAt'>>) => Promise<Team | null>
  removeTeam: (teamId: string) => Promise<boolean>
  getTeamById: (teamId: string) => Team | null
  
  // Player actions
  addPlayerToTeam: (teamId: string, playerData: Omit<Player, 'id' | 'teamId'>) => Promise<Player | null>
  editPlayer: (playerId: string, updates: Partial<Omit<Player, 'id' | 'teamId'>>) => Promise<Player | null>
  removePlayer: (playerId: string) => Promise<boolean>
}

export const useTeamsStore = create<TeamsState>((set, get) => ({
  teams: [],
  isLoading: false,

  loadTeamsFromStorage: () => {
    set({ isLoading: true })
    try {
      const teams = loadTeams()
      set({ teams, isLoading: false })
    } catch (error) {
      console.error('Failed to load teams:', error)
      set({ isLoading: false })
    }
  },

  addTeam: async (name: string, description: string) => {
    const newTeam = createTeam(name, description)
    const currentTeams = get().teams
    set({ teams: [...currentTeams, newTeam] })
    return newTeam
  },

  editTeam: async (teamId: string, updates: Partial<Omit<Team, 'id' | 'createdAt'>>) => {
    const updatedTeam = updateTeam(teamId, updates)
    if (updatedTeam) {
      const currentTeams = get().teams
      set({ 
        teams: currentTeams.map(team => 
          team.id === teamId ? updatedTeam : team
        )
      })
    }
    return updatedTeam
  },

  removeTeam: async (teamId: string) => {
    const success = deleteTeam(teamId)
    if (success) {
      const currentTeams = get().teams
      set({ teams: currentTeams.filter(team => team.id !== teamId) })
    }
    return success
  },

  getTeamById: (teamId: string) => {
    return get().teams.find(team => team.id === teamId) || null
  },

  addPlayerToTeam: async (teamId: string, playerData: Omit<Player, 'id' | 'teamId'>) => {
    const newPlayer = addPlayer(teamId, playerData)
    if (newPlayer) {
      // Refresh teams from storage to get updated data
      get().loadTeamsFromStorage()
    }
    return newPlayer
  },

  editPlayer: async (playerId: string, updates: Partial<Omit<Player, 'id' | 'teamId'>>) => {
    const updatedPlayer = updatePlayer(playerId, updates)
    if (updatedPlayer) {
      // Refresh teams from storage to get updated data
      get().loadTeamsFromStorage()
    }
    return updatedPlayer
  },

  removePlayer: async (playerId: string) => {
    const success = deletePlayer(playerId)
    if (success) {
      // Refresh teams from storage to get updated data
      get().loadTeamsFromStorage()
    }
    return success
  },
}))