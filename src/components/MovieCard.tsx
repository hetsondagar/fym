import { useState } from "react";
import { Star, Clock, Bookmark, Play, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Movie {
  id: string;
  title: string;
  year: number;
  genre?: string[];
  rating?: number | string;
  duration?: string;
  poster: string;
  description?: string;
  isBookmarked?: boolean;
}

interface MovieCardProps {
  movie: Movie;
  onBookmark?: (id: string) => void;
  onPlay?: (id: string) => void;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
  onClick?: () => void;
}

const MovieCard = ({ movie, onBookmark, onPlay, onLike, onDislike, onClick }: MovieCardProps) => {
  const [likeAnim, setLikeAnim] = useState(false);
  const [dislikeAnim, setDislikeAnim] = useState(false);
  const [bookmarkAnim, setBookmarkAnim] = useState(false);

  const trigger = (setter: (v: boolean) => void, duration = 700) => {
    setter(true);
    window.setTimeout(() => setter(false), duration);
  };

  return (
    <div className={`movie-card group relative overflow-hidden ${dislikeAnim ? 'animate-shakeSoft' : ''}`} onClick={onClick}>
      {/* Movie Poster */}
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={movie.poster}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/fym_logo.png'; }}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <Button
                size="sm"
                className="btn-hero text-xs"
                onClick={() => onPlay?.(movie.id)}
              >
                <Play className="h-3 w-3 mr-1" />
                Watch
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={`text-cinema-gold hover:text-cinema-gold/80 ${bookmarkAnim ? 'animate-glowOnce' : ''}`}
                onClick={() => {
                  onBookmark?.(movie.id);
                  trigger(setBookmarkAnim, 600);
                }}
              >
                <Bookmark className={`h-4 w-4 ${movie.isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-neon-teal hover:text-neon-teal/90"
                onClick={() => {
                  onLike?.(movie.id);
                  trigger(setLikeAnim);
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive/90"
                onClick={() => {
                  onDislike?.(movie.id);
                  trigger(setDislikeAnim, 400);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Rating Badge */}
        {movie.rating !== undefined && (
          <div className="absolute top-2 right-2 bg-cinema-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="h-3 w-3 text-cinema-gold fill-current" />
            <span className="text-xs font-medium text-foreground">{movie.rating}</span>
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-cinzel font-semibold text-lg text-foreground group-hover:text-cinema-gold transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{movie.year}</span>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{movie.duration}</span>
          </div>
        </div>

        {movie.genre && (
          <div className="flex flex-wrap gap-1">
            {movie.genre.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-xs px-2 py-1 bg-cinema-red/20 text-cinema-red rounded-full"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {movie.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors">
            {movie.description}
          </p>
        )}
      </div>

      {/* Like ripple */}
      {likeAnim && (
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-ripple"
          style={{ width: 12, height: 12, background: 'radial-gradient(circle, hsla(var(--neon-teal)/0.35) 0%, hsla(var(--neon-teal)/0.25) 40%, transparent 60%)' }}
        />
      )}
      {/* Dislike faint cross overlay */}
      {dislikeAnim && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <X className="w-16 h-16 text-destructive/40" />
        </div>
      )}
    </div>
  );
};

export default MovieCard;