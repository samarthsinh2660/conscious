# Consciousness App - Backend API

Production-ready Node.js/Express backend with clean architecture, repository pattern, and service layer.

## Architecture

```
src/
├── config/           # Configuration files
│   ├── database.js   # Supabase client
│   └── gemini.js     # Gemini AI client
├── controllers/      # Request handlers
│   ├── analysis.controller.js
│   └── reflection.controller.js
├── database/         # Database schemas
│   └── schema.sql    # Complete SQL schema
├── middleware/       # Express middleware
│   ├── auth.middleware.js
│   └── validation.middleware.js
├── modules/          # Feature modules
│   ├── auth/
│   │   ├── auth.controller.js
│   │   └── auth.routes.js
│   └── profile/
│       ├── profile.controller.js
│       └── profile.routes.js
├── repositories/     # Data access layer
│   ├── user.repository.js
│   ├── profile.repository.js
│   ├── reflection.repository.js
│   └── analysis.repository.js
├── routes/           # Route definitions
│   ├── index.js
│   ├── reflection.routes.js
│   └── analysis.routes.js
├── services/         # Business logic layer
│   ├── auth.service.js
│   ├── profile.service.js
│   ├── reflection.service.js
│   ├── analysis.service.js
│   └── gemini.service.js
├── utils/            # Utility functions
│   ├── error.js      # Error handling
│   └── auth.js       # Auth utilities
└── server.js         # Entry point
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in your credentials:
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
Run the complete schema from `src/database/schema.sql` in your Supabase SQL Editor.

This will create:
- All required tables with proper relationships
- Indexes for performance
- Triggers for auto-updating timestamps

### 4. Get Gemini API Key
1. Visit https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add it to your `.env` file

### 5. Run the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### User Profile (Onboarding)
- `POST /api/profile` - Create/Update user profile (protected)
- `GET /api/profile` - Get user profile (protected)

### Daily Reflections
- `POST /api/reflections` - Submit daily reflection (protected)
- `GET /api/reflections` - Get all user reflections (protected)
- `GET /api/reflections/:id` - Get specific reflection (protected)
- `GET /api/reflections/today` - Check if today's reflection exists (protected)

### AI Analysis
- `GET /api/analysis/:reflectionId` - Get AI analysis for a reflection (protected)
- `GET /api/analysis/latest` - Get latest AI analysis (protected)
- `GET /api/analysis/all` - Get all analyses (protected)

## Architecture Patterns

### Repository Pattern
All database queries are in repository files. Controllers never directly access the database.

```javascript
// repositories/user.repository.js
export const userRepository = {
  async create(userData) { /* SQL query */ },
  async findByEmail(email) { /* SQL query */ },
  async findById(id) { /* SQL query */ }
};
```

### Service Layer
Business logic is in service files. Services use repositories for data access.

```javascript
// services/auth.service.js
export const authService = {
  async register(userData) {
    // Business logic
    const user = await userRepository.create(userData);
    return user;
  }
};
```

### Controller Layer
Controllers handle HTTP requests/responses. They call services for business logic.

```javascript
// controllers/auth.controller.js
export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});
```

### Error Handling
Centralized error handling with custom error classes.

```javascript
// utils/error.js
export class AppError extends Error { /* ... */ }
export class ValidationError extends AppError { /* ... */ }
export const errorHandler = (err, req, res, next) => { /* ... */ };
```

### Async Handler
Wraps async functions to catch errors automatically.

```javascript
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

## Key Features

### Gemini AI Integration
- Prompt engineering in `services/gemini.service.js`
- Context-aware analysis using user profile + reflection history
- Structured response parsing

### Security
- JWT token authentication
- Password hashing with bcryptjs
- Input validation on all endpoints
- Protected routes
- CORS configuration

### Database
- PostgreSQL via Supabase
- Proper foreign key relationships
- Indexes for performance
- Triggers for auto-updates
- Unique constraints for business rules

### Code Quality
- Clean separation of concerns
- Repository pattern for data access
- Service layer for business logic
- Centralized error handling
- Async/await throughout
- No SQL in controllers
