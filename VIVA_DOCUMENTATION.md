# VIVA PRESENTATION - CODE DOCUMENTATION

This document lists all files with detailed comments to help you explain the code during your viva presentation.

## ✅ Files with Complete Comments

### 1. Database & Supabase Integration
- **`lib/db/prisma.ts`** - Supabase PostgreSQL connection using Prisma ORM
  - Explains connection pooling
  - Graceful shutdown for serverless
  - Global client reuse

### 2. Authentication (NextAuth.js v5)
- **`lib/auth/auth.config.ts`** - Authentication configuration
  - Route protection (authorized callback)
  - JWT and Session callbacks
  - Admin vs User role management

- **`lib/auth/auth.ts`** - Authentication providers
  - Google OAuth integration
  - Email/Password (Credentials) login
  - User creation in Supabase for Google sign-ins
  - bcrypt password hashing

### 3. API Routes (RESTful APIs)
- **`app/api/products/route.ts`** - Products API
  - Product filtering (category, search, featured, bestseller)
  - Pagination
  - Database joins (category, reviews)
  - Average rating calculation

- **`app/api/categories/route.ts`** - Categories API
  - Fetch all active categories
  - Alphabetical sorting

- **`app/api/cart/route.ts`** - Shopping Cart API
  - GET: Fetch user's cart
  - POST: Save/update cart
  - DELETE: Clear cart
  - Cart persistence across sessions

## Key Technologies Explained in Comments

### Supabase (Cloud PostgreSQL Database)
- Cloud-hosted database (like Firebase but for SQL)
- Stores all data: users, products, orders, cart, etc.
- Connection pooling for performance

### Prisma ORM
- Object-Relational Mapping tool
- Write database queries in JavaScript instead of raw SQL
- Type-safe database access

### NextAuth.js v5
- Authentication library for Next.js
- Supports multiple login methods (Google OAuth, Email/Password)
- Session management
- Route protection (middleware)

### Next.js 16 App Router
- Server Components (run on server, not browser)
- Client Components ('use client')
- API Routes (/api/*)
- File-based routing

### bcrypt
- Password hashing library
- One-way encryption (can't decrypt, only compare)
- Secure password storage

### Zod
- Input validation library
- Prevents SQL injection and invalid data
- Type-safe validation

## How to Use This for VIVA

### 1. Database & Supabase Questions
**"Explain your database setup"**
→ Open `lib/db/prisma.ts` and explain:
- We use Supabase (PostgreSQL cloud database)
- Prisma ORM for easier database queries
- Connection pooling to handle multiple requests efficiently

### 2. Authentication Questions
**"How does your login system work?"**
→ Open `lib/auth/auth.ts` and explain:
- Two methods: Google OAuth and Email/Password
- Passwords hashed with bcrypt (never stored in plain text)
- Google users automatically created in database
- Separate admin and regular user roles

### 3. API Questions
**"Explain your products API"**
→ Open `app/api/products/route.ts` and explain:
- RESTful API (GET /api/products)
- Supports filtering, search, pagination
- Joins products with categories and reviews
- Calculates average ratings

**"How does the shopping cart work?"**
→ Open `app/api/cart/route.ts` and explain:
- Cart saved in database (not just browser)
- Three operations: GET (fetch), POST (save), DELETE (clear)
- Requires authentication
- Persists across sessions and devices

### 4. Security Questions
**"How do you secure admin pages?"**
→ Open `lib/auth/auth.config.ts` and explain:
- Middleware checks every route
- Admin pages require 'admin' role
- Unauthorized users redirected to signin
- JWT tokens store user role

## Next Steps
More files will be documented with comments:
- Wishlist API
- Homepage and product pages
- Navbar and Footer components
- Admin dashboard

## Tips for Presentation
1. **Don't memorize** - understand the concepts
2. **Follow the comments** - they explain each step
3. **Use real examples** - "When a user adds to cart..."
4. **Show the flow** - "First we check authentication, then..."
5. **Be honest** - If you don't know something, say "I'd need to check that"
