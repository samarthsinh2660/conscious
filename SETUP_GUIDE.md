# Quick Setup Guide - Consciousness App

Follow these steps to get your Consciousness App running locally.

## Step 1: Install Dependencies

### Backend
```bash
cd Backend
npm install
```

### Frontend
```bash
cd Frontend
npm install
```

## Step 2: Set Up Supabase Database

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once created, go to **SQL Editor** and run these commands:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  self_introduction TEXT,
  good_qualities TEXT,
  bad_qualities TEXT,
  life_goals TEXT,
  challenges TEXT,
  additional_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Daily reflections table
CREATE TABLE daily_reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reflection_date DATE NOT NULL,
  day_summary TEXT,
  social_media_time TEXT,
  truthfulness_kindness TEXT,
  conscious_actions TEXT,
  overthinking_stress TEXT,
  gratitude_expression TEXT,
  proud_moment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, reflection_date)
);

-- AI analysis table
CREATE TABLE ai_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reflection_id UUID REFERENCES daily_reflections(id) ON DELETE CASCADE,
  analysis_text TEXT NOT NULL,
  recommendations TEXT,
  motivational_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Get your credentials from **Project Settings > API**:
   - Project URL (SUPABASE_URL)
   - anon/public key (SUPABASE_ANON_KEY)
   - service_role key (SUPABASE_SERVICE_ROLE_KEY)

## Step 3: Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated key

## Step 4: Configure Environment Variables

### Backend/.env
```env
PORT=5000
NODE_ENV=development

# Supabase credentials from Step 2
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Generate a random secret (use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_random_secret_here
JWT_EXPIRES_IN=7d

# Gemini API key from Step 3
GEMINI_API_KEY=your_gemini_api_key_here

FRONTEND_URL=http://localhost:5173
```

### Frontend/.env
```env
VITE_API_URL=http://localhost:5000/api
```

## Step 5: Run the Application

Open two terminal windows:

### Terminal 1 - Backend
```bash
cd Backend
npm run dev
```

You should see: `🚀 Server running on http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd Frontend
npm run dev
```

You should see: `Local: http://localhost:5173/`

## Step 6: Test the Application

1. Open browser to `http://localhost:5173`
2. Click "Sign Up" and create an account
3. Complete the onboarding questionnaire
4. You'll be redirected to the dashboard
5. Click "Start Daily Reflection" to test the reflection form
6. Submit and wait for AI analysis (takes ~5-10 seconds)

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify all environment variables are set
- Check Supabase credentials are correct

### Frontend won't start
- Check if port 5173 is available
- Verify `VITE_API_URL` is correct
- Run `npm install` again

### Database errors
- Verify all tables are created in Supabase
- Check service_role key has proper permissions
- Ensure table names match exactly

### AI analysis not working
- Verify Gemini API key is valid
- Check API key has proper permissions
- Look at backend console for error messages

### Authentication issues
- Clear browser localStorage
- Check JWT_SECRET is set
- Verify token is being sent in requests

## Production Deployment

### Backend
1. Deploy to Railway/Render/Heroku
2. Set all environment variables
3. Update `FRONTEND_URL` to production domain

### Frontend
1. Run `npm run build`
2. Deploy `dist/` folder to Vercel/Netlify
3. Set `VITE_API_URL` to production API URL

## Need Help?

Check the detailed README files:
- Main: `/README.md`
- Backend: `/Backend/README.md`
- Frontend: `/Frontend/README.md`

## Quick Commands Reference

```bash
# Backend
cd Backend
npm install          # Install dependencies
npm run dev         # Start development server
npm start           # Start production server

# Frontend
cd Frontend
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build

# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Default Ports

- Backend API: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## What's Next?

After setup:
1. Create your account
2. Complete onboarding
3. Submit your first daily reflection
4. Explore the dashboard and progress tracking
5. Review AI insights and recommendations

Enjoy your journey to self-awareness! 🧠✨
