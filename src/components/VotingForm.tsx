import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Vote, Clock, UserPlus, LogIn } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

interface VotingOption {
  id: string
  text: string
}

interface VotingFormProps {
  title: string
  description?: string | null
  options: VotingOption[]
  onVote: (optionId: string) => void
  isLoading?: boolean
  totalVotes: number
}

export const VotingForm = ({ title, description, options, onVote, isLoading, totalVotes }: VotingFormProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [hasVoted, setHasVoted] = useState(false)
  const { user } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedOption && !hasVoted && user) {
      onVote(selectedOption)
      setHasVoted(true)
    }
  }

  // Show authentication prompt for guest users
  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Vote className="w-6 h-6 text-primary" />
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Live Poll
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
          <div className="text-sm text-muted-foreground">
            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} so far
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Show poll options (disabled) */}
            <div className="space-y-3 opacity-50">
              {options.map((option, index) => (
                <div key={option.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-border bg-muted/30">
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/50"></div>
                    <span className="flex-1 font-medium text-muted-foreground">{option.text}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Authentication prompt */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-6 text-center space-y-4">
                <UserPlus className="w-12 h-12 mx-auto text-primary" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Account Required to Vote</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create a free account to participate in polls and track your voting history.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/login">
                    <Button variant="poll" className="w-full sm:w-auto">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up Free
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-border/50">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Vote className="w-6 h-6 text-primary" />
          <Badge variant="outline" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Live Poll
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
        <div className="text-sm text-muted-foreground">
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} so far
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup 
            value={selectedOption} 
            onValueChange={setSelectedOption}
            className="space-y-3"
            disabled={hasVoted || isLoading}
          >
            {options.map((option, index) => (
              <div key={option.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <Label 
                  htmlFor={option.id}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-accent/10 transition-all duration-200 cursor-pointer"
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <span className="flex-1 font-medium">{option.text}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <Button 
            type="submit" 
            className="w-full" 
            variant="poll"
            size="lg"
            disabled={!selectedOption || hasVoted || isLoading}
          >
            {isLoading ? "Submitting..." : hasVoted ? "Vote Submitted!" : "Cast Your Vote"}
          </Button>
          
          {hasVoted && (
            <div className="text-center text-sm text-success animate-fade-in">
              ✓ Your vote has been recorded! Results will update automatically.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}