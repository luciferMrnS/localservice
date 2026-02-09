'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createServiceRequest, updateServiceRequest, getServiceRequests } from '@/lib/database';

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

  // Load requests from database on mount
  const refreshRequests = async () => {
    try {
      console.log('🔄 Loading requests from database...');
      const dbRequests = await getServiceRequests();
      console.log('📊 Loaded requests from database:', dbRequests);
      setRequests(dbRequests);
    } catch (error) {
      console.error('❌ Error loading requests from database:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRequests();
  }, []);

  const createRequest = async (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceRequest> => {
    console.log('🔥 Creating request in database...', requestData);
    
    try {
      const newRequest = await createServiceRequest(requestData);
      console.log('✅ Request created in database:', newRequest);
      
      // Refresh requests to get the latest data
      await refreshRequests();
      
      return newRequest;
    } catch (error) {
      console.error('❌ Error creating request in database:', error);
      throw error;
    }
  };

  const updateRequest = async (id: string, updates: Partial<ServiceRequest>): Promise<boolean> => {
    console.log('🔄 Updating request in database...', id, updates);
    
    try {
      const success = await updateServiceRequest(id, updates);
      console.log('✅ Request updated in database:', success);
      
      if (success) {
        // Refresh requests to get the latest data
        await refreshRequests();
      }
      
      return success;
    } catch (error) {
      console.error('❌ Error updating request in database:', error);
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