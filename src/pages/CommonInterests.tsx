import { useState, useEffect } from 'react';
import { Heart, Star, Users, TrendingUp, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { userAPI } from '@/lib/api';
import { User, CommonInterest } from '@/lib/types';
import Navbar from '@/components/Navbar';

const CommonInterests = () => {
  const [user, setUser] = useState<User | null>(null);
  const [commonInterests, setCommonInterests] = useState<CommonInterest[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'title' | 'rating' | 'year'>('rating');

  useEffect(() => {
    const currentUser = userAPI.getCurrentUser();
    setUser(currentUser);
    loadCommonInterests();
  }, [selectedFriend]);

  const loadCommonInterests = () => {
    // Mock data for demonstration
    const mockFriends: User[] = [
      {
        id: '2',
        email: 'alex@example.com',
        username: 'AlexMovieBuff',
        password: '',
        createdAt: '2024-01-15T10:00:00Z',
        watchlists: [],
        reviews: [],
        friends: [],
        preferences: {
          favoriteGenres: ['Action', 'Sci-Fi'],
          favoriteActors: ['Tom Cruise', 'Scarlett Johansson'],
          favoriteDirectors: ['Christopher Nolan'],
          preferredLanguages: ['English'],
          minRating: 7,
          maxRuntime: 180,
          excludeGenres: ['Horror']
        },
        settings: {
          theme: 'dark',
          notifications: {
            email: true,
            push: true,
            watchlistUpdates: true,
            friendActivity: true
          },
          privacy: {
            profilePublic: true,
            watchlistPublic: true,
            reviewsPublic: true
          },
          familyMode: {
            enabled: false,
            restrictions: [],
            approvalRequired: false
          }
        }
      },
      {
        id: '3',
        email: 'sarah@example.com',
        username: 'SarahCinema',
        password: '',
        createdAt: '2024-01-20T14:30:00Z',
        watchlists: [],
        reviews: [],
        friends: [],
        preferences: {
          favoriteGenres: ['Drama', 'Romance'],
          favoriteActors: ['Emma Stone', 'Ryan Gosling'],
          favoriteDirectors: ['Damien Chazelle'],
          preferredLanguages: ['English'],
          minRating: 6,
          maxRuntime: 150,
          excludeGenres: ['Horror', 'Thriller']
        },
        settings: {
          theme: 'dark',
          notifications: {
            email: true,
            push: false,
            watchlistUpdates: true,
            friendActivity: true
          },
          privacy: {
            profilePublic: true,
            watchlistPublic: false,
            reviewsPublic: true
          },
          familyMode: {
            enabled: false,
            restrictions: [],
            approvalRequired: false
          }
        }
      }
    ];

    const mockCommonInterests: CommonInterest[] = [
      {
        imdbId: '1',
        title: 'Inception',
        poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
        year: '2010',
        type: 'movie',
        mutualRating: 4.5,
        user1Rating: 5,
        user2Rating: 4,
        user1Watched: true,
        user2Watched: true
      },
      {
        imdbId: '2',
        title: 'The Dark Knight',
        poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
        year: '2008',
        type: 'movie',
        mutualRating: 4.8,
        user1Rating: 5,
        user2Rating: 4.6,
        user1Watched: true,
        user2Watched: true
      },
      {
        imdbId: '3',
        title: 'Interstellar',
        poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
        year: '2014',
        type: 'movie',
        mutualRating: 4.2,
        user1Rating: 4.5,
        user2Rating: 3.9,
        user1Watched: true,
        user2Watched: false
      },
      {
        imdbId: '4',
        title: 'La La Land',
        poster: 'https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_SX300.jpg',
        year: '2016',
        type: 'movie',
        mutualRating: 4.0,
        user1Rating: 3.5,
        user2Rating: 4.5,
        user1Watched: false,
        user2Watched: true
      }
    ];

    setFriends(mockFriends);
    
    if (selectedFriend === 'all') {
      setCommonInterests(mockCommonInterests);
    } else {
      // Filter by selected friend (simplified for demo)
      setCommonInterests(mockCommonInterests);
    }
  };

  const sortedInterests = [...commonInterests].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'rating':
        return b.mutualRating - a.mutualRating;
      case 'year':
        return parseInt(b.year) - parseInt(a.year);
      default:
        return 0;
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-cinema-gold fill-current' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const getCompatibilityScore = () => {
    if (commonInterests.length === 0) return 0;
    const avgRating = commonInterests.reduce((sum, item) => sum + item.mutualRating, 0) / commonInterests.length;
    return Math.round(avgRating * 20); // Convert to percentage
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Please sign in</h2>
            <p className="text-muted-foreground">You need to be signed in to view common interests.</p>
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
                <h1 className="heading-hero text-4xl md:text-5xl">Common Interests</h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover movies and shows you and your friends both love, and find new recommendations based on shared tastes
              </p>
            </div>

            {/* Compatibility Score */}
            <div className="max-w-md mx-auto mb-8">
              <Card className="bg-cinema-dark/50 backdrop-blur-md border-cinema-red/30">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <TrendingUp className="h-6 w-6 text-cinema-gold" />
                    <span className="text-2xl font-bold text-cinema-gold">
                      {getCompatibilityScore()}%
                    </span>
                  </div>
                  <p className="text-muted-foreground">Taste Compatibility</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on {commonInterests.length} shared interests
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Select value={selectedFriend} onValueChange={setSelectedFriend}>
                  <SelectTrigger className="w-48 bg-cinema-dark border-cinema-red/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cinema-dark border-cinema-red/30">
                    <SelectItem value="all" className="text-foreground">All Friends</SelectItem>
                    {friends.map((friend) => (
                      <SelectItem key={friend.id} value={friend.id} className="text-foreground">
                        {friend.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-40 bg-cinema-dark border-cinema-red/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cinema-dark border-cinema-red/30">
                    <SelectItem value="rating" className="text-foreground">Rating</SelectItem>
                    <SelectItem value="title" className="text-foreground">Title</SelectItem>
                    <SelectItem value="year" className="text-foreground">Year</SelectItem>
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
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {sortedInterests.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Found {sortedInterests.length} shared interest{sortedInterests.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sortedInterests.map((interest) => (
                      <Card key={interest.imdbId} className="movie-card group">
                        <CardContent className="p-0">
                          <div className="aspect-[2/3] relative overflow-hidden">
                            <img
                              src={interest.poster}
                              alt={interest.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-4 left-4 right-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Button size="sm" className="btn-hero text-xs">
                                    <Heart className="h-3 w-3 mr-1" />
                                    Watch Together
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Mutual Rating Badge */}
                            <div className="absolute top-2 right-2 bg-cinema-red/90 text-white text-xs px-2 py-1 rounded">
                              {interest.mutualRating.toFixed(1)}
                            </div>
                          </div>

                          <div className="p-4 space-y-3">
                            <div>
                              <h3 className="font-semibold text-sm text-foreground group-hover:text-cinema-gold transition-colors line-clamp-2">
                                {interest.title}
                              </h3>
                              <p className="text-xs text-muted-foreground">{interest.year}</p>
                            </div>

                            {/* Rating Comparison */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">You:</span>
                                <div className="flex items-center space-x-1">
                                  {renderStars(interest.user1Rating)}
                                  <span className="text-foreground ml-1">{interest.user1Rating}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Friend:</span>
                                <div className="flex items-center space-x-1">
                                  {renderStars(interest.user2Rating)}
                                  <span className="text-foreground ml-1">{interest.user2Rating}</span>
                                </div>
                              </div>
                            </div>

                            {/* Watch Status */}
                            <div className="flex items-center justify-between">
                              <Badge 
                                variant={interest.user1Watched ? "default" : "outline"}
                                className={interest.user1Watched ? "bg-green-500" : "border-green-500/30 text-green-500"}
                              >
                                {interest.user1Watched ? "Watched" : "Not Watched"}
                              </Badge>
                              <Badge 
                                variant={interest.user2Watched ? "default" : "outline"}
                                className={interest.user2Watched ? "bg-blue-500" : "border-blue-500/30 text-blue-500"}
                              >
                                {interest.user2Watched ? "Watched" : "Not Watched"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedInterests.map((interest) => (
                      <Card key={interest.imdbId} className="movie-card">
                        <CardContent className="p-6">
                          <div className="flex space-x-4">
                            <img
                              src={interest.poster}
                              alt={interest.title}
                              className="w-20 h-28 object-cover rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg text-foreground mb-1">
                                    {interest.title}
                                  </h3>
                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                                    <span>{interest.year}</span>
                                    <span>{interest.type}</span>
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-4 w-4 text-cinema-gold fill-current" />
                                      <span className="text-cinema-gold font-semibold">
                                        {interest.mutualRating.toFixed(1)} mutual rating
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-1">Your Rating:</p>
                                      <div className="flex items-center space-x-1">
                                        {renderStars(interest.user1Rating)}
                                        <span className="text-sm text-foreground ml-2">
                                          {interest.user1Rating}/5
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-1">Friend's Rating:</p>
                                      <div className="flex items-center space-x-1">
                                        {renderStars(interest.user2Rating)}
                                        <span className="text-sm text-foreground ml-2">
                                          {interest.user2Rating}/5
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex space-x-2">
                                    <Badge 
                                      variant={interest.user1Watched ? "default" : "outline"}
                                      className={interest.user1Watched ? "bg-green-500" : "border-green-500/30 text-green-500"}
                                    >
                                      You: {interest.user1Watched ? "Watched" : "Not Watched"}
                                    </Badge>
                                    <Badge 
                                      variant={interest.user2Watched ? "default" : "outline"}
                                      className={interest.user2Watched ? "bg-blue-500" : "border-blue-500/30 text-blue-500"}
                                    >
                                      Friend: {interest.user2Watched ? "Watched" : "Not Watched"}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button size="sm" className="btn-hero">
                                    <Heart className="h-4 w-4 mr-1" />
                                    Watch Together
                                  </Button>
                                  <Button size="sm" variant="ghost" className="text-cinema-gold">
                                    <Users className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No common interests yet</h3>
                <p className="text-muted-foreground mb-6">
                  {selectedFriend === 'all' 
                    ? 'Add friends and rate movies to discover shared interests.'
                    : 'No shared interests found with this friend yet.'
                  }
                </p>
                <Button className="btn-hero">
                  <Users className="mr-2 h-4 w-4" />
                  Find Friends
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CommonInterests;
