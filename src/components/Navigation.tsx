import { Button } from "@/components/ui/button"
import { Plus, Vote } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export const Navigation = () => {
  const location = useLocation()

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          <Vote className="w-6 h-6 text-primary" />
          FlashPoll
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/create">
            <Button variant="poll" size="sm">
              <Plus className="w-4 h-4" />
              Create Poll
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}