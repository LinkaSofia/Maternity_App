# BabyJourney - Pregnancy Tracking Application

## Overview

BabyJourney is a comprehensive pregnancy tracking application that helps expecting mothers monitor their pregnancy journey. The application provides features for tracking pregnancy progress, maintaining a diary, monitoring appointments, and accessing educational content. It uses a modern full-stack architecture with React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preference: More colorful and vibrant landing page with mother-baby imagery, showing more life and warmth.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage

### Mobile-First Design
- Responsive design optimized for mobile devices
- Mobile-specific breakpoints and touch interactions
- Progressive Web App capabilities

## Key Components

### Authentication System
- **Provider**: Replit Auth using OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **User Management**: Automatic user creation and profile management
- **Security**: HTTP-only cookies with secure flag for production

### Database Schema
- **Users**: Profile information and authentication data
- **Pregnancies**: Pregnancy tracking with LMP, due dates, and weight monitoring
- **Diary Entries**: Personal journal entries with mood tracking and tags
- **Appointments**: Healthcare appointment scheduling and tracking
- **Weight Entries**: Weight monitoring throughout pregnancy
- **Baby Development**: Weekly development milestones and information

### Core Features
1. **Pregnancy Progress Tracking**
   - Weekly progress calculation based on Last Menstrual Period (LMP)
   - Visual progress indicators and milestone tracking
   - Baby size comparisons with fruit analogies

2. **Diary System**
   - Personal journal entries with rich text support
   - Mood tracking and tagging system
   - Search functionality for past entries

3. **Appointment Management**
   - Healthcare appointment scheduling
   - Upcoming appointment reminders
   - Appointment history tracking

4. **Educational Content**
   - Weekly pregnancy tips and information
   - Health reminders and guidelines
   - Baby development information

## Data Flow

### Authentication Flow
1. User attempts to access protected routes
2. Replit Auth redirects to OpenID Connect provider
3. User authenticates and returns with tokens
4. Session is created and stored in PostgreSQL
5. User profile is created or updated in database

### Pregnancy Tracking Flow
1. User creates pregnancy record with LMP date
2. System calculates current week and due date
3. Progress is calculated and displayed with visual indicators
4. Weekly content is fetched and displayed based on current week

### Diary Entry Flow
1. User creates diary entries through form interface
2. Entries are validated and stored with user association
3. Entries can be searched, filtered, and retrieved
4. Mood and tags are tracked for analytics

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database queries and migrations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight client-side routing
- **date-fns**: Date manipulation and formatting

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Variant-based component styling
- **lucide-react**: Icon library

### Authentication Dependencies
- **openid-client**: OpenID Connect client implementation
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with HMR
- **Type Checking**: TypeScript compilation with strict mode
- **Database**: Local PostgreSQL with migrations via Drizzle
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPLIT_DOMAINS

### Production Build
- **Frontend**: Vite build with optimizations and code splitting
- **Backend**: esbuild compilation to ESM format
- **Database**: Neon Database with connection pooling
- **Static Assets**: Served from dist/public directory

### Environment Configuration
- **Development**: NODE_ENV=development with detailed logging
- **Production**: NODE_ENV=production with error handling
- **Database**: Automatic migrations on startup
- **Sessions**: Secure cookies with appropriate expiration

### Performance Considerations
- **Query Optimization**: React Query with infinite stale time
- **Bundle Optimization**: Vite's automatic code splitting
- **Image Optimization**: Responsive images with proper sizing
- **Caching**: Server-side caching for static content

The application is designed to be deployed on Replit with automatic database provisioning and authentication integration. The mobile-first approach ensures optimal performance on mobile devices while maintaining desktop compatibility.