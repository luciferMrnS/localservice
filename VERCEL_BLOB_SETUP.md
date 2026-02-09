# Vercel Blob Storage Setup Guide

To enable photo uploads using Vercel Blob storage, follow these steps:

## Step 1: Install Vercel Blob

```bash
npm install @vercel/blob
```

## Step 2: Create Vercel Blob Store

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Storage" tab
4. Click "Create Database"
5. Select "Blob" and follow the setup
6. Choose a region (closest to your users)
7. Click "Create"

## Step 3: Get Blob Token

1. In your Vercel project, go to "Storage" → "Blob"
2. Click on your blob store
3. Go to "Settings" → ".env.local"
4. Copy the `BLOB_READ_WRITE_TOKEN`

## Step 4: Add to Environment Variables

Add the token to your `.env.local`:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_actual_token_here
```

## Step 5: Deploy to Vercel

For production, add the token to your Vercel environment variables:

1. Go to your Vercel project settings
2. Go to "Environment Variables"
3. Add `BLOB_READ_WRITE_TOKEN` with your token
4. Deploy your project

## Features

✅ **Automatic URL Generation**: Public URLs for uploaded files
✅ **No Size Limits**: Generous storage quotas
✅ **Fast CDN**: Global edge network
✅ **Simple API**: Easy to use upload/download
✅ **Secure**: Token-based access control

## Current Status

❌ Vercel Blob token not configured
✅ Photo upload code ready
✅ File validation implemented
✅ Fallback to manual input works

## Storage Limits

- **Free Tier**: 1GB storage, 100GB bandwidth/month
- **Pro Tier**: 100GB storage, 1TB bandwidth/month
- **Enterprise**: Custom limits

Perfect for photo uploads in service requests!