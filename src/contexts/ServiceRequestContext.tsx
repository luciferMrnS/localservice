'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

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
  const [nextId, setNextId] = useState(1);

  const createRequest = async (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceRequest> => {
    console.log('🔥 React Context: Creating request...', requestData);
    
    const newRequest: ServiceRequest = {
      id: nextId.toString(),
      ...requestData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    console.log('✅ React Context: New request created:', newRequest);
    
    setRequests(prev => {
      const updated = [...prev, newRequest];
      console.log('📊 React Context: Updated requests:', updated);
      return updated;
    });
    
    setNextId(prev => prev + 1);
    
    return newRequest;
  };

  const updateRequest = async (id: string, updates: Partial<ServiceRequest>): Promise<boolean> => {
    console.log('🔄 React Context: Updating request...', id, updates);
    
    setRequests(prev => {
      const updated = prev.map(req => 
        req.id === id 
          ? { ...req, ...updates, updatedAt: new Date() }
          : req
      );
      console.log('📊 React Context: Requests after update:', updated);
      return updated;
    });
    
    return true;
  };

  const getRequests = (status?: ServiceRequest['status']): ServiceRequest[] => {
    console.log('📥 React Context: Getting requests...', status);
    
    let filtered = requests;
    if (status) {
      filtered = requests.filter(req => req.status === status);
    }
    
    const sorted = filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    console.log('📋 React Context: Sorted requests:', sorted);
    
    return sorted;
  };

  const value: ServiceRequestContextType = {
    requests,
    createRequest,
    updateRequest,
    getRequests,
  };

  return (
    <ServiceRequestContext.Provider value={value}>
      {children}
    </ServiceRequestContext.Provider>
  );
}