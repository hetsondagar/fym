import { useState, useEffect } from 'react';
import { Users, Heart, Star, Bookmark, Play, Clock, MessageCircle, UserPlus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { userAPI } from '@/lib/api';
import { User, FriendActivity } from '@/lib/types';
import Navbar from '@/components/Navbar';

const FriendsActivity = () => {
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<User[]>([]);
  const [activities, setActivities] = useState<FriendActivity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('activity');

  useEffect(() => {
    const currentUser = userAPI.getCurrentUser();
    setUser(currentUser);
    loadFriendsAndActivities();
  }, []);

  const loadFriendsAndActivities = () => {
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

    const mockActivities: FriendActivity[] = [
      {
        userId: '2',
        username: 'AlexMovieBuff',
        activity: 'watched',
        item: {
          imdbID: '1',
          Title: 'Inception',
          Year: '2010',
          Type: 'movie',
          Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
          addedAt: '2024-01-25T10:00:00Z',
          watched: true,
          watchedAt: '2024-01-25T20:00:00Z',
          rating: 5,
          notes: 'Mind-blowing! Nolan at his best.'
        },
        timestamp: '2024-01-25T20:30:00Z',
        details: 'Rated 5/5 stars'
      },
      {
        userId: '3',
        username: 'SarahCinema',
        activity: 'added_to_watchlist',
        item: {
          imdbID: '2',
          Title: 'La La Land',
          Year: '2016',
          Type: 'movie',
          Poster: 'https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_SX300.jpg',
          addedAt: '2024-01-26T15:00:00Z',
          watched: false,
          rating: null,
          notes: ''
        },
        timestamp: '2024-01-26T15:00:00Z',
        details: 'Added to "Must Watch" list'
      },
      {
        userId: '2',
        username: 'AlexMovieBuff',
        activity: 'reviewed',
        item: {
          imdbID: '3',
          Title: 'The Dark Knight',
          Year: '2008',
          Type: 'movie',
          Poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
          addedAt: '2024-01-24T10:00:00Z',
          watched: true,
          watchedAt: '2024-01-24T19:00:00Z',
          rating: 5,
          notes: 'Heath Ledger\'s Joker is legendary!'
        },
        timestamp: '2024-01-24T19:30:00Z',
        details: 'Wrote a review: "Masterpiece of cinema"'
      }
    ];

    setFriends(mockFriends);
    setActivities(mockActivities);
  };

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'watched':
        return <Play className="h-4 w-4 text-green-500" />;
      case 'reviewed':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'added_to_watchlist':
        return <Bookmark className="h-4 w-4 text-blue-500" />;
      case 'created_list':
        return <Heart className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'watched':
        return 'bg-green-500/10 border-green-500/20';
      case 'reviewed':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'added_to_watchlist':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'created_list':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  const filteredActivities = activities.filter(activity =>
    activity.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.item.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Please sign in</h2>
            <p className="text-muted-foreground">You need to be signed in to view friends activity.</p>
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
                <h1 className="heading-hero text-4xl md:text-5xl">Friends Activity</h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Stay connected with your friends' movie discoveries and watchlist updates
              </p>
            </div>

            {/* Search */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search friends or movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-cinema-dark border-cinema-blue/30 focus:border-cinema-blue"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-cinema-dark border-cinema-blue/30">
                <TabsTrigger value="activity" className="text-foreground data-[state=active]:bg-cinema-blue data-[state=active]:text-white">
                  Recent Activity
                </TabsTrigger>
                <TabsTrigger value="friends" className="text-foreground data-[state=active]:bg-cinema-blue data-[state=active]:text-white">
                  My Friends ({friends.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="mt-8">
                {filteredActivities.length > 0 ? (
                  <div className="space-y-6">
                    {filteredActivities.map((activity, index) => (
                      <Card key={index} className={`movie-card ${getActivityColor(activity.activity)}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.username}`} />
                              <AvatarFallback className="bg-cinema-red text-white">
                                {activity.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                {getActivityIcon(activity.activity)}
                                <span className="font-semibold text-foreground">
                                  {activity.username}
                                </span>
                                <span className="text-muted-foreground">
                                  {activity.activity === 'watched' && 'watched'}
                                  {activity.activity === 'reviewed' && 'reviewed'}
                                  {activity.activity === 'added_to_watchlist' && 'added to watchlist'}
                                  {activity.activity === 'created_list' && 'created a list'}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-4 mb-3">
                                <img
                                  src={activity.item.Poster}
                                  alt={activity.item.Title}
                                  className="w-16 h-24 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg text-foreground">
                                    {activity.item.Title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {activity.item.Year} • {activity.item.Type}
                                  </p>
                                  {activity.details && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {activity.details}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(activity.timestamp).toLocaleString()}
                                </span>
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="ghost" className="text-cinema-gold">
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    Comment
                                  </Button>
                                  <Button size="sm" variant="ghost" className="text-cinema-gold">
                                    <Heart className="h-4 w-4 mr-1" />
                                    Like
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No activity yet</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery ? 'No activities found matching your search.' : 'Add friends to see their movie activities here.'}
                    </p>
                    {!searchQuery && (
                      <Button className="btn-hero">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Find Friends
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="friends" className="mt-8">
                {friends.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {friends.map((friend) => (
                      <Card key={friend.id} className="movie-card">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <Avatar className="h-20 w-20 mx-auto mb-4">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.username}`} />
                              <AvatarFallback className="bg-cinema-red text-white text-xl">
                                {friend.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <h3 className="font-semibold text-lg text-foreground mb-2">
                              {friend.username}
                            </h3>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Watchlists:</span>
                                <span className="text-foreground">{friend.watchlists?.length || 0}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Reviews:</span>
                                <span className="text-foreground">{friend.reviews?.length || 0}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Member since:</span>
                                <span className="text-foreground">
                                  {new Date(friend.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mb-4">
                              {friend.preferences.favoriteGenres.slice(0, 3).map((genre) => (
                                <Badge key={genre} variant="outline" className="text-xs">
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button size="sm" className="btn-hero flex-1">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Message
                              </Button>
                              <Button size="sm" variant="ghost" className="text-cinema-gold">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No friends yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Connect with other movie enthusiasts to see their activities and share recommendations.
                    </p>
                    <Button className="btn-hero">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Find Friends
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FriendsActivity;
