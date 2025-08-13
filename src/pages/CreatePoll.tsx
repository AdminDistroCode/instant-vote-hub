import { useState } from "react"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Vote, ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

const CreatePoll = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [poll, setPoll] = useState({
    title: "",
    description: "",
    options: ["", ""]
  })

  const addOption = () => {
    if (poll.options.length < 10) {
      setPoll(prev => ({
        ...prev,
        options: [...prev.options, ""]
      }))
    }
  }

  const removeOption = (index: number) => {
    if (poll.options.length > 2) {
      setPoll(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }))
    }
  }

  const updateOption = (index: number, value: string) => {
    setPoll(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!poll.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your poll.",
        variant: "destructive"
      })
      return
    }

    const validOptions = poll.options.filter(opt => opt.trim())
    if (validOptions.length < 2) {
      toast({
        title: "Need more options",
        description: "Please provide at least 2 options for your poll.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    // Simulate API call - will be replaced with Supabase
    setTimeout(() => {
      toast({
        title: "Poll created!",
        description: "Your poll has been created successfully.",
      })
      navigate("/poll/new-poll-id")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Create New Poll</h1>
              <p className="text-muted-foreground">Design your poll and get instant feedback</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-primary" />
                Poll Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Poll Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., What's your favorite programming language?"
                    value={poll.title}
                    onChange={(e) => setPoll(prev => ({ ...prev, title: e.target.value }))}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add more context about your poll..."
                    value={poll.description}
                    onChange={(e) => setPoll(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Poll Options *</Label>
                  {poll.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1"
                      />
                      {poll.options.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeOption(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {poll.options.length < 10 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addOption}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    variant="poll"
                    size="lg"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "Creating..." : "Create Poll"}
                  </Button>
                  <Link to="/">
                    <Button variant="outline" size="lg">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CreatePoll