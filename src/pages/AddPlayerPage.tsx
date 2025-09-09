import { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useTeamsStore } from '@/store/useTeamsStore'
import PlayerForm from '@/components/PlayerForm'
import { Position } from '@/types'

export default function AddPlayerPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { teams, loadTeamsFromStorage, addPlayerToTeam } = useTeamsStore()
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

  const handleSubmit = async (data: { name: string; position: Position; rating: number }) => {
    setIsSubmitting(true)
    try {
      await addPlayerToTeam(team.id, {
        name: data.name,
        position: data.position,
        rating: data.rating,
      })
      navigate(`/team/${team.id}`)
    } catch (error) {
      console.error('Failed to add player:', error)
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
        <h1 className="text-3xl font-bold mb-2">Add Player</h1>
        <p className="text-muted-foreground">
          Add a new player to <span className="font-medium">{team.name}</span>
        </p>
      </div>
      
      <PlayerForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        submitText="Add Player"
      />
    </div>
  )
}