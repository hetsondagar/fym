import { useState, useEffect } from 'react';
import { Star, Heart, MessageCircle, ThumbsUp, ThumbsDown, Edit3, Trash2, Plus, Search, Filter, Grid, List, User, Calendar, Award } from 'lucide-react';
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
import { User as UserType, Review, Movie } from '@/lib/types';
import Navbar from '@/components/Navbar';

const Reviews = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'my' | 'friends'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieSearchQuery, setMovieSearchQuery] = useState('');
  const [movieSearchResults, setMovieSearchResults] = useState<Movie[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    rating: 0,
    text: '',
    watched: true
  });

  useEffect(() => {
    const currentUser = userAPI.getCurrentUser();
    setUser(currentUser);
    loadReviews();
  }, []);

  const loadReviews = () => {
    // Mock data for demonstration
    const mockReviews: Review[] = [
      {
        imdbId: 'tt0112471',
        rating: 5,
        text: 'Before Sunrise is a masterpiece of intimate storytelling. The chemistry between Ethan Hawke and Julie Delpy is electric, and the film captures the magic of a chance encounter in the most beautiful way. Every conversation feels authentic, every moment feels precious. This is what cinema is all about - human connection, vulnerability, and the fleeting nature of time.',
        watched: true,
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
        likes: 23,
        helpful: 18
      },
      {
        imdbId: 'tt0246578',
        rating: 4,
        text: 'Donnie Darko is a mind-bending experience that gets better with each viewing. The atmosphere is incredible, and Jake Gyllenhaal delivers a haunting performance. The time travel elements are complex but rewarding for those willing to engage with the material. A true cult classic that deserves its reputation.',
        watched: true,
        createdAt: '2024-01-22T14:00:00Z',
        updatedAt: '2024-01-22T14:00:00Z',
        likes: 15,
        helpful: 12
      },
      {
        imdbId: 'tt0118715',
        rating: 5,
        text: 'The Big Lebowski is pure comedic genius. The Coen Brothers created something truly special here - a film that\'s endlessly quotable, hilariously absurd, and surprisingly deep. Jeff Bridges as The Dude is iconic, and the supporting cast is perfect. This is the kind of movie you can watch a hundred times and still find something new to love.',
        watched: true,
        createdAt: '2024-01-25T16:00:00Z',
        updatedAt: '2024-01-25T16:00:00Z',
        likes: 31,
        helpful: 25
      },
      {
        imdbId: 'tt0097165',
        rating: 5,
        text: 'Dead Poets Society is a powerful reminder of the impact a great teacher can have. Robin Williams gives one of his most moving performances, and the film\'s message about seizing the day resonates deeply. The cinematography is beautiful, and the emotional beats hit perfectly. A film that will stay with you long after the credits roll.',
        watched: true,
        createdAt: '2024-01-26T09:00:00Z',
        updatedAt: '2024-01-26T09:00:00Z',
        likes: 19,
        helpful: 16
      }
    ];
    setReviews(mockReviews);
  };

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setMovieSearchResults([]);
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
        setMovieSearchResults(detailedMovies);
      }
    } catch (error) {
      console.error('Failed to search movies:', error);
      setMovieSearchResults([]);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !selectedMovie || !formData.text) return;
    
    try {
      const newReview: Review = {
        imdbId: selectedMovie.imdbID,
        rating: formData.rating,
        text: formData.text,
        watched: formData.watched,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        helpful: 0
      };
      
      setReviews(prev => [newReview, ...prev]);
      setIsWriting(false);
      setFormData({
        rating: 0,
        text: '',
        watched: true
      });
      setSelectedMovie(null);
      setMovieSearchQuery('');
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const likeReview = (reviewIndex: number) => {
    setReviews(prev => prev.map((review, index) => 
      index === reviewIndex 
        ? { ...review, likes: review.likes + 1 }
        : review
    ));
  };

  const markHelpful = (reviewIndex: number) => {
    setReviews(prev => prev.map((review, index) => 
      index === reviewIndex 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating 
            ? 'text-cinema-gold fill-current' 
            : 'text-muted-foreground'
        } ${interactive ? 'cursor-pointer hover:text-cinema-gold' : ''}`}
        onClick={() => interactive && onRatingChange && onRatingChange(i + 1)}
      />
    ));
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'my' && review.imdbId !== user?.id) return false;
    if (searchQuery && !review.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return (b.likes + b.helpful) - (a.likes + a.helpful);
      case 'rating':
        return b.rating - a.rating;
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
            <p className="text-muted-foreground">You need to be signed in to view and write reviews.</p>
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
                <Star className="h-12 w-12 text-cinema-gold" />
                <h1 className="heading-hero text-4xl md:text-5xl">Reviews & Notes</h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Share your thoughts on movies and shows. Read reviews from fellow cinephiles and discover new perspectives on your favorite films.
              </p>
            </div>

            <div className="text-center">
              <Button 
                className="btn-hero"
                onClick={() => setIsWriting(true)}
              >
                <Plus className="mr-2 h-5 w-5" />
                Write a Review
              </Button>
            </div>
          </div>
        </section>

        {/* Write Review Modal */}
        {isWriting && (
          <div className="fixed inset-0 bg-cinema-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-cinema-dark border-cinema-gold/30 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-foreground">Write a Review</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsWriting(false)}
                    className="text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Movie Selection */}
                <div>
                  <Label className="text-foreground mb-2 block">Select Movie/Show</Label>
                  <div className="space-y-4">
                    <Input
                      placeholder="Search for a movie or show..."
                      value={movieSearchQuery}
                      onChange={(e) => {
                        setMovieSearchQuery(e.target.value);
                        searchMovies(e.target.value);
                      }}
                      className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                    />
                    
                    {movieSearchResults.length > 0 && (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {movieSearchResults.map((movie) => (
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

                {/* Rating */}
                <div>
                  <Label className="text-foreground mb-2 block">Your Rating</Label>
                  <div className="flex items-center space-x-1">
                    {renderStars(formData.rating, true, (rating) => setFormData(prev => ({ ...prev, rating })))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {formData.rating > 0 ? `${formData.rating}/5 stars` : 'No rating'}
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <Label htmlFor="review" className="text-foreground">Your Review</Label>
                  <Textarea
                    id="review"
                    value={formData.text}
                    onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Share your thoughts about this movie or show. What did you love? What didn't work for you? Be specific and help others decide if they should watch it..."
                    className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                    rows={6}
                  />
                </div>

                {/* Watched Status */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="watched"
                    checked={formData.watched}
                    onChange={(e) => setFormData(prev => ({ ...prev, watched: e.target.checked }))}
                    className="w-4 h-4 text-cinema-gold bg-cinema-black border-cinema-gold/30 rounded focus:ring-cinema-gold"
                  />
                  <Label htmlFor="watched" className="text-foreground">
                    I have watched this movie/show
                  </Label>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleSubmitReview}
                    className="btn-hero flex-1"
                    disabled={!selectedMovie || !formData.text}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Submit Review
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setIsWriting(false)}
                    className="text-muted-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reviews Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
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
                    <SelectItem value="all" className="text-foreground">All Reviews</SelectItem>
                    <SelectItem value="my" className="text-foreground">My Reviews</SelectItem>
                    <SelectItem value="friends" className="text-foreground">Friends' Reviews</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-40 bg-cinema-dark border-cinema-gold/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cinema-dark border-cinema-gold/30">
                    <SelectItem value="recent" className="text-foreground">Most Recent</SelectItem>
                    <SelectItem value="popular" className="text-foreground">Most Popular</SelectItem>
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

            {/* Reviews List */}
            {sortedReviews.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedReviews.map((review, index) => (
                    <Card key={index} className="movie-card group">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
                                <AvatarFallback className="bg-cinema-red text-white">
                                  {user?.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium text-foreground">{user?.username}</h4>
                                <div className="flex items-center space-x-1">
                                  {renderStars(review.rating)}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Review Text */}
                          <div className="space-y-3">
                            <p className="text-sm text-foreground/90 leading-relaxed line-clamp-4">
                              {review.text}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-cinema-red/20">
                            <div className="flex items-center space-x-4">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => likeReview(index)}
                                className="text-cinema-gold hover:text-cinema-gold/80"
                              >
                                <Heart className="h-4 w-4 mr-1" />
                                {review.likes}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markHelpful(index)}
                                className="text-cinema-blue hover:text-cinema-blue/80"
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {review.helpful}
                              </Button>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-muted-foreground"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedReviews.map((review, index) => (
                    <Card key={index} className="movie-card">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
                                <AvatarFallback className="bg-cinema-red text-white">
                                  {user?.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium text-lg text-foreground">{user?.username}</h4>
                                <div className="flex items-center space-x-2">
                                  {renderStars(review.rating)}
                                  <span className="text-sm text-muted-foreground">
                                    {review.rating}/5 stars
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Review Text */}
                          <div className="space-y-3">
                            <p className="text-foreground/90 leading-relaxed">
                              {review.text}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-cinema-red/20">
                            <div className="flex items-center space-x-4">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => likeReview(index)}
                                className="text-cinema-gold hover:text-cinema-gold/80"
                              >
                                <Heart className="h-4 w-4 mr-1" />
                                {review.likes} likes
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markHelpful(index)}
                                className="text-cinema-blue hover:text-cinema-blue/80"
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {review.helpful} helpful
                              </Button>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-muted-foreground"
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Comment
                              </Button>
                              {review.imdbId === user?.id && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-cinema-gold"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
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
                <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No reviews found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? 'No reviews match your search criteria.' : 'Be the first to write a review!'}
                </p>
                <Button className="btn-hero" onClick={() => setIsWriting(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Write Your First Review
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Reviews;
