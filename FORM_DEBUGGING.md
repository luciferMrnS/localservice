# Form Submission Debugging Guide

## "Error submitting request" - How to Fix

This error occurs when the form submission fails. Here's how to debug and fix it:

## 🔍 Step 1: Check Browser Console

1. Open your app (local or deployed)
2. Press F12 → Console tab
3. Fill and submit the form
4. Look for red error messages

### **Common Console Errors:**

#### **Firebase Not Configured:**
```
Firebase not initialized - cannot create service request
Firebase configuration missing
```

#### **Permission Denied:**
```
Firebase permission denied
permission-denied
```

#### **Network Issues:**
```
Firebase unavailable
unavailable
```

## 🔧 Step 2: Check Firebase Configuration

### **For Local Development:**
Check `.env.local` has these values:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
```

### **For Vercel Deployment:**
Check Vercel Environment Variables have the same values.

## 🔧 Step 3: Check Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to "Firestore Database"
4. Ensure database is created
5. Check security rules

### **Default Rules (for testing):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Allows all access
    }
  }
}
```

## 🔧 Step 4: Test Firebase Connection

Add this to your browser console to test:
```javascript
// Test Firebase initialization
import { db } from './src/lib/firebase.js';
console.log('Firebase DB:', db);
```

## 🚨 Common Issues & Solutions

### **Issue 1: Missing API Keys**
**Error**: `Firebase not configured`
**Solution**: Add Firebase config to environment variables

### **Issue 2: Firestore Rules**
**Error**: `permission-denied`
**Solution**: Update Firestore security rules

### **Issue 3: No Database**
**Error**: `unavailable`
**Solution**: Create Firestore database in Firebase console

### **Issue 4: Network Issues**
**Error**: `unavailable`
**Solution**: Check internet connection, CORS settings

## 🎯 Quick Fix Checklist

- [ ] Firebase project created
- [ ] Firestore database created
- [ ] Environment variables set (local + Vercel)
- [ ] Firestore rules allow read/write
- [ ] API keys are correct
- [ ] No network issues

## 🧪 Testing Steps

1. **Check Console**: Look for specific error messages
2. **Verify Firebase**: Ensure project and database exist
3. **Test Environment**: Check variables are set correctly
4. **Update Rules**: Set permissive rules for testing
5. **Restart Dev Server**: After changing environment variables

## 📞 If Still Not Working

1. **Share Console Error**: What specific error do you see?
2. **Check Firebase Status**: Is Firebase console showing the database?
3. **Verify Environment**: Are variables set in both local and Vercel?

## 🔬 Debug Mode

I've added better error logging. Check the console for detailed error messages that will tell you exactly what's wrong.