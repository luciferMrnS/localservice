# Google Maps API Setup Guide

To enable address autocomplete suggestions, you need to configure a Google Maps API key.

## Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "API key"
5. Copy your API key

## Step 2: Enable Required APIs

In your Google Cloud Console project, enable these APIs:

1. **Places API** - For address autocomplete
2. **Geocoding API** - For address coordinates
3. **Distance Matrix API** - For travel time calculations

## Step 3: Configure API Key Restrictions (Recommended)

1. Go to your API key settings
2. Under "Application restrictions", select "HTTP referrers"
3. Add your domain (e.g., `localhost:3000/*` for development)
4. Under "API restrictions", select "Restrict key"
5. Select only the APIs you enabled in Step 2

## Step 4: Add to Environment Variables

Add your API key to `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

## Step 5: Restart Development Server

After updating the environment variables, restart your development server:

```bash
npm run dev
```

## Testing

Once configured, you should see:
- Autocomplete suggestions when typing addresses
- No console errors about missing API key
- Distance calculations working in the admin dashboard

## Current Status

❌ Google Maps API key not configured
✅ Manual address input works
✅ Form submission works without coordinates

## Free Tier Limits

Google Maps offers a generous free tier:
- $200/month credit
- ~28,000 Places API calls per month
- ~100,000 Distance Matrix calls per month

This should be sufficient for most small businesses.