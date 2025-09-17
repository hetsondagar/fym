import { useState } from "react";
import { Calendar, Clock, Star, Plus, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import filmStripBg from "@/assets/film-strip-bg.jpg";

const WatchlistSection = () => {
  const [activeTab, setActiveTab] = useState<'planned' | 'watching' | 'completed'>('planned');

  // Mock watchlist data
  const watchlistData = {
    planned: [
      {
        id: "1",
        title: "Dune: Part Two",
        year: 2024,
        genre: ["Sci-Fi", "Adventure"],
        rating: 8.7,
        addedDate: "2024-01-15",
        notes: "Must watch in IMAX",
        priority: "high"
      },
      {
        id: "2", 
        title: "Oppenheimer",
        year: 2023,
        genre: ["Biography", "Drama"],
        rating: 8.4,
        addedDate: "2024-01-10",
        notes: "Academy Award winner",
        priority: "medium"
      }
    ],
    watching: [
      {
        id: "3",
        title: "True Detective",
        year: 2014,
        genre: ["Crime", "Drama"],
        rating: 9.0,
        progress: 60,
        episode: "S1E6",
        notes: "Incredible cinematography"
      }
    ],
    completed: [
      {
        id: "4",
        title: "The Bear",
        year: 2022,
        genre: ["Comedy", "Drama"],
        rating: 8.9,
        completedDate: "2024-01-20",
        userRating: 9,
        notes: "Loved the character development"
      }
    ]
  };

  const tabs = [
    { id: 'planned', label: 'Planned', count: watchlistData.planned.length },
    { id: 'watching', label: 'Watching', count: watchlistData.watching.length },
    { id: 'completed', label: 'Completed', count: watchlistData.completed.length }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-cinema-red/20 text-cinema-red';
      case 'medium': return 'bg-cinema-gold/20 text-cinema-gold';
      case 'low': return 'bg-cinema-blue/20 text-cinema-blue';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section 
      className="py-16 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${filmStripBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="heading-section mb-4">Your Watchlist</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your cinematic journey with personalized lists and detailed progress
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-cinema-dark/80 backdrop-blur-md rounded-lg p-2 flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-cinema-red text-white shadow-glow'
                    : 'text-muted-foreground hover:text-foreground hover:bg-cinema-dark/50'
                }`}
              >
                {tab.label}
                <Badge className="ml-2 bg-cinema-gold/20 text-cinema-gold">
                  {tab.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Planned Tab */}
          {activeTab === 'planned' && (
            <div className="space-y-4">
              {watchlistData.planned.map((item) => (
                <div key={item.id} className="movie-card p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-24 bg-cinema-dark rounded-lg flex items-center justify-center">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-cinzel text-xl font-semibold">{item.title}</h3>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{item.year}</span>
                        <span>{item.genre.join(', ')}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-cinema-gold" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                      {item.notes && (
                        <p className="text-sm text-cinema-gold italic">"{item.notes}"</p>
                      )}
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Added {item.addedDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" className="btn-secondary">
                      Start Watching
                    </Button>
                    <Button size="sm" variant="ghost">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Watching Tab */}
          {activeTab === 'watching' && (
            <div className="space-y-4">
              {watchlistData.watching.map((item) => (
                <div key={item.id} className="movie-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-2">
                      <h3 className="font-cinzel text-xl font-semibold">{item.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{item.year}</span>
                        <span>{item.genre.join(', ')}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-cinema-gold" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Currently on</div>
                      <div className="font-medium text-cinema-gold">{item.episode}</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-cinema-dark rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cinema-red to-cinema-gold h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-sm text-cinema-gold italic mb-4">"{item.notes}"</p>
                  )}

                  <div className="flex items-center space-x-2">
                    <Button size="sm" className="btn-hero">
                      Continue Watching
                    </Button>
                    <Button size="sm" className="btn-secondary">
                      Mark as Completed
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed Tab */}
          {activeTab === 'completed' && (
            <div className="space-y-4">
              {watchlistData.completed.map((item) => (
                <div key={item.id} className="movie-card p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-cinzel text-xl font-semibold">{item.title}</h3>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${
                                i < item.userRating 
                                  ? 'text-cinema-gold fill-current' 
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{item.year}</span>
                        <span>{item.genre.join(', ')}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-cinema-gold" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                      {item.notes && (
                        <p className="text-sm text-cinema-gold italic">"{item.notes}"</p>
                      )}
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Completed {item.completedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="mt-12 text-center">
          <Button className="btn-secondary mr-4">
            <Download className="h-4 w-4 mr-2" />
            Export as CSV
          </Button>
          <Button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export as PDF
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WatchlistSection;