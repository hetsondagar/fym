import { useState, useEffect } from 'react';
import { Brain, Heart, Clock, Star, Play, Bookmark, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { userAPI, omdbAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Movie, User } from '@/lib/types';

const RecommendationsSection = () => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = userAPI.getCurrentUser();
    setUser(currentUser);
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // In a real app, this would be based on user preferences and watch history
      // For now, we'll fetch some popular movies as recommendations
      const data = await omdbAPI.getTrending();
      if (data.Search) {
        const detailedMovies = await Promise.all(
          data.Search.slice(0, 6).map(async (movie: any) => {
            try {
              const details = await omdbAPI.getById(movie.imdbID);
              return details;
            } catch (error) {
              return movie;
            }
          })
        );
        setRecommendations(detailedMovies);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      // Fallback data
      setRecommendations([
        {
          imdbID: '1',
          Title: 'Inception',
          Year: '2010',
          Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
          imdbRating: '8.8',
          Genre: 'Action, Sci-Fi, Thriller',
          Plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
          Type: 'movie',
          Rated: 'PG-13',
          Released: '2010-07-16',
          Runtime: '148 min',
          Director: 'Christopher Nolan',
          Writer: 'Christopher Nolan',
          Actors: 'Leonardo DiCaprio, Marion Cotillard, Tom Hardy',
          Language: 'English',
          Country: 'USA',
          Awards: 'Won 4 Oscars. 157 wins & 220 nominations total',
          Ratings: [],
          Metascore: '74',
          imdbVotes: '2,447,910',
          DVD: '2010-12-07',
          BoxOffice: '$836,836,967',
          Production: 'Warner Bros.',
          Website: 'N/A',
          Response: 'True'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationReason = (index: number) => {
    const reasons = [
      { icon: Heart, text: 'Based on your favorite genres', color: 'text-red-500' },
      { icon: Star, text: 'High-rated content you might enjoy', color: 'text-yellow-500' },
      { icon: Clock, text: 'Recently added to your watchlist', color: 'text-blue-500' },
      { icon: Brain, text: 'AI-powered recommendation', color: 'text-purple-500' },
      { icon: Heart, text: 'Similar to your recent watches', color: 'text-red-500' },
      { icon: Star, text: 'Trending in your preferred categories', color: 'text-yellow-500' }
    ];
    return reasons[index % reasons.length];
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-cinema-blue/30 border-t-cinema-blue rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Finding your perfect recommendations...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Light overlay for readability */}
      <div className="absolute inset-0 bg-black/15"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <Brain className="h-8 w-8 text-cinema-blue" />
              <h2 className="heading-section">For You</h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {user ? `Personalized recommendations for ${user.username}` : 'Discover content tailored to your taste'}
            </p>
          </div>
          
          <Button
            variant="ghost"
            className="text-cinema-blue hover:text-cinema-blue/80"
            onClick={fetchRecommendations}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Recommendations
          </Button>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((movie, index) => {
            const reason = getRecommendationReason(index);
            const ReasonIcon = reason.icon;
            
            return (
              <Card key={movie.imdbID} className="movie-card neon-hover group">
                <CardContent className="p-0">
                  {/* Recommendation Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-cinema-blue/90 text-white border-0">
                      <ReasonIcon className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>

                  {/* Movie Poster */}
                  <div className="aspect-[2/3] relative overflow-hidden">
                    <img
                      src={movie.Poster}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/fym_logo.png'; }}
                      alt={movie.Title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Button
                            size="sm"
                            className="btn-hero text-xs"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Watch
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-cinema-gold hover:text-cinema-gold/80"
                            onClick={async () => {
                              try {
                                const currentUser = userAPI.getCurrentUser();
                                if (!currentUser) {
                                  toast({ title: 'Sign in required', description: 'Sign in to add to your watchlist.' });
                                  return;
                                }
                                await userAPI.addToWatchlist(currentUser.id, movie as any);
                                toast({ title: 'Added to Watchlist', description: movie.Title });
                              } catch (e: any) {
                                toast({ title: 'Could not add', description: e?.message || 'Try again.' });
                              }
                            }}
                          >
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-cinema-black/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                      <Star className="h-3 w-3 text-cinema-gold fill-current" />
                      <span className="text-xs font-medium text-foreground">{movie.imdbRating}</span>
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-cinzel font-semibold text-lg text-foreground group-hover:text-cinema-gold transition-colors line-clamp-2">
                        {movie.Title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                        <span>{movie.Year}</span>
                        <span>{movie.Runtime}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {movie.Genre.split(', ').slice(0, 2).map((genre) => (
                        <span
                          key={genre}
                          className="text-xs px-2 py-1 bg-cinema-red/20 text-cinema-red rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3 group-hover:text-foreground/80 transition-colors">
                      {movie.Plot}
                    </p>

                    {/* Recommendation Reason */}
                    <div className="flex items-center space-x-2 text-xs">
                      <ReasonIcon className={`h-3 w-3 ${reason.color}`} />
                      <span className="text-muted-foreground">{reason.text}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-cinema-dark/50 backdrop-blur-md rounded-2xl p-8 border border-cinema-blue/20">
            <h3 className="font-cinzel text-2xl font-semibold text-foreground mb-4">
              Want Better Recommendations?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Rate more movies, add to your watchlist, and tell us about your preferences to get more personalized suggestions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-hero">
                <Heart className="mr-2 h-4 w-4" />
                Rate Movies
              </Button>
              <Button variant="ghost" className="text-cinema-gold hover:text-cinema-gold/80">
                Update Preferences
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendationsSection;
