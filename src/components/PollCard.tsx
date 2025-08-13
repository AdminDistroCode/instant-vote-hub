import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"

interface PollCardProps {
  id: string
  title: string
  description?: string
  totalVotes: number
  isActive: boolean
  createdAt: string
  options: string[]
  hideStatus?: boolean // New prop to hide status badge
}

export const PollCard = ({ id, title, description, totalVotes, isActive, createdAt, options, hideStatus = false }: PollCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            )}
          </div>
          {!hideStatus && (
            <Badge variant={isActive ? "default" : "secondary"} className="ml-2 shrink-0">
              {isActive ? (
                <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
              ) : (
                "Closed"
              )}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {totalVotes} votes
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          {options.slice(0, 2).map((option, index) => (
            <div key={index} className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1">
              {option}
            </div>
          ))}
          {options.length > 2 && (
            <div className="text-xs text-muted-foreground">
              +{options.length - 2} more options
            </div>
          )}
        </div>
        
        <Link to={`/poll/${id}`}>
          <Button 
            className="w-full" 
            variant={isActive ? "poll" : "outline"}
            disabled={!isActive}
          >
            {isActive ? "Vote Now" : "View Results"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}