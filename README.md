# GEMINI Project Analysis: Prof Trading Course

## Project Overview

This is a monorepo for an interactive Forex trading education platform. The project uses a modern web development stack, with a Next.js frontend and a Supabase backend. The codebase is well-documented, with detailed architecture and tech stack information in the `/docs` directory.

The project is structured as a pnpm workspace monorepo managed by Turborepo. It consists of a main web application (`apps/web`) and several shared packages (`packages/*`).

- **`apps/web`**: The main Next.js 14 application, using the App Router. This is where the main user-facing application lives.
- **`packages/db`**: Contains the database schema (Supabase migrations) and client.
- **`packages/types`**: Shared TypeScript types for the entire project.
- **`packages/ui`**: A shared component library.
- **`content`**: Contains the course content in MDX format, structured into modules, units, and lessons.

## Building and Running

The project uses `pnpm` as its package manager.

- **Install dependencies:**
  ```bash
  pnpm install
  ```

- **Run the development server:**
  ```bash
  pnpm dev
  ```

- **Build for production:**
  ```bash
  pnpm build
  ```

- **Lint the code:**
  ```bash
  pnpm lint
  ```

- **Typecheck the code:**
  ```bash
  pnpm typecheck
  ```

## Development Conventions

### Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Backend:** Supabase (Postgres, Auth, Storage)
- **Styling:** Tailwind CSS with `shadcn/ui` components
- **State Management:** Zustand for global client state
- **Forms:** React Hook Form with Zod for validation
- **Content:** MDX files in the `/content` directory, rendered with `next-mdx-remote`
- **Animations:** Framer Motion, GSAP, and D3.js

### Code Structure

- The application is divided into route groups: `(marketing)`, `(auth)`, `(dashboard)`, and `(course)`.
- Shared components are located in `packages/ui/src/components`.
- App-specific components are in `apps/web/src/components`.
- Utility functions and hooks are in `apps/web/src/lib` and `apps/web/src/hooks` respectively.

### Content Management

- Course content is managed in the `/content` directory.
- The structure is `module > unit > lesson`.
- Each module and unit has a `_meta.json` file that defines its properties and order.
- Lessons are written in MDX and can include interactive components.

### Database

- The database schema is managed with Supabase migrations located in `packages/db/supabase/migrations`.
- Row Level Security (RLS) is used to protect data.
- The full schema is documented in `packages/db/prisma/schema.prisma`.

### Documentation

The `/docs` directory is the source of truth for project documentation. Key documents include:

- `architecture.md`: High-level overview of the project structure.
- `tech_stack.md`: Detailed list of all technologies used and their configuration.
- `database.md`: Information about the database schema and policies.
