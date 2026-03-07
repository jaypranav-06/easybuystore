# Velvet Vogue E-Commerce - Next.js Migration

![Status](https://img.shields.io/badge/Status-In%20Progress-yellow)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

## Overview

This project is the modern Next.js migration of the Velvet Vogue e-commerce website, originally built with PHP and MySQL for a university project. The goal is to transform the application into a fully-featured, scalable Next.js application with improved performance, better developer experience, and modern web standards.

## Original PHP Application Features

✅ Customer Portal:
- Product browsing with categories
- Shopping cart (localStorage + database sync)
- User authentication (registration/login)
- Product details and reviews
- Order history
- PayPal payment integration

✅ Admin Dashboard:
- Product management (CRUD)
- Order management
- Analytics and reporting
- Category management
- Contact inquiry management

## Migration Progress

### ✅ Phase 1: Project Setup (Completed)
- [x] Next.js 16+ with App Router
- [x] TypeScript configuration  
- [x] Tailwind CSS setup
- [x] Project structure created
- [x] Environment variables configured

### 🔄 Phase 2: Backend & Database (In Progress)
- [ ] Prisma ORM setup
- [ ] Database schema migration
- [ ] MySQL connection
- [ ] API route structure

### ⏳ Phase 3: API Development (Pending)
- [ ] Authentication API (NextAuth.js)
- [ ] Products API (CRUD)
- [ ] Cart API
- [ ] Orders API
- [ ] PayPal integration
- [ ] Reviews API
- [ ] Admin APIs

### ⏳ Phase 4: Frontend Pages (Pending)
**Customer Portal:**
- [ ] Home page
- [ ] Product listing
- [ ] Product details
- [ ] Shopping cart
- [ ] Checkout & payment
- [ ] Order history
- [ ] User account
- [ ] About & Contact pages
- [ ] Sign in/Sign up

**Admin Dashboard:**
- [ ] Dashboard overview
- [ ] Product management
- [ ] Order management
- [ ] Categories
- [ ] Inquiries
- [ ] Analytics

### ⏳ Phase 5: Components & State (Pending)
- [ ] Reusable UI components
- [ ] State management (Zustand)
- [ ] Form components
- [ ] Loading & error states

### ⏳ Phase 6: Testing & Deployment (Pending)
- [ ] User flow testing
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Production deployment

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

## Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL database (existing from PHP project)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your database credentials

# Initialize Prisma
npx prisma generate
npx prisma db pull  # Pull existing schema from database

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
DATABASE_URL="mysql://root:@localhost:3306/velvet_vogue_ecommerce_web"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-secret"
PAYPAL_ENVIRONMENT="sandbox"
```

## Project Structure

```
velvet-vogue-nextjs/
├── app/
│   ├── (customer)/         # Customer-facing pages
│   ├── (admin)/           # Admin dashboard pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
├── lib/                   # Utilities & helpers
├── prisma/               # Prisma schema & migrations
├── public/               # Static assets
└── types/                # TypeScript types
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
