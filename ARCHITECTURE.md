# System Architecture

## Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

1. AUTHENTICATION
   ┌──────────┐
   │  Login/  │ → JWT Token → Store in localStorage
   │ Register │
   └──────────┘

2. ONBOARDING (First Time Only)
   ┌─────────────────────────────────────┐
   │  5 Profile Questions:               │
   │  • Self Introduction                │
   │  • Good Qualities                   │
   │  • Areas for Improvement            │
   │  • Life Goals                       │
   │  • Current Challenges               │
   └─────────────────────────────────────┘
                    ↓
            Stored in Database
            (Used as AI Context)

3. DASHBOARD
   ┌─────────────────────────────────────┐
   │  • Today's Reflection Status        │
   │  • Latest AI Insights               │
   │  • Quick Statistics                 │
   │  • Start Reflection Button          │
   └─────────────────────────────────────┘

4. DAILY REFLECTION (Once Per Day)
   ┌─────────────────────────────────────┐
   │  7 Questions:                       │
   │  1. How was your day?               │
   │  2. Social media usage              │
   │  3. Truthfulness & kindness         │
   │  4. Conscious vs impulsive          │
   │  5. Overthinking/stress             │
   │  6. Gratitude expression            │
   │  7. Proud moment                    │
   └─────────────────────────────────────┘
                    ↓
            Submit to Backend
                    ↓
   ┌─────────────────────────────────────┐
   │      AI ANALYSIS GENERATION         │
   │                                     │
   │  Gemini AI processes:               │
   │  • User Profile (context)           │
   │  • Today's Reflection               │
   │  • Previous 7 Days (patterns)       │
   │                                     │
   │  Generates:                         │
   │  • Analysis                         │
   │  • Recommendations                  │
   │  • Motivational Message             │
   └─────────────────────────────────────┘
                    ↓
            Stored in Database
                    ↓
            Displayed to User

5. PROGRESS TRACKING
   ┌─────────────────────────────────────┐
   │  • Reflection History               │
   │  • Activity Charts                  │
   │  • Statistics                       │
   │  • Insights Timeline                │
   └─────────────────────────────────────┘
```

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Auth      │  │  Onboarding  │  │  Dashboard   │         │
│  │   Module     │  │    Module    │  │    Module    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                  │                 │
│         └──────────────────┴──────────────────┘                 │
│                           │                                     │
│                    ┌──────▼──────┐                             │
│                    │  API Layer  │                             │
│                    │   (Axios)   │                             │
│                    └──────┬──────┘                             │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                    HTTP Requests
                    (JWT Token)
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      BACKEND (Express)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Middleware Layer                          │    │
│  │  • CORS                                                │    │
│  │  • JWT Authentication                                  │    │
│  │  • Input Validation                                    │    │
│  └────────────────────────────────────────────────────────┘    │
│                           │                                     │
│  ┌────────────────────────▼────────────────────────────┐       │
│  │              Route Handlers                         │       │
│  │  ┌──────┐  ┌─────────┐  ┌────────────┐  ┌────────┐│       │
│  │  │ Auth │  │ Profile │  │ Reflection │  │Analysis││       │
│  │  └──────┘  └─────────┘  └────────────┘  └────────┘│       │
│  └─────────────────────────────────────────────────────┘       │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │    Supabase      │        │   Gemini AI      │
    │   (PostgreSQL)   │        │   (Analysis)     │
    └──────────────────┘        └──────────────────┘
```

## Data Flow - Daily Reflection

```
User Fills Form
      │
      ▼
Frontend Validation
      │
      ▼
POST /api/reflections
      │
      ▼
Backend Validation
      │
      ▼
Check: Already submitted today?
      │
      ├─ Yes → Return Error
      │
      └─ No → Continue
            │
            ▼
      Save to Database
      (daily_reflections)
            │
            ▼
      Fetch User Profile
      (user_profiles)
            │
            ▼
      Fetch Previous Reflections
      (last 7 days)
            │
            ▼
      Build AI Prompt
      (Profile + Current + History)
            │
            ▼
      Call Gemini AI API
            │
            ▼
      Parse AI Response
      (Analysis, Recommendations, Motivation)
            │
            ▼
      Save AI Analysis
      (ai_analysis)
            │
            ▼
      Return Success
            │
            ▼
      Frontend Displays
      (Analysis Card)
```

## Database Relationships

```
┌──────────────┐
│    users     │
│──────────────│
│ id (PK)      │◄─────────┐
│ email        │          │
│ password_hash│          │
│ full_name    │          │
└──────────────┘          │
                          │
                          │ user_id (FK)
                          │
        ┌─────────────────┼─────────────────┬─────────────────┐
        │                 │                 │                 │
        ▼                 ▼                 ▼                 ▼
┌───────────────┐  ┌──────────────┐  ┌─────────────┐  ┌─────────────┐
│user_profiles  │  │daily_reflect.│  │ai_analysis  │  │ai_analysis  │
│───────────────│  │──────────────│  │─────────────│  │─────────────│
│id (PK)        │  │id (PK)       │  │id (PK)      │  │id (PK)      │
│user_id (FK)   │  │user_id (FK)  │  │user_id (FK) │  │user_id (FK) │
│self_intro     │  │reflect_date  │  │reflect_id(FK)│ │reflect_id(FK)│
│good_qualities │  │day_summary   │◄─┤analysis_text│  │analysis_text│
│bad_qualities  │  │social_media  │  │recommend.   │  │recommend.   │
│life_goals     │  │truthfulness  │  │motivational │  │motivational │
│challenges     │  │conscious_act │  └─────────────┘  └─────────────┘
└───────────────┘  │overthinking  │
                   │gratitude     │
                   │proud_moment  │
                   └──────────────┘

Relationships:
• users → user_profiles (1:1)
• users → daily_reflections (1:many)
• users → ai_analysis (1:many)
• daily_reflections → ai_analysis (1:1)
```

## Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── BrowserRouter
│       └── AppRoutes
│           ├── LoginPage
│           │   ├── LoginForm
│           │   └── RegisterForm
│           │
│           ├── OnboardingPage
│           │   └── (Profile Form)
│           │
│           └── DashboardLayout
│               ├── Sidebar
│               │   └── Navigation
│               │
│               └── DashboardRoutes
│                   ├── DashboardPage
│                   │   ├── DailyReflectionForm (Modal)
│                   │   └── AnalysisCard
│                   │
│                   ├── ReflectionsPage
│                   │   ├── ReflectionCard (Grid)
│                   │   └── DetailModal
│                   │       ├── Reflection Details
│                   │       └── AnalysisCard
│                   │
│                   └── ProgressPage
│                       ├── Stats Cards
│                       ├── Activity Chart
│                       └── Insights Timeline
```

## Security Flow

```
1. User Registration
   Password → bcrypt.hash() → Store hash in DB

2. User Login
   Password → bcrypt.compare(password, hash) → Valid?
                                                   │
                                                   ├─ Yes → Generate JWT
                                                   │         │
                                                   │         └─ Return Token
                                                   │
                                                   └─ No → Return Error

3. Protected Request
   Request → Extract Token → Verify JWT → Valid?
                                             │
                                             ├─ Yes → Process Request
                                             │
                                             └─ No → Return 401

4. Token Storage
   Frontend: localStorage.setItem('token', token)
   
5. Token Usage
   Every API Request:
   Headers: { Authorization: 'Bearer <token>' }
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      PRODUCTION                              │
└─────────────────────────────────────────────────────────────┘

Frontend (Vercel/Netlify)
    │
    │ HTTPS
    │
    ▼
Backend (Railway/Render/Heroku)
    │
    ├─────────────┬─────────────┐
    │             │             │
    ▼             ▼             ▼
Supabase      Gemini AI    Environment
(Database)    (Analysis)    Variables
```

## Key Design Decisions

1. **Domain-Driven Architecture**: Features organized by domain (auth, profile, reflection, analysis)

2. **Separation of Concerns**: Clear boundaries between API layer, business logic, and UI

3. **JWT Authentication**: Stateless, scalable authentication

4. **One Reflection Per Day**: Business rule enforced at database level (UNIQUE constraint)

5. **AI Context Building**: User profile + current + history for personalized insights

6. **Modal-Based Forms**: Better UX for reflection submission and detail viewing

7. **Optimistic Updates**: Show loading states while AI generates analysis

8. **Error Boundaries**: Comprehensive error handling at all levels

9. **Environment-Based Config**: Different settings for dev/prod

10. **Clean Code**: No dummy data, production-ready implementation
