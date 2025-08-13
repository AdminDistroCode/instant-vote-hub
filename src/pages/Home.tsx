import { Navigation } from "@/components/Navigation"
import { PollCard } from "@/components/PollCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Vote, TrendingUp, Users, Zap } from "lucide-react"
import { Link } from "react-router-dom"

const featuredPolls = [
  {
    id: "1",
    title: "What's your favorite programming language in 2024?",
    description: "Help us understand the current trends in software development",
    totalVotes: 1247,
    isActive: true,
    createdAt: "2024-01-15",
    options: ["JavaScript", "Python", "TypeScript", "Go", "Rust"]
  },
  {
    id: "2", 
    title: "Best remote work tool for team collaboration?",
    description: "Share your experience with remote work tools",
    totalVotes: 892,
    isActive: true,
    createdAt: "2024-01-14",
    options: ["Slack", "Discord", "Microsoft Teams", "Zoom", "Other"]
  },
  {
    id: "3",
    title: "Preferred learning method for new technologies?",
    totalVotes: 567,
    isActive: false,
    createdAt: "2024-01-13",
    options: ["Online courses", "Documentation", "Video tutorials", "Books", "Practice projects"]
  }
]

const Home = () => {
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
            <Button variant="outline" size="xl" className="min-w-48">
              <TrendingUp className="w-5 h-5" />
              Explore Polls
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto pt-8">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">12K+</div>
                <div className="text-sm text-muted-foreground">Polls Created</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-accent">50K+</div>
                <div className="text-sm text-muted-foreground">Votes Cast</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-success">5K+</div>
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
            <Button variant="outline">View All</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPolls.map((poll) => (
              <PollCard key={poll.id} {...poll} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home