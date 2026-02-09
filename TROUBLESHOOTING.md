# Local Service App - Troubleshooting Guide

## Issue: Can't Find Request Service Form Submissions on Admin Dashboard

### Problem Description
The admin dashboard is not showing form submissions that users have submitted through the service request form.

### Root Cause Analysis

The application uses **two different data storage systems**:

1. **Vercel Blob Storage** (Production) - Persistent storage
2. **In-Memory Storage** (Development) - Temporary storage during session

### Storage System Details

#### Vercel Blob Storage (Recommended for Production)
- **File**: `src/lib/database.ts`
- **Storage**: `service-requests.json` in Vercel Blob
- **Environment Variable**: `BLOB_READ_WRITE_TOKEN`
- **Persistence**: Data persists across server restarts
- **Access**: Both admin dashboard and form submissions use this

#### In-Memory Storage (Development Mode)
- **File**: `src/lib/database.ts` (fallback when no BLOB token)
- **Storage**: Global state in memory
- **Persistence**: Data lost on server restart
- **Access**: Only works within the same session

### How to Fix the Issue

#### Option 1: Set Up Vercel Blob Storage (Recommended)

1. **Get Vercel Blob Token**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to Settings → Storage → Blob
   - Create a new token

2. **Update Environment Variables**:
   ```bash
   # In .env.local file
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
   ```

3. **Restart the Development Server**:
   ```bash
   npm run dev
   ```

#### Option 2: Use Development Mode (Temporary Fix)

If you can't set up Vercel Blob immediately:

1. **Submit a Test Request**:
   - Go to the main page
   - Select a service
   - Fill out the form
   - Submit the request

2. **Check Admin Dashboard**:
   - The request should appear immediately
   - **Note**: Data will be lost if you restart the server

### Debugging Steps

#### Step 1: Check Storage Configuration
1. Open the admin dashboard
2. Look for the storage indicator in the header
3. You should see:
   - **"Storage: Vercel Blob ✓"** (if configured correctly)
   - **"Storage: In-Memory (Development) ⚠️ Development Mode"** (if not configured)

#### Step 2: Check Console Logs
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for these messages:
   ```
   📦 Loading data from Vercel Blob...
   ✅ Loaded from Blob: X requests
   ```
   or
   ```
   ⚠️ Could not load from Blob, using in-memory
   ```

#### Step 3: Test Form Submission
1. Submit a test request through the form
2. Check console for:
   ```
   💾 Creating service request...
   ✅ Service request created: [request data]
   ```
3. Check if it appears in admin dashboard

### Common Issues and Solutions

#### Issue 1: No Requests Showing
**Symptoms**: Admin dashboard shows "No service requests yet"

**Solutions**:
1. Check if `BLOB_READ_WRITE_TOKEN` is set in `.env.local`
2. Restart the development server after setting the token
3. Submit a new test request
4. Check console for error messages

#### Issue 2: Requests Disappear After Restart
**Symptoms**: Requests show up but disappear after restarting the server

**Solution**: Set up Vercel Blob storage with proper token

#### Issue 3: Permission Errors
**Symptoms**: Console shows "permission-denied" or "unauthenticated"

**Solutions**:
1. Verify your Vercel Blob token has read/write permissions
2. Check that the token is correctly copied to `.env.local`
3. Ensure no extra spaces or characters in the token

#### Issue 4: Network Errors
**Symptoms**: Console shows "unavailable" or network timeout

**Solutions**:
1. Check internet connection
2. Verify Vercel Blob service is accessible
3. Check if Vercel project is properly configured

### Environment Variables Reference

```bash
# Required for Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here

# Optional (for Firebase - not used in current implementation)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Required for Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Admin password
NEXT_PUBLIC_ADMIN_PASSWORD=proservice
```

### Testing the Fix

1. **Set up Vercel Blob token** in `.env.local`
2. **Restart development server**:
   ```bash
   npm run dev
   ```
3. **Submit a test request**:
   - Go to main page
   - Select any service
   - Fill out form completely
   - Submit
4. **Check admin dashboard**:
   - Go to `/admin`
   - Enter password: `proservice`
   - Verify request appears in the list

### Production Deployment

When deploying to production:

1. **Set environment variables** in Vercel dashboard
2. **Verify Vercel Blob is configured** for the project
3. **Test form submission** after deployment
4. **Check admin dashboard** shows the submitted requests

### Additional Debug Tools

#### Debug Panel
- A debug panel appears in the bottom-right corner
- Shows current request count and recent requests
- Can create test requests for debugging

#### Console Logging
The application logs detailed information:
- Form submissions
- Database operations
- Storage operations
- Error messages

#### Network Tab
Check the Network tab in developer tools for:
- Blob API calls
- Database operations
- Error responses

### Contact Support

If you're still having issues:

1. **Check console logs** for specific error messages
2. **Verify environment variables** are correctly set
3. **Test with a simple form submission**
4. **Share console output** for debugging assistance

### Files Involved

- `src/lib/database.ts` - Database operations and storage logic
- `src/components/AdminDashboard.tsx` - Admin dashboard component
- `src/app/page.tsx` - Main page with form submission
- `src/app/admin/page.tsx` - Admin login and dashboard
- `.env.local` - Environment variables