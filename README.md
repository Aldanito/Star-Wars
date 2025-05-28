# Star Wars Characters Catalog

A fast and modern Star Wars characters catalog built with React + TypeScript, shadcn/ui components, and optimized SWAPI integration.

## ✨ Features

### Core Functionality

- 📋 **Character Listing**: Browse Star Wars characters with names, avatars, and basic info
- 🔍 **Smart Search**: Real-time character search with 300ms debounce
- 🎯 **Advanced Filtering**: Filter by gender across ALL characters (not just current page)
- ⭐ **Favorites System**: Add characters to favorites and filter to show only favorites
- 📱 **Character Details**: Comprehensive character information in modal dialogs
- 🔗 **Deep Linking**: Share direct links to specific characters
- 📄 **Smart Pagination**: Navigate through characters with proper pagination
- ⚖️ **Character Comparison**: Compare multiple characters side-by-side with detailed stats
- 🌙 **Theme Toggle**: Switch between light and dark modes with system preference detection

### Performance Optimizations

- ⚡ **In-Memory Caching**: 5-minute cache for lightning-fast subsequent loads
- 🚀 **Parallel API Requests**: Fetch multiple pages simultaneously for 3-5x faster loading
- 📦 **Batch Processing**: Efficient bulk character detail fetching
- 🎯 **Smart Loading States**: Skeleton loaders during data fetching
- 🔄 **Error Resilience**: Graceful handling of failed requests

### User Experience

- 🎨 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🖼️ **Reliable Avatars**: Auto-generated avatars with CORS-friendly image service
- ♿ **Accessibility**: Screen reader friendly with proper ARIA labels
- 🎭 **Loading Skeletons**: Beautiful loading states during data fetching
- ❌ **Error Handling**: Informative error messages with retry options
- 💾 **Persistent Favorites**: Favorites are saved locally and persist across sessions
- 🎯 **Smart Filtering**: Combine search, gender filters, and favorites for precise results

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React
- **API**: SWAPI (https://swapi.tech/)
- **Avatar Service**: UI Avatars API
- **Local Storage**: Browser localStorage for favorites persistence
- **Theme Management**: CSS variables with system preference detection

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Aldanito/Star-Wars.git
   cd star-wars
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to http://localhost:5173

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## 📁 Project Structure

```
src/
├── api/
│   └── swapi.ts              # Optimized SWAPI client with caching
├── components/
│   ├── ui/                   # shadcn/ui base components
│   ├── CharacterCard.tsx     # Character display card
│   ├── CharacterModal.tsx    # Character details modal
│   ├── CharacterComparison.tsx # Character comparison feature
│   ├── CharacterCardSkeleton.tsx # Loading skeletons
│   └── ThemeToggle.tsx       # Dark/light theme switcher
├── contexts/
│   └── ThemeContext.tsx      # Theme management context
├── hooks/
│   ├── usePeople.ts          # Character data fetching hooks
│   ├── useFavorites.ts       # Favorites management hook
│   └── useDebounce.ts        # Search debouncing
├── lib/
│   └── utils.ts              # Utility functions
├── types/
│   └── swapi.ts              # TypeScript type definitions
└── App.tsx                   # Main application component
```

## 🔧 Key Components

### CharacterCard

- Displays character avatar, name, and basic info
- Click to open detailed modal
- Hover effects and smooth animations
- Fallback handling for missing images
- Heart icon for favorites with toggle functionality

### CharacterModal

- Comprehensive character details (height, mass, eye color, etc.)
- Accessible dialog with keyboard navigation
- Auto-generated avatars
- Proper error handling
- Add/remove favorites functionality

### CharacterComparison

- Compare multiple characters side-by-side
- Detailed stats comparison (height, mass, birth year, etc.)
- Easy character selection and removal
- Responsive layout for mobile devices

### Search & Filtering

- **Real-time search**: Debounced search across character names
- **Global gender filtering**: Searches ALL characters, not just current page
- **Favorites filtering**: Show only your favorite characters
- **Combined filters**: Use search + gender + favorites simultaneously
- **Smart caching**: Instant results after initial load
- **Performance optimized**: Parallel API requests for filtering

### Theme System

- **Dark/Light toggle**: Manual theme switching
- **System preference**: Automatically detects user's system theme
- **Persistent choice**: Remembers user's theme preference
- **Smooth transitions**: Animated theme changes

### Favorites System

- **Persistent storage**: Favorites saved in localStorage
- **Toggle functionality**: Easy add/remove from any character card
- **Filter view**: Show only favorite characters
- **Visual indicators**: Heart icons show favorite status
- **Cross-session**: Favorites persist across browser sessions

### Pagination

- Navigate through character pages
- Maintains state during filtering
- Smart pagination for filtered results
- Responsive controls

## ⚡ Performance Features

### Caching Strategy

- **5-minute in-memory cache** for all API responses
- **Instant subsequent loads** after first fetch
- **Smart cache invalidation** with timestamp-based expiry

### Parallel Processing

- **Concurrent page fetching** instead of sequential loading
- **Batch character detail requests** for filtering
- **Promise.allSettled** for error-resilient parallel requests

### Optimized API Usage

- **Minimal API calls** through intelligent caching
- **Failed request handling** without blocking successful ones
- **Efficient gender filtering** across entire character database
- **Smart data fetching** for favorites and comparison features

## 🌐 Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers with ES2020 support
- localStorage support for favorites persistence

## 🔗 API Integration

Uses [SWAPI.tech](https://swapi.tech/) for Star Wars character data:

- `GET /people` - Character list with pagination
- `GET /people/{id}` - Individual character details
- **Rate limiting**: Respectful API usage with caching
- **Error handling**: Graceful degradation on API failures

## 🎯 Usage Examples

### Basic Navigation

1. Browse characters using pagination
2. Use search to find specific characters
3. Apply gender filters to narrow results
4. Click any character for detailed information
5. Toggle between light and dark themes

### Advanced Features

- **Favorites management**: Click heart icons to add/remove favorites
- **Favorites-only view**: Filter to show only your favorite characters
- **Character comparison**: Compare multiple characters side-by-side
- **Direct character links**: Share URLs like `?character=1` for Luke Skywalker
- **Combined filtering**: Search + gender filter + favorites for precise results
- **Responsive experience**: Works seamlessly across all device sizes

### Theme Customization

- **Manual toggle**: Use the theme button in the top-right corner
- **System sync**: Automatically matches your device's theme preference
- **Persistent**: Your theme choice is remembered across visits

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
