import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = 'md' 
}: StarRatingProps) {
  const handleStarClick = (starIndex: number) => {
    if (readonly || !onRatingChange) return
    
    // If clicking the same star that's already selected, set to 0
    const newRating = rating === starIndex + 1 ? 0 : starIndex + 1
    onRatingChange(newRating)
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleStarClick(index)}
          disabled={readonly}
          className={cn(
            sizes[size],
            "transition-colors",
            !readonly && "hover:scale-110 cursor-pointer",
            readonly && "cursor-default"
          )}
        >
          <Star
            className={cn(
              "transition-all duration-200",
              sizes[size],
              index < rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            )}
          />
        </button>
      ))}
      <span className="text-sm text-muted-foreground ml-2">
        {rating}/5
      </span>
    </div>
  )
}