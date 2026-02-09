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

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  services: ServiceType[];
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: '🔧',
    services: [
      { id: 'pipe_repair', name: 'Pipe Repair', description: 'Fix leaking or broken pipes', category: 'plumbing' },
      { id: 'drain_cleaning', name: 'Drain Cleaning', description: 'Clear blocked drains', category: 'plumbing' },
      { id: 'faucet_install', name: 'Faucet Installation', description: 'Install or replace faucets', category: 'plumbing' },
    ]
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    icon: '🧹',
    services: [
      { id: 'deep_clean', name: 'Deep Cleaning', description: 'Thorough house cleaning', category: 'cleaning' },
      { id: 'window_cleaning', name: 'Window Cleaning', description: 'Clean interior and exterior windows', category: 'cleaning' },
      { id: 'carpet_cleaning', name: 'Carpet Cleaning', description: 'Professional carpet cleaning', category: 'cleaning' },
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: '⚡',
    services: [
      { id: 'outlet_repair', name: 'Outlet Repair', description: 'Fix or install electrical outlets', category: 'electrical' },
      { id: 'lighting_install', name: 'Lighting Installation', description: 'Install new light fixtures', category: 'electrical' },
      { id: 'circuit_repair', name: 'Circuit Repair', description: 'Fix electrical circuit issues', category: 'electrical' },
    ]
  },
  {
    id: 'pool',
    name: 'Pool Maintenance',
    icon: '🏊',
    services: [
      { id: 'pool_cleaning', name: 'Pool Cleaning', description: 'Regular pool cleaning service', category: 'pool' },
      { id: 'chemical_balance', name: 'Chemical Balance', description: 'Balance pool chemicals', category: 'pool' },
      { id: 'equipment_repair', name: 'Equipment Repair', description: 'Fix pool pumps and filters', category: 'pool' },
    ]
  },
  {
    id: 'house_sitting',
    name: 'House Sitting',
    icon: '🏠',
    services: [
      { id: 'vacation_sitting', name: 'Vacation Sitting', description: 'Watch house while you are away', category: 'house_sitting' },
      { id: 'pet_care', name: 'Pet Care', description: 'Feed and care for pets', category: 'house_sitting' },
      { id: 'plant_care', name: 'Plant Care', description: 'Water and maintain plants', category: 'house_sitting' },
    ]
  },
  {
    id: 'errands',
    name: 'Errands',
    icon: '🛒',
    services: [
      { id: 'grocery_shopping', name: 'Grocery Shopping', description: 'Shop for groceries', category: 'errands' },
      { id: 'prescription_pickup', name: 'Prescription Pickup', description: 'Pick up medications', category: 'errands' },
      { id: 'package_delivery', name: 'Package Delivery', description: 'Deliver packages locally', category: 'errands' },
    ]
  },
  {
    id: 'delivery',
    name: 'Delivery',
    icon: '📦',
    services: [
      { id: 'local_delivery', name: 'Local Delivery', description: 'Same day local delivery', category: 'delivery' },
      { id: 'furniture_delivery', name: 'Furniture Delivery', description: 'Deliver furniture items', category: 'delivery' },
      { id: 'document_delivery', name: 'Document Delivery', description: 'Urgent document delivery', category: 'delivery' },
    ]
  },
];

export const BASE_LOCATION = {
  address: '123 Main St, City, State 12345',
  lat: 40.7128,
  lng: -74.0060,
};