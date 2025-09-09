import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTeamsStore } from '@/store/useTeamsStore'
import TeamForm from '@/components/TeamForm'

export default function CreateTeamPage() {
  const navigate = useNavigate()
  const { addTeam } = useTeamsStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: { name: string; description?: string }) => {
    setIsSubmitting(true)
    try {
      const newTeam = await addTeam(data.name, data.description || '')
      navigate(`/team/${newTeam.id}`)
    } catch (error) {
      console.error('Failed to create team:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Team</h1>
        <p className="text-muted-foreground">
          Start by giving your team a name and optional description
        </p>
      </div>
      
      <TeamForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        submitText="Create Team"
      />
    </div>
  )
}