import { useState, useEffect } from 'react';
import { Users, Plus, Share2, Edit3, Trash2, UserPlus, History, Lock, Unlock, Star, Play, Bookmark, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { userAPI, omdbAPI } from '@/lib/api';
import { User as UserType, Watchlist, WatchlistItem } from '@/lib/types';
import Navbar from '@/components/Navbar';

const CollaborativeWatchlists = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [collaborativeWatchlists, setCollaborativeWatchlists] = useState<Watchlist[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedWatchlist, setSelectedWatchlist] = useState<Watchlist | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [movieSearchQuery, setMovieSearchQuery] = useState('');
  const [movieSearchResults, setMovieSearchResults] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false
  });

  useEffect(() => {
    const currentUser = userAPI.getCurrentUser();
    setUser(currentUser);
    loadCollaborativeWatchlists();
  }, []);

  const loadCollaborativeWatchlists = () => {
    // Mock data for demonstration
    const mockWatchlists: Watchlist[] = [
      {
        name: 'Family Movie Night',
        items: [
          {
            imdbID: '1',
            Title: 'The Lion King',
            Year: '1994',
            Type: 'movie',
            Poster: 'https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FjMjhiYzNhXkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_SX300.jpg',
            addedAt: '2024-01-20T10:00:00Z',
            watched: false,
            rating: null,
            notes: 'Perfect for family viewing'
          }
        ],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-25T10:00:00Z',
        isPublic: true,
        collaborators: ['1', '2', '3']
      },
      {
        name: 'Horror Movie Marathon',
        items: [
          {
            imdbID: '2',
            Title: 'The Shining',
            Year: '1980',
            Type: 'movie',
            Poster: 'https://m.media-amazon.com/images/M/MV5BZWFlYmY2MGEtZjVkYS00YzU4LTg0YjQtYzY1ZGE3NTA5NGQxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
            addedAt: '2024-01-22T14:00:00Z',
            watched: false,
            rating: null,
            notes: 'Classic horror film'
          }
        ],
        createdAt: '2024-01-20T14:00:00Z',
        updatedAt: '2024-01-26T14:00:00Z',
        isPublic: false,
        collaborators: ['1', '4']
      }
    ];
    setCollaborativeWatchlists(mockWatchlists);
  };

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setMovieSearchResults([]);
      return;
    }
    
    try {
      const data = await omdbAPI.search(query, 'movie');
      if (data.Search) {
        setMovieSearchResults(data.Search.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to search movies:', error);
      setMovieSearchResults([]);
    }
  };

  const handleCreateWatchlist = () => {
    if (!user || !formData.name) return;
    
    const newWatchlist: Watchlist = {
      name: formData.name,
      description: formData.description,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: formData.isPublic,
      collaborators: [user.id]
    };
    
    setCollaborativeWatchlists(prev => [newWatchlist, ...prev]);
    setIsCreating(false);
    setFormData({
      name: '',
      description: '',
      isPublic: false
    });
  };

  const addMovieToWatchlist = (watchlist: Watchlist, movie: any) => {
    const newItem: WatchlistItem = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Type: movie.Type,
      Poster: movie.Poster,
      addedAt: new Date().toISOString(),
      watched: false,
      rating: null,
      notes: ''
    };
    
    setCollaborativeWatchlists(prev => prev.map(wl => 
      wl.name === watchlist.name 
        ? { ...wl, items: [...wl.items, newItem], updatedAt: new Date().toISOString() }
        : wl
    ));
    
    setMovieSearchQuery('');
    setMovieSearchResults([]);
  };

  const removeMovieFromWatchlist = (watchlist: Watchlist, imdbId: string) => {
    setCollaborativeWatchlists(prev => prev.map(wl => 
      wl.name === watchlist.name 
        ? { 
            ...wl, 
            items: wl.items.filter(item => item.imdbID !== imdbId),
            updatedAt: new Date().toISOString()
          }
        : wl
    ));
  };

  const inviteCollaborator = (watchlist: Watchlist) => {
    if (!inviteEmail.trim()) return;
    
    // In a real app, this would send an invitation email
    console.log(`Inviting ${inviteEmail} to collaborate on ${watchlist.name}`);
    setInviteEmail('');
  };

  const filteredWatchlists = collaborativeWatchlists.filter(watchlist =>
    watchlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    watchlist.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Please sign in</h2>
            <p className="text-muted-foreground">You need to be signed in to create collaborative watchlists.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Header */}
        <section className="py-12 bg-gradient-to-r from-cinema-black via-cinema-dark to-cinema-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Users className="h-12 w-12 text-cinema-blue" />
                <h1 className="heading-hero text-4xl md:text-5xl">Collaborative Watchlists</h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Create shared watchlists with friends and family. Collaborate on movie selections and plan group viewing sessions.
              </p>
            </div>

            <div className="text-center">
              <Button 
                className="btn-hero"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Collaborative Watchlist
              </Button>
            </div>
          </div>
        </section>

        {/* Create Watchlist Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-cinema-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-cinema-dark border-cinema-gold/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-foreground">Create Collaborative Watchlist</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCreating(false)}
                    className="text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">Watchlist Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Family Movie Night"
                    className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this watchlist is for..."
                    className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="w-4 h-4 text-cinema-gold bg-cinema-black border-cinema-gold/30 rounded focus:ring-cinema-gold"
                  />
                  <Label htmlFor="isPublic" className="text-foreground">
                    Make this watchlist public
                  </Label>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleCreateWatchlist}
                    className="btn-hero flex-1"
                    disabled={!formData.name}
                  >
                    Create Watchlist
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setIsCreating(false)}
                    className="text-muted-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Watchlists Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search collaborative watchlists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-cinema-dark border-cinema-blue/30 focus:border-cinema-blue"
                />
              </div>
            </div>

            {/* Watchlists List */}
            {filteredWatchlists.length > 0 ? (
              <div className="space-y-6">
                {filteredWatchlists.map((watchlist, index) => (
                  <Card key={index} className="movie-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <CardTitle className="text-xl text-foreground">{watchlist.name}</CardTitle>
                            {watchlist.isPublic ? (
                              <Badge className="bg-green-500">
                                <Unlock className="h-3 w-3 mr-1" />
                                Public
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-cinema-gold/30 text-cinema-gold">
                                <Lock className="h-3 w-3 mr-1" />
                                Private
                              </Badge>
                            )}
                          </div>
                          {watchlist.description && (
                            <p className="text-muted-foreground mb-3">{watchlist.description}</p>
                          )}
                          
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{watchlist.collaborators.length} collaborators</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Bookmark className="h-4 w-4" />
                              <span>{watchlist.items.length} items</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <History className="h-4 w-4" />
                              <span>Updated {new Date(watchlist.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-cinema-gold"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-cinema-gold"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {/* Add Movie Section */}
                      <div className="mb-6 p-4 bg-cinema-black/30 rounded-lg border border-cinema-blue/20">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <Input
                              placeholder="Search for movies to add..."
                              value={movieSearchQuery}
                              onChange={(e) => {
                                setMovieSearchQuery(e.target.value);
                                searchMovies(e.target.value);
                              }}
                              className="bg-cinema-dark border-cinema-blue/30 focus:border-cinema-blue"
                            />
                          </div>
                          <Button
                            size="sm"
                            className="btn-hero"
                            disabled={!movieSearchQuery}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Movie
                          </Button>
                        </div>
                        
                        {movieSearchResults.length > 0 && (
                          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                            {movieSearchResults.map((movie) => (
                              <div
                                key={movie.imdbID}
                                className="flex items-center space-x-3 p-2 rounded cursor-pointer hover:bg-cinema-dark/50 transition-colors"
                                onClick={() => addMovieToWatchlist(watchlist, movie)}
                              >
                                <img
                                  src={movie.Poster}
                                  alt={movie.Title}
                                  className="w-12 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-foreground">{movie.Title}</h4>
                                  <p className="text-sm text-muted-foreground">{movie.Year}</p>
                                </div>
                                <Button size="sm" variant="ghost" className="text-cinema-gold">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Movies Grid */}
                      {watchlist.items.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {watchlist.items.map((item) => (
                            <Card key={item.imdbID} className="movie-card group">
                              <CardContent className="p-0">
                                <div className="aspect-[2/3] relative overflow-hidden">
                                  <img
                                    src={item.Poster}
                                    alt={item.Title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  />
                                  
                                  <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-2 left-2 right-2">
                                      <div className="flex items-center gap-1">
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
                                          onClick={() => removeMovieFromWatchlist(watchlist, item.imdbID)}
                                          className="text-red-500 hover:text-red-400"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="p-2">
                                  <h4 className="font-medium text-xs text-foreground truncate group-hover:text-cinema-gold transition-colors">
                                    {item.Title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">{item.Year}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground">No movies added yet</p>
                          <p className="text-sm text-muted-foreground">Start by searching for movies above</p>
                        </div>
                      )}

                      {/* Collaborators Section */}
                      <div className="mt-6 pt-6 border-t border-cinema-red/20">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-foreground">Collaborators</h3>
                          <div className="flex items-center space-x-2">
                            <Input
                              placeholder="Invite by email..."
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                              className="w-48 bg-cinema-dark border-cinema-blue/30 focus:border-cinema-blue"
                            />
                            <Button
                              size="sm"
                              onClick={() => inviteCollaborator(watchlist)}
                              className="btn-hero"
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Invite
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {watchlist.collaborators.map((collaboratorId) => (
                            <Avatar key={collaboratorId} className="h-8 w-8">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${collaboratorId}`} />
                              <AvatarFallback className="bg-cinema-red text-white text-xs">
                                {collaboratorId.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No collaborative watchlists yet</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? 'No watchlists match your search criteria.' : 'Create your first collaborative watchlist to start planning movie nights with friends!'}
                </p>
                <Button className="btn-hero" onClick={() => setIsCreating(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Collaborative Watchlist
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CollaborativeWatchlists;
