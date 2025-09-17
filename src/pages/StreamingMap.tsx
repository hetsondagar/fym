import { useState, useEffect } from 'react';
import { Map, Globe, Search, Filter, Play, Star, Users, TrendingUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { userAPI } from '@/lib/api';
import { User as UserType, StreamingService, RegionalContent } from '@/lib/types';
import Navbar from '@/components/Navbar';

const StreamingMap = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('US');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [regionalContent, setRegionalContent] = useState<RegionalContent[]>([]);
  const [streamingServices, setStreamingServices] = useState<StreamingService[]>([]);

  const regions = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽' }
  ];

  useEffect(() => {
    const currentUser = userAPI.getCurrentUser();
    setUser(currentUser);
    loadStreamingServices();
    loadRegionalContent();
  }, [selectedRegion, selectedService]);

  const loadStreamingServices = () => {
    const mockServices: StreamingService[] = [
      {
        id: 'netflix',
        name: 'Netflix',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Netflix_2015_logo.svg',
        color: '#E50914',
        availableRegions: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'IN', 'BR', 'MX'],
        monthlyPrice: 15.49,
        features: ['HD Streaming', 'Multiple Profiles', 'Download Offline']
      },
      {
        id: 'disney',
        name: 'Disney+',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Disney%2B_logo.svg',
        color: '#113CCF',
        availableRegions: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'IN', 'BR', 'MX'],
        monthlyPrice: 7.99,
        features: ['4K Streaming', 'Family Content', 'Marvel & Star Wars']
      },
      {
        id: 'hulu',
        name: 'Hulu',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg',
        color: '#1CE783',
        availableRegions: ['US'],
        monthlyPrice: 7.99,
        features: ['Live TV', 'Next Day Episodes', 'Original Content']
      },
      {
        id: 'amazon',
        name: 'Prime Video',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png',
        color: '#00A8E1',
        availableRegions: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'IN', 'BR', 'MX'],
        monthlyPrice: 8.99,
        features: ['Prime Shipping', 'Music & Reading', 'Original Series']
      },
      {
        id: 'hbo',
        name: 'HBO Max',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg',
        color: '#8B5CF6',
        availableRegions: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'BR', 'MX'],
        monthlyPrice: 14.99,
        features: ['HBO Originals', 'Warner Bros Movies', 'DC Content']
      }
    ];
    setStreamingServices(mockServices);
  };

  const loadRegionalContent = () => {
    const mockContent: RegionalContent[] = [
      {
        imdbId: 'tt0112471',
        title: 'Before Sunrise',
        year: '1995',
        type: 'movie',
        poster: 'https://m.media-amazon.com/images/M/MV5BZDdiZTAwYzAtMDI3Ni00OTRjLTkzN2UtMGE3MDMyZmU4NTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
        availableOn: ['netflix', 'hulu'],
        region: selectedRegion,
        rating: 8.1,
        genre: 'Romance',
        description: 'A beautiful, intimate conversation between two strangers who meet on a train.'
      },
      {
        imdbId: 'tt0246578',
        title: 'Donnie Darko',
        year: '2001',
        type: 'movie',
        poster: 'https://m.media-amazon.com/images/M/MV5BZjZlZDlkYTktMmU1My00ZDBiLWFlNjEtYTBhNjVlOTc4YjM2XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
        availableOn: ['netflix', 'amazon'],
        region: selectedRegion,
        rating: 8.0,
        genre: 'Sci-Fi',
        description: 'A mind-bending psychological thriller that explores time travel and destiny.'
      },
      {
        imdbId: 'tt0118715',
        title: 'The Big Lebowski',
        year: '1998',
        type: 'movie',
        poster: 'https://m.media-amazon.com/images/M/MV5BMTQ0NjUzMDMyOF5BMl5BanBnXkFtZTgwODA1OTU0MDE@._V1_SX300.jpg',
        availableOn: ['hbo', 'amazon'],
        region: selectedRegion,
        rating: 8.1,
        genre: 'Comedy',
        description: 'The Dude abides in this hilarious and quotable comedy from the Coen Brothers.'
      },
      {
        imdbId: 'tt0097165',
        title: 'Dead Poets Society',
        year: '1989',
        type: 'movie',
        poster: 'https://m.media-amazon.com/images/M/MV5BOGYwYWNjMzgtNGU4ZC00NWQ2LWEwZjUtMzE1Zjc3NjY3YTU1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
        availableOn: ['disney', 'hulu'],
        region: selectedRegion,
        rating: 8.1,
        genre: 'Drama',
        description: 'An inspiring story about a teacher who changes his students\' lives through poetry.'
      }
    ];
    setRegionalContent(mockContent);
  };

  const getServiceInfo = (serviceId: string) => {
    return streamingServices.find(service => service.id === serviceId);
  };

  const filteredContent = regionalContent.filter(content => {
    if (selectedService !== 'all' && !content.availableOn.includes(selectedService)) {
      return false;
    }
    if (searchQuery && !content.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getRegionName = (code: string) => {
    return regions.find(region => region.code === code)?.name || code;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Please sign in</h2>
            <p className="text-muted-foreground">You need to be signed in to view streaming availability.</p>
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
                <Globe className="h-12 w-12 text-cinema-blue" />
                <h1 className="heading-hero text-4xl md:text-5xl">Streaming Map</h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover where your favorite movies and shows are available to stream around the world. 
                Compare regional availability and find the best streaming options.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="map" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-cinema-dark border-cinema-blue/30">
                <TabsTrigger value="map" className="text-foreground data-[state=active]:bg-cinema-blue data-[state=active]:text-white">
                  Regional Map
                </TabsTrigger>
                <TabsTrigger value="services" className="text-foreground data-[state=active]:bg-cinema-blue data-[state=active]:text-white">
                  Streaming Services
                </TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="mt-8">
                {/* Controls */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                  <div className="flex items-center space-x-4">
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger className="w-48 bg-cinema-dark border-cinema-blue/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-cinema-dark border-cinema-blue/30">
                        {regions.map((region) => (
                          <SelectItem key={region.code} value={region.code} className="text-foreground">
                            <div className="flex items-center space-x-2">
                              <span>{region.flag}</span>
                              <span>{region.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger className="w-40 bg-cinema-dark border-cinema-blue/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-cinema-dark border-cinema-blue/30">
                        <SelectItem value="all" className="text-foreground">All Services</SelectItem>
                        {streamingServices.map((service) => (
                          <SelectItem key={service.id} value={service.id} className="text-foreground">
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search movies and shows..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 bg-cinema-dark border-cinema-blue/30 focus:border-cinema-blue"
                    />
                  </div>
                </div>

                {/* Region Info */}
                <Card className="mb-8 bg-cinema-dark border-cinema-blue/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">
                          {regions.find(r => r.code === selectedRegion)?.flag}
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold text-foreground">
                            {getRegionName(selectedRegion)}
                          </h2>
                          <p className="text-muted-foreground">
                            Available streaming services and content in this region
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-cinema-gold">
                          {filteredContent.length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Available Titles
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Grid */}
                {filteredContent.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredContent.map((content) => (
                      <Card key={content.imdbId} className="movie-card group">
                        <CardContent className="p-0">
                          <div className="aspect-[2/3] relative overflow-hidden">
                            <img
                              src={content.poster}
                              alt={content.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-4 left-4 right-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Button size="sm" className="btn-hero text-xs">
                                    <Play className="h-3 w-3 mr-1" />
                                    Watch Now
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Rating Badge */}
                            <div className="absolute top-2 right-2 bg-cinema-black/80 backdrop-blur-sm rounded-full px-2 py-1">
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-cinema-gold fill-current" />
                                <span className="text-xs text-foreground">{content.rating}</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 space-y-3">
                            <div>
                              <h3 className="font-semibold text-sm text-foreground group-hover:text-cinema-gold transition-colors line-clamp-2">
                                {content.title}
                              </h3>
                              <p className="text-xs text-muted-foreground">{content.year} • {content.genre}</p>
                            </div>

                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {content.description}
                            </p>

                            {/* Streaming Services */}
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-foreground">Available on:</p>
                              <div className="flex flex-wrap gap-1">
                                {content.availableOn.map((serviceId) => {
                                  const service = getServiceInfo(serviceId);
                                  return service ? (
                                    <Badge
                                      key={serviceId}
                                      className="text-xs"
                                      style={{ backgroundColor: service.color, color: 'white' }}
                                    >
                                      {service.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No content found</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery 
                        ? 'No movies or shows match your search criteria in this region.'
                        : 'No content available for the selected filters in this region.'
                      }
                    </p>
                    <Button 
                      className="btn-hero"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedService('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="services" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {streamingServices.map((service) => (
                    <Card key={service.id} className="movie-card">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Service Header */}
                          <div className="flex items-center space-x-4">
                            <div 
                              className="w-16 h-16 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: service.color }}
                            >
                              <span className="text-white font-bold text-lg">
                                {service.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-foreground">
                                {service.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                ${service.monthlyPrice}/month
                              </p>
                            </div>
                          </div>

                          {/* Features */}
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Features:</h4>
                            <div className="space-y-1">
                              {service.features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-cinema-gold rounded-full"></div>
                                  <span className="text-sm text-muted-foreground">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Available Regions */}
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Available in:</h4>
                            <div className="flex flex-wrap gap-1">
                              {service.availableRegions.slice(0, 6).map((region) => (
                                <Badge key={region} variant="outline" className="text-xs">
                                  {region}
                                </Badge>
                              ))}
                              {service.availableRegions.length > 6 && (
                                <Badge variant="outline" className="text-xs">
                                  +{service.availableRegions.length - 6} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          <Button 
                            className="w-full btn-hero"
                            style={{ backgroundColor: service.color }}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Visit {service.name}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StreamingMap;
