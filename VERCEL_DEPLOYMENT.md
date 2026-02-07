# Vercel Deployment Guide

## ✅ Your Deployments Are Working!

Your Vercel deployments are building successfully. If you're experiencing issues, it's likely related to environment variables or runtime configuration.

## Required: Set Environment Variable

**CRITICAL**: You must configure the backend API URL in Vercel:

1. Go to your Vercel dashboard: https://vercel.com/israahs-projects/burnaware
2. Click on **Settings** tab
3. Click on **Environment Variables** in the left sidebar
4. Add a new variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://burnaware.onrender.com`
   - **Environment**: Select **Production**, **Preview**, and **Development**
5. Click **Save**
6. Go back to **Deployments** tab
7. Click the **⋯** menu on the latest deployment
8. Click **Redeploy**

## How to Access Your Site

1. In Vercel dashboard, go to the **Deployments** tab
2. Click on the most recent "Ready" deployment
3. Look for the domain URL at the top (should be like `burnaware-xxxxx.vercel.app`)
4. Click **Visit** to open your deployed site

## Troubleshooting

### If you see "Cannot connect to backend":

- Make sure you've set the `NEXT_PUBLIC_API_URL` environment variable (see above)
- Redeploy after adding the variable

### If login doesn't work:

- Check browser console (F12 → Console tab) for error messages
- Verify the API calls are going to `https://burnaware.onrender.com` not `localhost:8000`

### If pages are blank:

- Check browser console for JavaScript errors
- Make sure all environment variables are set correctly

## Your Backend URL

Your Render backend is live at: `https://burnaware.onrender.com`

Test it: https://burnaware.onrender.com/health-check

## Files Added

- [`vercel.json`](file:///Users/israahhanfa/burnaware/vercel.json) - Vercel build configuration
- [`frontend/.env.production`](file:///Users/israahhanfa/burnaware/frontend/.env.production) - Production environment template

## Next Steps

1. **Set the environment variable** in Vercel (see above)
2. **Redeploy** your site
3. **Visit your site** and test functionality
4. If issues persist, check browser console and share error messages
