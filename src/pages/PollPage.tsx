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
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"

interface PollOption {
  id: string
  option_text: string
  option_order: number
  votes: number
}

interface Poll {
  id: string
  title: string
  description: string | null
  is_active: boolean
  created_at: string
  options: PollOption[]
}

const PollPage = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const { user } = useAuth()
  const [hasVoted, setHasVoted] = useState(false)
  const [poll, setPoll] = useState<Poll | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [votingLoading, setVotingLoading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchPoll()
      checkUserVoted()
    }
  }, [id, user])

  const fetchPoll = async () => {
    if (!id) return
    
    setIsLoading(true)
    try {
      // Fetch basic poll data
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .select('*')
        .eq('id', id)
        .single()

      if (pollError) {
        throw pollError
      }

      // Use secure function to get vote counts without exposing individual votes
      const { data: voteCountsData, error: voteCountsError } = await supabase
        .rpc('get_poll_vote_counts', { poll_id_param: id })

      if (voteCountsError) {
        throw voteCountsError
      }

      // Transform the data to match our component structure
      const optionsWithVotes = voteCountsData.map((item: any) => ({
        id: item.option_id,
        option_text: item.option_text,
        option_order: item.option_order,
        votes: Number(item.vote_count)
      }))

      setPoll({
        ...pollData,
        options: optionsWithVotes
      })
    } catch (error: any) {
      console.error('Error fetching poll:', error)
      toast({
        title: "Error loading poll",
        description: "Failed to load poll data.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkUserVoted = async () => {
    if (!id || !user) return

    try {
      // Use secure function to check if user has voted
      const { data, error } = await supabase
        .rpc('has_user_voted', { poll_id_param: id })

      if (error) {
        console.error('Error checking vote:', error)
        return
      }

      setHasVoted(!!data)
    } catch (error) {
      console.error('Error checking vote:', error)
    }
  }

  const handleVote = async (optionId: string) => {
    if (!id || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote on polls.",
        variant: "destructive"
      })
      return
    }

    setVotingLoading(true)
    
    try {
      const { error } = await supabase
        .from('votes')
        .insert({
          poll_id: id,
          poll_option_id: optionId,
          user_id: user.id
        })

      if (error) {
        throw error
      }

      setHasVoted(true)
      await fetchPoll() // Refresh poll data to show updated vote counts
      
      toast({
        title: "Vote recorded!",
        description: "Thank you for participating in this poll.",
      })
    } catch (error: any) {
      console.error('Error voting:', error)
      toast({
        title: "Error recording vote",
        description: error.message || "Failed to record your vote. Please try again.",
        variant: "destructive"
      })
    } finally {
      setVotingLoading(false)
    }
  }

  const getVoterIP = () => {
    // Simple IP detection - in a real app, you'd get this from the server
    return `${Math.random().toString(36).substr(2, 9)}`
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied!",
      description: "Poll link has been copied to your clipboard.",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading poll...</p>
        </div>
      </div>
    )
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

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0)

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
              {!hasVoted && poll.is_active ? (
                <VotingForm
                  title={poll.title}
                  description={poll.description}
                  options={poll.options.map(o => ({ id: o.id, text: o.option_text }))}
                  onVote={handleVote}
                  isLoading={votingLoading}
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
                options={poll.options.map(o => ({ 
                  id: o.id, 
                  text: o.option_text, 
                  votes: o.votes 
                }))}
                totalVotes={totalVotes}
                isActive={poll.is_active}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PollPage