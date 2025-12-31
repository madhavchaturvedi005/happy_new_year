# 🔧 Manual Setup for OpenAI Integration

The function is currently using fallback wishes. To enable OpenAI-powered personalized wishes, follow these steps:

## Step 1: Go to Supabase Dashboard

Visit: https://supabase.com/dashboard/project/erdkwgoslgdmgxchsqtv/functions

## Step 2: Configure Environment Variables

1. Click on the **"generate-wish"** function
2. Click on the **"Settings"** tab
3. Scroll down to **"Environment Variables"** section
4. Add these variables:

### Required Environment Variables:

| Variable Name | Value |
|---------------|-------|
| `OPENAI_API_KEY` | `your-openai-api-key-here` |

### Optional (for database storage):

| Variable Name | Value |
|---------------|-------|
| `DATABASE_URL` | `https://erdkwgoslgdmgxchsqtv.supabase.co` |
| `SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyZGt3Z29zbGdkbWd4Y2hzcXR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzIwMDY2OCwiZXhwIjoyMDgyNzc2NjY4fQ.ix4N-B0GuJf-SDu03LpivIW2vsmOD0CCqHWzhqy1JFk` |

## Step 3: Save and Wait

After adding the environment variables:
1. Click **"Save"** 
2. Wait 1-2 minutes for the function to restart
3. Test your app again

## Step 4: Verify OpenAI is Working

You'll know OpenAI is working when:
- Name meanings become more detailed and accurate
- Wishes are more personalized and varied
- The responses are longer and more creative

## Current Status

✅ **Function Deployed**: Edge function is live and working
✅ **Database Ready**: Storage and tables are set up  
✅ **Anon Key Fixed**: JWT token is correct
⚠️ **OpenAI Pending**: Needs manual environment variable setup

## Troubleshooting

If it's still using fallback after setup:
1. Check the function logs in the Supabase dashboard
2. Verify the OpenAI API key is valid and has credits
3. Try redeploying the function: `npx supabase functions deploy generate-wish`

## Test Command

After setup, test with:
```bash
node test-openai.js
```

You should see more detailed and personalized responses!