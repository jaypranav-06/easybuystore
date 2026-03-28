#!/bin/bash

# Script to add environment variables to Vercel
# Usage: bash add-vercel-env.sh

echo "🚀 Adding Environment Variables to Vercel..."
echo ""
echo "⚠️  IMPORTANT: Update NEXTAUTH_URL after first deployment!"
echo ""

# Read from .env file and add to Vercel
npx vercel env add DATABASE_URL production <<< "$(grep DATABASE_URL .env | cut -d '=' -f2 | tr -d '\"')"
npx vercel env add DIRECT_URL production <<< "$(grep DIRECT_URL .env | cut -d '=' -f2 | tr -d '\"')"
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "$(grep NEXT_PUBLIC_SUPABASE_URL .env | cut -d '=' -f2 | tr -d '\"')"
npx vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY production <<< "$(grep NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY .env | cut -d '=' -f2 | tr -d '\"')"
npx vercel env add NEXTAUTH_SECRET production <<< "$(grep NEXTAUTH_SECRET .env | cut -d '=' -f2 | tr -d '\"')"
npx vercel env add GOOGLE_CLIENT_ID production <<< "$(grep GOOGLE_CLIENT_ID .env | cut -d '=' -f2 | tr -d '\"')"
npx vercel env add GOOGLE_CLIENT_SECRET production <<< "$(grep GOOGLE_CLIENT_SECRET .env | cut -d '=' -f2 | tr -d '\"')"

echo ""
echo "✅ Environment variables added!"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Find your project: easybuystore-nextjs"
echo "3. Add NEXTAUTH_URL manually with your Vercel domain"
echo "4. Run: npx vercel --prod"
