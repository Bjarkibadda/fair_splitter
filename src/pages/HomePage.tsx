import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTeamsStore } from '@/store/useTeamsStore'
import TeamCard from '@/components/TeamCard'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'

export default function HomePage() {
  const { teams, isLoading, loadTeamsFromStorage } = useTeamsStore()

  useEffect(() => {
    loadTeamsFromStorage()
  }, [loadTeamsFromStorage])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading teams...</div>
      </div>
    )
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Users className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">No teams yet</h1>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Create your first team to start organizing fair and balanced matches.
        </p>
        <Button asChild>
          <Link to="/team/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Team
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Teams</h1>
     
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  )
}