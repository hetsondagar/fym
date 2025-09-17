import { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, Clock, Play, Share2, Copy, Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { userAPI, omdbAPI } from '@/lib/api';
import { User, WatchParty, Movie } from '@/lib/types';
import Navbar from '@/components/Navbar';

const WatchParty = () => {
  const [user, setUser] = useState<User | null>(null);
  const [watchParties, setWatchParties] = useState<WatchParty[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledDate: new Date(),
    duration: 120,
    cost: 0,
    maxParticipants: 10
  });

  useEffect(() => {
    const currentUser = userAPI.getCurrentUser();
    setUser(currentUser);
    loadWatchParties();
  }, []);

  const loadWatchParties = () => {
    // Mock data for demonstration
    const mockParties: WatchParty[] = [
      {
        id: '1',
        title: 'Marvel Movie Night',
        description: 'Watching the latest Marvel movie together!',
        hostId: user?.id || '1',
        participants: ['2', '3', '4'],
        movieId: '1',
        scheduledDate: '2024-02-15T20:00:00Z',
        duration: 150,
        cost: 15.99,
        costPerPerson: 3.99,
        status: 'scheduled',
        chatMessages: [],
        createdAt: '2024-01-25T10:00:00Z'
      },
      {
        id: '2',
        title: 'Horror Movie Marathon',
        description: 'Spooky night with classic horror films',
        hostId: '2',
        participants: ['1', '3'],
        movieId: '2',
        scheduledDate: '2024-02-20T19:00:00Z',
        duration: 180,
        cost: 0,
        costPerPerson: 0,
        status: 'scheduled',
        chatMessages: [],
        createdAt: '2024-01-26T14:00:00Z'
      }
    ];
    setWatchParties(mockParties);
  };

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const data = await omdbAPI.search(query, 'movie');
      if (data.Search) {
        const detailedMovies = await Promise.all(
          data.Search.slice(0, 5).map(async (movie: any) => {
            try {
              const details = await omdbAPI.getById(movie.imdbID);
              return details;
            } catch (error) {
              return movie;
            }
          })
        );
        setSearchResults(detailedMovies);
      }
    } catch (error) {
      console.error('Failed to search movies:', error);
      setSearchResults([]);
    }
  };

  const handleCreateParty = () => {
    if (!selectedMovie || !user) return;
    
    const newParty: WatchParty = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      hostId: user.id,
      participants: [user.id],
      movieId: selectedMovie.imdbID,
      scheduledDate: formData.scheduledDate.toISOString(),
      duration: formData.duration,
      cost: formData.cost,
      costPerPerson: formData.cost / formData.maxParticipants,
      status: 'scheduled',
      chatMessages: [],
      createdAt: new Date().toISOString()
    };
    
    setWatchParties(prev => [newParty, ...prev]);
    setIsCreating(false);
    setFormData({
      title: '',
      description: '',
      scheduledDate: new Date(),
      duration: 120,
      cost: 0,
      maxParticipants: 10
    });
    setSelectedMovie(null);
  };

  const copyInviteLink = (partyId: string) => {
    const link = `${window.location.origin}/watch-party/${partyId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(partyId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const joinParty = (partyId: string) => {
    if (!user) return;
    
    setWatchParties(prev => prev.map(party => 
      party.id === partyId 
        ? { ...party, participants: [...party.participants, user.id] }
        : party
    ));
  };

  const leaveParty = (partyId: string) => {
    if (!user) return;
    
    setWatchParties(prev => prev.map(party => 
      party.id === partyId 
        ? { ...party, participants: party.participants.filter(id => id !== user.id) }
        : party
    ));
  };

  const getPartyStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Please sign in</h2>
            <p className="text-muted-foreground">You need to be signed in to create or join watch parties.</p>
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
                <Calendar className="h-12 w-12 text-cinema-gold" />
                <h1 className="heading-hero text-4xl md:text-5xl">Watch Parties</h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Plan movie nights with friends, split costs, and enjoy synchronized viewing experiences
              </p>
            </div>

            <div className="text-center">
              <Button 
                className="btn-hero"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Watch Party
              </Button>
            </div>
          </div>
        </section>

        {/* Create Party Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-cinema-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-cinema-dark border-cinema-gold/30 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-foreground">Create Watch Party</CardTitle>
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
              
              <CardContent className="space-y-6">
                {/* Movie Selection */}
                <div>
                  <Label className="text-foreground mb-2 block">Select Movie</Label>
                  <div className="space-y-4">
                    <Input
                      placeholder="Search for a movie..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchMovies(e.target.value);
                      }}
                      className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                    />
                    
                    {searchResults.length > 0 && (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {searchResults.map((movie) => (
                          <div
                            key={movie.imdbID}
                            className={`flex items-center space-x-3 p-3 rounded cursor-pointer transition-colors ${
                              selectedMovie?.imdbID === movie.imdbID
                                ? 'bg-cinema-gold/20 border border-cinema-gold'
                                : 'bg-cinema-black/50 hover:bg-cinema-black/70'
                            }`}
                            onClick={() => setSelectedMovie(movie)}
                          >
                            <img
                              src={movie.Poster}
                              alt={movie.Title}
                              className="w-12 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground">{movie.Title}</h4>
                              <p className="text-sm text-muted-foreground">{movie.Year} • {movie.Runtime}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {selectedMovie && (
                      <div className="flex items-center space-x-3 p-3 bg-cinema-gold/20 border border-cinema-gold rounded">
                        <img
                          src={selectedMovie.Poster}
                          alt={selectedMovie.Title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium text-foreground">{selectedMovie.Title}</h4>
                          <p className="text-sm text-muted-foreground">{selectedMovie.Year}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Party Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-foreground">Party Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Marvel Movie Night"
                      className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="maxParticipants" className="text-foreground">Max Participants</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                      className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell your friends about this watch party..."
                    className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-foreground mb-2 block">Date & Time</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-cinema-black/50 border-cinema-gold/30"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {format(formData.scheduledDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-cinema-dark border-cinema-gold/30">
                        <CalendarComponent
                          mode="single"
                          selected={formData.scheduledDate}
                          onSelect={(date) => date && setFormData(prev => ({ ...prev, scheduledDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label htmlFor="duration" className="text-foreground">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cost" className="text-foreground">Total Cost ($)</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) }))}
                      className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                    />
                  </div>
                </div>

                {formData.cost > 0 && (
                  <div className="p-4 bg-cinema-blue/10 border border-cinema-blue/20 rounded">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="h-4 w-4 text-cinema-blue" />
                      <span className="font-medium text-foreground">Cost Split</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Each participant will pay: <span className="text-cinema-gold font-semibold">
                        ${(formData.cost / formData.maxParticipants).toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    onClick={handleCreateParty}
                    className="btn-hero flex-1"
                    disabled={!selectedMovie || !formData.title}
                  >
                    Create Party
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

        {/* Watch Parties List */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {watchParties.length > 0 ? (
              <div className="space-y-6">
                {watchParties.map((party) => (
                  <Card key={party.id} className="movie-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-foreground">{party.title}</h3>
                            <Badge className={getPartyStatusColor(party.status)}>
                              {party.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{party.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-cinema-gold" />
                              <span className="text-foreground">
                                {new Date(party.scheduledDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-cinema-blue" />
                              <span className="text-foreground">{party.duration} min</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-cinema-red" />
                              <span className="text-foreground">
                                {party.participants.length} participants
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-500" />
                              <span className="text-foreground">
                                ${party.costPerPerson.toFixed(2)} per person
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyInviteLink(party.id)}
                            className="text-cinema-gold"
                          >
                            {copiedLink === party.id ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-cinema-gold"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {party.participants.includes(user?.id || '') ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => leaveParty(party.id)}
                              className="text-red-500 hover:text-red-400"
                            >
                              Leave Party
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="btn-hero"
                              onClick={() => joinParty(party.id)}
                            >
                              Join Party
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-cinema-gold"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Start Watching
                          </Button>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          Created {new Date(party.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No watch parties yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first watch party to start watching movies with friends!
                </p>
                <Button className="btn-hero" onClick={() => setIsCreating(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Watch Party
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default WatchParty;
