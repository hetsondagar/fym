import { useMemo, useState } from "react";
import { Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MovieCard from "./MovieCard";
import { useNavigate } from "react-router-dom";
import { useOmdbTrending } from "@/hooks/use-omdb";
import { userAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const MoviesGrid = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('rating');

  const { data, isLoading } = useOmdbTrending();
  const { toast } = useToast();
  const navigate = useNavigate();

  const movies = useMemo(() => {
    const search = (data as any)?.Search as Array<any> | undefined;
    if (!search) return [] as any[];
    return search.map((m) => ({
      id: m.imdbID,
      title: m.Title,
      year: Number(m.Year) || 0,
      genre: [],
      rating: 0,
      duration: "",
      poster: m.Poster,
      description: "",
    }));
  }, [data]);

  const handleBookmark = async (id: string) => {
    try {
      const currentUser = userAPI.getCurrentUser();
      if (!currentUser) {
        toast({ title: "Sign in required", description: "Please sign in to save to your watchlist." });
        return;
      }
      const movie = movies.find((m) => m.id === id);
      if (!movie) return;
      await userAPI.addToWatchlist(currentUser.id, {
        imdbID: movie.id,
        Title: movie.title,
        Year: String(movie.year || ""),
        Type: 'movie',
        Poster: movie.poster,
      } as any);
      toast({ title: "Added to Watchlist", description: `${movie.title} saved.` });
    } catch (error: any) {
      toast({ title: "Could not add", description: error?.message || "Try again." });
    }
  };

  const handlePlay = (id: string) => {
    const movie = movies.find((m) => m.id === id);
    toast({ title: "Opening details", description: movie ? movie.title : "Movie" });
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h2 className="heading-section mb-2">Trending Movies</h2>
            <p className="text-muted-foreground">Discover the most popular films right now</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort Options */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-cinema-dark border-cinema-red/30">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-cinema-dark border-cinema-red/30">
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="year">Release Year</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex bg-cinema-dark rounded-lg p-1">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button className="btn-secondary">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Movies Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
            : 'grid-cols-1'
        }`}>
          {isLoading && (
            <div className="col-span-full text-center py-8 text-muted-foreground">Loading trending from OMDB...</div>
          )}
          {movies.map((movie) => (
            <div key={movie.id} className="animate-fade-in">
              <MovieCard 
                movie={movie}
                onBookmark={handleBookmark}
                onPlay={handlePlay}
              onClick={() => navigate(`/details?i=${movie.id}`, { state: { imdbID: movie.id } })}
              />
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button className="btn-hero">
            Load More Movies
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MoviesGrid;