import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Smile, Users, Play, Pause, Volume2, VolumeX, Maximize, Settings, Heart, ThumbsUp, Laugh, Frown, Angry } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { userAPI } from '@/lib/api';
import { User as UserType, ChatMessage } from '@/lib/types';
import Navbar from '@/components/Navbar';

const WatchTogether = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120); // 2 minutes for demo
  const [participants, setParticipants] = useState<UserType[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const emojis = [
    { icon: Heart, name: 'love', color: 'text-red-500' },
    { icon: ThumbsUp, name: 'like', color: 'text-blue-500' },
    { icon: Laugh, name: 'laugh', color: 'text-yellow-500' },
    { icon: Smile, name: 'smile', color: 'text-green-500' },
    { icon: Angry, name: 'angry', color: 'text-red-600' },
    { icon: Frown, name: 'frown', color: 'text-blue-600' }
  ];

  useEffect(() => {
    const currentUser = userAPI.getCurrentUser();
    setUser(currentUser);
    loadParticipants();
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadParticipants = () => {
    // Mock participants
    const mockParticipants: UserType[] = [
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
    setParticipants(mockParticipants);
  };

  const loadMessages = () => {
    // Mock messages
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        userId: '2',
        username: 'AlexMovieBuff',
        text: 'This scene is incredible!',
        timestamp: '2024-01-25T20:05:00Z',
        type: 'text'
      },
      {
        id: '2',
        userId: '3',
        username: 'SarahCinema',
        text: 'I love the cinematography here',
        timestamp: '2024-01-25T20:06:00Z',
        type: 'text'
      },
      {
        id: '3',
        userId: '1',
        username: user?.username || 'You',
        text: 'The acting is phenomenal',
        timestamp: '2024-01-25T20:07:00Z',
        type: 'text'
      },
      {
        id: '4',
        userId: '2',
        username: 'AlexMovieBuff',
        text: '',
        timestamp: '2024-01-25T20:08:00Z',
        type: 'reaction',
        reaction: 'love'
      }
    ];
    setMessages(mockMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!user || !newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      text: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const sendReaction = (reaction: string) => {
    if (!user) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      text: '',
      timestamp: new Date().toISOString(),
      type: 'reaction',
      reaction
    };
    
    setMessages(prev => [...prev, message]);
    setShowEmojiPicker(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Please sign in</h2>
            <p className="text-muted-foreground">You need to be signed in to join watch together sessions.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        <div className="flex h-screen">
          {/* Video Player Section */}
          <div className="flex-1 flex flex-col">
            {/* Video Player */}
            <div className="flex-1 bg-cinema-black relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-cinema-red/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Play className="h-16 w-16 text-cinema-red" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">Inception</h2>
                  <p className="text-muted-foreground">2010 • Christopher Nolan</p>
                </div>
              </div>
              
              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cinema-black to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={togglePlayPause}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    
                    <div className="flex items-center space-x-2 text-white">
                      <span className="text-sm">{formatTime(currentTime)}</span>
                      <div className="w-64 h-1 bg-white/30 rounded-full">
                        <div 
                          className="h-full bg-cinema-red rounded-full"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{formatTime(duration)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      <Maximize className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="w-80 bg-cinema-dark border-l border-cinema-red/20 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-cinema-red/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Watch Together Chat</h3>
                <Badge className="bg-cinema-blue">
                  <Users className="h-3 w-3 mr-1" />
                  {participants.length + 1}
                </Badge>
              </div>
              
              {/* Participants */}
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                  <AvatarFallback className="bg-cinema-red text-white text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {participants.map((participant) => (
                  <Avatar key={participant.id} className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.username}`} />
                    <AvatarFallback className="bg-cinema-blue text-white text-xs">
                      {participant.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    message.userId === user.id ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.username}`} />
                    <AvatarFallback className="bg-cinema-red text-white text-xs">
                      {message.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`max-w-[200px] ${
                    message.userId === user.id ? 'text-right' : ''
                  }`}>
                    <div className="text-xs text-muted-foreground mb-1">
                      {message.username}
                    </div>
                    
                    {message.type === 'text' ? (
                      <div className={`p-2 rounded-lg text-sm ${
                        message.userId === user.id
                          ? 'bg-cinema-gold text-cinema-black'
                          : 'bg-cinema-black/50 text-foreground'
                      }`}>
                        {message.text}
                      </div>
                    ) : (
                      <div className="p-2 bg-cinema-black/30 rounded-lg">
                        {message.reaction && (
                          <div className="flex items-center space-x-1">
                            {(() => {
                              const found = emojis.find(emoji => emoji.name === message.reaction);
                              if (!found) return null;
                              const Icon = found.icon;
                              return (
                                <>
                                  <Icon className={`h-4 w-4 ${found.color}`} />
                                  <span className="text-xs text-muted-foreground">{message.reaction}</span>
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-cinema-red/20">
              <div className="flex items-center space-x-2 mb-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-cinema-gold hover:text-cinema-gold/80"
                >
                  <Smile className="h-4 w-4" />
                </Button>
                
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-4 bg-cinema-black border border-cinema-gold/30 rounded-lg p-2 flex space-x-1">
                    {emojis.map((emoji) => (
                      <Button
                        key={emoji.name}
                        size="sm"
                        variant="ghost"
                        onClick={() => sendReaction(emoji.name)}
                        className="text-foreground hover:bg-cinema-gold/20"
                      >
                        <emoji.icon className={`h-4 w-4 ${emoji.color}`} />
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                />
                <Button
                  size="sm"
                  onClick={sendMessage}
                  className="btn-hero"
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WatchTogether;
