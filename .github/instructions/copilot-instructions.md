# Copilot Instructions for EduVibe

## Project Overview
EduVibe is a Next.js 15 educational platform using Turbopack, Prisma with SQLite, shadcn/ui components, and Tailwind CSS. The app features a home page marketing site and a sample management system for learning/demonstration purposes.

## Architecture & Key Patterns

### Database & Data Management
- **Prisma Setup**: Custom output directory at `lib/generated/prisma/` with auto-generation on dev start
- **Database**: SQLite with a `Sample` model (id: String @id @default(cuid()), createdAt, updatedAt)
- **Client Pattern**: Global singleton pattern in `lib/prisma.ts` prevents multiple instances in development
- **Server Actions**: Located in `server/actions/` using "use server" directive with proper error handling and `revalidatePath`

### UI Component Architecture
- **shadcn/ui**: New York style with CSS variables, RSC-enabled components in `components/ui/`
- **Styling**: Tailwind CSS v4 with `cn()` utility function using `clsx` and `tailwind-merge`
- **Icons**: Lucide React icons throughout the app
- **Forms**: React Hook Form with Zod validation (dependencies installed but not actively used in current sample)

### Next.js App Router Patterns
- **Layout**: Simple root layout with Geist fonts and global CSS
- **Pages**: App router structure with component-based pages
- **Client Components**: Use "use client" for interactivity (SampleView, HomePage)
- **Server Components**: Default pattern for static content and data fetching

## Development Workflow

### Essential Commands
```bash
npm run predev    # Auto-runs before dev to generate Prisma client
npm run dev       # Start with Turbopack (--turbopack flag)
```

### Component Development
- UI components follow shadcn/ui patterns with Radix UI primitives
- Use `cn()` utility for conditional styling: `cn("base-classes", conditionalClasses)`
- Icons from lucide-react, prefer semantic naming (BookOpen, Users, etc.)
- **Documentation**: Use JSDoc style comments for all functions, components, and complex logic

### Data Operations
- Server Actions return `{ success: true, data? }` or `{ error: string }` format
- Always call `revalidatePath("/")` after mutations
- Use `startTransition` + `useTransition` for optimistic updates in client components

### Styling Conventions
- Color scheme: Indigo primary (`indigo-600`, `indigo-700`) with neutral grays
- Dark mode support using Tailwind dark: variants
- Responsive design: Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- Card-based layouts with hover effects for interactive elements

## File Structure & Organization
```
app/                 # Next.js app router
components/
  ├── ui/           # shadcn/ui components
  └── [pages].tsx   # Page-specific components
lib/
  ├── generated/    # Prisma client (don't edit)
  ├── prisma.ts     # Database client
  └── utils.ts      # Utility functions
server/actions/     # Server Actions
prisma/
  ├── schema.prisma # Database schema (NOTE: may be missing models)
  └── dev.db        # SQLite database
```

## Common Patterns & Anti-Patterns

### Date Handling
```tsx
// Use server-safe formatting to prevent hydration issues
const formatDate = (date: Date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
```

### Error Handling
- Server Actions: Try/catch with user-friendly error messages
- Client: Display errors in UI with proper styling (`bg-red-50 p-2 text-sm text-red-600`)
- Loading States: Use `isPending` from `useTransition` for disabled states

### Form Handling
- Use FormData for server actions, not controlled inputs for simple forms
- Provide immediate feedback and reset forms after successful submission

### Code Documentation
- **JSDoc Comments**: Required for all exported functions, components, and complex utility functions
- Document parameters, return values, and usage examples where helpful
- Use `@param`, `@returns`, `@example` tags consistently

## Development Notes
- The Prisma schema may be incomplete - check generated files for actual model structure
- Environment variables expected: `DATABASE_URL` for SQLite connection
- Component library is ready for form validation but not currently implemented
- Home page is a static marketing page; core functionality is in sample management
