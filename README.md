# Consciousness App - Self Reflection & Personal Growth

A production-ready full-stack web application that helps users develop self-awareness through daily reflections and AI-powered insights. Built with React, Node.js, Express, PostgreSQL (Supabase), and Google Gemini AI.

## Overview

The Consciousness App guides users through a journey of self-discovery by:
1. **Onboarding**: Understanding user background, goals, and challenges
2. **Daily Reflections**: 7 thoughtful questions answered each evening
3. **AI Analysis**: Personalized insights, recommendations, and motivation from Gemini AI
4. **Progress Tracking**: Visual representation of growth over time

## Architecture

This project follows enterprise-level architecture patterns with clean separation of concerns:

### Backend Architecture
- **Repository Pattern**: All database queries isolated in repository layer
- **Service Layer**: Business logic separated from HTTP handling
- **Controller Layer**: Thin controllers for request/response handling
- **Middleware**: Authentication, validation, and error handling
- **Utilities**: Reusable helper functions for auth and errors

### Frontend Architecture
- **Module-based**: Features organized by domain (auth, onboarding, dashboard)
- **API Layer**: Centralized API calls with axios interceptors
- **Protected Routes**: Authentication guards for secure pages
- **Shared Components**: Reusable UI components and custom hooks

## Features

### 🔐 Authentication
- Secure JWT-based authentication
- Email/password registration and login
- Protected routes and API endpoints

### 📝 Onboarding Questionnaire
- Self-introduction
- Good qualities identification
- Areas for improvement
- Life goals
- Current challenges

### 🌙 Daily Reflections (7 Questions)
1. How was your day?
2. Social media usage and its impact
3. Truthfulness and kindness assessment
4. Conscious vs impulsive actions
5. Overthinking and stress analysis
6. Gratitude expression
7. Proud moments

### 🤖 AI-Powered Insights
- Contextual analysis using user profile and reflection history
- Personalized recommendations
- Motivational messages
- Pattern recognition across multiple days

### 📊 Progress Tracking
- Reflection history
- Activity charts
- Growth statistics
- Insights timeline

## Tech Stack

### Frontend
- **React 19** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Supabase** - PostgreSQL database
- **JWT** - Authentication
- **Gemini AI** - AI analysis
- **bcryptjs** - Password hashing

## Project Structure

```
conscious/
├── Frontend/              # React application
│   ├── src/
│   │   ├── app/          # App setup
│   │   ├── api/          # API layer
│   │   ├── modules/      # Feature modules
│   │   │   ├── auth/
│   │   │   ├── onboarding/
│   │   │   └── dashboard/
│   │   ├── routes/       # Routing
│   │   ├── shared/       # Shared components
│   │   └── styles/       # Global styles
│   └── package.json
│
└── Backend/              # Express API
    ├── src/
    │   ├── config/       # Configuration (database, gemini)
    │   ├── controller/   # HTTP request handlers
    │   ├── database/     # SQL schemas
    │   ├── middleware/   # Auth & validation
    │   ├── repositories/ # Data access layer
    │   ├── routes/       # Route definitions
    │   ├── services/     # Business logic & AI
    │   ├── utils/        # Error handling & auth utilities
    │   └── server.js     # Entry point
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Google Gemini API key

### 1. Clone the Repository

```bash
cd conscious
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create `.env` file:
```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

GEMINI_API_KEY=your_gemini_api_key

FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup

Run the SQL commands from `Backend/README.md` in your Supabase SQL editor to create tables:
- `users`
- `user_profiles`
- `daily_reflections`
- `ai_analysis`

### 4. Frontend Setup

```bash
cd ../Frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

Access the app at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Profile
- `POST /api/profile` - Create/update profile
- `GET /api/profile` - Get user profile

### Reflections
- `POST /api/reflections` - Submit daily reflection
- `GET /api/reflections` - Get all reflections
- `GET /api/reflections/:id` - Get specific reflection
- `GET /api/reflections/today` - Check today's reflection

### Analysis
- `GET /api/analysis/:reflectionId` - Get analysis for reflection
- `GET /api/analysis/latest` - Get latest analysis
- `GET /api/analysis/all` - Get all analyses

## Database Schema

### users
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- full_name (VARCHAR)
- created_at, updated_at (TIMESTAMP)

### user_profiles
- id (UUID, PK)
- user_id (UUID, FK)
- self_introduction (TEXT)
- good_qualities (TEXT)
- bad_qualities (TEXT)
- life_goals (TEXT)
- challenges (TEXT)
- additional_info (JSONB)
- created_at, updated_at (TIMESTAMP)

### daily_reflections
- id (UUID, PK)
- user_id (UUID, FK)
- reflection_date (DATE)
- day_summary (TEXT)
- social_media_time (TEXT)
- truthfulness_kindness (TEXT)
- conscious_actions (TEXT)
- overthinking_stress (TEXT)
- gratitude_expression (TEXT)
- proud_moment (TEXT)
- created_at (TIMESTAMP)

### ai_analysis
- id (UUID, PK)
- user_id (UUID, FK)
- reflection_id (UUID, FK)
- analysis_text (TEXT)
- recommendations (TEXT)
- motivational_message (TEXT)
- created_at (TIMESTAMP)

## Key Features Implementation

### AI Analysis Flow
1. User submits daily reflection
2. Backend retrieves user profile (context)
3. Backend fetches previous reflections (patterns)
4. Gemini AI generates personalized analysis
5. Analysis stored and returned to user

### Authentication Flow
1. User registers/logs in
2. JWT token generated
3. Token stored in localStorage
4. Token sent with each API request
5. Backend validates token on protected routes

### Onboarding Flow
1. User completes registration
2. Redirected to onboarding page
3. Fills out 5 profile questions
4. Profile saved to database
5. Redirected to dashboard

## Production Deployment

### Backend
- Deploy to services like Railway, Render, or Heroku
- Set environment variables
- Ensure Supabase is accessible

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or similar
- Update `VITE_API_URL` to production API

## Security Considerations

- Passwords hashed with bcryptjs
- JWT tokens for authentication
- Environment variables for secrets
- CORS configured for frontend URL
- Input validation on all endpoints
- SQL injection prevention via Supabase client

## Future Enhancements

- Email notifications
- Streak tracking
- Social features (optional sharing)
- Mobile app
- Advanced analytics
- Goal setting and tracking
- Mood tracking
- Export data feature

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
