import { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useTeamsStore } from '@/store/useTeamsStore'
import TeamForm from '@/components/TeamForm'

export default function EditTeamPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { teams, loadTeamsFromStorage, editTeam } = useTeamsStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async (data: { name: string; description?: string }) => {
    setIsSubmitting(true)
    try {
      await editTeam(team.id, {
        name: data.name,
        description: data.description || ''
      })
      navigate(`/team/${team.id}`)
    } catch (error) {
      console.error('Failed to update team:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate(`/team/${team.id}`)
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Team</h1>
        <p className="text-muted-foreground">
          Update your team's information
        </p>
      </div>
      
      <TeamForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={team}
        isSubmitting={isSubmitting}
        submitText="Save Changes"
      />
    </div>
  )
}