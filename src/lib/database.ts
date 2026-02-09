// Simple in-memory storage for development
// In production, this would be replaced with Vercel KV or a database

let serviceRequests: any[] = [];
let nextId = 1;

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
}