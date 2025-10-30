# Consciousness App - Backend API

Production-ready Node.js/Express backend with enterprise-level architecture patterns: clean separation of concerns, repository pattern, service layer, and centralized error handling.

## Architecture Overview

This backend follows a layered architecture pattern:

```
Request → Middleware → Controller → Service → Repository → Database
                                ↓
                            Response
```

### Layer Responsibilities

1. **Controllers** - Handle HTTP requests/responses, extract data, call services
2. **Services** - Business logic, data validation, orchestrate repositories
3. **Repositories** - Database queries only (CRUD operations)
4. **Utilities** - Reusable helper functions (auth, errors)
5. **Middleware** - Authentication, validation, error handling

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── database.js   # Supabase client
│   └── gemini.js     # Gemini AI client
├── controller/       # HTTP request handlers
│   ├── auth.controller.js
│   ├── profile.controller.js
│   ├── analysis.controller.js
│   └── reflection.controller.js
├── database/         # Database schemas
│   └── schema.sql    # Complete SQL schema with triggers
├── middleware/       # Express middleware
│   ├── auth.middleware.js
│   └── validation.middleware.js
├── repositories/     # Data access layer (SQL queries)
│   ├── user.repository.js
│   ├── profile.repository.js
│   ├── reflection.repository.js
│   └── analysis.repository.js
├── routes/           # Route definitions
│   ├── index.js      # Main router
│   ├── auth.routes.js
│   ├── profile.routes.js
│   ├── reflection.routes.js
│   └── analysis.routes.js
├── services/         # Business logic layer
│   ├── auth.service.js
│   ├── profile.service.js
│   ├── reflection.service.js
│   ├── analysis.service.js
│   └── gemini.service.js  # AI prompts & logic
├── utils/            # Utility functions
│   ├── error.js      # Error classes & handler
│   └── auth.js       # JWT & password utilities
└── server.js         # Application entry point
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

### 1. Repository Pattern
All database queries are isolated in repository files. Controllers never directly access the database.

**Benefits:**
- Single source of truth for data access
- Easy to test and mock
- Easy to switch databases
- Reusable query functions

```javascript
// repositories/user.repository.js
class UserRepository {
  async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  
  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }
}

export default new UserRepository();
```

### 2. Service Layer
Business logic is in service files. Services use repositories for data access and contain no HTTP handling.

**Benefits:**
- Business logic separated from HTTP concerns
- Reusable across different controllers
- Easy to test independently
- Clear single responsibility

```javascript
// services/auth.service.js
class AuthService {
  async register(userData) {
    // Check business rules
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('User already exists');
    }
    
    // Hash password
    const hashedPassword = await hashPassword(userData.password);
    
    // Create user
    const user = await userRepository.create({
      ...userData,
      password_hash: hashedPassword
    });
    
    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });
    
    return { token, user };
  }
}

export default new AuthService();
```

### 3. Controller Layer
Controllers are thin layers that handle HTTP requests/responses. They call services for business logic.

**Benefits:**
- Simple and focused
- Easy to understand
- Minimal logic
- Clear HTTP handling

```javascript
// controllers/auth.controller.js
export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});
```

### 4. Error Handling
Centralized error handling with custom error classes and async handler wrapper.

**Benefits:**
- Consistent error responses
- Proper HTTP status codes
- Automatic error catching
- Clean error messages

```javascript
// utils/error.js
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

### 5. Gemini AI Service
Centralized AI prompt engineering and response parsing.

**Benefits:**
- Easy to modify prompts in one place
- Structured prompt building
- Consistent response parsing
- Error handling for AI failures

```javascript
// services/gemini.service.js
class GeminiService {
  async generateReflectionAnalysis(userProfile, currentReflection, previousReflections) {
    const prompt = this.buildAnalysisPrompt(userProfile, currentReflection, previousReflections);
    const result = await model.generateContent(prompt);
    return this.parseAnalysisResponse(result);
  }
  
  buildAnalysisPrompt(profile, reflection, history) {
    return `Context: ${profile.self_introduction}\n\nCurrent: ${reflection.day_summary}\n\nAnalyze...`;
  }
}

export default new GeminiService();
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
- Class-based architecture with singleton pattern
- JSDoc documentation
- Consistent error responses

## Data Flow Example

### Creating a Daily Reflection:

1. **Route** → `POST /api/reflections`
2. **Middleware** → `authenticateToken` validates JWT
3. **Middleware** → `validate` checks input with express-validator
4. **Controller** → `createReflection` extracts user ID and body
5. **Service** → `reflectionService.createReflection()`
   - Checks if today's reflection already exists (business rule)
   - Calls repository to create reflection
   - Triggers AI analysis asynchronously
6. **Repository** → `reflectionRepository.create()`
   - Executes Supabase INSERT query
   - Returns created reflection
7. **Service** → `geminiService.generateReflectionAnalysis()`
   - Fetches user profile for context
   - Fetches previous reflections for patterns
   - Builds AI prompt with all context
   - Calls Gemini API
   - Parses structured response
8. **Repository** → `analysisRepository.create()`
   - Stores AI analysis in database
9. **Controller** → Returns JSON response with reflection

## Benefits of This Architecture

### ✅ Maintainability
- Clear separation of concerns
- Easy to find and modify code
- Each file has single responsibility
- Consistent patterns throughout

### ✅ Testability
- Services can be unit tested independently
- Repositories can be mocked easily
- Controllers are thin and simple
- Business logic isolated from HTTP

### ✅ Scalability
- Easy to add new features
- Easy to modify existing features
- Clear patterns to follow
- Modular structure

### ✅ Security
- Centralized auth logic
- Consistent error handling
- Input validation at multiple layers
- No SQL injection (Supabase client)

### ✅ Team Collaboration
- Clear folder structure
- Consistent patterns
- Easy onboarding for new developers
- Self-documenting code
