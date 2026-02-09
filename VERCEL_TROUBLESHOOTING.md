# Vercel Deployment Troubleshooting Guide

## 401 Error Solutions

The 401 errors on your Vercel deployment indicate authentication/configuration issues. Here's how to fix them:

## 🔧 Step 1: Check Environment Variables

Go to your Vercel project → Settings → Environment Variables and ensure these are configured:

### **Required Variables:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_firebase_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_ADMIN_PASSWORD=proservice
```

### **Optional Variables:**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token
```

## 🔧 Step 2: Firebase Setup

1. **Create Firebase Project**: https://console.firebase.google.com
2. **Enable Firestore Database**: 
   - Go to "Build" → "Firestore Database"
   - Create database in "Test mode" (for now)
   - Select a location near your users
3. **Get Web App Config**:
   - Project Settings → General → Your apps
   - Click "Web app" → Copy config
4. **Update Vercel Environment Variables** with your actual Firebase config

## 🔧 Step 3: Vercel Blob Setup (for photos)

1. **Create Blob Store**: Vercel project → Storage → Create Database → Blob
2. **Get Token**: Storage → Blob → Settings → .env.local
3. **Add to Vercel**: `BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token`

## 🔧 Step 4: Redeploy

After updating environment variables:

1. Go to your Vercel project
2. Click "Deployments"
3. Click "..." → "Redeploy"

## 🚨 Common 401 Causes

### **1. Missing Firebase Config**
- Firebase not properly configured
- API keys missing or incorrect
- Project ID not set

### **2. Firestore Rules**
- Default rules may block access
- Update Firestore rules to allow reads/writes:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For testing only
    }
  }
}
```

### **3. Environment Variables Not Set**
- Variables in `.env.local` but not in Vercel
- Variables not prefixed with `NEXT_PUBLIC_` for client-side access

## 🔍 Debug Steps

### **Check Browser Console:**
1. Open your deployed site
2. Press F12 → Console tab
3. Look for Firebase initialization errors
4. Check for missing environment variable warnings

### **Check Vercel Logs:**
1. Vercel project → Functions tab
2. Check function logs for detailed errors
3. Look for authentication failures

## 🎯 Quick Fix

If you want the site to work without Firebase initially:

1. **Set basic environment variables** in Vercel
2. **Use demo mode** - forms will work but data won't persist
3. **Add Firebase later** when properly configured

## 📋 Current Status Check

- ✅ Code deployed to Vercel
- ❌ Environment variables likely missing
- ❌ Firebase not configured
- ❌ Vercel Blob not set up

## 🚀 Next Actions

1. **Configure Firebase** and update Vercel environment variables
2. **Set up Vercel Blob** for photo uploads
3. **Redeploy** to apply changes
4. **Test** all functionality

Need help with any specific step?