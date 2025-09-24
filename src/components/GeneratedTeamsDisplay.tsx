import { useState, DragEvent } from 'react'
import { GeneratedTeam, Position } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Trophy, Shuffle } from 'lucide-react'
import StarRating from '@/components/StarRating'

interface GeneratedTeamsDisplayProps {
  teams: GeneratedTeam[]
  onRegenerate: () => void
  onPlayerDrop: (payload: {
    sourceTeamId: string
    targetTeamId: string
    playerId: string
    targetPlayerId?: string
  }) => void
}

const positionColors: Record<Position, string> = {
  goalkeeper: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  defender: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  midfielder: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  forward: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const positionLabels: Record<Position, string> = {
  goalkeeper: 'GK',
  defender: 'DEF',
  midfielder: 'MID',
  forward: 'FWD',
}

export default function GeneratedTeamsDisplay({ teams, onRegenerate, onPlayerDrop }: GeneratedTeamsDisplayProps) {
  if (teams.length === 0) return null

  const overallBalance = teams.length > 1 ? 
    Math.max(...teams.map(t => t.averageRating)) - Math.min(...teams.map(t => t.averageRating)) : 0

  const [draggingPlayerId, setDraggingPlayerId] = useState<string | null>(null)
  const [overTeamId, setOverTeamId] = useState<string | null>(null)
  const [overPlayerId, setOverPlayerId] = useState<string | null>(null)

  const parseDragPayload = (event: DragEvent<HTMLDivElement>) => {
    try {
      const raw = event.dataTransfer.getData('application/json')
      if (!raw) return null
      const payload = JSON.parse(raw) as { sourceTeamId: string; playerId: string }
      if (!payload?.sourceTeamId || !payload?.playerId) return null
      return payload
    } catch (error) {
      console.error('Invalid drag payload', error)
      return null
    }
  }

  const clearDragState = () => {
    setDraggingPlayerId(null)
    setOverTeamId(null)
    setOverPlayerId(null)
  }

  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    playerId: string,
    teamId: string,
  ) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/json', JSON.stringify({ sourceTeamId: teamId, playerId }))
    setDraggingPlayerId(playerId)
  }

  const handleDragEnd = () => {
    clearDragState()
  }

  const handleDragEnterTeam = (event: DragEvent<HTMLDivElement>, teamId: string) => {
    event.preventDefault()
    setOverTeamId(teamId)
  }

  const handleDragOverTeam = (event: DragEvent<HTMLDivElement>, teamId: string) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setOverTeamId(teamId)
  }

  const handleDragLeaveTeam = (event: DragEvent<HTMLDivElement>, teamId: string) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setOverTeamId((current) => (current === teamId ? null : current))
    }
  }

  const handleDropOnTeam = (event: DragEvent<HTMLDivElement>, teamId: string) => {
    event.preventDefault()
    const payload = parseDragPayload(event)
    clearDragState()
    if (!payload) return
    onPlayerDrop({
      ...payload,
      targetTeamId: teamId,
    })
  }

  const handleDragEnterPlayer = (
    event: DragEvent<HTMLDivElement>,
    playerId: string,
    teamId: string,
  ) => {
    event.preventDefault()
    setOverTeamId(teamId)
    setOverPlayerId(playerId)
  }

  const handleDragOverPlayer = (
    event: DragEvent<HTMLDivElement>,
    playerId: string,
    teamId: string,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = 'move'
    setOverTeamId(teamId)
    setOverPlayerId(playerId)
  }

  const handleDragLeavePlayer = (event: DragEvent<HTMLDivElement>, playerId: string) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setOverPlayerId((current) => (current === playerId ? null : current))
    }
  }

  const handleDropOnPlayer = (
    event: DragEvent<HTMLDivElement>,
    playerId: string,
    teamId: string,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    const payload = parseDragPayload(event)
    clearDragState()
    if (!payload) return
    onPlayerDrop({
      ...payload,
      targetTeamId: teamId,
      targetPlayerId: playerId,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Generated Teams</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {teams.length} teams
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              Balance: {overallBalance.toFixed(1)} stars
            </span>
          </div>
        </div>
        
        <Button onClick={onRegenerate} variant="outline">
          <Shuffle className="h-4 w-4 mr-2" />
          Regenerate
        </Button>
      </div>

      {/* Teams grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card
            key={team.id}
            className={`flex h-full flex-col overflow-hidden transition-shadow duration-200 ease-out ${
              overTeamId === team.id ? 'ring-2 ring-primary/40 shadow-lg' : 'hover:shadow-md'
            }`}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span>{team.name}</span>
                <div className="text-right">
                  <div className="text-2xl font-bold">{team.averageRating.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">avg rating</div>
                </div>
              </CardTitle>
              
              {/* Position breakdown */}
              <div className="flex flex-wrap gap-1">
                {(Object.entries(team.positionCount) as [Position, number][])
                  .filter(([_, count]) => count > 0)
                  .map(([position, count]) => (
                    <Badge
                      key={position}
                      variant="secondary"
                      className={`${positionColors[position]} text-xs`}
                    >
                      {count} {positionLabels[position]}
                    </Badge>
                  ))}
              </div>
            </CardHeader>
            
            <CardContent
              className="flex flex-1 flex-col gap-3"
              onDragEnter={(event) => handleDragEnterTeam(event, team.id)}
              onDragOver={(event) => handleDragOverTeam(event, team.id)}
              onDragLeave={(event) => handleDragLeaveTeam(event, team.id)}
              onDrop={(event) => handleDropOnTeam(event, team.id)}
            >
              <div className="flex-1 space-y-3">
                {team.players.map((player) => (
                  <div
                    key={player.id}
                    draggable
                    aria-grabbed={draggingPlayerId === player.id}
                    onDragStart={(event) => handleDragStart(event, player.id, team.id)}
                    onDragEnter={(event) => handleDragEnterPlayer(event, player.id, team.id)}
                    onDragOver={(event) => handleDragOverPlayer(event, player.id, team.id)}
                    onDragLeave={(event) => handleDragLeavePlayer(event, player.id)}
                    onDrop={(event) => handleDropOnPlayer(event, player.id, team.id)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center justify-between rounded-lg bg-muted/30 p-2 shadow-sm transition-all duration-200 ease-out ${
                      draggingPlayerId === player.id
                        ? 'scale-[0.98] opacity-50'
                        : 'hover:-translate-y-[1px] hover:shadow-md'
                    } ${
                      overPlayerId === player.id ? 'ring-2 ring-primary/50 bg-primary/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`${positionColors[player.position]} text-xs px-1.5 py-0.5`}
                      >
                        {positionLabels[player.position]}
                      </Badge>
                      <span className="text-sm font-medium">{player.name}</span>
                    </div>
                    
                    <StarRating
                      rating={player.rating}
                      readonly
                      size="sm"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-border/50">
                <div className="text-xs text-muted-foreground">
                  {team.players.length} players • Total: {team.totalRating} stars
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {overallBalance > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Teams are balanced within {overallBalance.toFixed(1)} stars. 
            Lower values indicate better balance.
          </p>
        </div>
      )}
    </div>
  )
}
