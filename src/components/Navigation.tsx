import { Button } from "@/components/ui/button"
import { Plus, Vote, LogOut, User, List } from "lucide-react"
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
          <span className="hidden sm:inline">FlashPoll</span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <Link to="/my-polls" className="hidden sm:block">
                <Button variant="outline" size="sm">
                  <List className="w-4 h-4" />
                  <span className="hidden md:inline ml-2">My Polls</span>
                </Button>
              </Link>
              <Link to="/create">
                <Button variant="poll" size="sm">
                  <Plus className="w-4 h-4" />
                  <span className="hidden md:inline ml-2">Create Poll</span>
                </Button>
              </Link>
              <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="max-w-32 truncate">{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/create">
                <Button variant="poll" size="sm">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Create Poll</span>
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