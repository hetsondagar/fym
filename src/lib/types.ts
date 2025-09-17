// Type definitions for fym (Find Your Movie)

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  Type: 'movie';
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface TVShow {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  Type: 'series';
  totalSeasons: string;
  Response: string;
}

export interface SearchResult {
  Search: Array<{
    Title: string;
    Year: string;
    imdbID: string;
    Type: 'movie' | 'series';
    Poster: string;
  }>;
  totalResults: string;
  Response: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  createdAt: string;
  watchlists: Watchlist[];
  reviews: Review[];
  friends: string[];
  preferences: UserPreferences;
  settings: UserSettings;
}

export interface Watchlist {
  name: string;
  items: WatchlistItem[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  collaborators: string[];
}

export interface WatchlistItem {
  imdbID: string;
  Title: string;
  Year: string;
  Type: 'movie' | 'series';
  Poster: string;
  addedAt: string;
  watched: boolean;
  watchedAt?: string;
  rating?: number;
  notes?: string;
  progress?: number; // For TV shows, percentage watched
}

export interface Review {
  imdbId: string;
  rating: number;
  text: string;
  watched: boolean;
  createdAt: string;
  updatedAt: string;
  likes: number;
  helpful: number;
}

export interface UserPreferences {
  favoriteGenres: string[];
  favoriteActors: string[];
  favoriteDirectors: string[];
  preferredLanguages: string[];
  minRating: number;
  maxRuntime: number;
  excludeGenres: string[];
}

export interface UserSettings {
  theme: 'dark' | 'light';
  notifications: {
    email: boolean;
    push: boolean;
    watchlistUpdates: boolean;
    friendActivity: boolean;
  };
  privacy: {
    profilePublic: boolean;
    watchlistPublic: boolean;
    reviewsPublic: boolean;
  };
  familyMode: {
    enabled: boolean;
    restrictions: string[];
    approvalRequired: boolean;
  };
}

export interface WatchParty {
  id: string;
  title: string;
  description: string;
  hostId: string;
  participants: string[];
  movieId: string;
  scheduledDate: string;
  duration: number;
  cost: number;
  costPerPerson: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  chatMessages: ChatMessage[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  reactions: Array<{
    emoji: string;
    users: string[];
  }>;
  sceneTimestamp?: number; // For synced reactions
}

export interface MoodCollection {
  id: string;
  name: string;
  description: string;
  mood: string;
  color: string;
  banner: string;
  items: WatchlistItem[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  followers: string[];
}

export interface StreamingAvailability {
  imdbId: string;
  platforms: Array<{
    name: string;
    region: string;
    url: string;
    price?: number;
    subscription?: boolean;
  }>;
  lastUpdated: string;
}

export interface FriendActivity {
  userId: string;
  username: string;
  activity: 'watched' | 'reviewed' | 'added_to_watchlist' | 'created_list';
  item: WatchlistItem;
  timestamp: string;
  details?: string;
}

export interface CommonInterest {
  imdbId: string;
  title: string;
  poster: string;
  year: string;
  type: 'movie' | 'series';
  mutualRating: number;
  user1Rating: number;
  user2Rating: number;
  user1Watched: boolean;
  user2Watched: boolean;
}

export interface HiddenGem {
  id: string;
  imdbId: string;
  title: string;
  year: string;
  type: 'movie' | 'series';
  poster: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  upvotes: number;
  downvotes: number;
  tags: string[];
  verified: boolean;
}

export interface FilterOptions {
  genre: string[];
  year: {
    min: number;
    max: number;
  };
  rating: {
    min: number;
    max: number;
  };
  runtime: {
    min: number;
    max: number;
  };
  type: 'movie' | 'series' | 'all';
  language: string[];
  country: string[];
}

export interface SortOptions {
  field: 'title' | 'year' | 'rating' | 'runtime' | 'added';
  direction: 'asc' | 'desc';
}

export interface SearchFilters extends FilterOptions {
  query: string;
  sort: SortOptions;
  page: number;
  limit: number;
}
