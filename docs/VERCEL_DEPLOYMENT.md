# Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. **Connect GitHub Repository**
   - Go to: https://vercel.com/new
   - Sign in with GitHub
   - Click "Import Project"
   - Select your repository: `jaypranav-06/buystore`
   - Click "Import"

2. **Configure Project Settings**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

3. **Add Environment Variables**
   Click "Environment Variables" and add each variable:

### Environment Variables for Vercel

#### Database (Supabase)
```
DATABASE_URL
postgresql://postgres.cztqhcuoebdlwkhmjliv:EasyBuyStore%40@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10&pool_timeout=20
```

```
DIRECT_URL
postgresql://postgres.cztqhcuoebdlwkhmjliv:EasyBuyStore%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

#### Supabase Public
```
NEXT_PUBLIC_SUPABASE_URL
https://cztqhcuoebdlwkhmjliv.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
sb_publishable_afZOgHNh-NHAcwEVw-KX-w_ZLrhHfRm
```

#### NextAuth
```
NEXTAUTH_URL
https://your-project-name.vercel.app
```
**IMPORTANT:** Replace `your-project-name` with your actual Vercel domain (you'll get this after first deployment)

```
NEXTAUTH_SECRET
feesMMBCs205lj4bByWFw4oEUpzV7DDnC7odEX0KPjo=
```

#### Google OAuth
```
GOOGLE_CLIENT_ID
your-google-client-id.apps.googleusercontent.com
```
**Note:** Get this from your `.env` file

```
GOOGLE_CLIENT_SECRET
your-google-client-secret
```
**Note:** Get this from your `.env` file

#### PayPal (Optional)
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID
your-paypal-client-id
```

```
PAYPAL_CLIENT_SECRET
your-paypal-client-secret
```

```
PAYPAL_MODE
sandbox
```

4. **Select Environment for Each Variable**
   For each variable, select:
   - ☑ Production
   - ☑ Preview
   - ☑ Development

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Note your deployment URL (e.g., `https://easybuystore.vercel.app`)

---

## After First Deployment

### 1. Update NEXTAUTH_URL

After deployment, Vercel gives you a domain like `https://easybuystore.vercel.app`

1. Go to: **Project Settings** → **Environment Variables**
2. Find `NEXTAUTH_URL`
3. Click "Edit"
4. Change value to your actual Vercel domain
5. Click "Save"
6. **Redeploy** from Deployments tab

### 2. Update Google OAuth Configuration

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs:**
   ```
   https://your-project-name.vercel.app/api/auth/callback/google
   ```
4. Add to **Authorized JavaScript origins:**
   ```
   https://your-project-name.vercel.app
   ```
5. Click **SAVE**

### 3. Test Your Deployment

1. Visit your Vercel URL
2. Test `/api/auth/session` endpoint (should return `{}`)
3. Try Google sign-in
4. Test product browsing
5. Test cart functionality

---

## Custom Domain Setup (Optional)

### Add Custom Domain

1. Go to: **Project Settings** → **Domains**
2. Click "Add"
3. Enter your domain (e.g., `easybuystore.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-60 minutes)

### Update Environment Variables for Custom Domain

1. Update `NEXTAUTH_URL` to your custom domain:
   ```
   NEXTAUTH_URL=https://easybuystore.com
   ```

2. Update Google OAuth redirect URIs:
   ```
   https://easybuystore.com/api/auth/callback/google
   https://easybuystore.com
   ```

3. Redeploy

---

## Environment-Specific Deployments

Vercel automatically creates preview deployments for each branch:

### Production
- Branch: `main`
- URL: `https://your-project.vercel.app`
- Environment: Production

### Preview (Staging)
- Branch: `develop`
- URL: `https://your-project-git-develop.vercel.app`
- Environment: Preview

### Feature Branches
- Branch: `feature/new-feature`
- URL: `https://your-project-git-feature-new-feature.vercel.app`
- Environment: Preview

---

## Vercel CLI Deployment (Alternative)

### Install Vercel CLI

```bash
npm i -g vercel
```

### Login to Vercel

```bash
vercel login
```

### Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Set Environment Variables via CLI

```bash
# Production
vercel env add NEXTAUTH_URL production
# Paste: https://your-project.vercel.app

# Preview
vercel env add NEXTAUTH_URL preview
# Paste: https://your-project-git-develop.vercel.app

# Development
vercel env add NEXTAUTH_URL development
# Paste: http://localhost:3000
```

---

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

- **Push to `main`** → Production deployment
- **Push to `develop`** → Preview deployment
- **Open PR** → Preview deployment with unique URL

### Disable Auto-Deploy (if needed)

1. Go to: **Project Settings** → **Git**
2. Under "Ignored Build Step"
3. Add custom script to control when to deploy

---

## Environment Variables Management

### Add Variable

1. Project Settings → Environment Variables
2. Click "Add New"
3. Enter Key and Value
4. Select environments (Production/Preview/Development)
5. Click "Save"

### Edit Variable

1. Find variable in list
2. Click "Edit"
3. Update value
4. Click "Save"
5. Redeploy for changes to take effect

### Delete Variable

1. Find variable in list
2. Click "Delete"
3. Confirm deletion

---

## Troubleshooting

### Build Fails with "Prisma Client not generated"

**Solution:** Vercel runs `npm run build` which already includes `prisma generate` in your package.json:
```json
"build": "prisma generate && next build"
```
No action needed - this is already configured.

### Error: NEXTAUTH_URL is not set

**Solution:**
1. Check Environment Variables in Vercel dashboard
2. Ensure NEXTAUTH_URL is set
3. Redeploy

### Google Sign-In Returns 404

**Solution:**
1. Add Vercel domain to Google OAuth redirect URIs
2. Format: `https://your-project.vercel.app/api/auth/callback/google`
3. Don't forget to add JavaScript origin too

### Database Connection Timeout

**Solution:** Already configured with connection pooling in DATABASE_URL:
```
?pgbouncer=true&connection_limit=10&pool_timeout=20
```

### Environment Variables Not Updating

**Solution:** After changing environment variables, you MUST redeploy:
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"

---

## Vercel vs Netlify

| Feature | Vercel | Netlify |
|---------|--------|---------|
| Next.js Support | Native, Optimized | Plugin-based |
| Build Speed | Faster | Good |
| Preview Deployments | Automatic | Automatic |
| Custom Domains | Included | Included |
| Serverless Functions | Unlimited | 125k/month free |
| Best For | Next.js apps | Any static site |

**Recommendation:** Vercel is optimized for Next.js and provides better performance out of the box.

---

## Monitoring and Logs

### View Deployment Logs

1. Go to **Deployments** tab
2. Click on a deployment
3. View build logs and runtime logs

### View Function Logs

1. Go to **Deployments** tab
2. Click on a deployment
3. Click "Functions" tab
4. View real-time logs

### Analytics

1. Go to **Analytics** tab
2. View page views, unique visitors
3. Monitor performance metrics

---

## Best Practices

1. **Use Environment Variables** for all secrets
2. **Enable Preview Deployments** for all branches
3. **Set up Custom Domain** with SSL (automatic)
4. **Monitor Build Logs** for errors
5. **Use Git Integration** for automatic deployments
6. **Test Preview Deployments** before merging to main
7. **Keep Environment Variables in Sync** across environments

---

## Quick Deployment Checklist

- [ ] Repository connected to Vercel
- [ ] All 8+ environment variables added
- [ ] NEXTAUTH_URL set to Vercel domain
- [ ] Google OAuth redirect URIs updated
- [ ] First deployment successful
- [ ] `/api/auth/session` returns `{}`
- [ ] Google sign-in works
- [ ] Products load correctly
- [ ] Database queries working
- [ ] No errors in function logs

---

## Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Next.js Documentation: https://nextjs.org/docs

---

## Summary

Vercel is the recommended platform for deploying Next.js applications. It provides:
- Automatic deployments from GitHub
- Preview deployments for all branches
- Built-in SSL certificates
- Global CDN
- Serverless functions
- Environment variables management
- Zero configuration for Next.js

Simply connect your GitHub repository, add environment variables, and deploy!
