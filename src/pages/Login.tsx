import { useState } from "react"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Vote, Mail, Lock, User, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

const Login = () => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      })
    }, 1000)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Account created!",
        description: "Welcome to FlashPoll! You can now create and manage polls.",
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Vote className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Join FlashPoll</CardTitle>
              <p className="text-sm text-muted-foreground">
                Create an account to manage your polls and see advanced analytics
              </p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="your@email.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="poll"
                      size="lg"
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          value={signupData.name}
                          onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          value={signupData.email}
                          onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={signupData.password}
                          onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="poll"
                      size="lg"
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="text-center text-sm text-muted-foreground mt-6">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login