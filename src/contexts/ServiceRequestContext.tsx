'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface ServiceRequestContextType {
  requests: ServiceRequest[];
  createRequest: (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ServiceRequest>;
  updateRequest: (id: string, updates: Partial<ServiceRequest>) => Promise<boolean>;
  getRequests: (status?: ServiceRequest['status']) => ServiceRequest[];
  refreshRequests: () => Promise<void>;
}

const ServiceRequestContext = createContext<ServiceRequestContextType | undefined>(undefined);

export function useServiceRequests() {
  const context = useContext(ServiceRequestContext);
  if (context === undefined) {
    throw new Error('useServiceRequests must be used within a ServiceRequestProvider');
  }
  return context;
}

interface ServiceRequestProviderProps {
  children: ReactNode;
}

export function ServiceRequestProvider({ children }: ServiceRequestProviderProps) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to validate and fix dates
  const validateDates = (request: any): ServiceRequest => {
    return {
      ...request,
      createdAt: request.createdAt ? new Date(request.createdAt) : new Date(),
      updatedAt: request.updatedAt ? new Date(request.updatedAt) : new Date(),
      scheduledDateTime: request.scheduledDateTime ? new Date(request.scheduledDateTime) : undefined,
    };
  };

  // Load requests from database via API
  const refreshRequests = async () => {
    try {
      console.log('🔄 Loading requests from API...');
      const response = await fetch('/api/service-requests');
      const result = await response.json();
      
      if (result.success) {
        console.log('📊 Loaded requests from API:', result.data);
        // Validate and fix dates before setting state
        const validatedRequests = result.data.map(validateDates);
        console.log('📊 Validated requests:', validatedRequests);
        setRequests(validatedRequests);
      } else {
        console.error('❌ API Error:', result.error);
      }
    } catch (error) {
      console.error('❌ Error loading requests from API:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRequests();
  }, []);

  const createRequest = async (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceRequest> => {
    console.log('🔥 Creating request via API...', requestData);
    
    try {
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Request created via API:', result.data);
        
        // Validate dates in the response
        const validatedRequest = validateDates(result.data);
        
        // Refresh requests to get the latest data
        await refreshRequests();
        
        return validatedRequest;
      } else {
        throw new Error(result.error || 'Failed to create request');
      }
    } catch (error) {
      console.error('❌ Error creating request via API:', error);
      throw error;
    }
  };

  const updateRequest = async (id: string, updates: Partial<ServiceRequest>): Promise<boolean> => {
    console.log('🔄 Updating request via API...', id, updates);
    
    try {
      const response = await fetch(`/api/service-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Request updated via API:', id);
        
        // Refresh requests to get the latest data
        await refreshRequests();
        
        return true;
      } else {
        throw new Error(result.error || 'Failed to update request');
      }
    } catch (error) {
      console.error('❌ Error updating request via API:', error);
      throw error;
    }
  };

  const getRequests = (status?: ServiceRequest['status']): ServiceRequest[] => {
    console.log('📥 Getting requests from context...', status);
    
    let filtered = requests;
    if (status) {
      filtered = requests.filter(req => req.status === status);
    }
    
    const sorted = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    console.log('📋 Sorted requests:', sorted);
    
    return sorted;
  };

  const value: ServiceRequestContextType = {
    requests,
    createRequest,
    updateRequest,
    getRequests,
    refreshRequests,
  };

  return (
    <ServiceRequestContext.Provider value={value}>
      {children}
    </ServiceRequestContext.Provider>
  );
}