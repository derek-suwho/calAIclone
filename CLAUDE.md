# CalAI Clone - Project Overview

## Project Structure

This is a CalAI (Calorie AI) clone built with Next.js 15, featuring a modern dashboard for calorie tracking and nutrition management.

### Main Directory Structure
```
calAIclone/
├── calai-clone/           # Main Next.js application
│   ├── src/app/           # Next.js app directory
│   │   ├── page.tsx       # Main dashboard component
│   │   ├── layout.tsx     # Root layout
│   │   └── globals.css    # Global styles
│   ├── prisma/            # Database schema and migrations
│   │   └── schema.prisma  # Prisma schema (SQLite)
│   ├── public/            # Static assets (SVG icons)
│   └── package.json       # Dependencies and scripts
├── prisma/                # Additional Prisma files
├── src/                   # Additional source files
└── vercel.json           # Vercel deployment configuration
```

## Technology Stack

### Frontend
- **Next.js 15.4.5** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling framework
- **Framer Motion 12** - Animations
- **Lucide React** - Icon library

### UI Components
- **Radix UI** - Accessible UI primitives
  - Dialog, Progress, Tabs components
- **Class Variance Authority** - Component variants
- **clsx & tailwind-merge** - Conditional styling

### Database
- **Prisma 6.13.0** - ORM and database toolkit
- **SQLite** - Database (development)

### Development Tools
- **ESLint 9** - Code linting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundler (Next.js)

## Key Features

### Dashboard Components
The main dashboard (`src/app/page.tsx`) includes:

1. **Header** - App logo and user profile
2. **Date Display** - Current date formatting
3. **Calorie Summary Card**
   - Progress ring (69% completion)
   - Calorie tracking (1,247 consumed, 553 remaining)
   - Macronutrient breakdown (Protein, Carbs, Fat)
4. **Quick Actions**
   - Scan Food (camera integration)
   - Search Foods
5. **Tabbed Navigation**
   - Diary (meal logging)
   - Progress (weight tracking)
   - Water (hydration tracking)

### Meal Tracking
- Breakfast, Lunch, Dinner, Snacks sections
- Add food functionality
- Sample entries (Oatmeal with berries, Greek yogurt)

### Progress Tracking
- Weight progress monitoring
- Goal progress visualization
- Target weight tracking (70kg goal)

### Water Intake
- Daily water goal (2.5L)
- Visual glass tracking system
- Add glass functionality

## Development Commands

```bash
# Install dependencies
cd calai-clone && npm install

# Development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Database Setup

The project uses Prisma with SQLite:
- Schema location: `calai-clone/prisma/schema.prisma`
- Generated client: `src/generated/prisma/`
- Database file: `prisma/dev.db`

## Deployment

Configured for Vercel deployment with:
- Build command: `cd calai-clone && npm run build`
- Dev command: `cd calai-clone && npm run dev`
- Output directory: `calai-clone/.next`

## Current State

The project appears to be in early development with:
- ✅ Basic Next.js setup complete
- ✅ Modern UI dashboard implemented
- ✅ Prisma database schema configured
- ✅ Core UI components and styling
- 🔄 Database integration pending
- 🔄 Food scanning functionality pending
- 🔄 User authentication pending
- 🔄 Data persistence pending

## Git Status

- Current branch: `main`
- Recent commit: "Initial commit: CalAI clone setup with dashboard UI"
- Untracked files: `.env`, additional `prisma/` and `src/` directories

## Next Steps

To continue development:
1. Set up database connection and environment variables
2. Implement food data models in Prisma schema
3. Add API routes for CRUD operations
4. Integrate camera/image upload functionality
5. Add user authentication system
6. Connect UI components to backend data