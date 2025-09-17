// API configuration and utilities for fym (Find Your Movie)
import { Movie, TVShow, User, Watchlist, Review, WatchParty } from './types';

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || 'your-omdb-api-key';
const API_BASE_URL = 'https://www.omdbapi.com/';

// OMDB API functions
export const omdbAPI = {
  // Search movies and TV shows
  search: async (query: string, type?: 'movie' | 'series', year?: string, page: number = 1) => {
    if (!OMDB_API_KEY || OMDB_API_KEY === 'your-omdb-api-key') {
      throw new Error('Missing OMDB API key. Set VITE_OMDB_API_KEY in .env and restart.');
    }

    const params = new URLSearchParams();
    params.set('apikey', OMDB_API_KEY);
    params.set('s', query);
    if (type) params.set('type', type);
    if (year) params.set('y', year);
    params.set('page', String(page));

    const response = await fetch(`${API_BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error(`OMDB request failed: ${response.status}`);
    }
    const data = await response.json();
    
    if (data.Response === 'False') {
      throw new Error(data.Error || 'Failed to fetch data');
    }
    
    return data;
  },

  // Get detailed information about a specific movie/show
  getById: async (imdbId: string) => {
    if (!OMDB_API_KEY || OMDB_API_KEY === 'your-omdb-api-key') {
      throw new Error('Missing OMDB API key. Set VITE_OMDB_API_KEY in .env and restart.');
    }
    const params = new URLSearchParams();
    params.set('apikey', OMDB_API_KEY);
    params.set('i', imdbId);
    params.set('plot', 'full');

    const response = await fetch(`${API_BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error(`OMDB request failed: ${response.status}`);
    }
    const data = await response.json();
    
    if (data.Response === 'False') {
      throw new Error(data.Error || 'Failed to fetch data');
    }
    
    return data;
  },

  // Get trending movies (using search with popular terms)
  getTrending: async () => {
    const popularTerms = ['action', 'comedy', 'drama', 'thriller', 'horror'];
    const term = popularTerms[Math.floor(Math.random() * popularTerms.length)];

    return omdbAPI.search(term, 'movie', undefined, 1);
  },

  // Get top-rated content
  getTopRated: async (type: 'movie' | 'series' = 'movie') => {
    // OMDB doesn't expose a real top-rated endpoint. Use a curated query term likely to return high-rated titles.
    const term = type === 'movie' ? 'academy award' : 'emmy winner';
    return omdbAPI.search(term, type, undefined, 1);
  }
};

// Local storage API for user data (in a real app, this would be a backend API)
export const userAPI = {
  // User authentication
  signUp: async (userData: { email: string; password: string; username: string }) => {
    const users = JSON.parse(localStorage.getItem('fym_users') || '[]');
    const existingUser = users.find((u: any) => u.email === userData.email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      watchlists: [],
      reviews: [],
      friends: []
    };
    
    users.push(newUser);
    localStorage.setItem('fym_users', JSON.stringify(users));
    localStorage.setItem('fym_current_user', JSON.stringify(newUser));
    
    return newUser;
  },

  signIn: async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('fym_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    localStorage.setItem('fym_current_user', JSON.stringify(user));
    return user;
  },

  signOut: () => {
    localStorage.removeItem('fym_current_user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('fym_current_user');
    return user ? JSON.parse(user) : null;
  },

  // Watchlist management
  addToWatchlist: async (userId: string, item: Movie | TVShow, listName: string = 'default') => {
    const users = JSON.parse(localStorage.getItem('fym_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    if (!users[userIndex].watchlists) {
      users[userIndex].watchlists = [];
    }
    
    let watchlist = users[userIndex].watchlists.find((w: any) => w.name === listName);
    if (!watchlist) {
      watchlist = { name: listName, items: [], createdAt: new Date().toISOString() };
      users[userIndex].watchlists.push(watchlist);
    }
    
    const existingItem = watchlist.items.find((i: any) => i.imdbID === item.imdbID);
    if (!existingItem) {
      watchlist.items.push({
        ...item,
        addedAt: new Date().toISOString(),
        watched: false,
        rating: null,
        notes: ''
      });
    }
    
    localStorage.setItem('fym_users', JSON.stringify(users));
    localStorage.setItem('fym_current_user', JSON.stringify(users[userIndex]));
    
    return watchlist;
  },

  removeFromWatchlist: async (userId: string, imdbId: string, listName: string = 'default') => {
    const users = JSON.parse(localStorage.getItem('fym_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const watchlist = users[userIndex].watchlists?.find((w: any) => w.name === listName);
    if (watchlist) {
      watchlist.items = watchlist.items.filter((i: any) => i.imdbID !== imdbId);
    }
    
    localStorage.setItem('fym_users', JSON.stringify(users));
    localStorage.setItem('fym_current_user', JSON.stringify(users[userIndex]));
    
    return watchlist;
  },

  // Reviews and ratings
  addReview: async (userId: string, imdbId: string, review: { rating: number; text: string; watched: boolean }) => {
    const users = JSON.parse(localStorage.getItem('fym_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    if (!users[userIndex].reviews) {
      users[userIndex].reviews = [];
    }
    
    const existingReviewIndex = users[userIndex].reviews.findIndex((r: any) => r.imdbId === imdbId);
    const reviewData = {
      imdbId,
      ...review,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (existingReviewIndex >= 0) {
      users[userIndex].reviews[existingReviewIndex] = reviewData;
    } else {
      users[userIndex].reviews.push(reviewData);
    }
    
    localStorage.setItem('fym_users', JSON.stringify(users));
    localStorage.setItem('fym_current_user', JSON.stringify(users[userIndex]));
    
    return reviewData;
  }
};

// Movie quotes for inspiration
export const movieQuotes = [
  {
    text: "May the Force be with you.",
    movie: "Star Wars",
    year: "1977",
    character: "Obi-Wan Kenobi"
  },
  {
    text: "I'll be back.",
    movie: "The Terminator",
    year: "1984",
    character: "The Terminator"
  },
  {
    text: "Here's looking at you, kid.",
    movie: "Casablanca",
    year: "1942",
    character: "Rick Blaine"
  },
  {
    text: "Life is like a box of chocolates. You never know what you're gonna get.",
    movie: "Forrest Gump",
    year: "1994",
    character: "Forrest Gump"
  },
  {
    text: "I'm going to make him an offer he can't refuse.",
    movie: "The Godfather",
    year: "1972",
    character: "Don Vito Corleone"
  },
  {
    text: "You can't handle the truth!",
    movie: "A Few Good Men",
    year: "1992",
    character: "Colonel Nathan Jessup"
  },
  {
    text: "I see dead people.",
    movie: "The Sixth Sense",
    year: "1999",
    character: "Cole Sear"
  },
  {
    text: "There's no place like home.",
    movie: "The Wizard of Oz",
    year: "1939",
    character: "Dorothy Gale"
  },
  {
    text: "I'm the king of the world!",
    movie: "Titanic",
    year: "1997",
    character: "Jack Dawson"
  },
  {
    text: "Elementary, my dear Watson.",
    movie: "The Adventures of Sherlock Holmes",
    year: "1939",
    character: "Sherlock Holmes"
  }
];

// Utility functions
export const getRandomQuote = () => {
  return movieQuotes[Math.floor(Math.random() * movieQuotes.length)];
};

export const formatRuntime = (runtime: string) => {
  const minutes = parseInt(runtime);
  if (isNaN(minutes)) return runtime;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${remainingMinutes}m`;
};

export const formatRating = (rating: string) => {
  const num = parseFloat(rating);
  if (isNaN(num)) return rating;
  return num.toFixed(1);
};
