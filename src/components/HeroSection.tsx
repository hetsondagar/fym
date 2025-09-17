import { Play, Bookmark, Star, Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroCinema from "@/assets/hero-cinema.jpg";

const HeroSection = () => {
  const movieQuotes = [
    {
      text: "May the Force be with you.",
      movie: "Star Wars",
      year: "1977"
    },
    {
      text: "I'll be back.",
      movie: "The Terminator", 
      year: "1984"
    },
    {
      text: "Here's looking at you, kid.",
      movie: "Casablanca",
      year: "1942"
    }
  ];

  const currentQuote = movieQuotes[0];

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Subtle overlay to improve readability over dynamic background */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Movie Quote */}
        <div className="mb-8 animate-fade-in rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <blockquote className="quote-text text-xl md:text-2xl mb-4">
            {currentQuote.text}
          </blockquote>
          <cite className="text-cinema-gold/80 text-sm">
            — {currentQuote.movie} ({currentQuote.year})
          </cite>
        </div>

        {/* Main Hero Content */}
        <div className="space-y-8 animate-slide-up rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
          <h1 className="heading-hero mb-6 animate-glow">
            Find Your Movie
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Discover your next cinematic adventure. Curate watchlists, track your viewing journey, 
            and connect with fellow film enthusiasts in the ultimate movie discovery platform.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-start sm:justify-center items-center">
            <Button className="btn-hero group px-8 py-6 rounded-xl">
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Start Exploring
            </Button>
            <Button className="px-8 py-6 rounded-xl bg-gradient-to-r from-[#FF6F61] to-[#FF4C4C] text-white shadow-neon hover:shadow-glow">
              <Bookmark className="mr-2 h-4 w-4" />
              Create Watchlist
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14">
            <div className="glass-panel neon-hover p-6 text-left">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-6 w-6 text-white" />
                <span className="text-3xl font-bold bg-clip-text text-transparent" style={{backgroundImage:'linear-gradient(90deg,#FF4C4C,#9C27B0)'}}>50K+</span>
              </div>
              <p className="text-foreground/80">Movies & Shows</p>
            </div>
            <div className="glass-panel neon-hover p-6 text-left">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6 text-white" />
                <span className="text-3xl font-bold bg-clip-text text-transparent" style={{backgroundImage:'linear-gradient(90deg,#FF4C4C,#00FFF7)'}}>1M+</span>
              </div>
              <p className="text-foreground/80">User Reviews</p>
            </div>
            <div className="glass-panel neon-hover p-6 text-left">
              <div className="flex items-center gap-3 mb-2">
                <UserPlus className="h-6 w-6 text-white" />
                <span className="text-3xl font-bold bg-clip-text text-transparent" style={{backgroundImage:'linear-gradient(90deg,#FF6F61,#9C27B0)'}}>25K+</span>
              </div>
              <p className="text-foreground/80">Active Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating film elements */}
      <div className="absolute bottom-10 left-10 opacity-20">
        <div className="w-16 h-16 border-2 border-cinema-gold rounded-full animate-pulse"></div>
      </div>
      <div className="absolute top-20 right-10 opacity-20">
        <div className="w-12 h-12 border border-cinema-red rotate-45 animate-pulse"></div>
      </div>
    </section>
  );
};

export default HeroSection;