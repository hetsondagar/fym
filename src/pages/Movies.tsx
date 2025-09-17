import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Star, Play, Bookmark, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { omdbAPI, userAPI } from '@/lib/api';
import { Movie, SearchResult } from '@/lib/types';
import Navbar from '@/components/Navbar';
import BackgroundCarousel from '@/components/BackgroundCarousel';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'title' | 'year' | 'rating'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    genre: [] as string[],
    year: [1990, 2024] as number[],
    rating: [0, 10] as number[],
    type: 'movie' as 'movie' | 'series' | 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const genres = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History', 'Horror', 'Music', 'Musical',
    'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
  ];

  const searchMovies = async (query: string = searchQuery) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const data = await omdbAPI.search(query, 'movie');
      if (data.Search) {
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie: any) => {
            try {
              const details = await omdbAPI.getById(movie.imdbID);
              return details;
            } catch (error) {
              return movie;
            }
          })
        );
        setMovies(detailedMovies);
      }
    } catch (error) {
      console.error('Failed to search movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchMovies();
  };

  const toggleGenre = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }));
  };

  const filteredMovies = movies.filter(movie => {
    // Genre filter
    if (filters.genre.length > 0) {
      const movieGenres = movie.Genre.split(', ').map(g => g.trim());
      if (!filters.genre.some(genre => movieGenres.includes(genre))) {
        return false;
      }
    }

    // Year filter
    const movieYear = parseInt(movie.Year);
    if (movieYear < filters.year[0] || movieYear > filters.year[1]) {
      return false;
    }

    // Rating filter
    const rating = parseFloat(movie.imdbRating);
    if (rating < filters.rating[0] || rating > filters.rating[1]) {
      return false;
    }

    return true;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'title':
        aValue = a.Title.toLowerCase();
        bValue = b.Title.toLowerCase();
        break;
      case 'year':
        aValue = parseInt(a.Year);
        bValue = parseInt(b.Year);
        break;
      case 'rating':
        aValue = parseFloat(a.imdbRating);
        bValue = parseFloat(b.imdbRating);
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <BackgroundCarousel
        queries={[
          { term: 'Avengers', type: 'movie' },
          { term: 'Matrix', type: 'movie' },
          { term: 'Harry Potter', type: 'movie' },
          { term: 'Spider-Man', type: 'movie' },
        ]}
        intervalMs={6000}
        opacity={0.72}
      />
      <Navbar />
      
      <main className="pt-16">
        {/* Header */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h1 className="heading-hero text-4xl md:text-5xl mb-4">Movies</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover thousands of movies from every genre and era. Find your next favorite film.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg bg-cinema-dark border-cinema-red/30 focus:border-cinema-red"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-hero"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>
            </form>

            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-cinema-gold hover:text-cinema-gold/80"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-40 bg-cinema-dark border-cinema-red/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cinema-dark border-cinema-red/30">
                    <SelectItem value="title" className="text-foreground">Title</SelectItem>
                    <SelectItem value="year" className="text-foreground">Year</SelectItem>
                    <SelectItem value="rating" className="text-foreground">Rating</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="text-cinema-gold hover:text-cinema-gold/80"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="text-cinema-gold hover:text-cinema-gold/80"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="text-cinema-gold hover:text-cinema-gold/80"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Panel */}
        {showFilters && (
          <section className="py-6 bg-cinema-dark/50 border-b border-cinema-red/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Genre Filter */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <Badge
                        key={genre}
                        variant={filters.genre.includes(genre) ? 'default' : 'outline'}
                        className={`cursor-pointer transition-colors ${
                          filters.genre.includes(genre)
                            ? 'bg-cinema-red text-white'
                            : 'border-cinema-red/30 text-cinema-red hover:bg-cinema-red/10'
                        }`}
                        onClick={() => toggleGenre(genre)}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Year Filter */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">
                    Year: {filters.year[0]} - {filters.year[1]}
                  </h3>
                  <Slider
                    value={filters.year}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, year: value as [number, number] }))}
                    max={2024}
                    min={1900}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">
                    Rating: {filters.rating[0]} - {filters.rating[1]}
                  </h3>
                  <Slider
                    value={filters.rating}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value as [number, number] }))}
                    max={10}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Results */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-cinema-red/30 border-t-cinema-red rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Searching movies...</p>
              </div>
            ) : sortedMovies.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Found {sortedMovies.length} movie{sortedMovies.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {sortedMovies.map((movie) => (
                      <Card key={movie.imdbID} className="movie-card neon-hover group">
                        <CardContent className="p-0">
                          <div className="aspect-[2/3] relative overflow-hidden">
                            <img
                              src={movie.Poster}
                              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/fym_logo.png'; }}
                              alt={movie.Title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            
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

                            <div className="absolute top-2 right-2 bg-cinema-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                              <Star className="h-3 w-3 text-cinema-gold fill-current" />
                              <span className="text-xs font-medium text-foreground">{movie.imdbRating}</span>
                            </div>
                          </div>

                          <div className="p-3">
                            <h3 className="font-medium text-sm text-foreground truncate group-hover:text-cinema-gold transition-colors">
                              {movie.Title}
                            </h3>
                            <p className="text-xs text-muted-foreground">{movie.Year}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {movie.Genre.split(', ').slice(0, 2).map((genre) => (
                                <span
                                  key={genre}
                                  className="text-xs px-1 py-0.5 bg-cinema-red/20 text-cinema-red rounded"
                                >
                                  {genre}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedMovies.map((movie) => (
                      <Card key={movie.imdbID} className="movie-card">
                        <CardContent className="p-4">
                          <div className="flex space-x-4">
                            <img
                              src={movie.Poster}
                              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/fym_logo.png'; }}
                              alt={movie.Title}
                              className="w-20 h-28 object-cover rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg text-foreground mb-1">
                                    {movie.Title}
                                  </h3>
                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                                    <span>{movie.Year}</span>
                                    <span>{movie.Runtime}</span>
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-4 w-4 text-cinema-gold fill-current" />
                                      <span>{movie.imdbRating}</span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                    {movie.Plot}
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {movie.Genre.split(', ').slice(0, 3).map((genre) => (
                                      <span
                                        key={genre}
                                        className="text-xs px-2 py-1 bg-cinema-red/20 text-cinema-red rounded-full"
                                      >
                                        {genre}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button size="sm" className="btn-hero">
                                    <Play className="h-4 w-4 mr-1" />
                                    Watch
                                  </Button>
                                  <Button size="sm" variant="ghost" className="text-cinema-gold">
                                    <Bookmark className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {searchQuery ? 'No movies found for your search.' : 'Search for movies to get started.'}
                </p>
              </div>
            )}
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
};

export default Movies;
