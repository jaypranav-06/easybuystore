#!/bin/bash

# Script to sync Stripe environment variables to Vercel
# This will add the Stripe keys from .env.local to your Vercel project

echo "🔍 Checking Stripe configuration..."

# Extract Stripe keys from .env.local
STRIPE_PK=$(grep NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY .env.local | cut -d '=' -f2 | tr -d '"')
STRIPE_SK=$(grep STRIPE_SECRET_KEY .env.local | cut -d '=' -f2 | tr -d '"' | grep -v NEXT_PUBLIC)
STRIPE_WH=$(grep STRIPE_WEBHOOK_SECRET .env.local | cut -d '=' -f2 | tr -d '"')

if [ -z "$STRIPE_PK" ] || [ -z "$STRIPE_SK" ]; then
  echo "❌ Stripe keys not found in .env.local"
  exit 1
fi

echo "✅ Found Stripe keys in .env.local"
echo ""
echo "📤 Adding Stripe environment variables to Vercel..."
echo ""

# Add to Production
echo "Adding to Production environment..."
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production <<EOF
$STRIPE_PK
EOF

vercel env add STRIPE_SECRET_KEY production <<EOF
$STRIPE_SK
EOF

vercel env add STRIPE_WEBHOOK_SECRET production <<EOF
$STRIPE_WH
EOF

# Add to Preview
echo ""
echo "Adding to Preview environment..."
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY preview <<EOF
$STRIPE_PK
EOF

vercel env add STRIPE_SECRET_KEY preview <<EOF
$STRIPE_SK
EOF

vercel env add STRIPE_WEBHOOK_SECRET preview <<EOF
$STRIPE_WH
EOF

# Add to Development
echo ""
echo "Adding to Development environment..."
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY development <<EOF
$STRIPE_PK
EOF

vercel env add STRIPE_SECRET_KEY development <<EOF
$STRIPE_SK
EOF

vercel env add STRIPE_WEBHOOK_SECRET development <<EOF
$STRIPE_WH
EOF

echo ""
echo "✅ Stripe environment variables added to Vercel!"
echo ""
echo "🔄 To apply changes, you need to redeploy:"
echo "   vercel --prod"
echo ""
echo "📝 Note: Your Stripe keys:"
echo "   Publishable Key: ${STRIPE_PK:0:20}..."
echo "   Secret Key: ${STRIPE_SK:0:20}..."
