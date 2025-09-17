import { useState, useEffect } from 'react';
import { TrendingUp, Play, Bookmark, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { omdbAPI, userAPI } from '@/lib/api';
import { Movie } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const TrendingSection = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await omdbAPI.getTrending();
        if (data.Search) {
          // Fetch detailed info for each movie
          const detailedMovies = await Promise.all(
            data.Search.slice(0, 6).map(async (movie: any) => {
              try {
                const details = await omdbAPI.getById(movie.imdbID);
                return details;
              } catch (error) {
                return movie; // Fallback to basic info
              }
            })
          );
          setTrendingMovies(detailedMovies);
        }
      } catch (error) {
        console.error('Failed to fetch trending movies:', error);
        // Fallback data
        setTrendingMovies([
          {
            imdbID: '1',
            Title: 'The Dark Knight',
            Year: '2008',
            Poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
            imdbRating: '9.0',
            Genre: 'Action, Crime, Drama',
            Plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
            Type: 'movie',
            Rated: 'PG-13',
            Released: '2008-07-18',
            Runtime: '152 min',
            Director: 'Christopher Nolan',
            Writer: 'Jonathan Nolan, Christopher Nolan',
            Actors: 'Christian Bale, Heath Ledger, Aaron Eckhart',
            Language: 'English',
            Country: 'USA',
            Awards: 'Won 2 Oscars. 163 wins & 163 nominations total',
            Ratings: [],
            Metascore: '84',
            imdbVotes: '2,847,910',
            DVD: '2008-12-09',
            BoxOffice: '$534,987,076',
            Production: 'Warner Bros.',
            Website: 'N/A',
            Response: 'True'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % trendingMovies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + trendingMovies.length) % trendingMovies.length);
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-cinema-red/30 border-t-cinema-red rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading trending movies...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Light overlay for readability over dynamic bg */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <TrendingUp className="h-8 w-8 text-cinema-red" />
            <h2 className="heading-section">Trending Now</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover what everyone is watching and talking about right now
          </p>
        </div>

        {/* Featured Movie Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {trendingMovies.map((movie, index) => (
                <div key={movie.imdbID} className="w-full flex-shrink-0">
                  <div 
                    className="relative h-96 md:h-[500px] bg-cover bg-center rounded-2xl"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${movie.Poster})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cinema-black/80 via-cinema-black/40 to-transparent"></div>
                    
                    <div className="relative z-10 h-full flex items-center">
                      <div className="max-w-2xl px-8 md:px-12">
                        <div className="flex items-center space-x-2 mb-4">
                          <Star className="h-5 w-5 text-cinema-gold fill-current" />
                          <span className="text-cinema-gold font-semibold">{movie.imdbRating}/10</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{movie.Year}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{movie.Runtime}</span>
                        </div>
                        
                        <h3 className="font-cinzel text-4xl md:text-5xl font-bold text-foreground mb-4">
                          {movie.Title}
                        </h3>
                        
                        <p className="text-foreground/90 text-lg mb-6 line-clamp-3">
                          {movie.Plot}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {movie.Genre.split(', ').slice(0, 3).map((genre) => (
                            <span
                              key={genre}
                              className="px-3 py-1 bg-cinema-red/20 text-cinema-red rounded-full text-sm font-medium"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex space-x-4">
                          <Button className="btn-hero" onClick={() => toast({ title: 'Opening', description: movie.Title })}>
                            <Play className="mr-2 h-5 w-5" />
                            Watch Now
                          </Button>
                          <Button
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
                            <Bookmark className="mr-2 h-4 w-4" />
                            Add to Watchlist
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-cinema-black/50 hover:bg-cinema-black/70 text-foreground"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-cinema-black/50 hover:bg-cinema-black/70 text-foreground"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Movie Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {trendingMovies.map((movie, index) => (
            <Card
              key={movie.imdbID}
              className={`movie-card neon-hover cursor-pointer transition-all duration-300 ${
                index === currentIndex ? 'ring-2 ring-cinema-red scale-105' : ''
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <CardContent className="p-0">
                <div className="aspect-[2/3] relative overflow-hidden">
                  <img
                    src={movie.Poster}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/fym_logo.png'; }}
                    alt={movie.Title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cinema-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="h-3 w-3 text-cinema-gold fill-current" />
                        <span className="text-xs text-foreground font-medium">{movie.imdbRating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm text-foreground truncate">{movie.Title}</h4>
                  <p className="text-xs text-muted-foreground">{movie.Year}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
