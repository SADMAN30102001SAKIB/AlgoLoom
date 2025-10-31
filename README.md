# AlgoLoom 🧵

**Master Algorithms with AI-Powered Hints**

AlgoLoom is a modern LeetCode-style platform that combines competitive programming with gamification and AI-powered assistance. Solve algorithmic problems, get intelligent hints when stuck, earn XP, unlock achievements, and compete on the global leaderboard.

## ✨ Features

### 🧠 AI-Powered Hints

- Get progressive, non-spoiler hints from **Google Gemini AI**
- Three levels of hints to guide without giving away solutions
- Context-aware suggestions based on your code
- Daily limit to encourage problem-solving

### 🎮 Gamification System

- **XP & Leveling**: Earn XP for every problem solved
- **Achievements**: Unlock badges for milestones (first solve, streaks, etc.)
- **Streaks**: Maintain daily solving streaks for bonus XP
- **Leaderboard**: Compete globally with other developers
- **Difficulty Tiers**: Easy, Medium, Hard problems with varying rewards

### 💻 Code Editor

- **Monaco Editor** integration (VS Code experience)
- Support for **4 languages**: Python, C++, Java, JavaScript
- Syntax highlighting, IntelliSense, and code completion
- Auto-formatting and error detection

### 🔍 Problem Library

- **~30+ problems** from top tech companies
- Filter by **difficulty**, **tags**, **companies**, and **status**
- Real-time code execution with **Judge0 API**
- Detailed test case results and performance metrics

### 👤 User Profiles

- Track your progress with comprehensive statistics
- Activity heatmap (GitHub-style contribution graph)
- Submission history and acceptance rate
- Social links (GitHub, LinkedIn, website)

### 🛡️ Admin Panel

- **Problem Management**: Add, edit, and remove coding problems
- **User Management**: View user statistics and manage accounts
- **System Monitoring**: Track platform usage and performance
- **Content Moderation**: Review and approve user-generated content

## 🚀 Tech Stack

### Frontend

- **Next.js 14** (App Router, Server Components, ISR)
- **TypeScript** (strict mode)
- **Tailwind CSS** (utility-first styling)
- **shadcn/ui** (Radix UI + custom components)
- **Framer Motion** (animations)

### Backend

- **Next.js API Routes** (serverless functions)
- **NextAuth.js v5** (OAuth + credentials authentication)
- **Prisma ORM** (type-safe database queries)
- **PostgreSQL** (Neon.tech serverless DB)

### External Services (All FREE Tiers)

- **Judge0 API** (code execution via RapidAPI)
- **Google Gemini 1.5 Flash** (AI hints)

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (or use Neon.tech)
- API keys (see `.env.example`)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/algoloom.git
cd algoloom
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Fill in your `.env` file with:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret (`openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
- `GITHUB_ID` & `GITHUB_SECRET` - GitHub OAuth credentials
- `RAPIDAPI_KEY` - Judge0 API key from RapidAPI
- `GEMINI_API_KEY` - Google Gemini API key

### 4. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample data
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

```
algoloom/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   │   ├── achievements/ # Achievement system
│   │   ├── admin/        # Admin-only endpoints
│   │   ├── auth/         # NextAuth handlers
│   │   ├── companies/    # Company data
│   │   ├── hints/        # AI hint generation
│   │   ├── leaderboard/  # Rankings (API only)
│   │   ├── problems/     # Problem CRUD
│   │   ├── submit-stream/# Real-time code submission
│   │   ├── submissions/  # Submission history
│   │   ├── tags/         # Problem tags
│   │   └── user/         # User profiles (API only)
│   ├── (admin)/          # Admin panel routes
│   │   └── admin/        # Problem & user management
│   ├── (auth)/           # Authentication routes
│   │   ├── login/        # Sign in page
│   │   └── register/     # Sign up page
│   ├── (dashboard)/      # Protected routes
│   │   ├── problems/     # Problem list & solver
│   │   └── submissions/  # Submission details
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/           # React components
│   ├── ui/               # Base components (shadcn/ui)
│   ├── editor/           # Monaco code editor
│   ├── problem/          # Problem cards, filters
│   ├── submission/       # Verdict badges
│   └── providers/        # React Query, NextAuth
├── lib/                  # Utility libraries
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # NextAuth config
│   ├── judge0.ts         # Judge0 API client
│   ├── gemini.ts         # Gemini AI client
│   └── gamification/     # XP, streaks, achievements
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
├── middleware.ts         # Rate limiting, auth guards
├── tailwind.config.ts    # Tailwind configuration
└── package.json          # Dependencies

```

## 🎯 Usage Guide

### For Users

1. **Sign Up**: Create account with Google/GitHub or email
2. **Browse Problems**: Filter by difficulty, tags, or companies
3. **Solve Problems**: Write code in the Monaco editor
4. **Get Hints**: Stuck? Request AI-powered hints (3 per problem/day)
5. **Submit**: Run against test cases and get instant feedback
6. **Track Progress**: View your stats, XP, level, and achievements
7. **Compete**: Climb the leaderboard by solving more problems

### For Admins

1. **Admin Panel**: Access `/admin` (requires ADMIN role)
2. **Create Problems**: Add new problems with test cases
3. **Manage Users**: View user activity and moderate content
4. **Monitor System**: Track submission stats and API usage

## 🧪 API Endpoints

| Endpoint                | Method    | Description                          |
| ----------------------- | --------- | ------------------------------------ |
| `/api/problems`         | GET       | List problems with filters           |
| `/api/problems`         | POST      | Create problem (ADMIN)               |
| `/api/problems/[slug]`  | GET       | Get single problem                   |
| `/api/submit-stream`    | POST      | Submit code solution (SSE streaming) |
| `/api/submissions`      | GET       | Get user submission history          |
| `/api/submissions/[id]` | GET       | Get submission details               |
| `/api/hints`            | POST      | Generate AI hint                     |
| `/api/leaderboard`      | GET       | Get global rankings                  |
| `/api/user/[username]`  | GET       | Get user profile                     |
| `/api/user/me`          | GET/PATCH | Current user data                    |
| `/api/achievements`     | GET       | List achievements                    |
| `/api/admin/problems`   | GET       | Admin: List all problems             |
| `/api/admin/users`      | GET       | Admin: List all users                |
| `/api/companies`        | GET       | Get company data                     |
| `/api/tags`             | GET       | Get problem tags                     |

## 🔒 Security

- **Rate Limiting**: API endpoints have rate limits (100 requests/min default, 1 submission/min, 5 hints/min, 30 problems/min)
- **Authentication**: NextAuth.js with JWT sessions
- **Authorization**: Role-based access control (USER/ADMIN)
- **SQL Injection**: Protected by Prisma parameterized queries
- **XSS Protection**: React's built-in escaping + CSP headers
- **CSRF Protection**: NextAuth CSRF tokens

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy! 🎉

### Manual Deployment

```bash
# Build production
npm run build

# Start production server
npm start
```

## 📊 Database Schema

See `prisma/schema.prisma` for full schema. Key models:

- **User**: Authentication, gamification stats (xp, streak, level)
- **Problem**: Title, description, test cases, difficulty
- **Submission**: Code, verdict, runtime, memory
- **Achievement**: Badges and milestones
- **Hint**: AI-generated hints with rate limiting

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Judge0** for code execution API
- **Google Gemini** for AI-powered hints
- **shadcn/ui** for beautiful component library
- **Vercel** for hosting platform
- **Neon** for serverless PostgreSQL

---

**Built with ❤️ for developers by developers**

⭐ Star this repo if you find it helpful!
