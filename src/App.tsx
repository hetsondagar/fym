import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import Watchlist from "./pages/Watchlist";
import Recommendations from "./pages/Recommendations";
import FriendsActivity from "./pages/FriendsActivity";
import CommonInterests from "./pages/CommonInterests";
import WatchParty from "./pages/WatchParty";
import MoodCollections from "./pages/MoodCollections";
import HiddenGems from "./pages/HiddenGems";
import Reviews from "./pages/Reviews";
import Settings from "./pages/Settings";
import CollaborativeWatchlists from "./pages/CollaborativeWatchlists";
import WatchTogether from "./pages/WatchTogether";
import StreamingMap from "./pages/StreamingMap";
import NotFound from "./pages/NotFound";
import MovieDetails from "./pages/MovieDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv-shows" element={<TVShows />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/friends" element={<FriendsActivity />} />
          <Route path="/common-interests" element={<CommonInterests />} />
          <Route path="/watch-party" element={<WatchParty />} />
          <Route path="/mood-collections" element={<MoodCollections />} />
          <Route path="/hidden-gems" element={<HiddenGems />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/details" element={<MovieDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/collaborative-watchlists" element={<CollaborativeWatchlists />} />
          <Route path="/watch-together" element={<WatchTogether />} />
          <Route path="/streaming-map" element={<StreamingMap />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
