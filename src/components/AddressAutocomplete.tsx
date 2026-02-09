'use client';

import { useEffect, useRef, useState } from 'react';

interface AddressAutocompleteProps {
  onAddressSelect: (address: string, lat: number, lng: number) => void;
  placeholder?: string;
  className?: string;
  value?: string;
}

export default function AddressAutocomplete({
  onAddressSelect,
  placeholder = 'Enter address...',
  className = '',
  value = '',
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    // Only load Google Maps if API key is available
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key_here') {
      console.log('Google Maps API key not configured - using manual input');
      console.log('To enable autocomplete:');
      console.log('1. Get a Google Maps API key from https://console.cloud.google.com');
      console.log('2. Enable Places API and Geocoding API');
      console.log('3. Add your key to .env.local: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here');
      setIsLoaded(true);
      return;
    }

    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        setIsLoaded(true);
        initializeAutocomplete();
      };
      script.onerror = () => {
        console.log('Failed to load Google Maps - using manual input');
        setIsLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
      initializeAutocomplete();
    }

    return () => {
      if (autocomplete) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google || !window.google.maps || !window.google.maps.places) {
      console.log('Google Maps Places not available - using manual input');
      return;
    }

    try {
      const autocompleteInstance = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['address'],
          fields: ['formatted_address', 'geometry.location', 'address_components'],
        }
      );

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        if (place.geometry && place.geometry.location) {
          const address = place.formatted_address;
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setInputValue(address);
          onAddressSelect(address, lat, lng);
        }
      });

      setAutocomplete(autocompleteInstance);
    } catch (error) {
      console.log('Error initializing autocomplete - using manual input:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // If no autocomplete is available, still allow manual input
    if (!autocomplete) {
      // For manual input, we can't get lat/lng, so we'll use default values
      // The form validation will handle this
      onAddressSelect(value, 0, 0);
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      placeholder={placeholder}
      className={`${className} text-gray-900 placeholder-gray-500`}
      disabled={false} // Always enabled - let users type manually
    />
  );
}

declare global {
  interface Window {
    google: any;
  }
}