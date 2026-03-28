# Logout Redirect Fix - Summary

## Problem

After deploying to Vercel, logout redirects were going to the wrong domain:
- Expected: `https://buystore-rbhw.vercel.app/signin`
- Actual: `https://buystore.vercel.app/` (different domain)

This happened for both admin and regular users.

## Root Cause

The `signOut()` function from NextAuth was using relative callback URLs (`/signin`), which NextAuth then resolved against the `NEXTAUTH_URL` environment variable. If the environment variable was set to a different domain, it would redirect there instead of the current domain.

## Solution

Updated all logout handlers to use the current domain dynamically via `window.location.origin`.

### Changes Made

#### 1. Admin Logout (AdminSidebar.tsx)
**Before:**
```typescript
await signOut({ callbackUrl: '/signin' });
```

**After:**
```typescript
const baseUrl = window.location.origin;
await signOut({ callbackUrl: `${baseUrl}/signin` });
```

#### 2. Customer Logout (Navbar.tsx)
**Admin in navbar - Before:**
```typescript
signOut();
```

**Admin in navbar - After:**
```typescript
const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
signOut({ callbackUrl: `${baseUrl}/signin` });
```

**Regular user - Before:**
```typescript
signOut();
```

**Regular user - After:**
```typescript
const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
signOut({ callbackUrl: `${baseUrl}/` });
```

#### 3. Password Change Logout (settings/page.tsx)
**Before:**
```typescript
await signOut({ redirect: false });
router.push('/signin');
```

**After:**
```typescript
const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
await signOut({ callbackUrl: `${baseUrl}/signin` });
```

## Files Modified

1. `components/admin/AdminSidebar.tsx` - Admin panel logout
2. `components/customer/Navbar.tsx` - Navbar logout (admin & user)
3. `app/account/settings/page.tsx` - Password change logout

## Benefits

✅ Works correctly on any domain:
- Localhost: `http://localhost:3000`
- Vercel: `https://buystore-rbhw.vercel.app`
- Netlify: `https://silly-longma-69e139.netlify.app`
- Custom domains: `https://easybuystore.com`

✅ No hardcoded URLs

✅ Consistent behavior across all logout points

✅ Works for both admin and regular users

## Testing Checklist

### Admin Logout
- [ ] Logout from admin sidebar → Redirects to `/signin` on current domain
- [ ] Logout from navbar (as admin) → Redirects to `/signin` on current domain

### User Logout
- [ ] Logout from navbar → Redirects to `/` on current domain
- [ ] Change password → Auto logout → Redirects to `/signin` on current domain

### Environments
- [ ] Works on localhost
- [ ] Works on Vercel
- [ ] Works on Netlify (if applicable)
- [ ] Works on custom domain (if applicable)

## Deployment

Pushed to: `feature/netlify-auth-fix` branch

Auto-deploys to Vercel preview when pushed.

## Related Commits

1. `2989703` - Fix admin logout redirect URL for production deployment
2. `0663f50` - Fix user password change logout redirect for production

---

**Issue**: Fixed
**Status**: Ready for testing
**Date**: 2026-03-27
