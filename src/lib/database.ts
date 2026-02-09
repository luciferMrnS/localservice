// Shared data store for Firebase-free version
// This ensures both the form and admin dashboard share the same data

let serviceRequests: any[] = [];
let nextId = 1;
let listeners: (() => void)[] = [];

export interface ServiceRequest {
  id: string;
  clientName: string;
  phoneNumber: string;
  serviceAddress: {
    address: string;
    lat: number;
    lng: number;
  };
  serviceType: string;
  description: string;
  photos: string[];
  serviceTier: 'standard' | 'emergency';
  bookingType: 'asap' | 'scheduled';
  scheduledDateTime?: Date;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  estimatedDistance?: number;
  estimatedTravelTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Subscribe to data changes
export function subscribeToRequests(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(listener => listener !== callback);
  };
}

// Notify all listeners of data changes
function notifyListeners() {
  listeners.forEach(callback => callback());
}

export async function createServiceRequest(requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const newRequest: ServiceRequest = {
      id: nextId.toString(),
      ...requestData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    serviceRequests.push(newRequest);
    nextId++;
    
    console.log('Service request created:', newRequest);
    console.log('All requests:', serviceRequests);
    
    // Notify all listeners that data has changed
    notifyListeners();
    
    return newRequest;
  } catch (error) {
    console.error('Error creating service request:', error);
    throw error;
  }
}

export async function updateServiceRequest(id: string, updates: Partial<ServiceRequest>) {
  try {
    const index = serviceRequests.findIndex(req => req.id === id);
    if (index === -1) {
      throw new Error('Service request not found');
    }
    
    serviceRequests[index] = {
      ...serviceRequests[index],
      ...updates,
      updatedAt: new Date(),
    };
    
    console.log('Service request updated:', serviceRequests[index]);
    
    // Notify all listeners that data has changed
    notifyListeners();
    
    return true;
  } catch (error) {
    console.error('Error updating service request:', error);
    throw error;
  }
}

export async function getServiceRequests(status?: ServiceRequest['status']) {
  try {
    let filteredRequests = serviceRequests;
    
    if (status) {
      filteredRequests = serviceRequests.filter(req => req.status === status);
    }
    
    // Sort by creation date (newest first)
    return filteredRequests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error fetching service requests:', error);
    throw error;
  }
}

// For development: Reset storage
export function resetStorage() {
  serviceRequests = [];
  nextId = 1;
  notifyListeners();
}

// Get current requests (for debugging)
export function getCurrentRequests() {
  return serviceRequests;
}