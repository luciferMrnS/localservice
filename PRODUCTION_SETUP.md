# Production Deployment Setup Guide

## Environment Variables Required for Production

Your deployed app is failing because these environment variables are not configured in Vercel:

## 🔧 Step 1: Configure Vercel Environment Variables

Go to your Vercel project → Settings → Environment Variables and add:

### **Required for Basic Functionality:**
```env
NEXT_PUBLIC_ADMIN_PASSWORD=proservice
```

### **Required for Form Submissions:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_firebase_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
```

### **Optional for Enhanced Features:**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token
```

## 🔧 Step 2: Firebase Setup (Required)

1. **Create Firebase Project**: https://console.firebase.google.com
2. **Enable Firestore Database**: 
   - Go to "Build" → "Firestore Database"
   - Create database in "Test mode"
   - Select location near your users
3. **Get Web App Config**:
   - Project Settings → General → Your apps
   - Click "Web app" → Copy configuration
4. **Update Vercel Environment Variables** with your actual Firebase config

## 🔧 Step 3: Google Maps Setup (Optional)

1. **Create Google Cloud Project**: https://console.cloud.google.com
2. **Enable APIs**:
   - Places API
   - Geocoding API
   - Distance Matrix API
3. **Create API Key** with proper restrictions
4. **Add to Vercel Environment Variables**

## 🔧 Step 4: Vercel Blob Setup (Optional for Photos)

1. **Create Blob Store**: Vercel project → Storage → Create Database → Blob
2. **Get Token**: Storage → Blob → Settings → .env.local
3. **Add to Vercel Environment Variables**

## 🔧 Step 5: Redeploy

After updating environment variables:

1. Go to your Vercel project
2. Click "Deployments"
3. Click "..." → "Redeploy"

## 🚨 Current Issues on Your Deployment

### **1. Google Maps API Key Missing**
- **Error**: `key=undefined` in API calls
- **Fix**: Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to Vercel environment variables
- **Impact**: No address autocomplete, no distance calculations

### **2. Vercel Blob Token Missing**
- **Error**: Photo uploads failing
- **Fix**: Add `BLOB_READ_WRITE_TOKEN` to Vercel environment variables
- **Impact**: No photo uploads

### **3. Firebase Not Configured**
- **Error**: Form submissions failing
- **Fix**: Add Firebase config to Vercel environment variables
- **Impact**: No data persistence

## 🎯 Minimum Working Setup

For the app to work with basic functionality:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_ADMIN_PASSWORD=proservice
```

## 📋 What I Fixed

- ✅ **Graceful fallbacks** when API keys are missing
- ✅ **Better error handling** for missing services
- ✅ **No more crashes** due to undefined API keys
- ✅ **Clear console messages** for debugging

## 🚀 Next Actions

1. **Configure Firebase** and add to Vercel environment variables
2. **Redeploy** to apply changes
3. **Test form submission** - should work now
4. **Add optional services** (Google Maps, Vercel Blob) for enhanced features

The app will work with just Firebase configured. Google Maps and Vercel Blob are optional enhancements.