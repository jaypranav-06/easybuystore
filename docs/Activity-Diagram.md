# EasyBuyStore UML Activity Diagrams

## 1. Customer Purchase Flow (Main Activity)

```mermaid
flowchart TD
    Start([Customer Visits Store]) --> Browse[Browse Products]
    Browse --> SearchFilter{Search/Filter?}
    SearchFilter -->|Yes| Search[Search Products]
    SearchFilter -->|No| ViewProduct[View Product Details]
    Search --> ViewProduct

    ViewProduct --> CheckStock{Product Available?}
    CheckStock -->|No| Browse
    CheckStock -->|Yes| AddCart[Add to Cart]

    AddCart --> ContinueShopping{Continue Shopping?}
    ContinueShopping -->|Yes| Browse
    ContinueShopping -->|No| ViewCart[View Cart]

    ViewCart --> UpdateCart{Update Cart?}
    UpdateCart -->|Yes| ModifyCart[Modify Quantities]
    ModifyCart --> ViewCart
    UpdateCart -->|No| Checkout[Proceed to Checkout]

    Checkout --> CheckAuth{Logged In?}
    CheckAuth -->|No| Login[Login/Register]
    Login --> Checkout
    CheckAuth -->|Yes| EnterShipping[Enter Shipping Details]

    EnterShipping --> SelectPayment[Select Payment Method]
    SelectPayment --> PaymentMethod{Payment Type?}

    PaymentMethod -->|Stripe| StripeCheckout[Stripe Checkout]
    PaymentMethod -->|PayHere| PayHereCheckout[PayHere Gateway]
    PaymentMethod -->|Cash on Delivery| CODOrder[Create COD Order]

    StripeCheckout --> ProcessStripe[Process Stripe Payment]
    PayHereCheckout --> ProcessPayHere[Process PayHere Payment]

    ProcessStripe --> VerifyPayment{Payment Successful?}
    ProcessPayHere --> VerifyPayment
    CODOrder --> CreateOrder[Create Order]

    VerifyPayment -->|No| PaymentFailed[Show Payment Failed]
    PaymentFailed --> SelectPayment
    VerifyPayment -->|Yes| CreateOrder

    CreateOrder --> UpdateOrder[Update Order Status]
    UpdateOrder --> ClearCart[Clear Shopping Cart]
    ClearCart --> ShowSuccess[Show Success Page]
    ShowSuccess --> SendConfirmation[Send Confirmation Email]
    SendConfirmation --> End([Order Placed])
```

## 2. User Authentication Flow

```mermaid
flowchart TD
    Start([User Access]) --> CheckSession{Has Session?}
    CheckSession -->|Yes| Dashboard[Access Dashboard]
    CheckSession -->|No| AuthChoice{Action?}

    AuthChoice -->|Login| LoginForm[Enter Login Credentials]
    AuthChoice -->|Register| RegisterForm[Enter Registration Details]

    LoginForm --> ValidateLogin{Valid Credentials?}
    ValidateLogin -->|No| LoginError[Show Error Message]
    LoginError --> LoginForm
    ValidateLogin -->|Yes| CreateSession[Create Session]

    RegisterForm --> ValidateRegister{Valid Data?}
    ValidateRegister -->|No| RegisterError[Show Error Message]
    RegisterError --> RegisterForm
    ValidateRegister -->|Yes| HashPassword[Hash Password]
    HashPassword --> SaveUser[Save User to Database]
    SaveUser --> CreateSession

    CreateSession --> Dashboard
    Dashboard --> End([Authenticated])
```

## 3. Product Search & Browse Flow

```mermaid
flowchart TD
    Start([User on Store]) --> SearchAction{Action?}

    SearchAction -->|Search Modal| OpenModal[Open Search Modal]
    SearchAction -->|Browse| ViewCategories[View Categories]
    SearchAction -->|View All| ViewAllProducts[View All Products Page]

    OpenModal --> TypeQuery[Type Search Query]
    TypeQuery --> Debounce[Debounce 300ms]
    Debounce --> FetchResults[Fetch Products API]
    FetchResults --> ShowResults{Results Found?}

    ShowResults -->|Yes| DisplayResults[Display Product Results]
    ShowResults -->|No| NoResults[Show No Results]

    DisplayResults --> SelectProduct{User Action?}
    SelectProduct -->|Click Product| ViewDetail[View Product Detail]
    SelectProduct -->|View All Results| ViewAllProducts
    SelectProduct -->|Recent Search| ApplySearch[Apply Recent Search]
    ApplySearch --> ViewAllProducts

    ViewCategories --> SelectCategory[Select Category]
    SelectCategory --> ViewAllProducts

    ViewAllProducts --> ApplyFilters{Apply Filters?}
    ApplyFilters -->|Yes| FilterProducts[Filter by Price/Category]
    FilterProducts --> UpdateResults[Update Product List]
    ApplyFilters -->|No| ViewDetail

    UpdateResults --> ViewDetail
    ViewDetail --> End([Product Selected])
```

## 4. Admin Order Management Flow

```mermaid
flowchart TD
    Start([Admin Login]) --> ViewOrders[View Orders Dashboard]
    ViewOrders --> SelectOrder[Select Order]
    SelectOrder --> ViewDetails[View Order Details]

    ViewDetails --> CheckAction{Action Required?}

    CheckAction -->|Update Status| StatusChange{New Status?}
    StatusChange -->|Processing| SetProcessing[Set to Processing]
    StatusChange -->|Shipped| AddTracking[Add Tracking Info]
    StatusChange -->|Delivered| SetDelivered[Set to Delivered]
    StatusChange -->|Cancelled| SetCancelled[Set to Cancelled]

    AddTracking --> TrackingForm[Enter Tracking Number & Carrier]
    TrackingForm --> SetShipped[Set to Shipped]

    SetProcessing --> UpdateDB[Update Database]
    SetShipped --> UpdateDB
    SetDelivered --> UpdateDB
    SetCancelled --> UpdateDB

    UpdateDB --> NotifyCustomer[Send Status Update Email]
    NotifyCustomer --> ViewOrders

    CheckAction -->|View Details| ViewDetails
    CheckAction -->|Export| ExportOrder[Export Order Data]
    ExportOrder --> ViewOrders

    CheckAction -->|Done| End([Order Managed])
```

## 5. Product Review Flow

```mermaid
flowchart TD
    Start([Customer Views Product]) --> CheckPurchase{Purchased Before?}
    CheckPurchase -->|No| ViewReviews[View Existing Reviews]
    CheckPurchase -->|Yes| CanReview{Already Reviewed?}

    CanReview -->|Yes| ViewReviews
    CanReview -->|No| WriteReview[Write Review Form]

    WriteReview --> EnterRating[Enter Rating 1-5 stars]
    EnterRating --> EnterComment[Enter Title & Comment]
    EnterComment --> UploadImages{Add Images?}

    UploadImages -->|Yes| SelectImages[Select Images]
    SelectImages --> SubmitReview[Submit Review]
    UploadImages -->|No| SubmitReview

    SubmitReview --> SaveReview[Save to Database]
    SaveReview --> SetPending[Set is_approved = false]
    SetPending --> ShowThankYou[Show Thank You Message]

    ShowThankYou --> AdminReview[Admin Reviews Submission]
    AdminReview --> ApproveDecision{Approve?}

    ApproveDecision -->|Yes| SetApproved[Set is_approved = true]
    ApproveDecision -->|No| Reject[Reject Review]

    SetApproved --> DisplayPublic[Display in Product Page]

    ViewReviews --> VoteAction{Vote on Review?}
    VoteAction -->|Helpful| CastHelpful[Cast Helpful Vote]
    VoteAction -->|Unhelpful| CastUnhelpful[Cast Unhelpful Vote]
    VoteAction -->|No| End([Review Complete])

    CastHelpful --> UpdateVoteCount[Update Vote Count]
    CastUnhelpful --> UpdateVoteCount
    UpdateVoteCount --> End

    DisplayPublic --> End
    Reject --> End
```

## 6. Cart & Wishlist Management Flow

```mermaid
flowchart TD
    Start([User Action]) --> ItemAction{Action Type?}

    ItemAction -->|Add to Cart| AddCart[Add CartItem with type='cart']
    ItemAction -->|Add to Wishlist| AddWishlist[Add CartItem with type='wishlist']
    ItemAction -->|View Cart| ViewCart[Fetch Cart Items]
    ItemAction -->|View Wishlist| ViewWishlist[Fetch Wishlist Items]

    AddCart --> CheckDuplicate{Item Exists?}
    CheckDuplicate -->|Yes| UpdateQuantity[Increment Quantity]
    CheckDuplicate -->|No| CreateNew[Create New CartItem]

    UpdateQuantity --> ShowCart[Show Cart]
    CreateNew --> ShowCart

    AddWishlist --> SaveWishlist[Save to Database]
    SaveWishlist --> ShowWishlist[Show Wishlist]

    ViewCart --> CartActions{User Action?}
    CartActions -->|Update Qty| ModifyQty[Update Quantity]
    CartActions -->|Remove| RemoveItem[Delete CartItem]
    CartActions -->|Move to Wishlist| ChangeType[Update item_type to 'wishlist']
    CartActions -->|Checkout| GoCheckout[Proceed to Checkout]

    ModifyQty --> RefreshCart[Refresh Cart View]
    RemoveItem --> RefreshCart
    ChangeType --> RefreshCart
    RefreshCart --> ViewCart

    ViewWishlist --> WishlistActions{User Action?}
    WishlistActions -->|Move to Cart| MoveToCart[Update item_type to 'cart']
    WishlistActions -->|Remove| RemoveWishlist[Delete CartItem]

    MoveToCart --> RefreshWishlist[Refresh Wishlist View]
    RemoveWishlist --> RefreshWishlist
    RefreshWishlist --> ViewWishlist

    GoCheckout --> End([Proceed to Checkout])
    ShowWishlist --> End([Wishlist Updated])
```

## 7. Admin Product Management Flow

```mermaid
flowchart TD
    Start([Admin Panel]) --> ProductMenu{Action?}

    ProductMenu -->|Add New| CreateForm[Create Product Form]
    ProductMenu -->|Edit Existing| SelectProduct[Select Product]
    ProductMenu -->|View All| ViewProducts[View Product List]

    CreateForm --> EnterDetails[Enter Product Details]
    EnterDetails --> UploadImage{Upload Image?}
    UploadImage -->|Yes| BlobUpload[Upload to Vercel Blob]
    UploadImage -->|No| SaveProduct[Save Product]

    BlobUpload --> GetURL[Get Image URL]
    GetURL --> SaveProduct
    SaveProduct --> UpdateStock[Set Stock Quantity]
    UpdateStock --> SetFlags[Set is_featured/is_new/is_bestseller]
    SetFlags --> AssignCategory[Assign Category]
    AssignCategory --> CreateDB[Insert into Database]
    CreateDB --> ShowSuccess[Show Success Message]

    SelectProduct --> EditForm[Load Edit Form]
    EditForm --> ModifyDetails[Modify Product Details]
    ModifyDetails --> UpdateImage{Change Image?}
    UpdateImage -->|Yes| DeleteOld[Delete Old from Blob]
    DeleteOld --> BlobUpload
    UpdateImage -->|No| UpdateDB[Update Database]
    UpdateDB --> ShowSuccess

    ViewProducts --> FilterView{Filter?}
    FilterView -->|Category| FilterCategory[Filter by Category]
    FilterView -->|Status| FilterStatus[Filter Active/Inactive]
    FilterView -->|Featured| FilterFeatured[Filter Featured Products]

    FilterCategory --> DisplayFiltered[Display Filtered List]
    FilterStatus --> DisplayFiltered
    FilterFeatured --> DisplayFiltered
    DisplayFiltered --> ProductAction{Action?}

    ProductAction -->|Edit| EditForm
    ProductAction -->|Toggle Active| ToggleStatus[Update is_active]
    ProductAction -->|Delete| ConfirmDelete{Confirm?}

    ConfirmDelete -->|Yes| DeleteProduct[Delete from Database]
    ConfirmDelete -->|No| ViewProducts
    DeleteProduct --> DeleteImage[Delete Image from Blob]
    DeleteImage --> ViewProducts

    ToggleStatus --> ViewProducts
    ShowSuccess --> End([Product Managed])
```

## Flow Descriptions

### 1. Customer Purchase Flow
Main end-to-end flow from browsing to order completion, including:
- Product discovery and search
- Cart management
- Authentication check
- Payment processing (Stripe/PayHere/COD)
- Order creation and confirmation

### 2. User Authentication Flow
Login and registration process with validation and session management.

### 3. Product Search & Browse Flow
Shows how users discover products through:
- Search modal with live results
- Category browsing
- Filtering and sorting
- Recent search history

### 4. Admin Order Management Flow
Admin workflow for:
- Viewing orders
- Updating order status
- Adding tracking information
- Customer notifications

### 5. Product Review Flow
Complete review lifecycle including:
- Purchase verification
- Review submission
- Admin approval process
- Helpful/unhelpful voting

### 6. Cart & Wishlist Management Flow
Shows dual-purpose CartItem entity with type distinction:
- Adding items to cart or wishlist
- Moving items between cart and wishlist
- Quantity management
- Checkout initiation

### 7. Admin Product Management Flow
Product CRUD operations including:
- Creating new products
- Editing existing products
- Image management with Vercel Blob
- Category assignment
- Stock and flag management

## Key Decision Points

- **Authentication Gates**: Many flows check if user is logged in
- **Payment Method Selection**: Three options (Stripe, PayHere, COD)
- **Item Type**: CartItem can be 'cart' or 'wishlist'
- **Order Status Progression**: pending → processing → shipped → delivered
- **Review Approval**: Admin gate before reviews go public
