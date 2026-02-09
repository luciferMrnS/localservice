import { NextResponse } from 'next/server';
import { createServiceRequest, getServiceRequests } from '@/lib/database';
import { ServiceRequest } from '@/types';

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    
    console.log('🔥 API: Creating service request...', requestData);
    
    const result = await createServiceRequest(requestData);
    
    console.log('✅ API: Service request created successfully:', result);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('❌ API: Error creating service request:', error);
    
    let errorMessage = 'Failed to create service request';
    
    if (error instanceof Error) {
      if (error.message.includes('DATABASE_URL not configured')) {
        errorMessage = 'Database not configured. Please contact support.';
      } else if (error.message.includes('permission-denied')) {
        errorMessage = 'Database permission denied. Please contact support.';
      } else if (error.message.includes('unavailable')) {
        errorMessage = 'Database unavailable. Please try again later.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    console.log('📥 API: Fetching service requests...', status ? `status: ${status}` : 'all');
    
    const requests = await getServiceRequests(status as ServiceRequest['status'] || undefined);
    
    console.log('✅ API: Service requests fetched successfully:', requests.length);
    
    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error('❌ API: Error fetching service requests:', error);
    
    let errorMessage = 'Failed to fetch service requests';
    
    if (error instanceof Error) {
      if (error.message.includes('DATABASE_URL not configured')) {
        errorMessage = 'Database not configured. Please contact support.';
      } else if (error.message.includes('permission-denied')) {
        errorMessage = 'Database permission denied. Please contact support.';
      } else if (error.message.includes('unavailable')) {
        errorMessage = 'Database unavailable. Please try again later.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}