import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrendingSection from "@/components/TrendingSection";
import TopRatedSection from "@/components/TopRatedSection";
import RecommendationsSection from "@/components/RecommendationsSection";
import MoviesGrid from "@/components/MoviesGrid";
import WatchlistSection from "@/components/WatchlistSection";
import BackgroundCarousel from "@/components/BackgroundCarousel";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/use-mobile";

const Index = () => {
  useScrollReveal();
  return (
    <div className="min-h-screen bg-background">
      <BackgroundCarousel
        queries={[
          { term: 'The Dark Knight', type: 'movie' },
          { term: 'Inception', type: 'movie' },
          { term: 'Interstellar', type: 'movie' },
          { term: 'The Lord of the Rings', type: 'movie' },
        ]}
        intervalMs={6000}
        opacity={0.7}
      />
      <Navbar />
      <main className="pt-16">
        <div data-reveal>
          <HeroSection />
        </div>
        <div data-reveal>
          <TrendingSection />
        </div>
        <div data-reveal>
          <TopRatedSection />
        </div>
        <div data-reveal>
          <RecommendationsSection />
        </div>
        <div data-reveal>
          <MoviesGrid />
        </div>
        <div data-reveal>
          <WatchlistSection />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Index;
