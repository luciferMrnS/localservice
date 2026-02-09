'use client';

import { useState } from 'react';
import { useServiceRequests } from '@/contexts/ServiceRequestContext';
import { formatDistance, formatDuration } from '@/lib/maps';

export default function AdminDashboard() {
  const { requests, updateRequest, refreshRequests } = useServiceRequests();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredRequests = requests.filter((request: any) => {
    const matchesStatus = filter === 'all' || request.status === filter;
    const matchesSearch = searchTerm === '' || 
      request.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.serviceAddress.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'accepted': return '✅';
      case 'in_progress': return '🔧';
      case 'completed': return '🎉';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      await updateRequest(requestId, { status: newStatus });
      if (selectedRequest?.id === requestId) {
        setSelectedRequest((prev: any) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage all service requests and client submissions</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="font-medium">Total Requests:</span> {requests.length}
              </div>
<div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="font-medium">Storage:</span> PostgreSQL Database
              </div>
<button
                onClick={async () => {
                  setIsRefreshing(true);
                  await refreshRequests();
                  setIsRefreshing(false);
                }}
                disabled={isRefreshing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Requests</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, service, or address..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Service Requests ({filteredRequests.length})</h2>
              </div>
              
              {filteredRequests.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                  <p className="text-sm text-gray-600">
                    {requests.length === 0 
                      ? "No service requests have been submitted yet." 
                      : "No requests match your current filters."}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredRequests.map((request: any) => (
                    <div
                      key={request.id}
                      className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedRequest?.id === request.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedRequest(request)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{request.serviceType}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)} {request.status.replace('_', ' ')}
                            </span>
                            {request.serviceTier === 'emergency' && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">🚨 Emergency</span>
                            )}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="text-gray-500">Client:</span> {request.clientName} • {request.phoneNumber}</p>
                            <p><span className="text-gray-500">Address:</span> {request.serviceAddress.address}</p>
                            <p className="text-xs text-gray-500">
                              {request.bookingType === 'asap' ? '🚀 ASAP' : '📅 Scheduled'} • {formatDate(request.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedRequest ? (
              <div className="bg-white rounded-lg shadow-sm border sticky top-6">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Request Details</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Service Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Service:</span> {selectedRequest.serviceType}</p>
                      <p>
                        <span className="text-gray-500">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                          {getStatusIcon(selectedRequest.status)} {selectedRequest.status.replace('_', ' ')}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-500">Priority:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${selectedRequest.serviceTier === 'emergency' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                          {selectedRequest.serviceTier === 'emergency' ? '🚨 Emergency' : '📋 Standard'}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Client Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Name:</span> {selectedRequest.clientName}</p>
                      <p><span className="text-gray-500">Phone:</span> {selectedRequest.phoneNumber}</p>
                      <p><span className="text-gray-500">Address:</span> {selectedRequest.serviceAddress.address}</p>
                    </div>
                  </div>
                  
                  {selectedRequest.description && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                      <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-md">{selectedRequest.description}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Actions</h3>
                    <div className="space-y-2">
                      {selectedRequest.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatusUpdate(selectedRequest.id, 'accepted')} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">✅ Accept Request</button>
                          <button onClick={() => handleStatusUpdate(selectedRequest.id, 'cancelled')} className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">❌ Cancel Request</button>
                        </>
                      )}
                      {selectedRequest.status === 'accepted' && (
                        <button onClick={() => handleStatusUpdate(selectedRequest.id, 'in_progress')} className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">🔧 Start Job</button>
                      )}
                      {selectedRequest.status === 'in_progress' && (
                        <button onClick={() => handleStatusUpdate(selectedRequest.id, 'completed')} className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">🎉 Complete Job</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center">
                  <div className="text-gray-400 text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Request</h3>
                  <p className="text-sm text-gray-600">Click on a request to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}