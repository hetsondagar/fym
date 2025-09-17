import { useState, useEffect } from 'react';
import { Bookmark, Clock, Star, Play, Trash2, Edit3, Download, Calendar, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { userAPI } from '@/lib/api';
import { User, WatchlistItem } from '@/lib/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import heroCinema from '@/assets/hero-cinema.jpg';

const Watchlist = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('watchlist');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [selectedList, setSelectedList] = useState('default');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editRating, setEditRating] = useState(0);

  useEffect(() => {
    const currentUser = userAPI.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleMarkWatched = async (imdbId: string, listName: string = 'default') => {
    if (!user) return;
    
    try {
      // Update the item in the watchlist
      const users = JSON.parse(localStorage.getItem('fym_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        const watchlist = users[userIndex].watchlists?.find((w: any) => w.name === listName);
        if (watchlist) {
          const item = watchlist.items.find((i: any) => i.imdbID === imdbId);
          if (item) {
            item.watched = true;
            item.watchedAt = new Date().toISOString();
          }
        }
        
        localStorage.setItem('fym_users', JSON.stringify(users));
        localStorage.setItem('fym_current_user', JSON.stringify(users[userIndex]));
        setUser(users[userIndex]);
      }
    } catch (error) {
      console.error('Failed to mark as watched:', error);
    }
  };

  const handleRemoveFromList = async (imdbId: string, listName: string = 'default') => {
    if (!user) return;
    
    try {
      await userAPI.removeFromWatchlist(user.id, imdbId, listName);
      const updatedUser = userAPI.getCurrentUser();
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to remove from watchlist:', error);
    }
  };

  const handleUpdateNotes = async (imdbId: string, listName: string = 'default') => {
    if (!user) return;
    
    try {
      const users = JSON.parse(localStorage.getItem('fym_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        const watchlist = users[userIndex].watchlists?.find((w: any) => w.name === listName);
        if (watchlist) {
          const item = watchlist.items.find((i: any) => i.imdbID === imdbId);
          if (item) {
            item.notes = editNotes;
            item.rating = editRating;
          }
        }
        
        localStorage.setItem('fym_users', JSON.stringify(users));
        localStorage.setItem('fym_current_user', JSON.stringify(users[userIndex]));
        setUser(users[userIndex]);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Failed to update notes:', error);
    }
  };

  const exportWatchlist = () => {
    if (!user || !user.watchlists) return;
    
    const watchlist = user.watchlists.find(w => w.name === selectedList);
    if (!watchlist) return;
    
    const csvContent = [
      ['Title', 'Year', 'Type', 'Rating', 'Watched', 'Watched Date', 'Notes'],
      ...watchlist.items.map(item => [
        item.Title,
        item.Year,
        item.Type,
        item.rating || '',
        item.watched ? 'Yes' : 'No',
        item.watchedAt || '',
        item.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedList}-watchlist.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCurrentWatchlist = () => {
    if (!user || !user.watchlists) return [];
    return user.watchlists.find(w => w.name === selectedList)?.items || [];
  };

  const getWatchedItems = () => {
    if (!user || !user.watchlists) return [];
    const allItems: WatchlistItem[] = [];
    user.watchlists.forEach(watchlist => {
      allItems.push(...watchlist.items.filter(item => item.watched));
    });
    return allItems.sort((a, b) => new Date(b.watchedAt || '').getTime() - new Date(a.watchedAt || '').getTime());
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-cinema-gold fill-current' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const renderTimelineItem = (item: WatchlistItem, index: number) => (
    <div key={item.imdbID} className="relative flex items-start space-x-4 pb-8">
      {index < getWatchedItems().length - 1 && (
        <div className="absolute left-4 top-8 w-0.5 h-full bg-cinema-red/30"></div>
      )}
      <div className="relative">
        <div className="w-8 h-8 bg-cinema-red rounded-full flex items-center justify-center">
          <Calendar className="h-4 w-4 text-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-2">
          <img
            src={item.Poster}
            alt={item.Title}
            className="w-16 h-24 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{item.Title}</h3>
            <p className="text-sm text-muted-foreground">{item.Year} • {item.Type}</p>
            <div className="flex items-center space-x-1 mt-1">
              {item.rating ? renderStars(item.rating) : <span className="text-sm text-muted-foreground">Not rated</span>}
            </div>
          </div>
        </div>
        {item.notes && (
          <p className="text-sm text-muted-foreground bg-cinema-dark/50 p-3 rounded">
            "{item.notes}"
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Watched on {new Date(item.watchedAt || '').toLocaleDateString()}
        </p>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Please sign in</h2>
            <p className="text-muted-foreground">You need to be signed in to view your watchlist.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${heroCinema})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Navbar />
      
      <main className="pt-16">
        {/* Header */}
        <section className="py-12 bg-gradient-to-r from-cinema-black via-cinema-dark to-cinema-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Bookmark className="h-12 w-12 text-cinema-gold" />
                <h1 className="heading-hero text-4xl md:text-5xl">My Watchlist</h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Track your movie and TV show journey. Organize, rate, and remember your viewing experiences.
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Select value={selectedList} onValueChange={setSelectedList}>
                  <SelectTrigger className="w-48 bg-cinema-dark border-cinema-gold/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cinema-dark border-cinema-gold/30">
                    {user.watchlists?.map((watchlist) => (
                      <SelectItem key={watchlist.name} value={watchlist.name} className="text-foreground">
                        {watchlist.name} ({watchlist.items.length})
                      </SelectItem>
                    ))}
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
                <Button
                  variant={viewMode === 'timeline' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('timeline')}
                  className="text-cinema-gold hover:text-cinema-gold/80"
                >
                  <Clock className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={exportWatchlist}
                  className="text-cinema-gold hover:text-cinema-gold/80"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-cinema-dark border-cinema-gold/30">
                <TabsTrigger value="watchlist" className="text-foreground data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-black">
                  Watchlist ({getCurrentWatchlist().length})
                </TabsTrigger>
                <TabsTrigger value="watched" className="text-foreground data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-black">
                  Watched History ({getWatchedItems().length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="watchlist" className="mt-8">
                {getCurrentWatchlist().length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {getCurrentWatchlist().map((item) => (
                        <Card key={item.imdbID} className="movie-card group">
                          <CardContent className="p-0">
                            <div className="aspect-[2/3] relative overflow-hidden">
                              <img
                                src={item.Poster}
                                alt={item.Title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-4 left-4 right-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Button
                                      size="sm"
                                      className="btn-hero text-xs"
                                      onClick={() => handleMarkWatched(item.imdbID, selectedList)}
                                    >
                                      <Play className="h-3 w-3 mr-1" />
                                      Mark Watched
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-cinema-gold hover:text-cinema-gold/80"
                                      onClick={() => {
                                        setEditingItem(item.imdbID);
                                        setEditNotes(item.notes || '');
                                        setEditRating(item.rating || 0);
                                      }}
                                    >
                                      <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-red-500 hover:text-red-400"
                                      onClick={() => handleRemoveFromList(item.imdbID, selectedList)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              <div className="absolute top-2 right-2 bg-cinema-black/80 backdrop-blur-sm rounded-full px-2 py-1">
                                <span className="text-xs text-foreground">
                                  {new Date(item.addedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="p-3">
                              <h3 className="font-medium text-sm text-foreground truncate group-hover:text-cinema-gold transition-colors">
                                {item.Title}
                              </h3>
                              <p className="text-xs text-muted-foreground">{item.Year}</p>
                              {item.notes && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  "{item.notes}"
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getCurrentWatchlist().map((item) => (
                        <Card key={item.imdbID} className="movie-card">
                          <CardContent className="p-4">
                            <div className="flex space-x-4">
                              <img
                                src={item.Poster}
                                alt={item.Title}
                                className="w-20 h-28 object-cover rounded"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-lg text-foreground mb-1">
                                      {item.Title}
                                    </h3>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                                      <span>{item.Year}</span>
                                      <span>{item.Type}</span>
                                      <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
                                    </div>
                                    {item.notes && (
                                      <p className="text-sm text-muted-foreground mb-3">
                                        "{item.notes}"
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      className="btn-hero"
                                      onClick={() => handleMarkWatched(item.imdbID, selectedList)}
                                    >
                                      <Play className="h-4 w-4 mr-1" />
                                      Mark Watched
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-cinema-gold"
                                      onClick={() => {
                                        setEditingItem(item.imdbID);
                                        setEditNotes(item.notes || '');
                                        setEditRating(item.rating || 0);
                                      }}
                                    >
                                      <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-red-500"
                                      onClick={() => handleRemoveFromList(item.imdbID, selectedList)}
                                    >
                                      <Trash2 className="h-4 w-4" />
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
                    <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Your watchlist is empty</h3>
                    <p className="text-muted-foreground mb-6">
                      Start adding movies and TV shows to your watchlist to keep track of what you want to watch.
                    </p>
                    <Button className="btn-hero">
                      Browse Movies
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="watched" className="mt-8">
                {getWatchedItems().length > 0 ? (
                  viewMode === 'timeline' ? (
                    <div className="max-w-4xl mx-auto">
                      <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">
                        Your Viewing Timeline
                      </h3>
                      <div className="space-y-0">
                        {getWatchedItems().map((item, index) => renderTimelineItem(item, index))}
                      </div>
                    </div>
                  ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {getWatchedItems().map((item) => (
                        <Card key={item.imdbID} className="movie-card group">
                          <CardContent className="p-0">
                            <div className="aspect-[2/3] relative overflow-hidden">
                              <img
                                src={item.Poster}
                                alt={item.Title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-4 left-4 right-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-cinema-gold hover:text-cinema-gold/80"
                                      onClick={() => {
                                        setEditingItem(item.imdbID);
                                        setEditNotes(item.notes || '');
                                        setEditRating(item.rating || 0);
                                      }}
                                    >
                                      <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-red-500 hover:text-red-400"
                                      onClick={() => handleRemoveFromList(item.imdbID, selectedList)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              <div className="absolute top-2 right-2 bg-cinema-gold/90 text-cinema-black text-xs px-2 py-1 rounded">
                                Watched
                              </div>
                            </div>

                            <div className="p-3">
                              <h3 className="font-medium text-sm text-foreground truncate group-hover:text-cinema-gold transition-colors">
                                {item.Title}
                              </h3>
                              <p className="text-xs text-muted-foreground">{item.Year}</p>
                              {item.rating && (
                                <div className="flex items-center space-x-1 mt-1">
                                  {renderStars(item.rating)}
                                </div>
                              )}
                              {item.notes && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  "{item.notes}"
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getWatchedItems().map((item) => (
                        <Card key={item.imdbID} className="movie-card">
                          <CardContent className="p-4">
                            <div className="flex space-x-4">
                              <img
                                src={item.Poster}
                                alt={item.Title}
                                className="w-20 h-28 object-cover rounded"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-lg text-foreground mb-1">
                                      {item.Title}
                                    </h3>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                                      <span>{item.Year}</span>
                                      <span>{item.Type}</span>
                                      <span>Watched {new Date(item.watchedAt || '').toLocaleDateString()}</span>
                                    </div>
                                    {item.rating && (
                                      <div className="flex items-center space-x-1 mb-2">
                                        {renderStars(item.rating)}
                                        <span className="text-sm text-muted-foreground ml-2">
                                          ({item.rating}/5)
                                        </span>
                                      </div>
                                    )}
                                    {item.notes && (
                                      <p className="text-sm text-muted-foreground mb-3">
                                        "{item.notes}"
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-cinema-gold"
                                      onClick={() => {
                                        setEditingItem(item.imdbID);
                                        setEditNotes(item.notes || '');
                                        setEditRating(item.rating || 0);
                                      }}
                                    >
                                      <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-red-500"
                                      onClick={() => handleRemoveFromList(item.imdbID, selectedList)}
                                    >
                                      <Trash2 className="h-4 w-4" />
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
                    <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No watched items yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Mark movies and TV shows as watched to build your viewing history.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-cinema-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-cinema-dark border-cinema-gold/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Edit Notes & Rating</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Rating (1-5 stars)
                    </label>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 cursor-pointer ${
                            i < editRating ? 'text-cinema-gold fill-current' : 'text-muted-foreground'
                          }`}
                          onClick={() => setEditRating(i + 1)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Notes
                    </label>
                    <Textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Add your thoughts about this movie/show..."
                      className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                      rows={4}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <Button
                    onClick={() => handleUpdateNotes(editingItem, selectedList)}
                    className="btn-hero flex-1"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setEditingItem(null)}
                    className="text-muted-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Watchlist;
