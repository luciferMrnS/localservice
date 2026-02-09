import { BASE_LOCATION } from '@/types';

export interface DistanceResult {
  distance: number; // in miles
  duration: number; // in minutes
  distanceText: string;
  durationText: string;
}

export async function calculateDistance(
  destinationLat: number,
  destinationLng: number
): Promise<DistanceResult | null> {
  // Check if Google Maps API key is configured
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
    console.log('Google Maps API key not configured - skipping distance calculation');
    return null;
  }

  // Check if coordinates are valid (not 0,0 from manual input)
  if (destinationLat === 0 && destinationLng === 0) {
    console.log('Invalid coordinates (0,0) - skipping distance calculation');
    return null;
  }

  try {
    const origin = `${BASE_LOCATION.lat},${BASE_LOCATION.lng}`;
    const destination = `${destinationLat},${destinationLng}`;
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&units=imperial&key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
      const element = data.rows[0].elements[0];
      return {
        distance: element.distance.value / 1609.34, // Convert meters to miles
        duration: element.duration.value / 60, // Convert seconds to minutes
        distanceText: element.distance.text,
        durationText: element.duration.text,
      };
    } else {
      console.log('Distance Matrix API returned non-OK status:', data.status);
      return null;
    }
  } catch (error) {
    console.error('Error calculating distance:', error);
    return null;
  }
}

export function formatDistance(distance: number): string {
  if (distance < 0.1) {
    return 'Less than 0.1 miles';
  } else if (distance < 1) {
    return `${(distance * 5280).toFixed(0)} feet`;
  } else {
    return `${distance.toFixed(1)} miles`;
  }
}

export function formatDuration(duration: number): string {
  if (duration < 1) {
    return 'Less than 1 minute';
  } else if (duration < 60) {
    return `${Math.round(duration)} minutes`;
  } else {
    const hours = Math.floor(duration / 60);
    const minutes = Math.round(duration % 60);
    return `${hours}h ${minutes}m`;
  }
}