'use client';

import { useState, useEffect } from 'react';
import { ServiceRequest } from '@/types';
import { getServiceRequests, updateServiceRequest } from '@/lib/database';
import { formatDistance, formatDuration } from '@/lib/maps';
import { BASE_LOCATION } from '@/types';

export default function AdminDashboard() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getServiceRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: ServiceRequest['status']) => {
    try {
      await updateServiceRequest(requestId, { status: newStatus });
      await fetchRequests();
      if (selectedRequest?.id === requestId) {
        setSelectedRequest(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Base Location: {BASE_LOCATION.address}
              </span>
              <button
                onClick={fetchRequests}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Requests List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  Service Requests ({requests.length})
                </h2>
              </div>
              <div className="divide-y">
                {requests.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No service requests yet
                  </div>
                ) : (
                  requests.map((request) => (
                    <div
                      key={request.id}
                      className={`px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedRequest?.id === request.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedRequest(request)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {request.serviceType}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {getStatusText(request.status)}
                            </span>
                            {request.serviceTier === 'emergency' && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                Emergency
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {request.clientName} • {request.phoneNumber}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            {request.serviceAddress.address}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              {request.bookingType === 'asap' ? 'ASAP' : `Scheduled: ${request.scheduledDateTime?.toLocaleString()}`}
                            </span>
                            {request.estimatedDistance && (
                              <span>{formatDistance(request.estimatedDistance)} away</span>
                            )}
                            {request.estimatedTravelTime && (
                              <span>{formatDuration(request.estimatedTravelTime)} travel time</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="lg:col-span-1">
            {selectedRequest ? (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Request Details
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Service</h3>
                    <p className="text-sm text-gray-600">{selectedRequest.serviceType}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Client</h3>
                    <p className="text-sm text-gray-600">{selectedRequest.clientName}</p>
                    <p className="text-sm text-gray-600">{selectedRequest.phoneNumber}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Address</h3>
                    <p className="text-sm text-gray-600">{selectedRequest.serviceAddress.address}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Description</h3>
                    <p className="text-sm text-gray-600">{selectedRequest.description}</p>
                  </div>
                  
                  {selectedRequest.estimatedDistance && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Distance & Time</h3>
                      <p className="text-sm text-gray-600">
                        {formatDistance(selectedRequest.estimatedDistance)} • {formatDuration(selectedRequest.estimatedTravelTime || 0)}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Actions</h3>
                    <div className="space-y-2">
                      {selectedRequest.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(selectedRequest.id, 'accepted')}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Accept Request
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(selectedRequest.id, 'cancelled')}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Cancel Request
                          </button>
                        </>
                      )}
                      
                      {selectedRequest.status === 'accepted' && (
                        <button
                          onClick={() => handleStatusUpdate(selectedRequest.id, 'in_progress')}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Start Job
                        </button>
                      )}
                      
                      {selectedRequest.status === 'in_progress' && (
                        <button
                          onClick={() => handleStatusUpdate(selectedRequest.id, 'completed')}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Complete Job
                        </button>
                      )}
                      
                      <button
                        onClick={() => setShowMap(true)}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        View Map
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center text-gray-500">
                Select a request to view details
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Modal */}
      {showMap && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Route to {selectedRequest.serviceAddress.address}
              </h3>
              <button
                onClick={() => setShowMap(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="text-4xl mb-4">🗺️</div>
                  <p>Map integration would go here</p>
                  <p className="text-sm mt-2">
                    From: {BASE_LOCATION.address}<br />
                    To: {selectedRequest.serviceAddress.address}
                  </p>
                  {selectedRequest.estimatedDistance && (
                    <p className="text-sm mt-2">
                      Distance: {formatDistance(selectedRequest.estimatedDistance)}<br />
                      Travel Time: {formatDuration(selectedRequest.estimatedTravelTime || 0)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}