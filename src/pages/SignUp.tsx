import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Eye, EyeOff, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { userAPI, getRandomQuote } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import filmStripBg from '@/assets/film-strip-bg.jpg';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      await userAPI.signUp({
        email: formData.email,
        password: formData.password,
        username: formData.username
      });

      toast({
        title: "Welcome to fym!",
        description: "Your account has been created successfully.",
      });

      navigate('/');
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "An error occurred",
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
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6)), url(${filmStripBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-cinema-red/10 via-transparent to-cinema-blue/10 animate-pulse"></div>
      
      {/* Floating film elements */}
      <div className="absolute top-20 left-20 opacity-20">
        <div className="w-16 h-16 border-2 border-cinema-gold rounded-full animate-pulse"></div>
      </div>
      <div className="absolute bottom-20 right-20 opacity-20">
        <div className="w-12 h-12 border border-cinema-red rotate-45 animate-pulse"></div>
      </div>
      <div className="absolute top-1/2 left-10 opacity-10">
        <Film className="w-8 h-8 text-cinema-gold animate-spin" style={{ animationDuration: '20s' }} />
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

        <Card className="bg-cinema-dark/90 backdrop-blur-md border-cinema-red/30 shadow-cinema">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Film className="h-8 w-8 text-cinema-red" />
              <span className="font-cinzel text-3xl font-bold text-cinema-gold">
                fym
              </span>
            </div>
            <CardTitle className="text-2xl text-foreground">Join the Community</CardTitle>
            <CardDescription className="text-muted-foreground">
              Start your cinematic journey and discover your next favorite movie
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Choose a unique username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="bg-cinema-black/50 border-cinema-red/30 focus:border-cinema-red"
                />
              </div>

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
                  className="bg-cinema-black/50 border-cinema-red/30 focus:border-cinema-red"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="bg-cinema-black/50 border-cinema-red/30 focus:border-cinema-red pr-10"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="bg-cinema-black/50 border-cinema-red/30 focus:border-cinema-red pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-hero"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <>
                    <Star className="mr-2 h-4 w-4" />
                    Start Your Journey
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/signin"
                  className="text-cinema-gold hover:text-cinema-gold/80 transition-colors font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional inspiration */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm">
            Join thousands of movie enthusiasts discovering their next favorite film
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
