# EasyBuyStore - E-Commerce Platform Documentation

> ** See [INDEX.md](INDEX.md) for a complete documentation guide and quick navigation.**

##  Quick Start

New to EasyBuyStore? Start here:

1. **[QUICK_START.md](QUICK_START.md)** - Get running in 5 minutes
2. **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed installation guide (Windows/Mac/Linux)
3. **[ADMIN_CREDENTIALS.md](ADMIN_CREDENTIALS.md)** - Admin panel access

##  Available Documentation

### Setup & Installation
- [QUICK_START.md](QUICK_START.md) - Quick 5-minute setup guide
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Comprehensive installation instructions
- [ADMIN_CREDENTIALS.md](ADMIN_CREDENTIALS.md) - Default admin credentials

### Technical Documentation
- [BACKEND_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md) - Technical architecture
- [MIGRATION.md](MIGRATION.md) - PHP to Next.js migration guide
- [MY_CONTRIBUTIONS.md](MY_CONTRIBUTIONS.md) - Development contributions
- [01-introduction.md](01-introduction.md) - Project introduction

## Project Overview

EasyBuyStore is a modern, full-stack e-commerce platform built with Next.js 16, TypeScript, and MySQL. The platform provides a complete online shopping experience with features for both customers and administrators.

### Key Features

- **Customer Features:**
  - Product browsing and searching
  - Shopping cart and wishlist
  - Secure checkout with PayPal integration
  - Order tracking with logistics integration
  - Product reviews and ratings
  - User account management

- **Admin Features:**
  - Product management (CRUD operations)
  - Category management
  - Order management and fulfillment
  - Shipment tracking and logistics
  - Customer review moderation
  - Promo code management
  - Analytics dashboard

### Technology Stack

- **Frontend:** Next.js 16, React 19, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes, NextAuth.js
- **Database:** MySQL with Prisma ORM
- **Payment:** PayPal SDK
- **Logistics:** Third-party carrier integration (simulated)
- **Authentication:** NextAuth.js with JWT
- **State Management:** Zustand

## Getting Started

**Quick Setup:**
```bash
# 1. Install dependencies
npm install

# 2. Create database
mysql -u root -p
CREATE DATABASE easybuystore;

# 3. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 4. Setup database
npx prisma generate
npx prisma db push

# 5. Start server
npm run dev
```

**For detailed instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

## License

This project is part of a university coursework assignment.

## Contact

For questions or support, contact: contact@easybuystore.com
