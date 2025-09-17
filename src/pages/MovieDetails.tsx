import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BackgroundCarousel from '@/components/BackgroundCarousel';
import { omdbAPI, userAPI } from '@/lib/api';
import { Movie } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Bookmark, Play, Star, ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

const MovieDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const imdbId = (location.state as any)?.imdbID || new URLSearchParams(location.search).get('i') || '';
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!imdbId) return;
        const details = await omdbAPI.getById(imdbId);
        setMovie(details);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [imdbId]);

  return (
    <div className="min-h-screen bg-background">
      <BackgroundCarousel
        queries={[{ term: movie?.Title || 'cinema', type: 'movie' }]}
        intervalMs={7000}
        opacity={0.6}
      />
      <Navbar />
      <main className="pt-16">
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-foreground/80">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              {loading || !movie ? (
                <div className="text-center py-16">
                  <div className="w-8 h-8 border-2 border-cinema-red/30 border-t-cinema-red rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading details...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <img src={movie.Poster} alt={movie.Title} className="w-full rounded-xl" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/fym_logo.png'; }} />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <h1 className="heading-hero text-4xl md:text-5xl mb-2">{movie.Title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>{movie.Year}</span>
                      <span>•</span>
                      <span>{movie.Runtime}</span>
                      <span>•</span>
                      <span>{movie.Genre}</span>
                      <span className="inline-flex items-center gap-1 bg-cinema-black/60 px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 text-cinema-gold fill-current" /> {movie.imdbRating}
                      </span>
                    </div>
                    <p className="text-foreground/90 leading-relaxed">{movie.Plot}</p>
                    <div className="text-sm text-muted-foreground">
                      <p><strong className="text-foreground">Director:</strong> {movie.Director}</p>
                      <p><strong className="text-foreground">Cast:</strong> {movie.Actors}</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button className="btn-hero">
                        <Play className="h-4 w-4 mr-2" /> Watch Trailer
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-cinema-gold hover:text-cinema-gold/80"
                        onClick={async () => {
                          const currentUser = userAPI.getCurrentUser();
                          if (!currentUser) return;
                          await userAPI.addToWatchlist(currentUser.id, movie as any);
                        }}
                      >
                        <Bookmark className="h-4 w-4 mr-2" /> Add to Watchlist
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Carousel Placeholder */}
        <section className="py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="heading-section mb-6">Related</h2>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-muted-foreground">
              Coming soon
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MovieDetails;


