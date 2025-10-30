# Consciousness App - Frontend

A modern React application for daily self-reflection and personal growth tracking with AI-powered insights.

## Features

- **Authentication**: Secure login and registration system
- **Onboarding**: Personalized questionnaire to understand user background
- **Daily Reflections**: 7 thoughtful questions for end-of-day reflection
- **AI Insights**: Gemini AI-powered analysis and recommendations
- **Progress Tracking**: Visual charts and statistics
- **Reflection History**: Browse and review past reflections
- **Modern UI**: Clean, professional design with smooth animations

## Tech Stack

- **React 19** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Vite** - Build tool

## Project Structure

```
src/
├── app/                    # App core setup
│   ├── App.jsx            # Root component
│   └── main.jsx           # Entry point
├── api/                   # API layer
│   ├── axios.js           # Axios instance
│   ├── auth.api.js        # Auth endpoints
│   ├── profile.api.js     # Profile endpoints
│   ├── reflection.api.js  # Reflection endpoints
│   └── analysis.api.js    # Analysis endpoints
├── modules/               # Feature modules
│   ├── auth/             # Authentication
│   ├── onboarding/       # User onboarding
│   └── dashboard/        # Main dashboard
├── routes/               # Routing
│   ├── AppRoutes.jsx     # Main routes
│   └── ProtectedRoute.jsx # Auth guard
├── shared/               # Shared resources
│   ├── components/       # Reusable components
│   └── hooks/           # Custom hooks
└── styles/              # Global styles
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the API URL in `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## Usage

1. **Sign Up/Login**: Create an account or login
2. **Complete Onboarding**: Answer initial questions about yourself
3. **Daily Reflection**: Fill out the 7 daily questions each evening
4. **View Insights**: Get AI-powered analysis and recommendations
5. **Track Progress**: Monitor your growth over time

## Key Components

### Authentication
- Login/Register forms with validation
- JWT token management
- Protected routes

### Onboarding
- 5-question profile setup
- Stores user background for AI context

### Dashboard
- Today's reflection status
- Latest AI insights
- Quick stats

### Reflections
- Daily reflection form (7 questions)
- Reflection history
- Detailed view with AI analysis

### Progress
- Activity charts
- Statistics cards
- Recent insights timeline

## API Integration

All API calls are centralized in the `src/api/` directory. The axios instance automatically:
- Adds authentication tokens
- Handles 401 errors (auto-logout)
- Provides consistent error handling

## Styling

- Custom CSS with modern design system
- Gradient backgrounds
- Smooth transitions
- Responsive layout
- Professional color palette

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
