import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Vote, Clock } from "lucide-react"

interface VotingOption {
  id: string
  text: string
}

interface VotingFormProps {
  title: string
  description?: string
  options: VotingOption[]
  onVote: (optionId: string) => void
  isLoading?: boolean
  totalVotes: number
}

export const VotingForm = ({ title, description, options, onVote, isLoading, totalVotes }: VotingFormProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [hasVoted, setHasVoted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedOption && !hasVoted) {
      onVote(selectedOption)
      setHasVoted(true)
    }
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