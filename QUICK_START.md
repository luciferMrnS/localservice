# Quick Start: Testing Form Submissions

## You've Set Up Vercel Blob Storage! 🎉

Your `BLOB_READ_WRITE_TOKEN` is now configured. Here's how to test if form submissions are working:

## Step 1: Start Your Development Server

```bash
cd local-service-app
npm run dev
```

## Step 2: Test Form Submission

1. **Open your browser** and go to: `http://localhost:3000`

2. **Select a service** (e.g., "Pipe Repair" under Plumbing)

3. **Fill out the form completely**:
   - Full Name: `Test User`
   - Phone Number: `555-123-4567`
   - Address: Start typing and select from autocomplete
   - Description: `Test service request for verification`
   - Service Tier: `Standard`
   - When needed: `ASAP`
   - Click "Submit Request"

4. **Check for success message**: You should see "Request submitted successfully!"

## Step 3: Check Admin Dashboard

1. **Go to admin dashboard**: `http://localhost:3000/admin`

2. **Enter password**: `proservice`

3. **Look for storage indicator** in the header:
   - ✅ Should show: **"Storage: Vercel Blob ✓"**
   - ❌ If shows: **"Storage: In-Memory (Development) ⚠️"** - token not working

4. **Check for your test request**:
   - Should appear in the requests list
   - Shows service type, client name, address
   - Status should be "Pending"

## Step 4: Verify in Console

Open browser developer tools (F12) and check the Console tab for these messages:

```
📦 Loading data from Vercel Blob...
✅ Loaded from Blob: 1 requests
💾 Creating service request...
✅ Service request created: [request data]
```

## Troubleshooting

### Issue: No requests showing in admin dashboard

**Check these:**
1. ✅ `BLOB_READ_WRITE_TOKEN` is set in `.env.local` (it is!)
2. ✅ Development server restarted after setting token
3. ✅ Form was submitted successfully
4. ✅ No console errors

**If still not working:**
- Check console for error messages
- Verify the storage indicator shows "Vercel Blob ✓"
- Try submitting another test request

### Issue: Storage shows "In-Memory (Development)"

**This means:**
- The token isn't being read properly
- Check `.env.local` file format
- Restart development server
- Verify no syntax errors in `.env.local`

## Test Scripts Available

I've created test scripts you can run in browser console:

### Storage Test
```javascript
// Copy this to browser console after loading admin dashboard
async function testStorageSetup() {
  console.log('Testing storage setup...');
  const hasToken = !!process.env?.BLOB_READ_WRITE_TOKEN;
  console.log('BLOB_READ_WRITE_TOKEN available:', hasToken);
  
  if (hasToken) {
    console.log('✅ Vercel Blob is configured');
  } else {
    console.log('❌ Token not found');
  }
}
testStorageSetup();
```

### Form Submission Test
```javascript
// Copy this to browser console after loading main page
async function testFormSubmission() {
  console.log('Testing form submission...');
  // This simulates what happens when you submit a form
  console.log('Form would be submitted to:', process.env.BLOB_READ_WRITE_TOKEN ? 'Vercel Blob' : 'In-Memory');
}
testFormSubmission();
```

## Expected Results

✅ **Success indicators:**
- Admin dashboard shows "Storage: Vercel Blob ✓"
- Console shows "✅ Loaded from Blob: X requests"
- Your test request appears in the requests list
- No error messages in console

❌ **If something's wrong:**
- Storage shows "In-Memory (Development) ⚠️"
- Console shows error messages
- No requests appear in admin dashboard
- Form submission fails

## Next Steps

Once you've verified form submissions are working:

1. **Test different services** - try submitting requests for different service types
2. **Test status updates** - use admin dashboard to change request status
3. **Test with photos** - upload images when submitting requests
4. **Test scheduled requests** - try the "Scheduled" booking option

## Production Deployment

When you're ready to deploy:

1. **Set environment variables** in Vercel dashboard
2. **Verify Vercel Blob is configured** for your project
3. **Test form submission** after deployment
4. **Check admin dashboard** shows submitted requests

## Need Help?

Check the detailed troubleshooting guide: `TROUBLESHOOTING.md`

Or run the test scripts above to diagnose issues.