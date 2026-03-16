# EasyBuyStore - Modern E-Commerce Platform

A full-featured e-commerce platform built with Next.js 16, featuring a complete customer shopping experience and comprehensive admin dashboard.

## Features

### Customer Features
- Product browsing and search
- Product filtering by category
- Shopping cart management
- Wishlist functionality
- Secure checkout process
- Order tracking
- User account management
- Responsive design for all devices

### Admin Features
- Dashboard with analytics
- Product management (CRUD operations)
- Category management
- Order management and processing
- Customer management
- Store settings configuration
- Staff management
- Real-time inventory tracking

## Tech Stack

- **Frontend**: Next.js 16.1.6 with React 19
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL) with Prisma ORM
- **Authentication**: NextAuth.js v5
- **State Management**: Zustand
- **Payment**: PayPal REST API integration
- **Build Tool**: Turbopack
- **Language**: TypeScript

## Prerequisites

- Node.js 18+
- Supabase account (free tier available)
- npm or yarn

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/jaypranav-06/EasyBuyStore.git
cd EasyBuyStore
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase Database

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Get your connection strings from Settings > Database

See [Supabase Setup Guide](docs/SUPABASE_SETUP.md) for detailed instructions.

### 4. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database - Supabase
DATABASE_URL="your-supabase-connection-pooling-url"
DIRECT_URL="your-supabase-direct-connection-url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# PayPal (Optional)
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-secret"
PAYPAL_MODE="sandbox"
```

### 5. Push database schema to Supabase

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to Supabase
npx prisma db push
```

### 6. Start the development server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
easybuystore-nextjs/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication routes
│   ├── account/             # Customer account pages
│   ├── admin/               # Admin dashboard
│   ├── api/                 # API routes
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout process
│   ├── products/            # Product pages
│   └── ...
├── components/              # React components
│   ├── admin/              # Admin components
│   └── customer/           # Customer components
├── lib/                    # Utility libraries
│   ├── auth/              # Authentication
│   ├── db/                # Database client
│   └── services/          # Business logic
├── prisma/                # Database schema
├── public/                # Static assets
├── scripts/               # Utility scripts
└── docs/                  # Documentation
```

## Admin Access

After creating an admin user, access the admin panel at:
```
http://localhost:3000/admin/login
```

Default credentials (if using seed data):
- Email: admin@easybuystore.com
- Password: (as set in your .env file)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npx prisma studio` - Open Prisma Studio

## Database Schema

The application uses PostgreSQL with the following main tables:
- Users
- Products
- Categories
- Orders
- Order Items
- Shopping Cart
- Wishlist
- Staff (Admin users)

See `prisma/schema.prisma` for the complete schema.

## Documentation

Detailed documentation is available in the `/docs` directory:

- [Supabase Setup Guide](docs/SUPABASE_SETUP.md) - Database setup with Supabase
- [PayPal Setup Guide](docs/PAYPAL_SETUP_GUIDE.md) - Complete PayPal payment integration guide
- [Firebase Setup Guide](docs/FIREBASE_SETUP_GUIDE.md) - Google OAuth authentication setup
- [Setup Guide](docs/SETUP_GUIDE.md) - Detailed setup instructions
- [Admin Credentials](docs/ADMIN_CREDENTIALS.md) - Admin user management
- [Backend Architecture](docs/BACKEND_ARCHITECTURE.md) - System architecture
- [Distribution Checklist](docs/DISTRIBUTION_CHECKLIST.md) - Deployment guide

## Features in Detail

### Authentication
- Secure user authentication with NextAuth.js v5
- Email/password authentication with bcrypt hashing
- Google OAuth integration (Sign in with Google)
- Separate admin and customer authentication
- Session management and JWT tokens
- Auto-user provisioning for OAuth users

### Shopping Cart
- Persistent cart across sessions
- Real-time price calculations
- Quantity management
- Stock validation

### Wishlist
- Save products for later
- Quick add to cart from wishlist
- Persistent across sessions

### Order Management
- Order creation and tracking
- Payment integration
- Order status updates
- Order history for customers

### Admin Dashboard
- Analytics and reporting
- Product inventory management
- Order processing workflow
- Customer management tools

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS
- Digital Ocean

## Environment Variables Reference

```env
# Required
DATABASE_URL=              # PostgreSQL connection string
NEXTAUTH_URL=             # Your application URL
NEXTAUTH_SECRET=          # Secret for NextAuth.js

# Admin Setup
ADMIN_EMAIL=              # Admin email
ADMIN_PASSWORD=           # Admin password

# Optional
NEXT_PUBLIC_PAYPAL_CLIENT_ID=  # PayPal Client ID
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email jay@easybuystore.com or open an issue on GitHub.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting
- All contributors who helped with this project
