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
    <div className="p-4 bg-white dark:bg-black border-2 border-black dark:border-white font-mono relative">
      <div className="absolute -top-3 left-4 bg-white dark:bg-black px-2">
        <span className="text-xs uppercase tracking-widest">[ TEAM ]</span>
      </div>
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold mb-1 uppercase tracking-wider border-b-2 border-dotted border-black dark:border-white pb-1">
            {team.name}
          </h3>
          {team.description && (
            <p className="text-sm mt-2 leading-tight">{team.description}</p>
          )}
        </div>
        
        <div className="text-xs space-y-1 py-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">►</span>
            <Users className="h-3 w-3" />
            <span className="uppercase">Players:</span>
            <span className="font-bold">{playerCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">►</span>
            <Calendar className="h-3 w-3" />
            <span className="uppercase">Created:</span>
            <span className="font-bold">{formatDate(team.createdAt)}</span>
          </div>
        </div>
        
        <div className="border-t border-dashed border-black dark:border-white pt-3 mt-3">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              disabled={!canGenerate}
              asChild={canGenerate}
              className="flex-2 border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-mono uppercase text-xs tracking-wider h-8"
            >
              {canGenerate ? (
                <Link to={`/team/${team.id}/generate`}>
                  <Shuffle className="h-3 w-3 mr-1 inline" />
                  [GENERATE]
                </Link>
              ) : (
                <>
                  <Shuffle className="h-3 w-3 mr-1 inline" />
                  [GENERATE]
                </>
              )}
            </Button>
          </div>
          
          {!canGenerate && playerCount > 0 && (
            <div className="mt-2 text-xs border border-dashed border-black dark:border-white p-2">
              <span className="block">* REQUIREMENT: MIN. 6 PLAYERS</span>
              <span className="block">* CURRENT: {playerCount} PLAYER{playerCount !== 1 ? 'S' : ''}</span>
              <span className="block">* STATUS: INSUFFICIENT</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}