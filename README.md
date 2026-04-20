# EduCore School Management System

A production-ready School Management System built with Node.js, Express, TypeScript, and React.

## Project Structure

```
educore/
|-- backend/          # Node.js + Express + TypeScript API
|-- frontend/         # React + TypeScript + Vite (to be added)
```

## Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check

## Development Phases

1. Phase 1: Backend setup (Express + TypeScript) - COMPLETED
2. Phase 2: Supabase connection
3. Phase 3: Authentication system
4. Phase 4: Role-based middleware
5. Phase 5: Students module
6. Phase 6: Remaining backend modules
7. Phase 7+: Frontend development

## Tech Stack

**Backend:**
- Node.js 20
- Express.js
- TypeScript (strict mode)
- Supabase (PostgreSQL)
- Custom JWT
- Zod validation

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Axios
