# fym (Find Your Movie) 🎬

An elegant, immersive movie and web series discovery platform built with React, TypeScript, and Tailwind CSS. Discover your next favorite movie with personalized recommendations, curated watchlists, and a cinematic user experience.

## ✨ Features

### 🎭 Core Features
- **Movie & TV Show Discovery**: Browse thousands of movies and TV shows with advanced filtering
- **Personalized Recommendations**: AI-powered suggestions based on your preferences and viewing history
- **Watchlist Management**: Create and manage multiple watchlists with notes and ratings
- **User Reviews & Ratings**: Share your thoughts and rate content you've watched
- **Timeline Visualization**: Track your viewing journey with an elegant timeline interface

### 🎨 Design & Experience
- **Cinematic UI**: Dark mode with rich contrasts (deep blacks, reds, cinematic blues)
- **Immersive Animations**: Smooth transitions, hover effects, and glowing buttons
- **Movie Quotes**: Inspirational quotes from classic and modern films throughout the interface
- **Responsive Design**: Beautiful experience across desktop and mobile devices
- **Film Grain Effects**: Subtle textures and cinematic visual elements

### 🔧 Technical Features
- **OMDB API Integration**: Real-time movie and TV show data
- **Local Storage**: User data persistence without backend requirements
- **React Router**: Seamless navigation between pages
- **TypeScript**: Full type safety and better development experience
- **Tailwind CSS**: Utility-first styling with custom cinematic theme

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OMDB API key (free at [omdbapi.com](http://www.omdbapi.com/apikey.aspx))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fym
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_OMDB_API_KEY=your_omdb_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 Usage

### Getting Your OMDB API Key
1. Visit [omdbapi.com](http://www.omdbapi.com/apikey.aspx)
2. Sign up for a free account
3. Get your API key
4. Add it to your `.env` file

### Key Features to Try
- **Sign Up/Login**: Create an account to save your preferences
- **Browse Movies**: Use the Movies page to search and filter content
- **Create Watchlists**: Add movies to your personal watchlists
- **Rate & Review**: Mark movies as watched and add your ratings
- **Get Recommendations**: Visit the Recommendations page for personalized suggestions

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom cinematic theme
- **UI Components**: Radix UI primitives with custom styling
- **Routing**: React Router v6
- **State Management**: React hooks and local storage
- **API**: OMDB API for movie/TV show data
- **Icons**: Lucide React
- **Animations**: CSS animations and transitions

## 🎨 Design System

### Color Palette
- **Cinema Black**: `#0a0a0a` - Primary background
- **Cinema Dark**: `#1a1a1a` - Secondary background
- **Cinema Red**: `#dc2626` - Primary accent (velvet curtains)
- **Cinema Gold**: `#fbbf24` - Secondary accent (film awards)
- **Cinema Blue**: `#3b82f6` - Tertiary accent (neon signs)

### Typography
- **Cinzel**: For headings and movie titles (elegant serif)
- **Inter**: For body text and UI elements (clean sans-serif)
- **Orbitron**: For special elements (futuristic monospace)

### Components
- **Movie Cards**: Hover effects with poster scaling and overlay information
- **Buttons**: Glowing hover effects with cinematic styling
- **Forms**: Floating labels with focus states
- **Navigation**: Sticky header with backdrop blur
 - **Background Carousel**: Page-wide poster stills with smooth rotation and dark overlay

## 📱 Pages & Features

### Implemented Pages
- ✅ **Home Page**: Hero section with movie quotes, trending content, and recommendations
- ✅ **Sign Up/Login**: Cinematic authentication with movie quotes
- ✅ **Movies**: Advanced search and filtering with grid/list views
- ✅ **TV Shows**: Dedicated TV show browsing with season information
- ✅ **Watchlist**: Personal watchlist management with timeline view
- ✅ **Recommendations**: Personalized suggestions based on preferences

### Planned Features
- 🔄 **Friends Activity**: Social features for sharing watchlists
- 🔄 **Watch Party Scheduler**: Plan group viewing sessions
- 🔄 **Mood Collections**: Curated collections for different moods
- 🔄 **Streaming Availability Map**: Interactive content availability
- 🔄 **Family Mode**: Parental controls and restrictions
- 🔄 **Hidden Gems**: User-recommended content
- 🔄 **Collaborative Watchlists**: Shared editing capabilities
- 🔄 **Watch Together Chat**: Real-time chat during viewing

## 🎬 Movie Quotes Integration

The platform features inspirational movie quotes throughout the interface:
- Hero sections with rotating quotes
- Authentication pages with contextual quotes
- Recommendation pages with motivational content
- All quotes include movie title, year, and character attribution

## 🖼 Background Carousel & OMDb Images

The background carousel fetches and rotates HD poster stills from OMDb to create a cinematic backdrop:

- Component: `src/components/BackgroundCarousel.tsx`
- Pages: Home, Movies, TV Shows, Watchlist, Recommendations
- Queries: Each page passes context-specific search terms (e.g., `adventure`, `popular`, `series`) and `type`
- Cache: In-memory cache prevents redundant requests during a session
- Preload: First few images preloaded for smooth transitions
- Fallback: Uses `/fym_logo.png` when posters are missing/unavailable

Setup: Add `VITE_OMDB_API_KEY` to `.env` and restart the dev server.

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Radix UI)
│   ├── HeroSection.tsx # Home page hero
│   ├── MovieCard.tsx   # Movie display component
│   └── ...
├── pages/              # Page components
├── lib/                # Utilities and API functions
├── hooks/              # Custom React hooks
└── assets/             # Images and static files
```

### Key Files
- `src/lib/api.ts`: OMDB API integration and user management
- `src/lib/types.ts`: TypeScript type definitions
- `src/index.css`: Cinematic design system and animations
- `tailwind.config.ts`: Custom theme configuration
 - `src/components/BackgroundCarousel.tsx`: HD background carousel powered by OMDb

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Set environment variables
3. Deploy automatically on push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎭 Inspiration

Built with love for cinema and storytelling. Every design decision reflects the passion for movies, from the color palette inspired by velvet curtains and film awards to the typography that evokes classic movie posters.

---

**Find Your Movie** - Because every great story deserves to be discovered. 🎬✨