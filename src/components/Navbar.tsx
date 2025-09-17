import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Film, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userAPI } from "@/lib/api";
import { omdbAPI } from '@/lib/api';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const currentUser = userAPI.getCurrentUser();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ Title: string; imdbID: string; Year: string }>>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        if (query.trim().length < 3) { setSuggestions([]); return; }
        const data = await omdbAPI.search(query);
        setSuggestions((data?.Search || []).slice(0, 6));
      } catch {
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "TV Shows", href: "/tv-shows" },
    { name: "Watchlist", href: "/watchlist" },
    { name: "Recommendations", href: "/recommendations" },
  ];

  const handleSignOut = () => {
    userAPI.signOut();
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cinema-black/90 backdrop-blur-md border-b border-cinema-red/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/fym_logo.png" alt="FYM" className="h-9 w-9 rounded" />
            <div className="leading-tight">
              <div className="font-poppins text-xl font-bold tracking-wide">
                <span className="text-cinema-red">FYM</span>
                <span className="sr-only">&nbsp;</span>
                <span className="ml-2 text-foreground/90">Find Your Movie</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`transition-colors duration-300 font-medium relative ${
                  location.pathname === item.href
                    ? 'text-cinema-gold'
                    : 'text-foreground/80 hover:text-cinema-gold'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-2 left-0 h-0.5 bg-cinema-gold transition-all duration-500 ${
                  location.pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search movies, shows..."
                className="pl-10 w-full"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
              />
              {open && suggestions.length > 0 && (
                <div className="absolute mt-2 w-full glass-panel p-2">
                  {suggestions.map((s) => (
                    <Link key={s.imdbID} to={`/details?i=${s.imdbID}`} state={{ imdbID: s.imdbID }} className="block px-3 py-2 rounded-md hover:bg-white/5">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/90">{s.Title}</span>
                        <span className="text-muted-foreground">{s.Year}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-foreground/80 hidden sm:block">
                  {currentUser.username}
                </span>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="btn-hero" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-cinema-red/20">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`transition-colors duration-300 font-medium px-2 py-1 ${
                    location.pathname === item.href
                      ? 'text-cinema-gold'
                      : 'text-foreground/80 hover:text-cinema-gold'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-3 border-t border-cinema-red/20">
                <Input
                  placeholder="Search..."
                  className="bg-cinema-dark border-cinema-red/30"
                />
              </div>
              {currentUser ? (
                <div className="pt-3 border-t border-cinema-red/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/80">{currentUser.username}</span>
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-cinema-red/20 flex space-x-2">
                  <Link to="/signin" className="flex-1">
                    <Button variant="ghost" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" className="flex-1">
                    <Button className="btn-hero" size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;