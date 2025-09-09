import { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useTeamsStore } from '@/store/useTeamsStore'
import PlayerForm from '@/components/PlayerForm'
import { Position } from '@/types'

export default function EditPlayerPage() {
  const { teamId, playerId } = useParams<{ teamId: string; playerId: string }>()
  const navigate = useNavigate()
  const { teams, loadTeamsFromStorage, editPlayer } = useTeamsStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (teams.length === 0) {
      loadTeamsFromStorage()
    }
  }, [teams.length, loadTeamsFromStorage])

  if (!teamId || !playerId) {
    return <Navigate to="/" replace />
  }

  const team = teams.find(t => t.id === teamId)
  const player = team?.players.find(p => p.id === playerId)

  if (teams.length > 0 && (!team || !player)) {
    return <Navigate to="/" replace />
  }

  if (!team || !player) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading player...</div>
      </div>
    )
  }

  const handleSubmit = async (data: { name: string; position: Position; rating: number }) => {
    setIsSubmitting(true)
    try {
      await editPlayer(player.id, {
        name: data.name,
        position: data.position,
        rating: data.rating,
      })
      navigate(`/team/${teamId}`)
    } catch (error) {
      console.error('Failed to update player:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate(`/team/${teamId}`)
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Player</h1>
        <p className="text-muted-foreground">
          Update <span className="font-medium">{player.name}</span> in <span className="font-medium">{team.name}</span>
        </p>
      </div>
      
      <PlayerForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={player}
        isSubmitting={isSubmitting}
        submitText="Save Changes"
      />
    </div>
  )
}