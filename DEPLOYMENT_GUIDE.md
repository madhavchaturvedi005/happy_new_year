# 🚀 Deployment Guide

## Quick Fix for CORS Error

The CORS error means the Edge Function hasn't been deployed to your new Supabase project yet. Here's how to fix it:

## Option 1: Automated Deployment (Recommended)

Run the deployment script:
```bash
./deploy-supabase.sh
```

## Option 2: Manual Deployment

### Step 1: Install Supabase CLI (if not installed)
```bash
npm install -g supabase
```

### Step 2: Login and Link Project
```bash
# Login to Supabase
supabase login

# Link to your new project
supabase link --project-ref erdkwgoslgdmgxchsqtv
```

### Step 3: Deploy Edge Function
```bash
supabase functions deploy generate-wish
```

### Step 4: Apply Database Schema
```bash
supabase db push
```

## Step 5: Set Environment Variables

Go to your Supabase dashboard:
1. Visit: https://supabase.com/dashboard/project/erdkwgoslgdmgxchsqtv
2. Go to Project Settings → Edge Functions → Environment Variables
3. Add these variables:

| Variable | Value |
|----------|-------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `SUPABASE_URL` | `https://erdkwgoslgdmgxchsqtv.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Get from Project Settings → API |

## Step 6: Update Local Environment

Update your `.env` file with your actual OpenAI API key:
```env
OPENAI_API_KEY="sk-your-actual-openai-api-key-here"
```

## Step 7: Run Database Schema

Copy the contents of `supabase_schema.sql` and run it in your Supabase SQL Editor:
https://supabase.com/dashboard/project/erdkwgoslgdmgxchsqtv/sql

## ✅ Verification

After deployment, your app should work without CORS errors. The function will:
- Use OpenAI to generate personalized wishes (if API key is configured)
- Fall back to nice default wishes (if no API key)
- Store visitor data in the database
- Handle photo uploads to storage

## 🔧 Troubleshooting

- **Still getting CORS errors?** Make sure the function deployed successfully
- **Function not working?** Check the Edge Function logs in Supabase dashboard
- **Database errors?** Make sure you ran the SQL schema in the SQL Editor
- **Photo upload issues?** Verify the storage bucket was created properly

## 🎯 What's Changed

- ✅ Updated Supabase project configuration
- ✅ Fixed publishable key format
- ✅ Added OpenAI API integration
- ✅ Added fallback for when API key is missing
- ✅ Complete database schema with proper policies
- ✅ Storage bucket for photo uploads