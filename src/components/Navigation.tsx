import { Button } from "@/components/ui/button"
import { Plus, Vote, LogOut, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

export const Navigation = () => {
  const location = useLocation()
  const { user, signOut, loading } = useAuth()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            <Vote className="w-6 h-6 text-primary" />
            FlashPoll
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-20 h-8 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          <Vote className="w-6 h-6 text-primary" />
          FlashPoll
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/create">
                <Button variant="poll" size="sm">
                  <Plus className="w-4 h-4" />
                  Create Poll
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                {user.email}
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  )
}