# Test Account Credentials

## 🔐 Available Test Accounts

### Primary Test User (Customer)
```
Email: brotestuser@gmail.com
Password: easybuystore123
```
**User ID:** 14
**Name:** Bro Test User
**Role:** Customer

---

### Admin Account
```
Email: admin@easybuy.com
Password: admin123
```
**Role:** Admin
**Username:** admin

---

### Alternative Test User (Customer)
```
Email: testuser@example.com
Password: testuser123
```
**Name:** Test User
**Role:** Customer

---

## 🚀 How to Login

### As Customer:
1. Go to: http://localhost:3000/signin
2. Use email: `brotestuser@gmail.com`
3. Password: `easybuystore123`
4. You'll be redirected to homepage as logged-in customer

### As Admin:
1. Go to: http://localhost:3000/signin
2. Use email: `admin@easybuy.com`
3. Password: `admin123`
4. You'll be redirected to admin dashboard

---

## ✅ What You Can Test

### As Customer (brotestuser@gmail.com):
- ✓ Browse products and categories
- ✓ Add items to cart
- ✓ Add items to wishlist
- ✓ Checkout process
- ✓ View order history
- ✓ Update profile settings
- ✓ Change password
- ✓ Logout functionality

### As Admin (admin@easybuy.com):
- ✓ Manage products (CRUD)
- ✓ Manage categories
- ✓ View and process orders
- ✓ Manage customers
- ✓ View analytics
- ✓ Store settings
- ✓ Logout functionality

---

## 🌐 Google Sign-In (OAuth)

You can also sign in with Google:
1. Click "Sign in with Google" button
2. Select your Google account
3. Account will be auto-created in database
4. Works on both localhost and production

---

## 📝 Create New Account

You can register new accounts at:
- **Signup URL:** http://localhost:3000/signup
- Fill in the registration form
- Create your own credentials

---

## 🔒 Security Notes

1. **Production:** Change all default passwords before deploying
2. **Testing:** These credentials are for development/testing only
3. **Never commit** real user credentials to Git
4. **Delete this file** before deploying to production

---

## 📊 Database Info

- **Database:** Supabase PostgreSQL
- **Users Table:** `users`
- **Admin Table:** `admin_users`

---

**Last Updated:** 2026-03-27
**Environment:** Development/Testing
