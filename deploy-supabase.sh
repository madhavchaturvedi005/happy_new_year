#!/bin/bash

echo "🚀 Deploying to Supabase..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Login to Supabase (if not already logged in)
echo "🔐 Checking Supabase login..."
supabase status 2>/dev/null || {
    echo "Please login to Supabase:"
    supabase login
}

# Link to your project
echo "🔗 Linking to project erdkwgoslgdmgxchsqtv..."
supabase link --project-ref erdkwgoslgdmgxchsqtv

# Deploy the Edge Function
echo "📦 Deploying generate-wish function..."
supabase functions deploy generate-wish

# Apply database migrations
echo "🗄️ Applying database migrations..."
supabase db push

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/erdkwgoslgdmgxchsqtv"
echo "2. Navigate to Project Settings → Edge Functions → Environment Variables"
echo "3. Add these environment variables:"
echo "   - OPENAI_API_KEY: your-openai-api-key"
echo "   - SUPABASE_URL: https://erdkwgoslgdmgxchsqtv.supabase.co"
echo "   - SUPABASE_SERVICE_ROLE_KEY: (get from Project Settings → API)"
echo "4. Update your local .env file with your actual OpenAI API key"
echo ""
echo "🎉 Your app should now work!"