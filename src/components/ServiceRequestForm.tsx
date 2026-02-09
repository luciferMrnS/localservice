'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ServiceType } from '@/types';
import AddressAutocomplete from './AddressAutocomplete';
import { validatePhotoFile } from '@/lib/storage';

const requestSchema = z.object({
  clientName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  serviceAddress: z.string().min(5, 'Please enter a valid address'),
  serviceLat: z.number(),
  serviceLng: z.number(),
  description: z.string().min(10, 'Please provide more details about your request'),
  serviceTier: z.enum(['standard', 'emergency']),
  bookingType: z.enum(['asap', 'scheduled']),
  scheduledDateTime: z.string().optional(),
});

type RequestFormData = z.infer<typeof requestSchema>;

interface ServiceRequestFormProps {
  selectedService: ServiceType;
  onBack: () => void;
  onSubmit: (data: RequestFormData, photos: File[]) => Promise<void>;
}

export default function ServiceRequestForm({
  selectedService,
  onBack,
  onSubmit,
}: ServiceRequestFormProps) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<{ address: string; lat: number; lng: number } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      serviceTier: 'standard',
      bookingType: 'asap',
    },
  });

  const bookingType = watch('bookingType');
  const serviceTier = watch('serviceTier');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => validatePhotoFile(file));
    
    if (validFiles.length !== files.length) {
      const invalidCount = files.length - validFiles.length;
      alert(`${invalidCount} file(s) were invalid. Please ensure files are images under 5MB.`);
    }
    
    setPhotos(prev => [...prev, ...validFiles].slice(0, 3)); // Max 3 photos
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    setSelectedAddress({ address, lat, lng });
    setValue('serviceAddress', address);
    setValue('serviceLat', lat);
    setValue('serviceLng', lng);
  };

  const onFormSubmit = async (data: RequestFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data, photos);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2"
          >
            ← Back to services
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Request {selectedService.name}
          </h1>
          <p className="text-gray-600">{selectedService.description}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  {...register('clientName')}
                  type="text"
                  id="clientName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="John Doe"
                />
                {errors.clientName && (
                  <p className="mt-1 text-sm text-red-600">{errors.clientName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  {...register('phoneNumber')}
                  type="tel"
                  id="phoneNumber"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="(555) 123-4567"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Service Address */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Service Address
            </h2>
<div>
                <label htmlFor="serviceAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <AddressAutocomplete
                  onAddressSelect={handleAddressSelect}
                  placeholder="123 Main St, City, State 12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  value={selectedAddress?.address || ''}
                />
                <input
                  {...register('serviceAddress')}
                  type="hidden"
                  id="serviceAddress"
                />
                <input
                  {...register('serviceLat', { valueAsNumber: true })}
                  type="hidden"
                />
                <input
                  {...register('serviceLng', { valueAsNumber: true })}
                  type="hidden"
                />
                {errors.serviceAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.serviceAddress.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Start typing and select from the autocomplete suggestions
                </p>
              </div>
          </div>

          {/* Service Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Service Details
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  id="description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Please describe what you need help with..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos (Optional - Max 3 photos, 5MB each)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                {photos.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Service Options */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Service Options
            </h2>
            <div className="space-y-4">
              {/* Service Tier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Tier *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="relative">
                    <input
                      {...register('serviceTier')}
                      type="radio"
                      value="standard"
                      className="sr-only peer"
                    />
                    <div className="p-4 border-2 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50">
                      <div className="font-medium text-gray-900">Standard</div>
                      <div className="text-sm text-gray-600">Regular service</div>
                    </div>
                  </label>
                  <label className="relative">
                    <input
                      {...register('serviceTier')}
                      type="radio"
                      value="emergency"
                      className="sr-only peer"
                    />
                    <div className="p-4 border-2 rounded-lg cursor-pointer peer-checked:border-red-500 peer-checked:bg-red-50 hover:bg-gray-50">
                      <div className="font-medium text-red-600">Emergency</div>
                      <div className="text-sm text-gray-600">Urgent service</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Booking Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  When do you need this service? *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="relative">
                    <input
                      {...register('bookingType')}
                      type="radio"
                      value="asap"
                      className="sr-only peer"
                    />
                    <div className="p-4 border-2 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50">
                      <div className="font-medium text-gray-900">ASAP</div>
                      <div className="text-sm text-gray-600">As soon as possible</div>
                    </div>
                  </label>
                  <label className="relative">
                    <input
                      {...register('bookingType')}
                      type="radio"
                      value="scheduled"
                      className="sr-only peer"
                    />
                    <div className="p-4 border-2 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50">
                      <div className="font-medium text-gray-900">Scheduled</div>
                      <div className="text-sm text-gray-600">Pick a date/time</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Scheduled Date/Time */}
              {bookingType === 'scheduled' && (
                <div>
                  <label htmlFor="scheduledDateTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time *
                  </label>
                  <input
                    {...register('scheduledDateTime', { required: bookingType === 'scheduled' })}
                    type="datetime-local"
                    id="scheduledDateTime"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                  {errors.scheduledDateTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.scheduledDateTime.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}