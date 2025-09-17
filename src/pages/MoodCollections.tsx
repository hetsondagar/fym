import { useState, useEffect } from 'react';
import { Heart, Star, Play, Bookmark, Plus, Filter, Grid, List, Users, Share2, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { userAPI } from '@/lib/api';
import { User, MoodCollection, WatchlistItem } from '@/lib/types';
import Navbar from '@/components/Navbar';

const MoodCollections = () => {
  const [user, setUser] = useState<User | null>(null);
  const [collections, setCollections] = useState<MoodCollection[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'my' | 'public'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'followers'>('created');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mood: 'Happy',
    color: '#dc2626',
    banner: '',
    isPublic: true
  });

  const moodOptions = [
    { name: 'Happy', color: '#fbbf24', emoji: '😊' },
    { name: 'Sad', color: '#3b82f6', emoji: '😢' },
    { name: 'Excited', color: '#ef4444', emoji: '🤩' },
    { name: 'Relaxed', color: '#10b981', emoji: '😌' },
    { name: 'Nostalgic', color: '#8b5cf6', emoji: '🥺' },
    { name: 'Romantic', color: '#ec4899', emoji: '💕' },
    { name: 'Thrilled', color: '#f59e0b', emoji: '😱' },
    { name: 'Inspired', color: '#06b6d4', emoji: '✨' },
    { name: 'Cozy', color: '#84cc16', emoji: '🏠' },
    { name: 'Adventurous', color: '#f97316', emoji: '🗺️' }
  ];

  useEffect(() => {
    const currentUser = userAPI.getCurrentUser();
    setUser(currentUser);
    loadCollections();
  }, []);

  const loadCollections = () => {
    // Mock data for demonstration
    const mockCollections: MoodCollection[] = [
      {
        id: '1',
        name: 'Cozy Rainy Day Movies',
        description: 'Perfect films to watch when it\'s raining outside and you want to stay warm and cozy.',
        mood: 'Cozy',
        color: '#84cc16',
        banner: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop',
        items: [
          {
            imdbID: '1',
            Title: 'The Princess Bride',
            Year: '1987',
            Type: 'movie',
            Poster: 'https://m.media-amazon.com/images/M/MV5BMGM4M2Q5N2MtNThkZS00NTc1LTk1NTUtNWE5N2FmNzM0ZTAyXkEyXkFqcGdeQXVyNjE0ODc0MDc@._V1_SX300.jpg',
            addedAt: '2024-01-25T10:00:00Z',
            watched: false,
            rating: null,
            notes: ''
          }
        ],
        isPublic: true,
        createdBy: '2',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-25T10:00:00Z',
        followers: ['1', '3', '4']
      },
      {
        id: '2',
        name: 'Mind-Bending Sci-Fi',
        description: 'Science fiction films that will make you question reality and blow your mind.',
        mood: 'Excited',
        color: '#ef4444',
        banner: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=400&fit=crop',
        items: [
          {
            imdbID: '2',
            Title: 'Inception',
            Year: '2010',
            Type: 'movie',
            Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
            addedAt: '2024-01-25T10:00:00Z',
            watched: false,
            rating: null,
            notes: ''
          }
        ],
        isPublic: true,
        createdBy: '3',
        createdAt: '2024-01-22T14:00:00Z',
        updatedAt: '2024-01-26T14:00:00Z',
        followers: ['1', '2', '5']
      },
      {
        id: '3',
        name: 'My Personal Favorites',
        description: 'A collection of my all-time favorite movies that I can watch over and over again.',
        mood: 'Nostalgic',
        color: '#8b5cf6',
        banner: 'https://images.unsplash.com/photo-1489599804150-0b0a0a0a0a0a?w=800&h=400&fit=crop',
        items: [],
        isPublic: false,
        createdBy: user?.id || '1',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        followers: []
      }
    ];
    setCollections(mockCollections);
  };

  const handleCreateCollection = () => {
    if (!user || !formData.name) return;
    
    const newCollection: MoodCollection = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      mood: formData.mood,
      color: formData.color,
      banner: formData.banner,
      items: [],
      isPublic: formData.isPublic,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      followers: []
    };
    
    setCollections(prev => [newCollection, ...prev]);
    setIsCreating(false);
    setFormData({
      name: '',
      description: '',
      mood: 'Happy',
      color: '#dc2626',
      banner: '',
      isPublic: true
    });
  };

  const followCollection = (collectionId: string) => {
    if (!user) return;
    
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId 
        ? { ...collection, followers: [...collection.followers, user.id] }
        : collection
    ));
  };

  const unfollowCollection = (collectionId: string) => {
    if (!user) return;
    
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId 
        ? { ...collection, followers: collection.followers.filter(id => id !== user.id) }
        : collection
    ));
  };

  const deleteCollection = (collectionId: string) => {
    setCollections(prev => prev.filter(collection => collection.id !== collectionId));
  };

  const filteredCollections = collections.filter(collection => {
    if (filter === 'my') return collection.createdBy === user?.id;
    if (filter === 'public') return collection.isPublic;
    return true;
  });

  const sortedCollections = [...filteredCollections].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'followers':
        return b.followers.length - a.followers.length;
      default:
        return 0;
    }
  });

  const getMoodEmoji = (mood: string) => {
    const moodOption = moodOptions.find(m => m.name === mood);
    return moodOption?.emoji || '🎬';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Please sign in</h2>
            <p className="text-muted-foreground">You need to be signed in to view mood collections.</p>
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
                <Heart className="h-12 w-12 text-cinema-red" />
                <h1 className="heading-hero text-4xl md:text-5xl">Mood Collections</h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Curate movies and shows based on your mood. Create collections that capture the perfect vibe for any moment.
              </p>
            </div>

            <div className="text-center">
              <Button 
                className="btn-hero"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Collection
              </Button>
            </div>
          </div>
        </section>

        {/* Create Collection Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-cinema-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-cinema-dark border-cinema-gold/30 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-foreground">Create Mood Collection</CardTitle>
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
                <div>
                  <Label htmlFor="name" className="text-foreground">Collection Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Cozy Rainy Day Movies"
                    className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what makes this collection special..."
                    className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-foreground mb-2 block">Mood</Label>
                    <Select value={formData.mood} onValueChange={(value) => setFormData(prev => ({ ...prev, mood: value }))}>
                      <SelectTrigger className="bg-cinema-black/50 border-cinema-gold/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-cinema-dark border-cinema-gold/30">
                        {moodOptions.map((mood) => (
                          <SelectItem key={mood.name} value={mood.name} className="text-foreground">
                            <div className="flex items-center space-x-2">
                              <span>{mood.emoji}</span>
                              <span>{mood.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="banner" className="text-foreground">Banner URL (optional)</Label>
                    <Input
                      id="banner"
                      value={formData.banner}
                      onChange={(e) => setFormData(prev => ({ ...prev, banner: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                    />
                  </div>
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
                    Make this collection public
                  </Label>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleCreateCollection}
                    className="btn-hero flex-1"
                    disabled={!formData.name}
                  >
                    Create Collection
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

        {/* Collections */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="flex items-center space-x-4">
                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                  <SelectTrigger className="w-40 bg-cinema-dark border-cinema-red/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cinema-dark border-cinema-red/30">
                    <SelectItem value="all" className="text-foreground">All Collections</SelectItem>
                    <SelectItem value="my" className="text-foreground">My Collections</SelectItem>
                    <SelectItem value="public" className="text-foreground">Public Only</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-40 bg-cinema-dark border-cinema-red/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cinema-dark border-cinema-red/30">
                    <SelectItem value="created" className="text-foreground">Recently Created</SelectItem>
                    <SelectItem value="name" className="text-foreground">Name</SelectItem>
                    <SelectItem value="followers" className="text-foreground">Most Followed</SelectItem>
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

            {sortedCollections.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedCollections.map((collection) => (
                    <Card key={collection.id} className="movie-card group overflow-hidden">
                      <div 
                        className="h-32 bg-cover bg-center relative"
                        style={{
                          backgroundImage: collection.banner 
                            ? `url(${collection.banner})`
                            : `linear-gradient(135deg, ${collection.color}20, ${collection.color}40)`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/50 to-transparent"></div>
                        <div className="absolute top-3 left-3">
                          <Badge 
                            className="bg-cinema-black/80 text-white border-0"
                            style={{ backgroundColor: collection.color }}
                          >
                            {getMoodEmoji(collection.mood)} {collection.mood}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          {!collection.isPublic && (
                            <Badge variant="outline" className="bg-cinema-black/80 text-white border-white/30">
                              Private
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-cinema-gold transition-colors">
                          {collection.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {collection.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <span>{collection.items.length} items</span>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{collection.followers.length}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          {collection.followers.includes(user?.id || '') ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => unfollowCollection(collection.id)}
                              className="text-cinema-gold hover:text-cinema-gold/80"
                            >
                              <Heart className="h-4 w-4 mr-1 fill-current" />
                              Following
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="btn-hero"
                              onClick={() => followCollection(collection.id)}
                            >
                              <Heart className="h-4 w-4 mr-1" />
                              Follow
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-cinema-gold"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          {collection.createdBy === user?.id && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteCollection(collection.id)}
                              className="text-red-500 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedCollections.map((collection) => (
                    <Card key={collection.id} className="movie-card">
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <div 
                            className="w-24 h-32 bg-cover bg-center rounded"
                            style={{
                              backgroundImage: collection.banner 
                                ? `url(${collection.banner})`
                                : `linear-gradient(135deg, ${collection.color}20, ${collection.color}40)`
                            }}
                          >
                            <div className="w-full h-full bg-gradient-to-t from-cinema-black via-cinema-black/50 to-transparent rounded flex items-end p-2">
                              <Badge 
                                className="bg-cinema-black/80 text-white border-0 text-xs"
                                style={{ backgroundColor: collection.color }}
                              >
                                {getMoodEmoji(collection.mood)} {collection.mood}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg text-foreground mb-1">
                                  {collection.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {collection.description}
                                </p>
                                
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                                  <span>{collection.items.length} items</span>
                                  <div className="flex items-center space-x-1">
                                    <Users className="h-3 w-3" />
                                    <span>{collection.followers.length} followers</span>
                                  </div>
                                  <span>Created {new Date(collection.createdAt).toLocaleDateString()}</span>
                                </div>
                                
                                <div className="flex space-x-2">
                                  {collection.followers.includes(user?.id || '') ? (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => unfollowCollection(collection.id)}
                                      className="text-cinema-gold hover:text-cinema-gold/80"
                                    >
                                      <Heart className="h-4 w-4 mr-1 fill-current" />
                                      Following
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      className="btn-hero"
                                      onClick={() => followCollection(collection.id)}
                                    >
                                      <Heart className="h-4 w-4 mr-1" />
                                      Follow
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-cinema-gold"
                                  >
                                    <Share2 className="h-4 w-4 mr-1" />
                                    Share
                                  </Button>
                                  {collection.createdBy === user?.id && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-cinema-gold"
                                      >
                                        <Edit3 className="h-4 w-4 mr-1" />
                                        Edit
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deleteCollection(collection.id)}
                                        className="text-red-500 hover:text-red-400"
                                      >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                      </Button>
                                    </>
                                  )}
                                </div>
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
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No collections found</h3>
                <p className="text-muted-foreground mb-6">
                  {filter === 'my' 
                    ? 'You haven\'t created any collections yet.'
                    : 'No collections match your current filters.'
                  }
                </p>
                <Button className="btn-hero" onClick={() => setIsCreating(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Collection
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MoodCollections;
