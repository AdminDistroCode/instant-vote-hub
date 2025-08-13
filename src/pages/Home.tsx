import { useState, useEffect } from "react"
import { Navigation } from "@/components/Navigation"
import { PollCard } from "@/components/PollCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Vote, TrendingUp, Users, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Poll {
  id: string
  title: string
  description: string | null
  is_active: boolean
  created_at: string
  poll_options: { option_text: string }[]
  votes: { id: string }[]
}

const Home = () => {
  const [polls, setPolls] = useState<Poll[]>([])
  const [stats, setStats] = useState({
    totalPolls: 0,
    totalVotes: 0,
    activeUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchPolls()
    fetchStats()
  }, [])

  const fetchPolls = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select(`
          *,
          poll_options(option_text),
          votes(id)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) {
        console.error('Error fetching polls:', error)
        toast({
          title: "Error loading polls",
          description: "Failed to load featured polls.",
          variant: "destructive"
        })
      } else {
        setPolls(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const [pollsCount, votesCount, usersCount] = await Promise.all([
        supabase.from('polls').select('id', { count: 'exact' }),
        supabase.from('votes').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' })
      ])

      setStats({
        totalPolls: pollsCount.count || 0,
        totalVotes: votesCount.count || 0,
        activeUsers: usersCount.count || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Instant Polls, Live Results
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create engaging polls and get real-time feedback from your audience. 
              Simple, fast, and beautiful polling platform.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/create">
              <Button variant="poll" size="xl" className="min-w-48">
                <Vote className="w-5 h-5" />
                Create Your First Poll
              </Button>
            </Link>
            <Button variant="outline" size="xl" className="min-w-48" onClick={fetchPolls}>
              <TrendingUp className="w-5 h-5" />
              Explore Polls
            </Button>
          </div>
          
          {/* Real Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto pt-8">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalPolls}</div>
                <div className="text-sm text-muted-foreground">Polls Created</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-accent">{stats.totalVotes}</div>
                <div className="text-sm text-muted-foreground">Votes Cast</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-success">{stats.activeUsers}</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FlashPoll?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground">Create and share polls in seconds. Get instant feedback from your audience.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-accent/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Real-time Results</h3>
              <p className="text-muted-foreground">Watch results update live as votes come in. Beautiful charts and analytics.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-success/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold">Easy Sharing</h3>
              <p className="text-muted-foreground">Share your polls with anyone, anywhere. No signup required to vote.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Polls */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Polls</h2>
            <Button variant="outline" onClick={fetchPolls}>View All</Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-4"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : polls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {polls.map((poll) => (
                <PollCard 
                  key={poll.id} 
                  id={poll.id}
                  title={poll.title}
                  description={poll.description}
                  totalVotes={poll.votes.length}
                  isActive={poll.is_active}
                  createdAt={poll.created_at}
                  options={poll.poll_options.map(opt => opt.option_text)}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Vote className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No polls yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to create a poll!</p>
                <Link to="/create">
                  <Button variant="poll">Create First Poll</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home