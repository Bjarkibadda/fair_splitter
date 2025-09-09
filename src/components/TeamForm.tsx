import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Team } from '@/types'
import { validateTeam } from '@/lib/storage'

const teamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(50, 'Team name must be 50 characters or less'),
  description: z.string().max(200, 'Description must be 200 characters or less').optional(),
})

type TeamFormData = z.infer<typeof teamSchema>

interface TeamFormProps {
  onSubmit: (data: TeamFormData) => Promise<void> | void
  onCancel: () => void
  initialData?: Partial<Team>
  isSubmitting?: boolean
  submitText?: string
}

export default function TeamForm({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isSubmitting = false,
  submitText = 'Create Team'
}: TeamFormProps) {
  const [serverErrors, setServerErrors] = useState<string[]>([])

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
    },
  })

  const handleSubmit = async (data: TeamFormData) => {
    setServerErrors([])
    
    // Additional server-side validation
    const errors = validateTeam(data)
    if (errors.length > 0) {
      setServerErrors(errors)
      return
    }

    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Failed to submit team:', error)
      setServerErrors(['Failed to save team. Please try again.'])
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter team name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Brief description of the team"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {serverErrors.length > 0 && (
            <div className="text-sm text-destructive space-y-1">
              {serverErrors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Saving...' : submitText}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}