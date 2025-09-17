import { useState, useEffect } from 'react';
import { Brain, Heart, Star, Play, Bookmark, RefreshCw, Filter, TrendingUp, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { userAPI, omdbAPI, getRandomQuote } from '@/lib/api';
import { Movie, User } from '@/lib/types';
import Navbar from '@/components/Navbar';
import heroCinema from '@/assets/hero-cinema.jpg';

const Recommendations = () => {
  const [user, setUser] = useState<User | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personalized');
  const [filter, setFilter] = useState<'all' | 'movie' | 'series'>('all');

  const currentQuote = getRandomQuote();

  useEffect(() => {
    const currentUser = userAPI.getCurrentUser();
    setUser(currentUser);
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // Fetch different types of recommendations
      const [trendingData, topRatedData] = await Promise.all([
        omdbAPI.getTrending(),
        omdbAPI.getTopRated('movie')
      ]);

      // Process trending recommendations
      if (trendingData.Search) {
        const trendingMovies = await Promise.all(
          trendingData.Search.slice(0, 6).map(async (movie: any) => {
            try {
              const details = await omdbAPI.getById(movie.imdbID);
              return details;
            } catch (error) {
              return movie;
            }
          })
        );
        setTrending(trendingMovies);
      }

      // Process top-rated recommendations
      if (topRatedData.Search) {
        const topRatedMovies = await Promise.all(
          topRatedData.Search.slice(0, 6).map(async (movie: any) => {
            try {
              const details = await omdbAPI.getById(movie.imdbID);
              return details;
            } catch (error) {
              return movie;
            }
          })
        );
        setSimilar(topRatedMovies);
      }

      // Combine for personalized recommendations
      setRecommendations([...trending, ...similar].slice(0, 8));
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

  const getRecommendationReason = (index: number, type: string) => {
    const reasons = {
      personalized: [
        { icon: Heart, text: 'Based on your favorite genres', color: 'text-red-500' },
        { icon: Star, text: 'High-rated content you might enjoy', color: 'text-yellow-500' },
        { icon: Clock, text: 'Recently added to your watchlist', color: 'text-blue-500' },
        { icon: Brain, text: 'AI-powered recommendation', color: 'text-purple-500' },
        { icon: Heart, text: 'Similar to your recent watches', color: 'text-red-500' },
        { icon: Star, text: 'Trending in your preferred categories', color: 'text-yellow-500' }
      ],
      trending: [
        { icon: TrendingUp, text: 'Currently trending worldwide', color: 'text-green-500' },
        { icon: Users, text: 'Popular among users like you', color: 'text-blue-500' },
        { icon: TrendingUp, text: 'Rising in popularity', color: 'text-green-500' },
        { icon: Users, text: 'Highly discussed content', color: 'text-blue-500' },
        { icon: TrendingUp, text: 'Breaking into mainstream', color: 'text-green-500' },
        { icon: Users, text: 'Community favorite', color: 'text-blue-500' }
      ],
      similar: [
        { icon: Star, text: 'Critically acclaimed masterpiece', color: 'text-yellow-500' },
        { icon: Heart, text: 'Similar to your high-rated content', color: 'text-red-500' },
        { icon: Star, text: 'Award-winning production', color: 'text-yellow-500' },
        { icon: Heart, text: 'Matches your taste profile', color: 'text-red-500' },
        { icon: Star, text: 'Highly rated by critics', color: 'text-yellow-500' },
        { icon: Heart, text: 'Perfect match for your preferences', color: 'text-red-500' }
      ]
    };
    
    const typeReasons = reasons[type as keyof typeof reasons] || reasons.personalized;
    return typeReasons[index % typeReasons.length];
  };

  const filteredRecommendations = (items: Movie[]) => {
    if (filter === 'all') return items;
    return items.filter(item => item.Type === filter);
  };

  const renderRecommendationCard = (movie: Movie, index: number, type: string) => {
    const reason = getRecommendationReason(index, type);
    const ReasonIcon = reason.icon;
    
    return (
      <Card key={movie.imdbID} className="movie-card group">
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-cinema-blue/30 border-t-cinema-blue rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Finding your perfect recommendations...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${heroCinema})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Navbar />
      
      <main className="pt-16">
        {/* Header */}
        <section className="py-12 bg-gradient-to-r from-cinema-black via-cinema-dark to-cinema-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Brain className="h-12 w-12 text-cinema-blue" />
                <h1 className="heading-hero text-4xl md:text-5xl">What to Watch Next</h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {user ? `Personalized recommendations for ${user.username}` : 'Discover content tailored to your taste'}
              </p>
            </div>

            {/* Movie Quote */}
            <div className="text-center mb-8 animate-fade-in">
              <blockquote className="quote-text text-lg mb-2">
                {currentQuote.text}
              </blockquote>
              <cite className="text-cinema-gold/80 text-sm">
                — {currentQuote.movie} ({currentQuote.year})
              </cite>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                  <SelectTrigger className="w-40 bg-cinema-dark border-cinema-blue/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cinema-dark border-cinema-blue/30">
                    <SelectItem value="all" className="text-foreground">All Content</SelectItem>
                    <SelectItem value="movie" className="text-foreground">Movies</SelectItem>
                    <SelectItem value="series" className="text-foreground">TV Shows</SelectItem>
                  </SelectContent>
                </Select>
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
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-cinema-dark border-cinema-blue/30">
                <TabsTrigger value="personalized" className="text-foreground data-[state=active]:bg-cinema-blue data-[state=active]:text-white">
                  For You
                </TabsTrigger>
                <TabsTrigger value="trending" className="text-foreground data-[state=active]:bg-cinema-blue data-[state=active]:text-white">
                  Trending
                </TabsTrigger>
                <TabsTrigger value="similar" className="text-foreground data-[state=active]:bg-cinema-blue data-[state=active]:text-white">
                  Similar to Your Taste
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personalized" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredRecommendations(recommendations).map((movie, index) => 
                    renderRecommendationCard(movie, index, 'personalized')
                  )}
                </div>
              </TabsContent>

              <TabsContent value="trending" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredRecommendations(trending).map((movie, index) => 
                    renderRecommendationCard(movie, index, 'trending')
                  )}
                </div>
              </TabsContent>

              <TabsContent value="similar" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredRecommendations(similar).map((movie, index) => 
                    renderRecommendationCard(movie, index, 'similar')
                  )}
                </div>
              </TabsContent>
            </Tabs>

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
      </main>
    </div>
  );
};

export default Recommendations;
