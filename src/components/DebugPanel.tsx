'use client';

import { useState } from 'react';

export default function DebugPanel() {
  const [requests, setRequests] = useState<any[]>([]);
  const [listeners, setListeners] = useState(0);

  const fetchDebugInfo = async () => {
    try {
      // Import the database functions
      const { getCurrentRequests, subscribeToRequests } = await import('@/lib/database');
      
      // Get current requests
      const currentRequests = getCurrentRequests();
      setRequests(currentRequests);
      
      // Subscribe to updates to count listeners
      const unsubscribe = subscribeToRequests(() => {
        console.log('Debug panel: Data updated');
        const updatedRequests = getCurrentRequests();
        setRequests(updatedRequests);
      });
      
      // Count listeners (this is a rough estimate)
      setListeners(1);
      
      return unsubscribe;
    } catch (error) {
      console.error('Debug panel error:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">🔍 Debug Panel</h3>
      
      <button
        onClick={fetchDebugInfo}
        className="w-full bg-blue-500 text-white px-2 py-1 rounded text-xs mb-2 hover:bg-blue-600"
      >
        Refresh Debug Info
      </button>
      
      <div className="text-xs space-y-1">
        <div>📊 Requests: {requests.length}</div>
        <div>👂 Listeners: {listeners}</div>
        
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