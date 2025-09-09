import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import StarRating from '@/components/StarRating'
import { Player, Position } from '@/types'
import { validatePlayer } from '@/lib/storage'

const playerSchema = z.object({
  name: z.string().min(1, 'Player name is required').max(50, 'Player name must be 50 characters or less'),
  position: z.enum(['goalkeeper', 'defender', 'midfielder', 'forward']).refine((val) => val !== undefined, {
    message: 'Please select a position',
  }),
  rating: z.number().min(0, 'Rating must be at least 0').max(5, 'Rating must be at most 5'),
})

type PlayerFormData = z.infer<typeof playerSchema>

interface PlayerFormProps {
  onSubmit: (data: PlayerFormData) => Promise<void> | void
  onCancel: () => void
  initialData?: Partial<Player>
  isSubmitting?: boolean
  submitText?: string
}

const positionOptions: { value: Position; label: string; description: string }[] = [
  { value: 'goalkeeper', label: 'Goalkeeper', description: 'GK - Last line of defense' },
  { value: 'defender', label: 'Defender', description: 'DEF - Protects the goal' },
  { value: 'midfielder', label: 'Midfielder', description: 'MID - Controls the game' },
  { value: 'forward', label: 'Forward', description: 'FWD - Scores goals' },
]

export default function PlayerForm({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isSubmitting = false,
  submitText = 'Add Player'
}: PlayerFormProps) {
  const [serverErrors, setServerErrors] = useState<string[]>([])

  const form = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: initialData?.name || '',
      position: initialData?.position || undefined,
      rating: initialData?.rating ?? 3,
    },
  })

  const handleSubmit = async (data: PlayerFormData) => {
    setServerErrors([])
    
    // Additional server-side validation
    const errors = validatePlayer(data)
    if (errors.length > 0) {
      setServerErrors(errors)
      return
    }

    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Failed to submit player:', error)
      setServerErrors(['Failed to save player. Please try again.'])
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
                <FormLabel>Player Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter player name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {positionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skill Rating</FormLabel>
                <FormControl>
                  <div className="py-2">
                    <StarRating
                      rating={field.value}
                      onRatingChange={field.onChange}
                      size="lg"
                    />
                  </div>
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Rate the player's skill level from 0 to 5 stars
                </div>
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