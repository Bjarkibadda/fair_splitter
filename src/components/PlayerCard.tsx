import { Player, Position } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Edit, Trash2 } from 'lucide-react'

interface PlayerCardProps {
  player: Player
  onEdit?: (player: Player) => void
  onDelete?: (player: Player) => void
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

export default function PlayerCard({ player, onEdit, onDelete }: PlayerCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ))
  }

  return (
    <div className="p-4 border border-border rounded-lg bg-card hover:shadow-sm transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-base mb-2">{player.name}</h4>
          
          <div className="flex items-center gap-3 mb-3">
            <Badge 
              variant="secondary" 
              className={positionColors[player.position]}
            >
              {positionLabels[player.position]}
            </Badge>
            
            <div className="flex items-center gap-1">
              {renderStars(player.rating)}
            </div>
          </div>
        </div>
        
        {(onEdit || onDelete) && (
          <div className="flex gap-1">
            {onEdit && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onEdit(player)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onDelete(player)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}