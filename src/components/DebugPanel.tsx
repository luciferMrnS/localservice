'use client';

import { useState } from 'react';
import { useServiceRequests } from '@/contexts/ServiceRequestContext';

export default function DebugPanel() {
  const { requests, createRequest } = useServiceRequests();

  const createTestRequest = async () => {
    try {
      const testRequest = {
        clientName: 'React Context Test',
        phoneNumber: '123-456-7890',
        serviceAddress: {
          address: '123 React Context St',
          lat: 40.7128,
          lng: -74.0060,
        },
        serviceType: 'React Context Service',
        description: 'Test request from React Context debug panel',
        photos: [],
        serviceTier: 'standard' as const,
        bookingType: 'asap' as const,
        status: 'pending' as const,
      };
      
      console.log('🧪 React Context: Creating test request from debug panel...');
      const result = await createRequest(testRequest);
      console.log('✅ React Context: Test request created:', result);
    } catch (error) {
      console.error('❌ React Context: Error creating test request:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">🔍 React Context Debug</h3>
      
      <button
        onClick={createTestRequest}
        className="w-full bg-green-500 text-white px-2 py-1 rounded text-xs mb-2 hover:bg-green-600"
      >
        Create Test Request
      </button>
      
      <div className="text-xs space-y-1">
        <div>📊 Requests: {requests.length}</div>
        <div>🔄 Real-time: Yes (React Context)</div>
        
        {requests.length > 0 && (
          <div className="mt-2 pt-2 border-t">
            <div className="font-semibold">Recent Requests:</div>
            {requests.slice(0, 3).map((req, index) => (
              <div key={req.id} className="mt-1">
                {index + 1}. {req.clientName} - {req.serviceType}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}