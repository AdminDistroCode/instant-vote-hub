import { useState, useEffect } from "react"
import { Navigation } from "@/components/Navigation"
import { PollCard } from "@/components/PollCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Vote, Search, Filter, ArrowLeft } from "lucide-react"
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

const AllPolls = () => {
  const [polls, setPolls] = useState<Poll[]>([])
  const [filteredPolls, setFilteredPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const { toast } = useToast()

  useEffect(() => {
    fetchAllPolls()
  }, [])

  useEffect(() => {
    filterAndSortPolls()
  }, [polls, searchTerm, statusFilter, sortBy])

  const fetchAllPolls = async () => {
    try {
      // Fetch polls with basic info only (no vote details)
      const { data: pollsData, error } = await supabase
        .from('polls')
        .select(`
          *,
          poll_options(option_text)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      // Get vote counts securely for each poll
      const pollsWithCounts = await Promise.all(
        (pollsData || []).map(async (poll) => {
          try {
            const { data: totalVotes } = await supabase
              .rpc('get_poll_total_votes', { poll_id_param: poll.id })
            
            return {
              ...poll,
              votes: Array(totalVotes || 0).fill({ id: 'placeholder' })
            }
          } catch (error) {
            console.error('Error fetching vote count for poll:', poll.id, error)
            return {
              ...poll,
              votes: []
            }
          }
        })
      )

      setPolls(pollsWithCounts)
    } catch (error: any) {
      console.error('Error fetching polls:', error)
      toast({
        title: "Error loading polls",
        description: "Failed to load polls. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortPolls = () => {
    let filtered = [...polls]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(poll =>
        poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (poll.description && poll.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by status
    if (statusFilter === "active") {
      filtered = filtered.filter(poll => poll.is_active)
    } else if (statusFilter === "closed") {
      filtered = filtered.filter(poll => !poll.is_active)
    }

    // Sort polls
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "most-votes":
          return b.votes.length - a.votes.length
        case "least-votes":
          return a.votes.length - b.votes.length
        default:
          return 0
      }
    })

    setFilteredPolls(filtered)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">All Polls</h1>
              <p className="text-muted-foreground">Browse and participate in all available polls</p>
            </div>
          </div>

          {/* Filters and Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search polls..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="most-votes">Most Votes</SelectItem>
                      <SelectItem value="least-votes">Least Votes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredPolls.length} of {polls.length} polls
            </p>
            <Link to="/create">
              <Button variant="poll">
                <Vote className="w-4 h-4 mr-2" />
                Create New Poll
              </Button>
            </Link>
          </div>

          {/* Polls Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-4"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPolls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPolls.map((poll) => (
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
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || statusFilter !== "all" ? "No polls found" : "No polls yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filters" 
                    : "Be the first to create a poll!"
                  }
                </p>
                {(!searchTerm && statusFilter === "all") && (
                  <Link to="/create">
                    <Button variant="poll">Create First Poll</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllPolls