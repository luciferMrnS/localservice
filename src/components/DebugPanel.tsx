'use client';

import { useState } from 'react';

export default function DebugPanel() {
  const [requests, setRequests] = useState<any[]>([]);
  const [listeners, setListeners] = useState(0);
  const [globalStateInfo, setGlobalStateInfo] = useState<string>('');

  const fetchDebugInfo = async () => {
    try {
      // Import the database functions
      const { getCurrentRequests, subscribeToRequests, getServiceRequests } = await import('@/lib/database');
      
      // Check global state directly
      const globalStateInfo = `globalThis.__serviceAppData exists: ${!!(globalThis as any).__serviceAppData}`;
      setGlobalStateInfo(globalStateInfo);
      
      // Get current requests from global state
      const currentRequests = getCurrentRequests();
      console.log('🔍 Debug panel: Current requests from global state:', currentRequests);
      console.log('🔍 Debug panel: Global state info:', globalStateInfo);
      setRequests(currentRequests);
      
      // Also try fetching via function
      const fetchedRequests = await getServiceRequests();
      console.log('🔍 Debug panel: Fetched requests via function:', fetchedRequests);
      
      // Subscribe to updates to count listeners
      const unsubscribe = subscribeToRequests(() => {
        console.log('🔄 Debug panel: Data updated');
        const updatedRequests = getCurrentRequests();
        console.log('🔍 Debug panel: Updated requests:', updatedRequests);
        setRequests(updatedRequests);
      });
      
      // Count listeners (this is a rough estimate)
      setListeners(1);
      
      return unsubscribe;
    } catch (error) {
      console.error('❌ Debug panel error:', error);
    }
  };

  const createTestRequest = async () => {
    try {
      const { createServiceRequest } = await import('@/lib/database');
      
      const testRequest = {
        clientName: 'Debug Test',
        phoneNumber: '123-456-7890',
        serviceAddress: {
          address: '123 Debug St',
          lat: 40.7128,
          lng: -74.0060,
        },
        serviceType: 'Debug Service',
        description: 'Test request from debug panel',
        photos: [],
        serviceTier: 'standard' as const,
        bookingType: 'asap' as const,
        status: 'pending' as const,
      };
      
      console.log('🧪 Creating test request from debug panel...');
      const result = await createServiceRequest(testRequest);
      console.log('✅ Test request created:', result);
      
      // Refresh the debug info
      fetchDebugInfo();
    } catch (error) {
      console.error('❌ Error creating test request:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">🔍 Debug Panel</h3>
      
      <div className="space-x-2 mb-2">
        <button
          onClick={fetchDebugInfo}
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
        >
          Refresh
        </button>
        <button
          onClick={createTestRequest}
          className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
        >
          Test Request
        </button>
      </div>
      
      <div className="text-xs space-y-1">
        <div>📊 Requests: {requests.length}</div>
        <div>👂 Listeners: {listeners}</div>
        <div className="text-xs text-gray-500 break-words">{globalStateInfo}</div>
        
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