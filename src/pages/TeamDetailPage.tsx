import { useEffect } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { useTeamsStore } from '@/store/useTeamsStore'
import PlayerCard from '@/components/PlayerCard'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, Users, Shuffle, Edit, Calendar, MoreHorizontal, Trash2 } from 'lucide-react'

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { teams, loadTeamsFromStorage, removePlayer, removeTeam } = useTeamsStore()
  
  useEffect(() => {
    if (teams.length === 0) {
      loadTeamsFromStorage()
    }
  }, [teams.length, loadTeamsFromStorage])

  if (!id) {
    return <Navigate to="/" replace />
  }

  const team = teams.find(t => t.id === id)

  if (teams.length > 0 && !team) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Team not found</h1>
        <p className="text-muted-foreground mb-6">
          The team you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/">Back to Teams</Link>
        </Button>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading team...</div>
      </div>
    )
  }

  const canGenerate = team.players.length >= 6

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const handleDeletePlayer = async (playerId: string) => {
    if (confirm('Are you sure you want to remove this player from the team?')) {
      await removePlayer(playerId)
    }
  }

  const handleDeleteTeam = async () => {
    if (confirm(`Are you sure you want to delete "${team.name}"? This action cannot be undone.`)) {
      await removeTeam(team.id)
      navigate('/')
    }
  }

  return (
    <div className="space-y-8">
      {/* Team Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{team.name}</h1>
            {team.description && (
              <p className="text-muted-foreground text-lg">{team.description}</p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/team/${team.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Team
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDeleteTeam}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{team.players.length} {team.players.length === 1 ? 'player' : 'players'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDate(team.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to={`/team/${team.id}/add-player`}>
            <Plus className="h-4 w-4 mr-2" />
            Add Player
          </Link>
        </Button>
        
        <Button 
          variant="secondary"
          disabled={!canGenerate}
          asChild={canGenerate}
        >
          {canGenerate ? (
            <Link to={`/team/${team.id}/generate`}>
              <Shuffle className="h-4 w-4 mr-2" />
              Generate Teams
            </Link>
          ) : (
            <>
              <Shuffle className="h-4 w-4 mr-2" />
              Generate Teams
            </>
          )}
        </Button>
        
        {!canGenerate && team.players.length > 0 && (
          <p className="text-sm text-muted-foreground flex items-center">
            Need at least 6 players to generate teams
          </p>
        )}
      </div>

      {/* Players Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Players</h2>
        
        {team.players.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No players yet</h3>
            <p className="text-muted-foreground mb-4">
              Add players to start building your team.
            </p>
            <Button asChild>
              <Link to={`/team/${team.id}/add-player`}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Player
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onEdit={() => navigate(`/team/${team.id}/player/${player.id}/edit`)}
                onDelete={() => handleDeletePlayer(player.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}