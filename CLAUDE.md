# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite hot reloading
- `npm run build` - Build for production (TypeScript compile + Vite build)
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview the production build locally

## Project Architecture

This is a React 19 + TypeScript + Vite application using modern tooling:

- **UI Framework**: Tailwind CSS v4 with shadcn/ui components
- **State Management**: React hooks (currently useState for demo functionality)
- **Component Library**: shadcn/ui pattern with Radix UI primitives
- **Icons**: lucide-react
- **Styling**: Tailwind CSS with utility-first approach

## Code Organization

- `src/App.tsx` - Main application component (currently a shadcn/ui demo)
- `src/components/ui/` - Reusable UI components following shadcn/ui patterns
- `src/lib/utils.ts` - Utility functions, includes `cn()` for className merging
- Path alias `@/` maps to `src/` directory

## Key Conventions

- Components use shadcn/ui patterns with `cva` (class-variance-authority) for variants
- TypeScript is configured with strict mode and path mapping
- All components should use the `cn()` utility for className composition
- ESLint enforces React hooks rules and React Refresh compatibility