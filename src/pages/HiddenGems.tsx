import { useState, useEffect } from 'react';
import { Gem, Star, ThumbsUp, ThumbsDown, Plus, Search, Filter, Grid, List, User, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { userAPI, omdbAPI } from '@/lib/api';
import { User as UserType, HiddenGem } from '@/lib/types';
import Navbar from '@/components/Navbar';

const HiddenGems = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [hiddenGems, setHiddenGems] = useState<HiddenGem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'verified' | 'trending'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    type: 'movie' as 'movie' | 'series',
    description: '',
    tags: '',
    imdbId: ''
  });

  useEffect(() => {
    const currentUser = userAPI.getCurrentUser();
    setUser(currentUser);
    loadHiddenGems();
  }, []);

  const loadHiddenGems = () => {
    // Mock data for demonstration
    const mockGems: HiddenGem[] = [
      {
        id: '1',
        imdbId: 'tt0112471',
        title: 'Before Sunrise',
        year: '1995',
        type: 'movie',
        poster: 'https://m.media-amazon.com/images/M/MV5BZDdiZTAwYzAtMDI3Ni00OTRjLTkzN2UtMGE3MDMyZmU4NTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
        description: 'A beautiful, intimate conversation between two strangers who meet on a train. This film captures the magic of connection and the fleeting nature of time.',
        submittedBy: '2',
        submittedAt: '2024-01-20T10:00:00Z',
        upvotes: 45,
        downvotes: 2,
        tags: ['romance', 'drama', 'indie', 'conversation'],
        verified: true
      },
      {
        id: '2',
        imdbId: 'tt0246578',
        title: 'Donnie Darko',
        year: '2001',
        type: 'movie',
        poster: 'https://m.media-amazon.com/images/M/MV5BZjZlZDlkYTktMmU1My00ZDBiLWFlNjEtYTBhNjVlOTc4YjM2XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
        description: 'A mind-bending psychological thriller that explores time travel, destiny, and the nature of reality. A cult classic that gets better with each viewing.',
        submittedBy: '3',
        submittedAt: '2024-01-22T14:00:00Z',
        upvotes: 38,
        downvotes: 5,
        tags: ['sci-fi', 'thriller', 'psychological', 'cult'],
        verified: true
      },
      {
        id: '3',
        imdbId: 'tt0118715',
        title: 'The Big Lebowski',
        year: '1998',
        type: 'movie',
        poster: 'https://m.media-amazon.com/images/M/MV5BMTQ0NjUzMDMyOF5BMl5BanBnXkFtZTgwODA1OTU0MDE@._V1_SX300.jpg',
        description: 'The Dude abides. A hilarious and quotable comedy that has become a cultural phenomenon. Perfect for a laid-back movie night.',
        submittedBy: '1',
        submittedAt: '2024-01-25T16:00:00Z',
        upvotes: 52,
        downvotes: 1,
        tags: ['comedy', 'crime', 'cult', 'quotable'],
        verified: false
      },
      {
        id: '4',
        imdbId: 'tt0097165',
        title: 'Dead Poets Society',
        year: '1989',
        type: 'movie',
        poster: 'https://m.media-amazon.com/images/M/MV5BOGYwYWNjMzgtNGU4ZC00NWQ2LWEwZjUtMzE1Zjc3NjY3YTU1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
        description: 'An inspiring story about a teacher who changes his students\' lives through poetry. Robin Williams delivers a powerful performance.',
        submittedBy: '4',
        submittedAt: '2024-01-26T09:00:00Z',
        upvotes: 41,
        downvotes: 3,
        tags: ['drama', 'inspirational', 'education', 'robin-williams'],
        verified: true
      }
    ];
    setHiddenGems(mockGems);
  };

  const handleSubmitGem = async () => {
    if (!user || !formData.title || !formData.description) return;
    
    setIsSubmitting(true);
    
    try {
      // Search for the movie to get IMDB ID if not provided
      let imdbId = formData.imdbId;
      if (!imdbId) {
        const searchData = await omdbAPI.search(formData.title, formData.type);
        if (searchData.Search && searchData.Search.length > 0) {
          imdbId = searchData.Search[0].imdbID;
        }
      }
      
      const newGem: HiddenGem = {
        id: Date.now().toString(),
        imdbId: imdbId || 'unknown',
        title: formData.title,
        year: formData.year,
        type: formData.type,
        poster: '', // Would be fetched from OMDB
        description: formData.description,
        submittedBy: user.id,
        submittedAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        verified: false
      };
      
      setHiddenGems(prev => [newGem, ...prev]);
      setFormData({
        title: '',
        year: '',
        type: 'movie',
        description: '',
        tags: '',
        imdbId: ''
      });
    } catch (error) {
      console.error('Failed to submit hidden gem:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const voteOnGem = (gemId: string, voteType: 'up' | 'down') => {
    if (!user) return;
    
    setHiddenGems(prev => prev.map(gem => {
      if (gem.id === gemId) {
        if (voteType === 'up') {
          return { ...gem, upvotes: gem.upvotes + 1 };
        } else {
          return { ...gem, downvotes: gem.downvotes + 1 };
        }
      }
      return gem;
    }));
  };

  const filteredGems = hiddenGems.filter(gem => {
    if (filter === 'verified' && !gem.verified) return false;
    if (filter === 'trending' && gem.upvotes < 20) return false;
    if (searchQuery && !gem.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !gem.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedGems = [...filteredGems].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      case 'popular':
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      case 'rating':
        return b.upvotes - a.upvotes;
      default:
        return 0;
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Please sign in</h2>
            <p className="text-muted-foreground">You need to be signed in to view and submit hidden gems.</p>
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
                <Gem className="h-12 w-12 text-cinema-gold" />
                <h1 className="heading-hero text-4xl md:text-5xl">Hidden Gems</h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover underrated movies and shows recommended by fellow cinephiles. Share your favorite hidden gems with the community.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="discover" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-cinema-dark border-cinema-gold/30">
                <TabsTrigger value="discover" className="text-foreground data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-black">
                  Discover Gems
                </TabsTrigger>
                <TabsTrigger value="submit" className="text-foreground data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-black">
                  Submit a Gem
                </TabsTrigger>
              </TabsList>

              <TabsContent value="discover" className="mt-8">
                {/* Controls */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search hidden gems..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64 bg-cinema-dark border-cinema-gold/30 focus:border-cinema-gold"
                      />
                    </div>

                    <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                      <SelectTrigger className="w-40 bg-cinema-dark border-cinema-gold/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-cinema-dark border-cinema-gold/30">
                        <SelectItem value="all" className="text-foreground">All Gems</SelectItem>
                        <SelectItem value="verified" className="text-foreground">Verified Only</SelectItem>
                        <SelectItem value="trending" className="text-foreground">Trending</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-40 bg-cinema-dark border-cinema-gold/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-cinema-dark border-cinema-gold/30">
                        <SelectItem value="popular" className="text-foreground">Most Popular</SelectItem>
                        <SelectItem value="recent" className="text-foreground">Most Recent</SelectItem>
                        <SelectItem value="rating" className="text-foreground">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
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

                {/* Gems List */}
                {sortedGems.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedGems.map((gem) => (
                        <Card key={gem.id} className="movie-card group">
                          <CardContent className="p-0">
                            <div className="aspect-[2/3] relative overflow-hidden">
                              <img
                                src={gem.poster}
                                alt={gem.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-4 left-4 right-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Button
                                      size="sm"
                                      className="btn-hero text-xs"
                                    >
                                      <Star className="h-3 w-3 mr-1" />
                                      Add to Watchlist
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              {/* Verified Badge */}
                              {gem.verified && (
                                <div className="absolute top-2 right-2">
                                  <Badge className="bg-cinema-gold text-cinema-black">
                                    <Award className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                </div>
                              )}

                              {/* Vote Score */}
                              <div className="absolute top-2 left-2 bg-cinema-black/80 backdrop-blur-sm rounded-full px-2 py-1">
                                <span className="text-xs text-foreground">
                                  {gem.upvotes - gem.downvotes > 0 ? '+' : ''}{gem.upvotes - gem.downvotes}
                                </span>
                              </div>
                            </div>

                            <div className="p-4 space-y-3">
                              <div>
                                <h3 className="font-semibold text-sm text-foreground group-hover:text-cinema-gold transition-colors line-clamp-2">
                                  {gem.title}
                                </h3>
                                <p className="text-xs text-muted-foreground">{gem.year} • {gem.type}</p>
                              </div>

                              <p className="text-sm text-muted-foreground line-clamp-3 group-hover:text-foreground/80 transition-colors">
                                {gem.description}
                              </p>

                              <div className="flex flex-wrap gap-1">
                                {gem.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs px-2 py-1 bg-cinema-red/20 text-cinema-red rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => voteOnGem(gem.id, 'up')}
                                    className="text-green-500 hover:text-green-400"
                                  >
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    {gem.upvotes}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => voteOnGem(gem.id, 'down')}
                                    className="text-red-500 hover:text-red-400"
                                  >
                                    <ThumbsDown className="h-3 w-3 mr-1" />
                                    {gem.downvotes}
                                  </Button>
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <User className="h-3 w-3" />
                                  <span>Submitted by user</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedGems.map((gem) => (
                        <Card key={gem.id} className="movie-card">
                          <CardContent className="p-6">
                            <div className="flex space-x-4">
                              <img
                                src={gem.poster}
                                alt={gem.title}
                                className="w-20 h-28 object-cover rounded"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center space-x-2 mb-2">
                                      <h3 className="font-semibold text-lg text-foreground">
                                        {gem.title}
                                      </h3>
                                      {gem.verified && (
                                        <Badge className="bg-cinema-gold text-cinema-black">
                                          <Award className="h-3 w-3 mr-1" />
                                          Verified
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                                      <span>{gem.year}</span>
                                      <span>{gem.type}</span>
                                      <div className="flex items-center space-x-1">
                                        <TrendingUp className="h-4 w-4 text-cinema-gold" />
                                        <span className="text-cinema-gold font-semibold">
                                          {gem.upvotes - gem.downvotes > 0 ? '+' : ''}{gem.upvotes - gem.downvotes}
                                        </span>
                                      </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">
                                      {gem.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                      {gem.tags.map((tag) => (
                                        <span
                                          key={tag}
                                          className="text-xs px-2 py-1 bg-cinema-red/20 text-cinema-red rounded-full"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      className="btn-hero"
                                    >
                                      <Star className="h-4 w-4 mr-1" />
                                      Add to Watchlist
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => voteOnGem(gem.id, 'up')}
                                      className="text-green-500"
                                    >
                                      <ThumbsUp className="h-4 w-4 mr-1" />
                                      {gem.upvotes}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => voteOnGem(gem.id, 'down')}
                                      className="text-red-500"
                                    >
                                      <ThumbsDown className="h-4 w-4 mr-1" />
                                      {gem.downvotes}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <Gem className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No hidden gems found</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery ? 'No gems match your search criteria.' : 'Be the first to submit a hidden gem!'}
                    </p>
                    <Button className="btn-hero">
                      <Plus className="mr-2 h-4 w-4" />
                      Submit a Hidden Gem
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="submit" className="mt-8">
                <Card className="max-w-2xl mx-auto bg-cinema-dark border-cinema-gold/30">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground">Submit a Hidden Gem</CardTitle>
                    <p className="text-muted-foreground">
                      Share an underrated movie or show that deserves more recognition
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title" className="text-foreground">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Movie or show title"
                          className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="year" className="text-foreground">Year</Label>
                        <Input
                          id="year"
                          value={formData.year}
                          onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                          placeholder="Release year"
                          className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-foreground mb-2 block">Type</Label>
                      <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="bg-cinema-black/50 border-cinema-gold/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-cinema-dark border-cinema-gold/30">
                          <SelectItem value="movie" className="text-foreground">Movie</SelectItem>
                          <SelectItem value="series" className="text-foreground">TV Series</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-foreground">Why is this a hidden gem? *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Tell us what makes this movie/show special and why others should watch it..."
                        className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="tags" className="text-foreground">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="e.g., indie, psychological, cult, foreign"
                        className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                      />
                    </div>

                    <div>
                      <Label htmlFor="imdbId" className="text-foreground">IMDB ID (optional)</Label>
                      <Input
                        id="imdbId"
                        value={formData.imdbId}
                        onChange={(e) => setFormData(prev => ({ ...prev, imdbId: e.target.value }))}
                        placeholder="tt1234567"
                        className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                      />
                    </div>

                    <Button
                      onClick={handleSubmitGem}
                      className="w-full btn-hero"
                      disabled={!formData.title || !formData.description || isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        <>
                          <Gem className="mr-2 h-4 w-4" />
                          Submit Hidden Gem
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HiddenGems;
