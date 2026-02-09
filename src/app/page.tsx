'use client';

import { useState } from 'react';
import ServiceSelection from '@/components/ServiceSelection';
import ServiceRequestForm from '@/components/ServiceRequestForm';
import { ServiceType } from '@/types';
import { createServiceRequest } from '@/lib/database';
import { calculateDistance } from '@/lib/maps';
import { uploadPhotos } from '@/lib/storage';
import { BASE_LOCATION } from '@/types';

export default function Home() {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
  };

  const handleCustomTask = () => {
    setShowCustomForm(true);
  };

  const handleBack = () => {
    setSelectedService(null);
    setShowCustomForm(false);
  };

  const handleFormSubmit = async (data: any, photos: File[]) => {
    try {
      // Calculate distance and travel time
      const distanceResult = await calculateDistance(data.serviceLat, data.serviceLng);
      
      // Upload photos if any
      let photoUrls: string[] = [];
      if (photos.length > 0) {
        photoUrls = await uploadPhotos(photos);
      }
      
      // Prepare request data
      const requestData: any = {
        clientName: data.clientName,
        phoneNumber: data.phoneNumber,
        serviceAddress: {
          address: data.serviceAddress,
          lat: data.serviceLat,
          lng: data.serviceLng,
        },
        serviceType: selectedService?.name || 'Custom Task',
        description: data.description,
        photos: photoUrls,
        serviceTier: data.serviceTier,
        bookingType: data.bookingType,
        status: 'pending' as const,
        estimatedDistance: distanceResult?.distance,
        estimatedTravelTime: distanceResult?.duration,
      };

      // Only include scheduledDateTime if it's provided and booking is scheduled
      if (data.bookingType === 'scheduled' && data.scheduledDateTime) {
        requestData.scheduledDateTime = new Date(data.scheduledDateTime);
      }

      // Submit to database
      console.log('💾 Creating service request...');
      console.log('📋 Request data:', requestData);
      const result = await createServiceRequest(requestData);
      console.log('✅ Service request created:', result);
      
      alert('Request submitted successfully! We will contact you soon.');
      setSelectedService(null);
      setShowCustomForm(false);
    } catch (error) {
      console.error('Error submitting request:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Error submitting request. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Firebase not configured')) {
          errorMessage = 'Firebase not configured. Please contact support.';
        } else if (error.message.includes('permission-denied')) {
          errorMessage = 'Permission denied. Please contact support.';
        } else if (error.message.includes('unavailable')) {
          errorMessage = 'Service unavailable. Please check your internet connection.';
        } else if (error.message.includes('unauthenticated')) {
          errorMessage = 'Authentication failed. Please contact support.';
        }
      }
      
      alert(errorMessage);
    }
  };

  if (selectedService && !showCustomForm) {
    return (
      <ServiceRequestForm
        selectedService={selectedService}
        onBack={handleBack}
        onSubmit={handleFormSubmit}
      />
    );
  }

  if (showCustomForm) {
    const customService: ServiceType = {
      id: 'custom',
      name: 'Custom Task',
      description: 'Describe your custom service request',
      category: 'custom'
    };
    return (
      <ServiceRequestForm
        selectedService={customService}
        onBack={handleBack}
        onSubmit={handleFormSubmit}
      />
    );
  }

  return (
    <ServiceSelection
      onServiceSelect={handleServiceSelect}
      onCustomTask={handleCustomTask}
    />
  );
}
