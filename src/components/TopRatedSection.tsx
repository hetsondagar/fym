import { useState, useEffect } from 'react';
import { Trophy, Star, Play, Bookmark, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { omdbAPI } from '@/lib/api';
import { Movie } from '@/lib/types';

const TopRatedSection = () => {
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'movie' | 'series'>('movie');

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const data = await omdbAPI.getTopRated(filter);
        if (data.Search) {
          // Fetch detailed info for each movie
          const detailedMovies = await Promise.all(
            data.Search.slice(0, 8).map(async (movie: any) => {
              try {
                const details = await omdbAPI.getById(movie.imdbID);
                return details;
              } catch (error) {
                return movie; // Fallback to basic info
              }
            })
          );
          setTopRatedMovies(detailedMovies);
        }
      } catch (error) {
        console.error('Failed to fetch top-rated content:', error);
        // Fallback data
        setTopRatedMovies([
          {
            imdbID: '1',
            Title: 'The Shawshank Redemption',
            Year: '1994',
            Poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDU3ODQ@._V1_SX300.jpg',
            imdbRating: '9.3',
            Genre: 'Drama',
            Plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
            Type: 'movie',
            Rated: 'R',
            Released: '1994-09-23',
            Runtime: '142 min',
            Director: 'Frank Darabont',
            Writer: 'Stephen King, Frank Darabont',
            Actors: 'Tim Robbins, Morgan Freeman, Bob Gunton',
            Language: 'English',
            Country: 'USA',
            Awards: 'Nominated for 7 Oscars. 21 wins & 45 nominations total',
            Ratings: [],
            Metascore: '82',
            imdbVotes: '2,847,910',
            DVD: '1999-12-17',
            BoxOffice: '$28,767,189',
            Production: 'Castle Rock Entertainment',
            Website: 'N/A',
            Response: 'True'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRated();
  }, [filter]);

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-cinema-gold/30 border-t-cinema-gold rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading top-rated content...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Light overlay for readability */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <Trophy className="h-8 w-8 text-cinema-gold" />
              <h2 className="heading-section">Top Rated</h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl">
              The highest-rated movies and series that have stood the test of time
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={filter} onValueChange={(value: 'movie' | 'series') => setFilter(value)}>
              <SelectTrigger className="w-40 bg-cinema-black/50 border-cinema-gold/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-cinema-dark border-cinema-gold/30">
                <SelectItem value="movie" className="text-foreground hover:bg-cinema-red/20">
                  Movies
                </SelectItem>
                <SelectItem value="series" className="text-foreground hover:bg-cinema-red/20">
                  TV Shows
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Top Rated Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {topRatedMovies.map((movie, index) => (
            <Card key={movie.imdbID} className="movie-card neon-hover group">
              <CardContent className="p-0">
                {/* Rank Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-cinema-gold text-cinema-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
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

                  {/* Awards indicator */}
                  {movie.Awards && movie.Awards !== 'N/A' && (
                    <div className="flex items-center space-x-1 text-xs text-cinema-gold">
                      <Trophy className="h-3 w-3" />
                      <span className="truncate">{movie.Awards.split('.')[0]}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button className="btn-secondary">
            View All Top Rated {filter === 'movie' ? 'Movies' : 'TV Shows'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TopRatedSection;
