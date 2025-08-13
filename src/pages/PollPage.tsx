import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Navigation } from "@/components/Navigation"
import { VotingForm } from "@/components/VotingForm"
import { PollResults } from "@/components/PollResults"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Share2, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

// Mock data - will be replaced with Supabase
const mockPoll = {
  id: "1",
  title: "What's your favorite programming language in 2024?",
  description: "Help us understand the current trends in software development",
  isActive: true,
  options: [
    { id: "1", text: "JavaScript", votes: 45 },
    { id: "2", text: "Python", votes: 38 },
    { id: "3", text: "TypeScript", votes: 32 },
    { id: "4", text: "Go", votes: 18 },
    { id: "5", text: "Rust", votes: 12 }
  ]
}

const PollPage = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const [hasVoted, setHasVoted] = useState(false)
  const [poll, setPoll] = useState(mockPoll)
  const [isLoading, setIsLoading] = useState(false)

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0)

  const handleVote = async (optionId: string) => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setPoll(prev => ({
        ...prev,
        options: prev.options.map(option =>
          option.id === optionId 
            ? { ...option, votes: option.votes + 1 }
            : option
        )
      }))
      setHasVoted(true)
      setIsLoading(false)
      
      toast({
        title: "Vote recorded!",
        description: "Thank you for participating in this poll.",
      })
    }, 1000)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied!",
      description: "Poll link has been copied to your clipboard.",
    })
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Poll not found</h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button and share */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Polls
              </Button>
            </Link>
            
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Poll
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Voting Form */}
            <div className="space-y-6">
              {!hasVoted && poll.isActive ? (
                <VotingForm
                  title={poll.title}
                  description={poll.description}
                  options={poll.options.map(o => ({ id: o.id, text: o.text }))}
                  onVote={handleVote}
                  isLoading={isLoading}
                  totalVotes={totalVotes}
                />
              ) : (
                <Card className="w-full">
                  <CardContent className="p-8 text-center">
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold">{poll.title}</h2>
                      {poll.description && (
                        <p className="text-muted-foreground">{poll.description}</p>
                      )}
                      <div className="text-sm text-muted-foreground">
                        {hasVoted 
                          ? "Thank you for voting! Check out the live results →" 
                          : "This poll is closed. View the final results →"
                        }
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Results */}
            <div className="space-y-6">
              <PollResults
                title="Live Results"
                options={poll.options}
                totalVotes={totalVotes}
                isActive={poll.isActive}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PollPage