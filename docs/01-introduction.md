# 1. Introduction and Background

## 1.1 Project Overview

EasyBuyStore is a comprehensive e-commerce platform designed to provide a seamless online shopping experience for customers while offering powerful management tools for administrators. The platform was developed as part of a university coursework project to demonstrate full-stack web development capabilities and modern software engineering practices.

## 1.2 Problem Statement

### Business Need

The retail industry in Sri Lanka is rapidly moving towards digital transformation. Traditional brick-and-mortar stores face limitations in:
- Geographic reach and customer accessibility
- Operating hours and staffing constraints
- Inventory management and scalability
- Customer data and analytics

### Target Users

1. **Customers:** Individuals seeking convenient online shopping with features like:
   - Easy product discovery and search
   - Secure payment processing
   - Order tracking and delivery updates
   - Wishlist and cart functionality

2. **Administrators:** Store owners and managers needing:
   - Inventory and product management
   - Order processing and fulfillment
   - Customer relationship management
   - Business analytics and reporting

### Market Gap

While global e-commerce platforms exist, there's a need for localized solutions that:
- Support Sri Lankan Rupees (LKR) as primary currency
- Integrate with local logistics providers
- Cater to local business practices
- Provide affordable and scalable solutions

## 1.3 Project Objectives

### Primary Objectives

1. **Customer Experience:** Create an intuitive, responsive shopping interface
2. **Admin Efficiency:** Develop comprehensive management tools
3. **Security:** Implement robust authentication and data protection
4. **Scalability:** Design architecture to handle growth
5. **Integration:** Connect with third-party services (payment, logistics)

### Success Criteria

-  Fully functional product catalog with categories
-  Complete shopping cart and checkout flow
-  Secure user authentication and authorization
-  Admin dashboard with CRUD operations
-  Payment gateway integration (PayPal)
-  Logistics tracking integration
-  Responsive design (mobile, tablet, desktop)
-  Database with proper relationships and constraints

## 1.4 System Scope

### In Scope

- Product management (categories, products, inventory)
- User management (customers, admins, authentication)
- Shopping features (cart, wishlist, checkout)
- Order management and tracking
- Payment processing (PayPal)
- Logistics integration (shipment tracking)
- Product reviews and ratings
- Promo code system
- Admin analytics dashboard

### Out of Scope

- Multi-vendor marketplace
- Real-time chat support
- Mobile application (native)
- Advanced AI recommendations
- Social media integration
- Multi-currency support
- Multi-language support

## 1.5 Development Approach

### Methodology

The project follows an **Agile-inspired iterative approach**: [Clickup]

1. **Planning Phase:** Requirements gathering and system design
2. **Implementation Sprints:** Feature development in iterations
   - Sprint 1: Core architecture and authentication
   - Sprint 2: Product catalog and customer features
   - Sprint 3: Admin features and management
   - Sprint 4: Integration and polish
3. **Testing Phase:** Unit and integration testing
4. **Deployment:** Preparation for production

### Technology Selection Rationale

| Technology | Reason for Selection |
|------------|---------------------|
| **Next.js 16** | Server-side rendering, API routes, modern React features |
| **TypeScript** | Type safety, better developer experience, fewer bugs |
| **MySQL** | Reliable, widely supported, excellent for relational data |
| **Prisma** | Type-safe database client, excellent migration tools |
| **TailwindCSS** | Rapid UI development, consistent design system |
| **NextAuth.js** | Secure authentication, session management |
| **PayPal SDK** | Trusted payment processor, easy integration |

## 1.6 Project Timeline

### Development Phases

- **Phase 1 (Weeks 1-2):** Setup, database design, authentication
- **Phase 2 (Weeks 3-4):** Customer features (products, cart, checkout)
- **Phase 3 (Weeks 5-6):** Admin features (management, analytics)
- **Phase 4 (Weeks 7-8):** Integrations (payment, logistics)
- **Phase 5 (Weeks 9-10):** Testing, documentation, deployment

### Current Status

 All core features implemented
 Payment gateway integrated
 Logistics tracking system implemented
 Wishlist feature added
 Documentation in progress
⏳ Final testing and deployment pending

## 1.7 Expected Outcomes

### Technical Outcomes

1. Fully functional e-commerce platform
2. Comprehensive API documentation
3. Well-structured, maintainable codebase
4. Secure, scalable architecture
5. Complete project documentation

### Learning Outcomes

1. Full-stack web development expertise
2. Database design and management
3. API integration and third-party services
4. Security best practices
5. Project management and documentation
6. Modern development tools and workflows

## 1.8 Project Structure

```
easybuystore-nextjs/
 app/                    # Next.js App Router
    api/               # API routes
    admin/             # Admin pages
    account/           # User account pages
    auth/              # Authentication pages
    (public)/          # Public pages
 components/            # React components
    customer/         # Customer-facing components
    admin/            # Admin components
 lib/                   # Utility libraries
    db/               # Database connection
    services/         # Business logic services
    stores/           # State management
 prisma/               # Database schema and migrations
 public/               # Static assets
 docs/                 # Project documentation
```

## 1.9 Stakeholders

### Primary Stakeholders

1. **Development Team:** Project creators and maintainers
2. **Course Instructors:** Academic evaluators
3. **End Users:** Customers using the platform
4. **Store Administrators:** Business owners/managers

### Secondary Stakeholders

1. **Payment Processor:** PayPal integration partner
2. **Logistics Providers:** Shipping and tracking services
3. **Hosting Provider:** Platform deployment service

## 1.10 Success Metrics

### Functional Metrics

- 100% of required features implemented
- All user workflows functional end-to-end
- Zero critical security vulnerabilities
- Database integrity maintained

### Quality Metrics

- Code follows consistent style guidelines
- API endpoints respond within acceptable time
- UI responsive across all device sizes
- Documentation comprehensive and clear

### Academic Metrics

- Meets all coursework requirements
- Demonstrates technical proficiency
- Shows understanding of software engineering principles
- Proper documentation and presentation
