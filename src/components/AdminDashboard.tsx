'use client';

import { useState } from 'react';
import { useServiceRequests } from '@/contexts/ServiceRequestContext';
import { formatDistance, formatDuration } from '@/lib/maps';
import { BASE_LOCATION } from '@/types';

export default function AdminDashboard() {
  const { requests, getRequests, updateRequest } = useServiceRequests();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter requests based on status and search
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

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
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
      {/* Header */}
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
                <span className="font-medium">Storage:</span> React Context
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Requests
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, service, or address..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Status Filter */}
            <div className="sm:w-48">
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                id="status-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          {/* Requests List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Service Requests ({filteredRequests.length})
                </h2>
                {filter !== 'all' && (
                  <button
                    onClick={() => setFilter('all')}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              
              {filteredRequests.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                  <p className="text-sm text-gray-600">
                    {requests.length === 0 
                      ? "No service requests have been submitted yet." 
                      : "No requests match your current filters."
                    }
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
                            <h3 className="font-semibold text-gray-900">
                              {request.serviceType}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)} {request.status.replace('_', ' ')}
                            </span>
                            {request.serviceTier === 'emergency' && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                🚨 Emergency
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Client:</span>
                              <span className="font-medium text-gray-900">{request.clientName}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">{request.phoneNumber}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Address:</span>
                              <span className="text-gray-900">{request.serviceAddress.address}</span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>
                                {request.bookingType === 'asap' ? '🚀 ASAP' : '📅 Scheduled'}
                              </span>
                              {request.estimatedDistance && (
                                <span>📍 {formatDistance(request.estimatedDistance)}</span>
                              )}
                              {request.estimatedTravelTime && (
                                <span>⏱️ {formatDuration(request.estimatedTravelTime)}</span>
                              )}
                              <span>📅 {formatDate(request.createdAt)}</span>
                            </div>
                            
                            {request.description && (
                              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                <p className="text-sm text-gray-700">{request.description}</p>
                              </div>
                            )}
                            
                            {request.photos && request.photos.length > 0 && (
                              <div className="mt-2">
                                <span className="text-xs text-gray-500">📷 {request.photos.length} photo(s)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Request Details */}
          <div className="lg:col-span-1">
            {selectedRequest ? (
              <div className="bg-white rounded-lg shadow-sm border sticky top-6">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Request Details
                  </h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Service Info */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Service Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Service Type:</span>
                        <span className="font-medium text-gray-900">{selectedRequest.serviceType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                          {getStatusIcon(selectedRequest.status)} {selectedRequest.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Priority:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedRequest.serviceTier === 'emergency' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedRequest.serviceTier === 'emergency' ? '🚨 Emergency' : '📋 Standard'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Client Info */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Client Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <p className="font-medium text-gray-900 mt-1">{selectedRequest.clientName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <p className="font-medium text-gray-900 mt-1">{selectedRequest.phoneNumber}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Address:</span>
                        <p className="font-medium text-gray-900 mt-1">{selectedRequest.serviceAddress.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  {selectedRequest.description && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-700">{selectedRequest.description}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Timing */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Timing</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Booking Type:</span>
                        <span className="font-medium text-gray-900">
                          {selectedRequest.bookingType === 'asap' ? '🚀 ASAP' : '📅 Scheduled'}
                        </span>
                      </div>
                      {selectedRequest.scheduledDateTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Scheduled:</span>
                          <span className="font-medium text-gray-900">
                            {formatDate(selectedRequest.scheduledDateTime)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Submitted:</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(selectedRequest.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Actions</h3>
                    <div className="space-y-2">
                      {selectedRequest.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(selectedRequest.id, 'accepted')}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            ✅ Accept Request
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(selectedRequest.id, 'cancelled')}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                          >
                            ❌ Cancel Request
                          </button>
                        </>
                      )}
                      
                      {selectedRequest.status === 'accepted' && (
                        <button
                          onClick={() => handleStatusUpdate(selectedRequest.id, 'in_progress')}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                        >
                          🔧 Start Job
                        </button>
                      )}
                      
                      {selectedRequest.status === 'in_progress' && (
                        <button
                          onClick={() => handleStatusUpdate(selectedRequest.id, 'completed')}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                        >
                          🎉 Complete Job
                        </button>
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
                  <p className="text-sm text-gray-600">
                    Click on a request from the list to view details and take action
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
                  </p>
                  {!storageInfo.hasBlobToken && (
                    <div className="mt-4 text-sm text-yellow-600">
                      In development mode, requests are only stored in memory during this session.
                    </div>
                  )}
                </div>
              ) : (
                <div className="divide-y max-h-[600px] overflow-y-auto">
                  {filteredRequests.map((request) => (
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
                            <h3 className="font-semibold text-gray-900 text-lg">
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
                            {request.bookingType === 'scheduled' && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                Scheduled
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Client:</span> {request.clientName}
                              </p>
                              <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Phone:</span> {request.phoneNumber}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Submitted:</span> {request.createdAt.toLocaleString()}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Address:</span> {request.serviceAddress.address}
                              </p>
                              {request.scheduledDateTime && request.bookingType === 'scheduled' && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Scheduled:</span> {request.scheduledDateTime.toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              📍 {request.serviceAddress.address.split(',')[0]}
                            </span>
                            {request.estimatedDistance && (
                              <span className="flex items-center gap-1">
                                📏 {formatDistance(request.estimatedDistance)}
                              </span>
                            )}
                            {request.estimatedTravelTime && (
                              <span className="flex items-center gap-1">
                                ⏱️ {formatDuration(request.estimatedTravelTime)}
                              </span>
                            )}
                          </div>

                          <div className="text-sm text-gray-600 line-clamp-2">
                            <span className="font-medium">Description:</span> {request.description}
                          </div>

                          {request.photos && request.photos.length > 0 && (
                            <div className="mt-3">
                              <span className="text-xs text-gray-500">Photos:</span>
                              <div className="flex gap-2 mt-1">
                                {request.photos.slice(0, 3).map((photo, index) => (
                                  <img
                                    key={index}
                                    src={photo}
                                    alt={`Photo ${index + 1}`}
                                    className="w-16 h-16 object-cover rounded-md border"
                                  />
                                ))}
                                {request.photos.length > 3 && (
                                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-600">
                                    +{request.photos.length - 3} more
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRequest(request);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedRequest.serviceType}
                </h2>
                <p className="text-sm text-gray-600 mt-1">Request Details</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMap(true)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                >
                  View Map
                </button>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Client Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Client Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedRequest.clientName}</div>
                    <div><span className="font-medium">Phone:</span> {selectedRequest.phoneNumber}</div>
                    <div><span className="font-medium">Submitted:</span> {selectedRequest.createdAt.toLocaleString()}</div>
                    <div><span className="font-medium">Updated:</span> {selectedRequest.updatedAt.toLocaleString()}</div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Service Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Service Type:</span> {selectedRequest.serviceType}</div>
                    <div><span className="font-medium">Service Tier:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        selectedRequest.serviceTier === 'emergency' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedRequest.serviceTier}
                      </span>
                    </div>
                    <div><span className="font-medium">Booking Type:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        selectedRequest.bookingType === 'scheduled' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedRequest.bookingType}
                      </span>
                    </div>
                    {selectedRequest.scheduledDateTime && selectedRequest.bookingType === 'scheduled' && (
                      <div><span className="font-medium">Scheduled Date:</span> {selectedRequest.scheduledDateTime.toLocaleString()}</div>
                    )}
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Service Address</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Address:</span> {selectedRequest.serviceAddress.address}</div>
                    <div><span className="font-medium">Coordinates:</span> {selectedRequest.serviceAddress.lat.toFixed(6)}, {selectedRequest.serviceAddress.lng.toFixed(6)}</div>
                    {selectedRequest.estimatedDistance && (
                      <div><span className="font-medium">Distance:</span> {formatDistance(selectedRequest.estimatedDistance)}</div>
                    )}
                    {selectedRequest.estimatedTravelTime && (
                      <div><span className="font-medium">Travel Time:</span> {formatDuration(selectedRequest.estimatedTravelTime)}</div>
                    )}
                  </div>
                </div>

                {/* Status Actions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Status Management</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Current Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                        {getStatusText(selectedRequest.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {selectedRequest.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(selectedRequest.id, 'accepted')}
                            className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Accept Request
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(selectedRequest.id, 'cancelled')}
                            className="w-full px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            Cancel Request
                          </button>
                        </>
                      )}
                      
                      {selectedRequest.status === 'accepted' && (
                        <button
                          onClick={() => handleStatusUpdate(selectedRequest.id, 'in_progress')}
                          className="w-full px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                        >
                          Start Job
                        </button>
                      )}
                      
                      {selectedRequest.status === 'in_progress' && (
                        <button
                          onClick={() => handleStatusUpdate(selectedRequest.id, 'completed')}
                          className="w-full px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Complete Job
                        </button>
                      )}
                      
                      {selectedRequest.status !== 'completed' && selectedRequest.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusUpdate(selectedRequest.id, 'cancelled')}
                          className="w-full px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                        >
                          Cancel Job
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedRequest.description}</p>
                </div>

                {/* Photos */}
                {selectedRequest.photos && selectedRequest.photos.length > 0 && (
                  <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Photos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedRequest.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <a
                            href={photo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center text-white text-sm opacity-0 group-hover:opacity-100"
                          >
                            View Full Size
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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