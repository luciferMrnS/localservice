import { collection, addDoc, serverTimestamp, doc, updateDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from './firebase';
import { ServiceRequest } from '@/types';

const REQUESTS_COLLECTION = 'serviceRequests';

export async function createServiceRequest(requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const docRef = await addDoc(collection(db, REQUESTS_COLLECTION), {
      ...requestData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return { id: docRef.id, ...requestData };
  } catch (error) {
    console.error('Error creating service request:', error);
    throw error;
  }
}

export async function updateServiceRequest(id: string, updates: Partial<ServiceRequest>) {
  try {
    const docRef = doc(db, REQUESTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating service request:', error);
    throw error;
  }
}

export async function getServiceRequests(status?: ServiceRequest['status']) {
  try {
    let q = query(collection(db, REQUESTS_COLLECTION), orderBy('createdAt', 'desc'));
    
    if (status) {
      q = query(collection(db, REQUESTS_COLLECTION), where('status', '==', status), orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    const requests: ServiceRequest[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      requests.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as ServiceRequest);
    });
    
    return requests;
  } catch (error) {
    console.error('Error fetching service requests:', error);
    throw error;
  }
}