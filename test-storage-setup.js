// Test script to verify Vercel Blob storage setup
// Run this in browser console after loading the admin dashboard

async function testStorageSetup() {
  console.log('🧪 Testing Vercel Blob Storage Setup...');
  
  try {
    // Check if BLOB_READ_WRITE_TOKEN is available
    const hasToken = !!process.env?.BLOB_READ_WRITE_TOKEN;
    console.log('📋 BLOB_READ_WRITE_TOKEN available:', hasToken);
    
    if (!hasToken) {
      console.log('❌ BLOB_READ_WRITE_TOKEN not found in environment');
      console.log('💡 Make sure it\'s set in your .env.local file');
      return;
    }
    
    console.log('✅ BLOB_READ_WRITE_TOKEN is configured');
    
    // Test database functions
    console.log('🔍 Testing database functions...');
    
    // Try to get current requests
    if (typeof window !== 'undefined' && window.getServiceRequests) {
      console.log('🎯 Database functions are available');
      const requests = await window.getServiceRequests();
      console.log('📊 Current requests count:', requests.length);
      console.log('📋 Requests:', requests);
    } else {
      console.log('⚠️ Database functions not directly accessible');
      console.log('💡 This is normal - they\'re server-side functions');
    }
    
    // Check admin dashboard storage indicator
    const storageIndicator = document.querySelector('[data-testid="storage-indicator"]') || 
                            document.querySelector('.storage-info') ||
                            document.querySelector('div:contains("Storage:")');
    
    if (storageIndicator) {
      console.log('🎯 Found storage indicator:', storageIndicator.textContent);
    } else {
      console.log('⚠️ Storage indicator not found in DOM');
      console.log('💡 Check the admin dashboard header for storage information');
    }
    
    console.log('✅ Storage setup test completed');
    
  } catch (error) {
    console.error('❌ Storage test failed:', error);
  }
}

// Instructions
console.log('📋 Storage Setup Test Instructions:');
console.log('1. Load the admin dashboard (/admin)');
console.log('2. Enter password: proservice');
console.log('3. Open browser developer tools (F12)');
console.log('4. Go to Console tab');
console.log('5. Copy and paste the testStorageSetup() function');
console.log('6. Run: testStorageSetup()');
console.log('');
console.log('Expected results:');
console.log('- ✅ BLOB_READ_WRITE_TOKEN is configured');
console.log('- 📊 Current requests count: [number]');
console.log('- 🎯 Found storage indicator: Storage: Vercel Blob ✓');

// Export for potential use
if (typeof module !== 'undefined') {
  module.exports = { testStorageSetup };
}