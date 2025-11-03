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
- **Public Viewing**: Browse problems and submissions without login
- **Protected Submissions**: Email verification required to submit solutions
- Filter by **difficulty**, **tags**, **companies**, and **status**
- **URL State Persistence**: Pagination and filters synced with URL
- Real-time code execution with **Judge0 API**
- Detailed test case results and performance metrics

### 👤 User Profiles & Authentication

- **Email Verification**: Secure account verification via email (Resend API)
- **OAuth Support**: Sign in with Google or GitHub (auto-verified)
- **Username Auto-generation**: Automatic username creation from name
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
- **Resend** (email verification - 100 emails/day free)

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
- `NEXTAUTH_URL` - Your app URL (e.g., `http://localhost:3000`)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
- `GITHUB_ID` & `GITHUB_SECRET` - GitHub OAuth credentials
- `RAPIDAPI_KEY` - Judge0 API key from RapidAPI
- `GEMINI_API_KEY` - Google Gemini API key
- `RESEND_API_KEY` - Resend API key for email verification (optional in dev)
- `EMAIL_FROM` - Sender email address (e.g., `noreply@yourdomain.com`)

### 4. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample data
npx prisma db seed
```

### 5. Setup Email Verification (Optional for Development)

For development, you can skip email verification by:

- Using OAuth login (Google/GitHub) - auto-verified
- Or testing without actual emails (verification links logged to console)

For production with actual emails:

1. Sign up for [Resend](https://resend.com) (100 emails/day free)
2. Add your domain and verify DNS records
3. Get API key and add to `.env`:
   ```
   RESEND_API_KEY=re_xxxxx
   EMAIL_FROM=noreply@yourdomain.com
   ```

See `docs/EMAIL_VERIFICATION.md` for detailed setup guide.

### 6. Run Development Server

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
│   │   ├── auth/         # NextAuth & email verification
│   │   ├── companies/    # Company data
│   │   ├── hints/        # AI hint generation
│   │   ├── leaderboard/  # Rankings (API only)
│   │   ├── problems/     # Problem CRUD (public read)
│   │   ├── submit-stream/# Real-time code submission (protected)
│   │   ├── submissions/  # Submission history (public read)
│   │   ├── tags/         # Problem tags
│   │   └── user/         # User profiles (API only)
│   ├── (admin)/          # Admin panel routes
│   │   └── admin/        # Problem & user management
│   ├── (auth)/           # Authentication routes
│   │   ├── login/        # Sign in page
│   │   └── register/     # Sign up page
│   ├── (dashboard)/      # Public viewing routes
│   │   ├── problems/     # Problem list & solver
│   │   └── submissions/  # Submission details
│   ├── auth/
│   │   └── callback/     # OAuth callback handler
│   ├── register-success/ # Post-registration page
│   ├── verify-email/     # Email verification page
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
│   ├── email.ts          # Email verification (Resend)
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

1. **Browse Problems**: View problems and submissions without login
2. **Sign Up**: Create account with Google/GitHub (auto-verified) or email
3. **Verify Email**: Check email for verification link (if using email/password)
4. **Solve Problems**: Write code in the Monaco editor
5. **Get Hints**: Stuck? Request AI-powered hints (requires login)
6. **Submit**: Run against test cases and get instant feedback (requires verified email)
7. **Track Progress**: View your stats, XP, level, and achievements
8. **Compete**: Climb the leaderboard by solving more problems

### For Admins

1. **Admin Panel**: Access `/admin` (requires ADMIN role)
2. **Create Problems**: Add new problems with test cases
3. **Manage Users**: View user activity and moderate content
4. **Monitor System**: Track submission stats and API usage

## 🧪 API Endpoints

| Endpoint                              | Method    | Auth Required     | Description                          |
| ------------------------------------- | --------- | ----------------- | ------------------------------------ |
| `/api/problems`                       | GET       | No                | List problems with filters           |
| `/api/problems`                       | POST      | Yes (ADMIN)       | Create problem                       |
| `/api/problems/[slug]`                | GET       | No                | Get single problem                   |
| `/api/problems/[slug]/mark-hint-used` | POST      | Yes               | Mark hint as used                    |
| `/api/submit-stream`                  | POST      | Yes (verified)    | Submit code solution (SSE streaming) |
| `/api/submissions`                    | GET       | No                | Get submission history               |
| `/api/submissions/[id]`               | GET       | No                | Get submission details               |
| `/api/submissions/[id]/delete`        | DELETE    | Yes (owner/admin) | Delete submission                    |
| `/api/hints`                          | POST      | Yes               | Generate AI hint                     |
| `/api/leaderboard`                    | GET       | No                | Get global rankings                  |
| `/api/user/[username]`                | GET       | No                | Get user profile                     |
| `/api/user/me`                        | GET/PATCH | Yes               | Current user data                    |
| `/api/achievements`                   | GET       | Yes               | List achievements                    |
| `/api/admin/problems`                 | GET       | Yes (ADMIN)       | Admin: List all problems             |
| `/api/admin/users`                    | GET       | Yes (ADMIN)       | Admin: List all users                |
| `/api/auth/register`                  | POST      | No                | Create account + send verification   |
| `/api/auth/verify-email`              | POST      | No                | Verify email token                   |
| `/api/companies`                      | GET       | No                | Get company data                     |
| `/api/tags`                           | GET       | No                | Get problem tags                     |

## 🔒 Security

- **Email Verification**: Required for code submissions (OAuth auto-verified)
- **Rate Limiting**: In-memory rate limiter with cleanup
  - Default: 100 requests/min per IP
  - Submissions: 1/min per user
  - Hints: 5/min per user
  - Problems: 30/min per IP
- **Authentication**: NextAuth.js v5 with JWT sessions (no polling)
- **Authorization**: Role-based access control (USER/ADMIN)
- **Public Viewing**: Problems and submissions viewable without auth
- **Protected Actions**: Submissions and hints require verified email
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

- **User**: Authentication, gamification stats (xp, streak, level), emailVerified
- **Problem**: Title, description, test cases, difficulty, isPremium, publishedAt
- **Submission**: Code, verdict, runtime, memory
- **Achievement**: Badges and milestones
- **Hint**: AI-generated hints with rate limiting
- **VerificationToken**: Email verification tokens (identifier + token composite key)

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
- **Resend** for email delivery service
- **shadcn/ui** for beautiful component library
- **Vercel** for hosting platform
- **Neon** for serverless PostgreSQL

---

**Built with ❤️ for developers by developers**

⭐ Star this repo if you find it helpful!
