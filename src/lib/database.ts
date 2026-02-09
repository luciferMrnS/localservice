import { put, list, del, get } from '@vercel/blob';
import { ServiceRequest } from '@/types';

const BLOB_NAME = 'service-requests.json';

// Global state for development (survives HMR but not deployments)
const globalState = typeof globalThis !== 'undefined' ? (globalThis as any).__serviceAppData = (globalThis as any).__serviceAppData || {
  serviceRequests: [],
  nextId: 1,
  listeners: [],
  initialized: false,
} : {
  serviceRequests: [],
  nextId: 1,
  listeners: [],
  initialized: false,
};

let serviceRequests = globalState.serviceRequests;
let nextId = globalState.nextId;
let listeners = globalState.listeners;

type ListenerCallback = () => void;

// Load data from Vercel Blob or initialize
async function loadData(): Promise<void> {
  if (globalState.initialized) return;
  
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      console.log('📦 Loading data from Vercel Blob...');
      const result = await list();
      const blob = result.blobs.find(b => b.pathname === BLOB_NAME);
      
      if (blob) {
        const response = await get(blob.pathname);
        const text = await response.text();
        const data = JSON.parse(text);
        serviceRequests = data.requests || [];
        nextId = data.nextId || 1;
        globalState.serviceRequests = serviceRequests;
        globalState.nextId = nextId;
        console.log('✅ Loaded from Blob:', serviceRequests.length, 'requests');
      } else {
        console.log('📝 No existing blob found, starting fresh');
      }
    }
  } catch (error) {
    console.warn('⚠️ Could not load from Blob, using in-memory:', error);
  }
  
  globalState.initialized = true;
}

// Save data to Vercel Blob
async function saveData(): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  
  try {
    const data = JSON.stringify({ requests: serviceRequests, nextId });
    await put(BLOB_NAME, data, { access: 'public' });
    console.log('💾 Saved to Blob:', serviceRequests.length, 'requests');
  } catch (error) {
    console.error('❌ Failed to save to Blob:', error);
  }
}

// Initialize on module load
loadData();

// Subscribe to data changes
export function subscribeToRequests(callback: ListenerCallback) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((listener: ListenerCallback) => listener !== callback);
  };
}

// Notify all listeners of data changes
function notifyListeners() {
  listeners.forEach((callback: ListenerCallback) => callback());
}

export async function createServiceRequest(requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) {
  await loadData();
  
  const newRequest: ServiceRequest = {
    id: nextId.toString(),
    ...requestData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  serviceRequests.push(newRequest);
  nextId++;
  
  globalState.serviceRequests = serviceRequests;
  globalState.nextId = nextId;
  
  await saveData();
  notifyListeners();
  
  return newRequest;
}

export async function updateServiceRequest(id: string, updates: Partial<ServiceRequest>) {
  await loadData();
  
  const index = serviceRequests.findIndex((req: ServiceRequest) => req.id === id);
  if (index === -1) {
    throw new Error('Service request not found');
  }
  
  serviceRequests[index] = {
    ...serviceRequests[index],
    ...updates,
    updatedAt: new Date(),
  };
  
  await saveData();
  notifyListeners();
  
  return true;
}

export async function getServiceRequests(status?: ServiceRequest['status']) {
  await loadData();
  
  let filteredRequests = serviceRequests;
  
  if (status) {
    filteredRequests = serviceRequests.filter((req: ServiceRequest) => req.status === status);
  }
  
  const result = filteredRequests.sort((a: ServiceRequest, b: ServiceRequest) => b.createdAt.getTime() - a.createdAt.getTime());
  return result;
}

// For development: Reset storage
export function resetStorage() {
  serviceRequests = [];
  nextId = 1;
  globalState.serviceRequests = [];
  globalState.nextId = 1;
  notifyListeners();
}

// Get current requests (for debugging)
export function getCurrentRequests() {
  return serviceRequests;
}