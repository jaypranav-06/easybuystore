# Vercel Quick Start

## ✅ Project Status

Your project is now **linked to Vercel**:
- **Project Name:** `easybuystore-nextjs`
- **GitHub Repo:** Connected
- **Project ID:** `prj_u4cKX3Xmv6rLxAkrNhFAbartYNlr`

## 🚀 Your Vercel URL

After deployment, your URL will be:
```
https://easybuystore-nextjs.vercel.app
```

## 📋 Quick Deploy Steps

### Step 1: Add Environment Variables (Via Dashboard - Easiest)

Go to: https://vercel.com/dashboard → easybuystore-nextjs → Settings → Environment Variables

Add these variables for **Production** environment:

```
DATABASE_URL
Value: Get from your .env file

DIRECT_URL
Value: Get from your .env file

NEXT_PUBLIC_SUPABASE_URL
Value: Get from your .env file

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
Value: Get from your .env file

NEXTAUTH_URL
Value: https://easybuystore-nextjs.vercel.app

NEXTAUTH_SECRET
Value: Get from your .env file

GOOGLE_CLIENT_ID
Value: Get from your .env file

GOOGLE_CLIENT_SECRET
Value: Get from your .env file
```

### Step 2: Deploy

Option A - Via Dashboard:
```
https://vercel.com/dashboard → easybuystore-nextjs → Deployments → Deploy
```

Option B - Via CLI:
```bash
npx vercel --prod
```

### Step 3: Update Google OAuth

After deployment, add your Vercel URL to Google Cloud Console:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth Client ID
3. Add to **Authorized redirect URIs:**
   ```
   https://easybuystore-nextjs.vercel.app/api/auth/callback/google
   ```
4. Add to **Authorized JavaScript origins:**
   ```
   https://easybuystore-nextjs.vercel.app
   ```
5. Click SAVE

### Step 4: Test

1. Visit: `https://easybuystore-nextjs.vercel.app`
2. Test Google sign-in
3. Verify products load correctly

---

## 📁 Files Created

- `.vercel/` - Vercel configuration (ignored by git)
- `CLAUDE.md` - Vercel best practices (ignored by git)
- `.env.local` - Local environment pulled from Vercel
- `add-vercel-env.sh` - Script to add env vars via CLI (optional)

---

## 🔧 Useful Commands

```bash
# Deploy to production
npx vercel --prod

# Deploy to preview
npx vercel

# View deployment logs
npx vercel logs

# Pull environment variables
npx vercel env pull

# Add environment variable
npx vercel env add VARIABLE_NAME production

# List all deployments
npx vercel ls

# View project info
npx vercel inspect
```

---

## 🌐 Your URLs

After deployment, you'll have:

**Production:**
```
https://easybuystore-nextjs.vercel.app
```

**Preview (develop branch):**
```
https://easybuystore-nextjs-git-develop.vercel.app
```

**Feature Branches:**
```
https://easybuystore-nextjs-git-[branch-name].vercel.app
```

---

## ⚙️ Environment Variable Priority

1. **Production** - main branch
2. **Preview** - Other branches (develop, feature/*)
3. **Development** - Local development (already in your .env)

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

- Push to `main` → Production deploy
- Push to `develop` → Preview deploy
- Open PR → Preview deploy with unique URL

---

## 📊 Monitoring

View your app's performance:
- **Dashboard:** https://vercel.com/dashboard
- **Analytics:** Settings → Analytics
- **Logs:** Deployments → [Your Deploy] → Logs

---

## 🆘 Troubleshooting

### Build Fails

Check build logs in Vercel dashboard. Common issues:
- Missing environment variables
- Prisma Client not generated (should be automatic)

### Auth Not Working

1. Verify NEXTAUTH_URL matches your Vercel domain
2. Check Google OAuth redirect URIs
3. Verify all environment variables are set

### Database Connection Issues

Already configured with connection pooling in your DATABASE_URL

---

## ✅ Deployment Checklist

- [ ] Project linked to Vercel
- [ ] Environment variables added in Vercel dashboard
- [ ] NEXTAUTH_URL set to `https://easybuystore-nextjs.vercel.app`
- [ ] Google OAuth redirect URIs updated
- [ ] Deployed to production
- [ ] Tested authentication
- [ ] Verified products load
- [ ] Checked deployment logs

---

## 📝 Notes

- Your project is already connected to GitHub
- Vercel will auto-deploy on every push
- No special configuration needed for Next.js
- All dependencies are properly configured

**Ready to deploy!** 🚀
