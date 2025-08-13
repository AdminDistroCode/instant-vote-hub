import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

interface PollOption {
  id: string
  text: string
  votes: number
}

interface PollResultsProps {
  title: string
  options: PollOption[]
  totalVotes: number
  isActive: boolean
}

export const PollResults = ({ title, options, totalVotes, isActive }: PollResultsProps) => {
  const maxVotes = Math.max(...options.map(o => o.votes), 1)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Live Results" : "Final Results"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span className="text-sm">{totalVotes} total votes</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {options.map((option, index) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
          const widthPercentage = totalVotes > 0 ? (option.votes / maxVotes) * 100 : 0
          
          return (
            <div key={option.id} className="space-y-2 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{option.text}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{option.votes} votes</span>
                  <Badge variant="outline" className="text-xs">
                    {percentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
              
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${widthPercentage}%`,
                    animationDelay: `${index * 200}ms`
                  }}
                />
              </div>
            </div>
          )
        })}
        
        {totalVotes === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No votes yet. Be the first to vote!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}