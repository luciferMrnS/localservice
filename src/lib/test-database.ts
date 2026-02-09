// Test file to verify database functionality
// Run this in the browser console to test

import { createServiceRequest, getServiceRequests, getCurrentRequests } from '@/lib/database';

// Test function
export async function testDatabase() {
  console.log('🧪 Testing database functionality...');
  
  // Create a test request
  const testRequest = {
    clientName: 'Test Client',
    phoneNumber: '123-456-7890',
    serviceAddress: {
      address: '123 Test St',
      lat: 40.7128,
      lng: -74.0060,
    },
    serviceType: 'Test Service',
    description: 'This is a test request',
    photos: [],
    serviceTier: 'standard' as const,
    bookingType: 'asap' as const,
    status: 'pending' as const,
  };
  
  console.log('📝 Creating test request...');
  const created = await createServiceRequest(testRequest);
  console.log('✅ Created:', created);
  
  console.log('📥 Fetching requests...');
  const fetched = await getServiceRequests();
  console.log('📊 Fetched:', fetched);
  
  console.log('🔍 Current requests from global state:');
  const current = getCurrentRequests();
  console.log('📊 Current:', current);
  
  return { created, fetched, current };
}