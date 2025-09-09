import { GeneratedTeam, Position } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Trophy, Shuffle } from 'lucide-react'
import StarRating from '@/components/StarRating'

interface GeneratedTeamsDisplayProps {
  teams: GeneratedTeam[]
  onRegenerate: () => void
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

export default function GeneratedTeamsDisplay({ teams, onRegenerate }: GeneratedTeamsDisplayProps) {
  if (teams.length === 0) return null

  const overallBalance = teams.length > 1 ? 
    Math.max(...teams.map(t => t.averageRating)) - Math.min(...teams.map(t => t.averageRating)) : 0

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
          <Card key={team.id} className="overflow-hidden">
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
            
            <CardContent className="space-y-3">
              {team.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`${positionColors[player.position]} text-xs px-1.5 py-0.5`}
                    >
                      {positionLabels[player.position]}
                    </Badge>
                    <span className="font-medium text-sm">{player.name}</span>
                  </div>
                  
                  <StarRating
                    rating={player.rating}
                    readonly
                    size="sm"
                  />
                </div>
              ))}
              
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