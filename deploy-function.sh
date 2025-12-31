#!/bin/bash

echo "🚀 Deploying Edge Function to Supabase..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Check if logged in
echo "🔐 Checking Supabase authentication..."
if ! supabase projects list &> /dev/null; then
    echo "Please login to Supabase:"
    supabase login
fi

# Link to project
echo "🔗 Linking to project erdkwgoslgdmgxchsqtv..."
supabase link --project-ref erdkwgoslgdmgxchsqtv

# Deploy the function
echo "📦 Deploying generate-wish function..."
supabase functions deploy generate-wish --no-verify-jwt

echo "✅ Function deployed successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Go to: https://supabase.com/dashboard/project/erdkwgoslgdmgxchsqtv/functions"
echo "2. Click on 'generate-wish' function"
echo "3. Go to 'Settings' tab"
echo "4. Add environment variables:"
echo "   - OPENAI_API_KEY: your-openai-api-key"
echo "   - SUPABASE_URL: https://erdkwgoslgdmgxchsqtv.supabase.co"
echo "   - SUPABASE_SERVICE_ROLE_KEY: (from Project Settings → API)"
echo ""
echo "🎉 Your function is now live and should work!"