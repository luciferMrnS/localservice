import { NextResponse } from 'next/server';
import { updateServiceRequest } from '@/lib/database';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    
    console.log('🔄 API: Updating service request...', id, updates);
    
    const success = await updateServiceRequest(id, updates);
    
    if (success) {
      console.log('✅ API: Service request updated successfully:', id);
      return NextResponse.json({ success: true });
    } else {
      throw new Error('Failed to update service request');
    }
  } catch (error) {
    console.error('❌ API: Error updating service request:', error);
    
    let errorMessage = 'Failed to update service request';
    
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