import { Link } from 'react-router-dom'
import { Team } from '@/types'
import { Button } from '@/components/ui/button'
import { Users, Calendar, Shuffle } from 'lucide-react'

interface TeamCardProps {
  team: Team
}

export default function TeamCard({ team }: TeamCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const playerCount = team.players.length
  const canGenerate = playerCount >= 6 // Minimum 6 players to split into 2 teams of 3

  return (
    <div className="p-6 border border-border rounded-lg bg-card hover:shadow-md transition-all duration-200">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
          {team.description && (
            <p className="text-muted-foreground text-sm mb-3">{team.description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{playerCount} {playerCount === 1 ? 'player' : 'players'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(team.createdAt)}</span>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link to={`/team/${team.id}`}>
              View Team
            </Link>
          </Button>
          
          <Button 
            size="sm" 
            disabled={!canGenerate}
            asChild={canGenerate}
            className="flex-1"
          >
            {canGenerate ? (
              <Link to={`/team/${team.id}/generate`}>
                <Shuffle className="h-4 w-4 mr-1" />
                Generate
              </Link>
            ) : (
              <>
                <Shuffle className="h-4 w-4 mr-1" />
                Generate
              </>
            )}
          </Button>
        </div>
        
        {!canGenerate && playerCount > 0 && (
          <p className="text-xs text-muted-foreground">
            Need at least 6 players to generate teams
          </p>
        )}
      </div>
    </div>
  )
}