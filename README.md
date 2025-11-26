# PolyMerit - Enterprise Polymarket Analytics Platform

<div align="center">

![PolyMerit](https://img.shields.io/badge/PolyMerit-v1.0-purple)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**The most comprehensive analytics platform for Polymarket prediction markets**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [API](#-api-integration)

</div>

---

## 🎯 Overview

PolyMerit is a professional-grade analytics dashboard built for serious Polymarket traders. It provides real-time market intelligence, whale tracking, advanced search capabilities, and comprehensive market analytics through the Polymarket Gamma API.

### Why PolyMerit?

- 🔍 **Advanced Search** - Real-time search across 1000+ markets with tag filtering
- 🐋 **Whale Tracking** - Monitor large trades and smart money movements
- 📊 **Market Intelligence** - Deep insights into volume, liquidity, and price trends  
- 🎨 **Beautiful UI** - Modern, responsive design with dark mode
- ⚡ **Fast & Reliable** - Built on Next.js 16 with optimized caching
- 🔒 **Secure** - Server-side API calls, no exposed keys

---

## ✨ Features

### 🔍 Market Scanner
- **Real-time Search**: Instant search across all active markets
- **Tag Filtering**: Filter by categories (Politics, Sports, Crypto, etc.)
- **Smart Sorting**: Sort by volume, date, or liquidity
- **Pagination**: Load more markets on demand
- **Market Cards**: Beautiful cards showing prices, volume, and trends

### 🐋 Whale Tracker
- **Live Trade Feed**: Real-time large trades from top markets
- **Advanced Filters**: Filter by buy/sell, minimum size
- **Auto-Refresh**: Optional 30-second auto-refresh
- **Trade Statistics**: See buy/sell ratios at a glance
- **Wallet Tracking**: Monitor specific addresses

### 📈 Analytics Dashboard *(Coming Soon)*
- Price history charts
- Volume analytics  
- Orderbook visualization
- Market depth analysis
- Sentiment tracking

### 🎯 Market Details *(Coming Soon)*
- Individual market pages
- Live price charts
- Trade history
- Orderbook data
- Market statistics

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (for watchlists)
- Polymarket API credentials *(optional)*

### Installation

```bash
# Clone the repository
git clone https://github.com/web3firm/PolyMerit.git
cd PolyMerit

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your database URL and API credentials

# Run database migrations
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

---

## 📋 Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Required for watchlists)
DATABASE_URL="postgresql://user:password@host:5432/database"

# Polymarket Builder/Affiliate (Optional - for referral tracking)
NEXT_PUBLIC_BUILDER_ADDRESS="your_ethereum_address"
POLYMARKET_API_KEY="your_api_key"
POLYMARKET_SECRET="your_secret"
POLYMARKET_PASSPHRASE="your_passphrase"
```

> **Note**: The app works without Polymarket credentials - they're only needed for builder/affiliate features.

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma** - Database ORM
- **PostgreSQL** - Relational database

### APIs & Services
- **Polymarket Gamma API** - Market data
- **Polymarket CLOB API** - Orderbook data

---

## 📡 API Integration

### Gamma API Endpoints Used

```typescript
// Markets
GET /markets?limit=12&active=true&order=DESC
GET /markets/{conditionId}

// Events  
GET /events?limit=20&order=volume&ascending=false

// Search
GET /public-search?q={query}&limit_per_type=10

// Tags
GET /tags

// Price History
GET /markets/{conditionId}/prices?interval=1d

// Trades
GET /markets/{conditionId}/trades?limit=50
```

### API Client Features

```typescript
import { 
  getMarkets, 
  getEvents, 
  searchMarkets, 
  getTags,
  getPriceHistory,
  getTrades,
  getOrderBook 
} from '@/lib/polymarket';

// Fetch trending markets
const markets = await getMarkets({ 
  limit: 12, 
  active: true, 
  order: 'DESC' 
});

// Search with tags
const results = await searchMarkets({ 
  q: 'election', 
  search_tags: true 
});

// Get price history
const history = await getPriceHistory(conditionId, '1d');
```

---

## 📂 Project Structure

```
polymerit/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Home page
│   │   ├── scanner/         # Market scanner
│   │   ├── whales/          # Whale tracker
│   │   ├── analytics/       # Analytics dashboard
│   │   └── api/             # API routes
│   │       ├── markets/     # Markets endpoint
│   │       ├── events/      # Events endpoint
│   │       ├── search/      # Search endpoint
│   │       ├── tags/        # Tags endpoint
│   │       └── whales/      # Whale activity endpoint
│   ├── components/          # Reusable components
│   ├── contexts/            # React contexts (theme)
│   └── lib/                 # Utilities
│       ├── polymarket.ts    # Polymarket API client
│       ├── db.ts            # Prisma client
│       └── utils.ts         # Helper functions
├── prisma/
│   └── schema.prisma        # Database schema
└── public/                  # Static assets
```

---

## 🎨 Key Components

### MarketCard
```tsx
<MarketCard
  title="Will Biden win 2024?"
  volume="$2.5M"
  yesPrice={0.52}
  noPrice={0.48}
  isTrending={true}
/>
```

### Search with Filters
```tsx
// Live search with debouncing
<input onChange={(e) => setSearchQuery(e.target.value)} />

// Tag filtering
<button onClick={() => setSelectedTag(tag.id)}>
  {tag.label}
</button>
```

---

## 🔄 Data Flow

```mermaid
graph LR
    A[User] --> B[Next.js Frontend]
    B --> C[API Routes]
    C --> D[Polymarket Gamma API]
    C --> E[PostgreSQL]
    D --> C
    E --> C
    C --> B
    B --> A
```

---

## 🚧 Roadmap

### Phase 1: Core Features ✅
- [x] Market scanner with search
- [x] Whale tracker
- [x] Tag filtering
- [x] Real-time data fetching
- [x] Dark mode

### Phase 2: Analytics (In Progress)
- [ ] Price history charts
- [ ] Market detail pages
- [ ] Orderbook visualization
- [ ] Volume analytics

### Phase 3: Social Features
- [ ] User authentication
- [ ] Market watchlists
- [ ] Portfolio tracking
- [ ] Price alerts

### Phase 4: Advanced Tools
- [ ] Trading signals
- [ ] API for developers
- [ ] Mobile app
- [ ] Export/reporting tools

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Polymarket](https://polymarket.com) for providing the Gamma API
- [Next.js](https://nextjs.org) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS
- The Web3 community for continuous support

---

## 📧 Contact

- **Website**: [polymerit.app](https://polymerit.app)
- **Email**: support@polymerit.app
- **Twitter**: [@polymerit](https://twitter.com/polymerit)
- **Discord**: [Join our community](https://discord.gg/polymerit)

---

<div align="center">

**Built with ❤️ by [Web3Firm](https://github.com/web3firm)**

[⬆ back to top](#polymerit---enterprise-polymarket-analytics-platform)

</div>
