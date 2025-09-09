import { useState, useEffect } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { useTeamsStore } from '@/store/useTeamsStore'
import { generateBalancedTeams, validateTeamGeneration } from '@/lib/teamGenerator'
import GeneratedTeamsDisplay from '@/components/GeneratedTeamsDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GeneratedTeam, SplitOptions } from '@/types'
import { Settings, Users, ArrowLeft } from 'lucide-react'

export default function GenerateTeamsPage() {
  const { id } = useParams<{ id: string }>()
  const { teams, loadTeamsFromStorage } = useTeamsStore()
  
  const [splitOptions, setSplitOptions] = useState<SplitOptions>({
    considerRating: true,
    considerPosition: true,
    numberOfTeams: 2,
  })
  
  const [generatedTeams, setGeneratedTeams] = useState<GeneratedTeam[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

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
    return <Navigate to="/" replace />
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading team...</div>
      </div>
    )
  }

  const maxPossibleTeams = Math.floor(team.players.length / 3)
  const canGenerate = team.players.length >= 6

  const handleGenerate = () => {
    setIsGenerating(true)
    setErrors([])
    
    try {
      const validationErrors = validateTeamGeneration(team.players, splitOptions.numberOfTeams)
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        setIsGenerating(false)
        return
      }

      const generated = generateBalancedTeams(team.players, splitOptions)
      setGeneratedTeams(generated)
    } catch (error) {
      console.error('Failed to generate teams:', error)
      setErrors([error instanceof Error ? error.message : 'Failed to generate teams'])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/team/${team.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Generate Teams</h1>
          <p className="text-muted-foreground">
            Split <span className="font-medium">{team.name}</span> into balanced teams
          </p>
        </div>
      </div>

      {!canGenerate ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Not enough players</h3>
            <p className="text-muted-foreground mb-6">
              You need at least 6 players to generate teams. Currently have {team.players.length} players.
            </p>
            <Button asChild>
              <Link to={`/team/${team.id}/add-player`}>
                Add More Players
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Team Generation Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="numberOfTeams">Number of Teams</Label>
                  <Select
                    value={splitOptions.numberOfTeams.toString()}
                    onValueChange={(value) => 
                      setSplitOptions(prev => ({ ...prev, numberOfTeams: parseInt(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of teams" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: maxPossibleTeams - 1 }, (_, i) => i + 2).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} teams ({Math.floor(team.players.length / num)}-{Math.ceil(team.players.length / num)} players each)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="considerRating"
                    checked={splitOptions.considerRating}
                    onCheckedChange={(checked) => 
                      setSplitOptions(prev => ({ ...prev, considerRating: checked }))
                    }
                  />
                  <div className="space-y-1">
                    <Label htmlFor="considerRating" className="text-sm font-medium">
                      Balance by Rating
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Distribute players to balance skill levels
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="considerPosition"
                    checked={splitOptions.considerPosition}
                    onCheckedChange={(checked) => 
                      setSplitOptions(prev => ({ ...prev, considerPosition: checked }))
                    }
                  />
                  <div className="space-y-1">
                    <Label htmlFor="considerPosition" className="text-sm font-medium">
                      Balance by Position
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Ensure fair distribution of positions
                    </p>
                  </div>
                </div>
              </div>

              {errors.length > 0 && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm space-y-1">
                  {errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="w-full md:w-auto"
              >
                {isGenerating ? 'Generating...' : 'Generate Teams'}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Teams */}
          {generatedTeams.length > 0 && (
            <GeneratedTeamsDisplay 
              teams={generatedTeams} 
              onRegenerate={handleRegenerate}
            />
          )}
        </>
      )}
    </div>
  )
}