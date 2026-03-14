# EasyBuyStore E-Commerce - Next.js Migration

![Status](https://img.shields.io/badge/Status-95%25%20Complete-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

## Overview

This is the modern Next.js migration of the EasyBuyStore e-commerce website, originally built with PHP and MySQL for a university project. The migration is **95% complete** with all core features implemented including customer pages, authentication, shopping cart, checkout, order management, and admin dashboard.

## Original PHP Application Features

 Customer Portal:
- Product browsing with categories
- Shopping cart (localStorage + database sync)
- User authentication (registration/login)
- Product details and reviews
- Order history
- PayPal payment integration

 Admin Dashboard:
- Product management (CRUD)
- Order management
- Analytics and reporting
- Category management
- Contact inquiry management

## Migration Progress - 95% Complete! 

###  Phase 1: Project Setup (Completed)
- [x] Next.js 16+ with App Router
- [x] TypeScript configuration
- [x] Tailwind CSS setup
- [x] Project structure created
- [x] Environment variables configured

###  Phase 2: Backend & Database (Completed)
- [x] Prisma ORM setup with Prisma 7
- [x] Database schema migration (10 models)
- [x] MySQL connection configured
- [x] API route structure implemented

###  Phase 3: API Development (Completed)
- [x] Authentication API (NextAuth.js v5)
- [x] Products API (list, details, admin CRUD)
- [x] Cart API (save, load, clear)
- [x] Orders API (create, history, details)
- [x] PayPal integration (create/capture order)
- [x] Contact form API
- [x] Admin APIs (products, orders)

###  Phase 4: Frontend Pages (Completed)
**Customer Portal:**
- [x] Home page with hero, categories, featured products
- [x] Product listing with search, filters, sorting
- [x] Product details with reviews and ratings
- [x] Shopping cart with quantity controls
- [x] Checkout & PayPal payment (multi-step flow)
- [x] Order history with tracking
- [x] User account dashboard
- [x] About & Contact pages
- [x] Sign in/Sign up pages
- [x] Categories browsing page

**Admin Dashboard:**
- [x] Dashboard overview with stats and alerts
- [x] Product management (list, search, delete)
- [x] Order management with status tracking
- [x] Protected admin routes

###  Phase 5: Components & State (Completed)
- [x] Navbar with cart count and user menu
- [x] Footer with links
- [x] Add to Cart button component
- [x] Admin Sidebar navigation
- [x] State management (Zustand for cart)
- [x] Form components with validation
- [x] Loading & error states

### ⏳ Phase 6: Testing & Deployment (Optional Enhancements)
- [ ] Unit tests
- [ ] E2E tests
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Production deployment
- [ ] Admin product add/edit forms
- [ ] Admin analytics with charts
- [ ] Review submission page
- [ ] Promo code functionality

## Tech Stack

**Frontend:**
- Next.js 16.1.6 (App Router)
- React 19.2.4
- TypeScript 5.9
- Tailwind CSS 4.2.1

**Backend:**
- Next.js API Routes
- Prisma ORM
- MySQL Database
- NextAuth.js

**Additional Tools:**
- Zustand (State Management)
- React Hook Form + Zod (Forms & Validation)
- SWR (Data Fetching)
- PayPal SDK

## Database Schema

The application uses the existing MySQL database with the following tables:
- `users` - Customer accounts
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Order records
- `payment_orders` - PayPal payment records
- `order_items` - Order line items
- `contacts` - Contact form submissions
- `promo_codes` - Promotional codes
- `reviews` - Product reviews

##  Documentation

Comprehensive setup and usage guides are available in the `docs/` folder:

- **[Quick Start Guide](docs/QUICK_START.md)** - Get up and running in 5 minutes
- **[Setup Guide](docs/SETUP_GUIDE.md)** - Detailed installation and configuration instructions
- **[Admin Credentials](docs/ADMIN_CREDENTIALS.md)** - Default admin login information
- **[Migration Guide](docs/MIGRATION.md)** - PHP to Next.js migration details

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL database 8.0+
- npm or yarn

### Quick Installation

```bash
# 1. Install dependencies
npm install

# 2. Create database
mysql -u root -p
CREATE DATABASE easybuystore;

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# 4. Initialize Prisma
npx prisma generate
npx prisma db push

# 5. Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

**For detailed setup instructions, see [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)**

## Environment Variables

```env
DATABASE_URL="mysql://root:password@localhost:3306/easybuystore"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-secret"
```

See `.env.example` for a complete template.

## Project Structure

```
easybuystore-nextjs/
 app/
    (customer)/         # Customer-facing pages
    (admin)/           # Admin dashboard pages
    api/               # API routes
    globals.css        # Global styles
    layout.tsx         # Root layout
    page.tsx           # Home page
 components/            # Reusable components
 lib/                   # Utilities & helpers
 prisma/               # Prisma schema & migrations
 public/               # Static assets
 types/                # TypeScript types
```

## Key Differences from PHP Version

1. **Server-Side Rendering**: Next.js provides automatic SSR and SSG for better performance
2. **API Routes**: RESTful API using Next.js API routes instead of separate PHP files
3. **Type Safety**: Full TypeScript support throughout the application
4. **Modern React**: Uses React 19 with latest hooks and patterns
5. **Optimized Images**: Next.js Image component for automatic optimization
6. **Better DX**: Hot module replacement, fast refresh, and improved debugging

## Migration Strategy

The migration follows a parallel development approach:
1. Original PHP application remains functional
2. Next.js application is built alongside  
3. Database schema is shared between both
4. Gradual feature migration and testing
5. Complete switchover once all features are migrated

## Contributing

This is a university project migration. Contributions and suggestions are welcome!

## License

MIT

## Contact

For questions about this migration project, please refer to the original PHP application documentation or open an issue.

---

**Original PHP Project**: `/velvet_vogue_Ecommerce_WebPage/`  
**Migration Start Date**: March 2026  
**Target Completion**: 2 weeks
