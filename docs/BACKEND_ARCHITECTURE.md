# Backend Architecture - How It Works

##  Backend Architecture Overview

The backend uses **Next.js API Routes** - which means the backend and frontend are in the same application but separated logically.

```

                     CLIENT (Browser)                         
              React Components + User Interface               

                        HTTP Requests (fetch/axios)
                       

                  NEXT.JS API ROUTES                          
                 (/app/api/**/route.ts)                       
  - Authentication & Authorization                            
  - Request Validation                                        
  - Business Logic                                            

                        Prisma ORM
                       

                   DATABASE (MySQL)                           
  - Users, Products, Orders                                   
  - Categories, Reviews, Cart Items                           
  - Persistent Data Storage                                   

```

---

##  Backend File Structure

```
app/api/
 auth/                    # Authentication (NextAuth.js)
    [...nextauth]/
 products/                # Product management
    route.ts
 wishlist/               # Wishlist feature
    route.ts            # GET (fetch) & POST (add)
    [id]/route.ts       # DELETE (remove)
 orders/                 # Order management
    [orderId]/
        tracking/       # Customer tracking
            route.ts
 admin/                  # Admin-only endpoints
    products/
    orders/
       [orderId]/
           shipping/   # Admin shipping management
               route.ts
    reviews/
 contact/
     route.ts

lib/
 db/
    prisma.ts           # Database connection
 services/
    logistics.ts        # Logistics service
 auth.ts                 # NextAuth configuration
```

---

##  How a Request Works (Step-by-Step Example)

### Example: Adding a Product to Wishlist

**Step 1: User Clicks "Add to Wishlist" Button**
```tsx
// Frontend: /components/customer/AddToWishlistButton.tsx
const response = await fetch('/api/wishlist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ product_id: 123 })
});
```

**Step 2: Request Arrives at API Route**
```typescript
// Backend: /app/api/wishlist/route.ts
export async function POST(request: NextRequest) {
  // This function handles the request
}
```

**Step 3: Authentication Check**
```typescript
// Get user session from NextAuth
const session = await getServerSession(authOptions);

if (!session || !session.user?.id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**Step 4: Validate Request Data**
```typescript
const body = await request.json();
const { product_id } = body;

if (!product_id) {
  return NextResponse.json(
    { error: 'Product ID is required' },
    { status: 400 }
  );
}
```

**Step 5: Database Operations via Prisma**
```typescript
// Check if product exists
const product = await prisma.product.findFirst({
  where: {
    product_id: productId,
    is_active: true,
  },
});

// Check for duplicates
const existingItem = await prisma.cartItem.findFirst({
  where: {
    user_id: userId,
    product_id: productId,
    item_type: 'wishlist',
  },
});

// Create wishlist item
const wishlistItem = await prisma.cartItem.create({
  data: {
    user_id: userId,
    product_id: productId,
    quantity: 1,
    item_type: 'wishlist',
  },
});
```

**Step 6: Return Response**
```typescript
return NextResponse.json({
  success: true,
  message: 'Product added to wishlist',
  item: wishlistItem,
}, { status: 201 });
```

**Step 7: Frontend Updates UI**
```tsx
// Back in the component
if (response.ok) {
  setInWishlist(true); // Update button state
  // Show success message
}
```

---

##  Authentication & Authorization

### How NextAuth.js Works

```typescript
// lib/auth.ts - Configuration
export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // 1. Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // 2. Verify password with bcrypt
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        // 3. Return user if valid
        if (isValid) return user;
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to JWT token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add token info to session
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    }
  }
};
```

### Session Flow:
```
1. User logs in → Credentials sent to /api/auth/signin
2. Backend validates → Creates JWT token
3. Token stored in cookie → Sent with every request
4. API routes verify token → Grant/deny access
```

---

##  Database Layer (Prisma ORM)

### Prisma Schema Example:
```prisma
// prisma/schema.prisma
model CartItem {
  id             Int       @id @default(autoincrement())
  user_id        Int
  product_id     Int
  quantity       Int
  item_type      String    @default("cart") // "cart" or "wishlist"
  created_at     DateTime  @default(now())
  updated_at     DateTime  @updatedAt

  user           User      @relation(fields: [user_id], references: [user_id])

  @@map("cart_items")
}
```

### How Prisma Queries Work:
```typescript
// Prisma generates type-safe database queries

// Find many (SELECT)
const items = await prisma.cartItem.findMany({
  where: { user_id: 1, item_type: 'wishlist' },
  include: { product: true }
});

// Create (INSERT)
const newItem = await prisma.cartItem.create({
  data: {
    user_id: 1,
    product_id: 123,
    quantity: 1,
    item_type: 'wishlist'
  }
});

// Update (UPDATE)
await prisma.cartItem.update({
  where: { id: 5 },
  data: { quantity: 2 }
});

// Delete (DELETE)
await prisma.cartItem.delete({
  where: { id: 5 }
});
```

### Prisma automatically:
-  Prevents SQL injection (parameterized queries)
-  Provides TypeScript types
-  Handles database connections
-  Manages migrations

---

##  Key Backend Concepts

### 1. **RESTful API Pattern**
```
GET    /api/wishlist          → Fetch all wishlist items
POST   /api/wishlist          → Add item to wishlist
DELETE /api/wishlist/[id]     → Remove item from wishlist

GET    /api/products          → List all products
GET    /api/products/[id]     → Get single product
POST   /api/products          → Create product (admin only)
PUT    /api/products/[id]     → Update product (admin only)
DELETE /api/products/[id]     → Delete product (admin only)
```

### 2. **HTTP Status Codes Used**
```typescript
200 OK              → Success (GET, PUT)
201 Created         → Resource created (POST)
400 Bad Request     → Invalid input
401 Unauthorized    → Not logged in
403 Forbidden       → Logged in but no permission
404 Not Found       → Resource doesn't exist
409 Conflict        → Duplicate resource
500 Server Error    → Something went wrong
```

### 3. **Middleware Pattern**
```typescript
// Every API route follows this pattern:

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions);
    if (!session) return unauthorized();

    // 2. Authorization (role check)
    if (session.user.role !== 'admin') return forbidden();

    // 3. Validation
    const data = await request.json();
    if (!data.required_field) return badRequest();

    // 4. Business Logic
    const result = await someOperation(data);

    // 5. Response
    return success(result);

  } catch (error) {
    // 6. Error Handling
    return serverError();
  }
}
```

---

##  Feature-Specific Backend Implementations

### **Wishlist Backend** (`/app/api/wishlist/`)

**Database Design:**
```
cart_items table:

 id  user_id  product_id  quantity  item_type 

 1   5        101         1         cart      
 2   5        102         1         wishlist   ← Wishlist
 3   5        103         3         cart      
 4   8        101         1         wishlist   ← Wishlist

```

**Why this design?**
- Reuses existing `cart_items` table
- `item_type` field distinguishes cart vs wishlist
- No duplicate table needed
- Same structure for similar data

**API Endpoints:**
```typescript
GET  /api/wishlist        → WHERE user_id=X AND item_type='wishlist'
POST /api/wishlist        → INSERT with item_type='wishlist'
DELETE /api/wishlist/[id] → DELETE WHERE id=X AND user_id=Y
```

---

### **Logistics Backend** (`/lib/services/logistics.ts`)

**Service Layer Pattern:**
```
API Route → Service Layer → External API/Database
```

**Example Flow:**
```typescript
// 1. Admin creates shipment
POST /api/admin/orders/123/shipping
  ↓
// 2. API calls logistics service
const result = await createShipment({
  orderId: 123,
  carrier: 'dhl',
  recipient: {...}
});
  ↓
// 3. Service generates tracking number
trackingNumber = "DHL123456789LK"
  ↓
// 4. Update database
await prisma.paymentOrder.update({
  where: { order_id: 123 },
  data: {
    tracking_number: "DHL123456789LK",
    carrier: "DHL Express",
    shipping_status: "shipped"
  }
});
  ↓
// 5. Return to admin
{ success: true, tracking: {...} }
```

**Why Service Layer?**
- Separates business logic from API routes
- Easy to replace simulation with real carrier APIs
- Reusable across multiple endpoints
- Testable independently

---

##  Security Measures

### 1. **Password Security**
```typescript
// Storing passwords (register)
const hashedPassword = await bcrypt.hash(password, 10);
await prisma.user.create({
  data: {
    email,
    password_hash: hashedPassword // Never store plain passwords!
  }
});

// Verifying passwords (login)
const isValid = await bcrypt.compare(inputPassword, user.password_hash);
```

### 2. **SQL Injection Prevention**
```typescript
//  UNSAFE (vulnerable to SQL injection)
const query = `SELECT * FROM users WHERE email = '${userInput}'`;

//  SAFE (Prisma uses parameterized queries)
const user = await prisma.user.findUnique({
  where: { email: userInput }
});
```

### 3. **Authorization Checks**
```typescript
// Check user owns the resource
const wishlistItem = await prisma.cartItem.findFirst({
  where: {
    id: itemId,
    user_id: session.user.id, // Ensure ownership
    item_type: 'wishlist'
  }
});

if (!wishlistItem) {
  return unauthorized(); // Can't delete other user's items
}
```

### 4. **Role-Based Access Control (RBAC)**
```typescript
// Admin-only endpoint
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  // Check if user is admin
  if (session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    );
  }

  // Admin-only operations here...
}
```

### 5. **Input Validation**
```typescript
// Validate all user inputs
const { product_id, quantity } = await request.json();

// Type checking
if (typeof product_id !== 'number') {
  return badRequest('Invalid product ID');
}

// Range validation
if (quantity < 1 || quantity > 100) {
  return badRequest('Quantity must be between 1 and 100');
}

// Sanitization (Prisma handles this automatically)
const product = await prisma.product.findUnique({
  where: { product_id } // Safe from SQL injection
});
```

---

##  Backend Data Flow Summary

```

   Browser    
  (Frontend)  

        fetch('/api/wishlist', {...})
       

         API Route Handler                      
  1.  Check authentication (NextAuth)         
  2.  Validate request data                   
  3.  Check authorization (user permissions)  
  4. → Call business logic                     

       

         Prisma ORM Layer                       
  - Generates SQL queries                       
  - Type-safe operations                        
  - Connection pooling                          

       

         MySQL Database                         
  - Stores all data                             
  - Enforces constraints                        
  - ACID transactions                           

```

---

##  API Endpoint Reference

### Public Endpoints (No Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all active products |
| GET | `/api/products/[id]` | Get product details |
| GET | `/api/categories` | List all categories |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/auth/signin` | User login |
| POST | `/api/auth/signup` | User registration |

### Customer Endpoints (Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist` | Get user's wishlist |
| POST | `/api/wishlist` | Add item to wishlist |
| DELETE | `/api/wishlist/[id]` | Remove from wishlist |
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart` | Add to cart |
| GET | `/api/orders` | Get user's orders |
| GET | `/api/orders/[orderId]/tracking` | Track order shipment |
| POST | `/api/checkout` | Create order |

### Admin Endpoints (Admin Role Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/[id]` | Update product |
| DELETE | `/api/admin/products/[id]` | Delete product |
| GET | `/api/admin/orders` | List all orders |
| PATCH | `/api/admin/orders/[id]` | Update order status |
| POST | `/api/admin/orders/[id]/shipping` | Create shipment |
| PATCH | `/api/admin/orders/[id]/shipping` | Update shipping status |
| GET | `/api/admin/reviews` | Get all reviews |
| PATCH | `/api/admin/reviews/[id]` | Approve/reject review |

---

##  Database Schema Overview

### Core Tables

**users** - Customer accounts
- user_id (PK)
- email (unique)
- password_hash
- first_name, last_name
- address, city, state, zip_code, country
- created_at, updated_at

**admin_users** - Admin accounts
- admin_id (PK)
- username (unique)
- email (unique)
- password_hash
- role (admin, super_admin)
- created_at, updated_at

**products** - Product catalog
- product_id (PK)
- product_name
- description
- price, discount_price
- category_id (FK)
- image_url
- stock_quantity
- is_active, is_featured, is_new, is_bestseller
- created_at, updated_at

**categories** - Product categories
- category_id (PK)
- category_name
- description
- image_url
- is_active
- created_at, updated_at

**cart_items** - Shopping cart AND wishlist
- id (PK)
- user_id (FK)
- product_id (FK - no relation due to Prisma limitation)
- quantity
- **item_type** ('cart' or 'wishlist')
- created_at, updated_at

**payment_orders** - Order history
- order_id (PK)
- order_number (unique)
- user_id (FK)
- total, subtotal, tax, shipping, discount
- order_status (pending, confirmed, shipped, delivered, cancelled)
- payment_method, payment_status
- shipping_name, shipping_address, etc.
- **tracking_number, carrier, shipping_status** (logistics)
- **shipped_at, delivered_at, estimated_delivery** (logistics)
- paypal_order_id, paypal_transaction_id
- created_at, updated_at

**order_items** - Order line items
- id (PK)
- order_id (FK)
- product_id (FK)
- quantity, price, subtotal
- created_at

**reviews** - Product reviews
- id (PK)
- product_id (FK)
- user_id (FK)
- rating (1-5)
- title, comment
- is_approved
- created_at, updated_at

**promo_codes** - Discount codes
- id (PK)
- promo_code (unique)
- discount_type (percentage, fixed)
- discount_value
- minimum_order_amount
- max_uses, times_used
- is_active
- start_date, end_date
- created_at, updated_at

---

##  Performance Considerations

### 1. **Database Indexing**
```prisma
// Prisma automatically creates indexes on:
// - Primary keys (@id)
// - Unique fields (@unique)
// - Foreign keys (@relation)

model Product {
  product_id Int @id @default(autoincrement())

  // This creates an index automatically
  @@index([category_id])
  @@index([is_active, is_featured])
}
```

### 2. **Query Optimization**
```typescript
//  Bad: N+1 query problem
const orders = await prisma.order.findMany();
for (const order of orders) {
  const items = await prisma.orderItem.findMany({
    where: { order_id: order.id }
  });
}

//  Good: Single query with include
const orders = await prisma.order.findMany({
  include: {
    order_items: {
      include: {
        product: true
      }
    }
  }
});
```

### 3. **Pagination**
```typescript
// Implement pagination for large datasets
const products = await prisma.product.findMany({
  skip: (page - 1) * limit,
  take: limit,
  where: { is_active: true },
  orderBy: { created_at: 'desc' }
});
```

### 4. **Caching Strategy** (Future Enhancement)
```typescript
// Example: Cache product list for 5 minutes
// This would be implemented with Redis or Next.js cache
const products = await cache('products:all', async () => {
  return await prisma.product.findMany();
}, { ttl: 300 }); // 5 minutes
```

---

##  Error Handling Best Practices

```typescript
export async function POST(request: NextRequest) {
  try {
    // Attempt operation
    const result = await someOperation();
    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    // Log error for debugging
    console.error('Error in POST /api/endpoint:', error);

    // Prisma-specific errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A record with this value already exists' },
        { status: 409 }
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }

    // Generic error (don't expose internal details to client)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
```

---

##  Additional Resources

### Next.js API Routes
- [Official Docs](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [API Route Best Practices](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)

### Prisma ORM
- [Prisma Docs](https://www.prisma.io/docs)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

### NextAuth.js
- [Authentication Docs](https://next-auth.js.org/)
- [Credentials Provider](https://next-auth.js.org/providers/credentials)

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [bcrypt Guide](https://www.npmjs.com/package/bcrypt)

---

**Document Created:** March 9, 2026
**Last Updated:** March 9, 2026
**Version:** 1.0
