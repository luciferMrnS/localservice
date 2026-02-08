'use client';

import { useEffect, useRef, useState } from 'react';

interface AddressAutocompleteProps {
  onAddressSelect: (address: string, lat: number, lng: number) => void;
  placeholder?: string;
  className?: string;
}

export default function AddressAutocomplete({
  onAddressSelect,
  placeholder = 'Enter address...',
  className = '',
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [autocomplete, setAutocomplete] = useState<any>(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        setIsLoaded(true);
        initializeAutocomplete();
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
    if (!inputRef.current || !window.google) return;

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
        onAddressSelect(address, lat, lng);
      }
    });

    setAutocomplete(autocompleteInstance);
  };

return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      className={className}
      disabled={!isLoaded}
    />
  );
}

declare global {
  interface Window {
    google: any;
  }
}