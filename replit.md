# Heyo Notes - Romantic Note-Taking Web App

## Overview

Heyo Notes is a romantic, Netflix-inspired note-taking web application built with a modern full-stack architecture. The application provides a simple, beautiful interface for creating and managing personal notes with an emphasis on emotional design and smooth user experience. The app features a cinematic aesthetic with bold typography, spacious layouts, and gentle animations that create an intimate, personal feel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR and optimized production builds
- Wouter for lightweight client-side routing (replacing React Router)
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)

**UI Component System**
- shadcn/ui component library with Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom design tokens
- Custom design system following "New York" style variant
- Extensive use of CSS variables for theming (HSL color format with alpha channel support)

**Design Philosophy**
- Netflix-inspired romantic aesthetic with cinematic feel
- Typography hierarchy using Playfair Display (serif) for romantic headlines and Inter/Poppins for body text
- Consistent spacing system using Tailwind units (4, 6, 8, 12, 16, 24)
- Smooth transitions and animations using Framer Motion
- Dark mode as default with light mode support

**State Management**
- TanStack Query (React Query) for server state management
- Custom query client with infinite stale time and disabled auto-refetch
- React Hook Form with Zod validation for form state and validation
- Local component state using React hooks

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server framework
- Node.js runtime with ES modules (type: "module")
- Custom logging middleware tracking request duration and responses
- Static file serving for production builds

**API Design**
- RESTful API endpoints under `/api` namespace
- Routes organized in centralized `routes.ts` file
- Storage abstraction layer (`IStorage` interface) for data operations
- Zod schema validation for request payloads

**Data Layer**
- Storage interface pattern allowing for implementation swapping
- `DatabaseStorage` class implementing `IStorage` interface
- Separation of concerns: routes handle HTTP, storage handles data access

### Database & ORM

**Database Technology**
- PostgreSQL via Neon serverless driver
- WebSocket-based connection pooling for serverless environments
- Environment-based configuration via `DATABASE_URL`

**ORM & Schema**
- Drizzle ORM for type-safe database operations
- Schema-first approach with TypeScript inference
- Shared schema definitions between client and server (`shared/schema.ts`)
- Drizzle-Zod integration for automatic validation schema generation
- Migration management via Drizzle Kit

**Data Models**
- `users` table: id (UUID), username (unique), password
- `notes` table: id (UUID), title, content, createdAt (timestamp)
- Default UUID generation using PostgreSQL's `gen_random_uuid()`

### Build & Deployment

**Development Workflow**
- Separate client and server development servers
- Vite dev server with middleware mode integrated into Express
- Hot module replacement (HMR) via WebSocket on `/vite-hmr` path
- TypeScript type checking without emit
- Replit-specific development plugins (cartographer, dev banner, runtime error overlay)

**Production Build**
- Custom build script using esbuild for server bundling
- Vite build for client assets
- Server bundled as single CJS file in `dist/index.cjs`
- Client built to `dist/public` directory
- Selective dependency bundling (allowlist pattern for tree-shaking optimization)
- External dependencies for faster cold starts

### Form Handling & Validation

**Validation Strategy**
- Zod schemas as single source of truth for data validation
- `drizzle-zod` generates insert schemas from database schema
- Extended validation rules in frontend (e.g., minimum length requirements)
- React Hook Form integration via `@hookform/resolvers/zod`
- Consistent error handling between client and server

### Code Organization

**Directory Structure**
- `/client` - Frontend React application
  - `/src/pages` - Route components (home, create-note, notes-list, note-detail)
  - `/src/components/ui` - shadcn/ui components
  - `/src/lib` - Utility functions and query client
  - `/src/hooks` - Custom React hooks
- `/server` - Backend Express application
  - `index.ts` - Server entry point
  - `routes.ts` - API route definitions
  - `storage.ts` - Data access layer
  - `db.ts` - Database connection
- `/shared` - Shared code between client and server
  - `schema.ts` - Database schema and validation
- `/script` - Build scripts

## External Dependencies

### Database & Infrastructure
- **Neon Serverless PostgreSQL** - Serverless PostgreSQL database with WebSocket support
- **ws** - WebSocket library required by Neon's serverless driver

### UI & Design System
- **shadcn/ui** - Collection of re-usable components built on Radix UI
- **Radix UI** - Comprehensive suite of accessible, unstyled UI primitives (20+ component packages)
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth transitions
- **Lucide React** - Icon library

### Forms & Validation
- **React Hook Form** - Performant form library with validation
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Validation resolver for React Hook Form

### Data Fetching
- **TanStack Query** - Powerful data synchronization and caching for React
- Custom fetch wrapper with credential inclusion and error handling

### Development Tools
- **TypeScript** - Type safety across the stack
- **Vite** - Fast build tool and dev server
- **esbuild** - Extremely fast JavaScript bundler for production
- **Drizzle Kit** - CLI tool for database migrations and schema management
- **tsx** - TypeScript execution environment for Node.js

### Utilities
- **date-fns** - Date utility library
- **nanoid** - Unique ID generator
- **clsx & tailwind-merge** - Utility for conditional CSS class names
- **class-variance-authority** - Type-safe variant management for components