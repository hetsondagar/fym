import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Eye, EyeOff, LogIn, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { userAPI, getRandomQuote } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import movieWall from '@/assets/movie-wall.jpg';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const currentQuote = getRandomQuote();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await userAPI.signIn(formData.email, formData.password);

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in to fym.",
      });

      navigate('/');
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6)), url(${movieWall})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-tl from-cinema-blue/10 via-transparent to-cinema-red/10 animate-pulse"></div>
      
      {/* Floating film elements */}
      <div className="absolute top-32 right-32 opacity-20">
        <div className="w-20 h-20 border-2 border-cinema-gold rounded-full animate-pulse"></div>
      </div>
      <div className="absolute bottom-32 left-32 opacity-20">
        <div className="w-16 h-16 border border-cinema-blue rotate-45 animate-pulse"></div>
      </div>
      <div className="absolute top-1/3 right-10 opacity-10">
        <Film className="w-6 h-6 text-cinema-red animate-spin" style={{ animationDuration: '15s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Movie Quote */}
        <div className="text-center mb-8 animate-fade-in">
          <Quote className="h-8 w-8 text-cinema-gold mx-auto mb-4" />
          <blockquote className="quote-text text-lg mb-2">
            {currentQuote.text}
          </blockquote>
          <cite className="text-cinema-gold/80 text-sm">
            — {currentQuote.movie} ({currentQuote.year})
          </cite>
        </div>

        <Card className="bg-cinema-dark/90 backdrop-blur-md border-cinema-blue/30 shadow-cinema">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Film className="h-8 w-8 text-cinema-red" />
              <span className="font-cinzel text-3xl font-bold text-cinema-gold">
                fym
              </span>
            </div>
            <CardTitle className="text-2xl text-foreground">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Continue your cinematic journey and discover more amazing content
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-cinema-black/50 border-cinema-blue/30 focus:border-cinema-blue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="bg-cinema-black/50 border-cinema-blue/30 focus:border-cinema-blue pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-cinema-blue bg-cinema-black border-cinema-blue/30 rounded focus:ring-cinema-blue focus:ring-2"
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-cinema-blue hover:text-cinema-blue/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full btn-hero"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-cinema-gold hover:text-cinema-gold/80 transition-colors font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional inspiration */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm">
            Your personalized movie recommendations are waiting
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
