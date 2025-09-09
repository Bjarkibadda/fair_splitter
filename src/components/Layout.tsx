import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Users, Plus, ArrowLeft } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isHomePage && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  asChild
                >
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              
              <Link 
                to="/" 
                className="flex items-center gap-2 text-lg font-semibold hover:text-foreground/80 transition-colors"
              >
                <Users className="h-5 w-5" />
                Fair Splitter
              </Link>
            </div>
            
            {isHomePage && (
              <Button asChild>
                <Link to="/team/new">
                  <Plus className="h-4 w-4" />
                  New Team
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}