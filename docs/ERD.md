# EasyBuyStore Database ERD

```mermaid
erDiagram
    User ||--o{ CartItem : "has"
    User ||--o{ PaymentOrder : "places"
    User ||--o{ Review : "writes"
    User ||--o{ ReviewVote : "casts"

    Product ||--o{ CartItem : "in"
    Product ||--o{ OrderItem : "contains"
    Product ||--o{ Review : "receives"
    Product }o--|| Category : "belongs to"

    PaymentOrder ||--o{ OrderItem : "contains"

    Review ||--o{ ReviewVote : "receives"

    User {
        int user_id PK
        string first_name
        string last_name
        string email UK
        string password_hash
        string phone
        string address
        string city
        string state
        string zip_code
        string country
        datetime created_at
        datetime updated_at
    }

    AdminUser {
        int admin_id PK
        string username UK
        string email UK
        string password_hash
        string role
        datetime created_at
        datetime updated_at
    }

    Product {
        int product_id PK
        string product_name
        string description
        float price
        float discount_price
        int category_id FK
        string image_url
        int stock_quantity
        boolean is_active
        boolean is_featured
        boolean is_new
        boolean is_bestseller
        string keywords
        datetime created_at
        datetime updated_at
    }

    Category {
        int category_id PK
        string category_name
        string description
        string image_url
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    CartItem {
        int id PK
        int user_id FK
        int product_id FK
        int quantity
        string item_type
        datetime created_at
        datetime updated_at
    }

    PaymentOrder {
        int order_id PK
        string order_number UK
        int user_id FK
        float total
        float subtotal
        float tax
        float shipping
        float discount
        string order_status
        string payment_method
        string payment_status
        string shipping_name
        string shipping_address
        string shipping_city
        string shipping_state
        string shipping_zip
        string shipping_country
        string shipping_phone
        string paypal_order_id
        string paypal_transaction_id
        string tracking_number
        string carrier
        string shipping_status
        datetime shipped_at
        datetime delivered_at
        datetime estimated_delivery
        datetime created_at
        datetime updated_at
    }

    OrderItem {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        float price
        float subtotal
        datetime created_at
    }

    Review {
        int id PK
        int product_id FK
        int user_id FK
        int rating
        string title
        string comment
        string[] images
        boolean is_approved
        boolean is_verified_purchase
        int helpful_count
        int unhelpful_count
        datetime created_at
        datetime updated_at
    }

    ReviewVote {
        int id PK
        int review_id FK
        int user_id FK
        string vote_type
        datetime created_at
    }

    PromoCode {
        int id PK
        string promo_code UK
        string discount_type
        float discount_value
        float minimum_order_amount
        int max_uses
        int times_used
        boolean is_active
        datetime start_date
        datetime end_date
        datetime created_at
        datetime updated_at
    }

    Contact {
        int id PK
        string first_name
        string last_name
        string email
        string phone
        string subject
        string message
        string category
        string priority
        string status
        datetime created_at
        datetime updated_at
    }
```

## Entity Descriptions

### Core Entities

- **User**: Customer accounts with authentication and shipping information
- **AdminUser**: Administrative users with role-based access (separate from customers)
- **Product**: Items available for purchase with pricing and inventory tracking
- **Category**: Product categorization and organization

### Transaction Entities

- **PaymentOrder**: Complete order records with payment, shipping, and tracking details
- **OrderItem**: Individual products within an order (line items)
- **CartItem**: Shopping cart and wishlist items (distinguished by `item_type`)

### Engagement Entities

- **Review**: Customer product reviews with ratings and approval workflow
- **ReviewVote**: Helpful/unhelpful votes on reviews (prevents duplicate votes)

### Supporting Entities

- **PromoCode**: Discount codes with usage tracking and validation rules
- **Contact**: Customer support inquiries and contact form submissions

## Key Relationships

1. **User → CartItem → Product**: Shopping cart functionality
2. **User → PaymentOrder → OrderItem → Product**: Order processing flow
3. **Product → Category**: Product organization and filtering
4. **User → Review → Product**: Product feedback system
5. **Review → ReviewVote**: Community-driven review quality

## Notes

- **PK** = Primary Key
- **FK** = Foreign Key
- **UK** = Unique Key
- All entities have `created_at` and `updated_at` timestamps
- CartItem's `item_type` field distinguishes between cart and wishlist items
- PaymentOrder supports multiple payment methods (Stripe, PayPal, etc.)
