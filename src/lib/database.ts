import { neon } from '@neondatabase/serverless';
import { ServiceRequest } from '@/types';

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

async function ensureTable() {
  if (!sql) {
    throw new Error('DATABASE_URL not configured');
  }

  await sql`
    CREATE TABLE IF NOT EXISTS service_requests (
      id SERIAL PRIMARY KEY,
      client_name VARCHAR(255) NOT NULL,
      phone_number VARCHAR(50) NOT NULL,
      service_address TEXT NOT NULL,
      service_lat DECIMAL(10, 8),
      service_lng DECIMAL(11, 8),
      service_type VARCHAR(100) NOT NULL,
      description TEXT,
      photos TEXT[],
      service_tier VARCHAR(50),
      booking_type VARCHAR(20) DEFAULT 'immediate',
      scheduled_timestamp TIMESTAMP,
      status VARCHAR(20) DEFAULT 'pending',
      estimated_distance DECIMAL(10, 2),
      estimated_travel_time VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function createServiceRequest(requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) {
  if (!sql) {
    throw new Error('DATABASE_URL not configured');
  }

  await ensureTable();

  const result = await sql`
    INSERT INTO service_requests (
      client_name, phone_number, service_address, service_lat, service_lng,
      service_type, description, photos, service_tier, booking_type,
      scheduled_timestamp, status, estimated_distance, estimated_travel_time
    ) VALUES (
      ${requestData.clientName}, ${requestData.phoneNumber},
      ${JSON.stringify(requestData.serviceAddress)},
      ${requestData.serviceAddress.lat}, ${requestData.serviceAddress.lng},
      ${requestData.serviceType}, ${requestData.description},
      ${requestData.photos || []}, ${requestData.serviceTier},
      ${requestData.bookingType}, ${requestData.scheduledDateTime || null},
      ${requestData.status}, ${requestData.estimatedDistance || null},
      ${requestData.estimatedTravelTime || null}
    )
    RETURNING *
  `;

  const row = result[0];
  return {
    id: row.id.toString(),
    clientName: row.client_name,
    phoneNumber: row.phone_number,
    serviceAddress: typeof row.service_address === 'string' ? JSON.parse(row.service_address) : row.service_address,
    serviceType: row.service_type,
    description: row.description,
    photos: row.photos || [],
    serviceTier: row.service_tier,
    bookingType: row.booking_type,
    scheduledDateTime: row.scheduled_timestamp,
    status: row.status,
    estimatedDistance: row.estimated_distance,
    estimatedTravelTime: row.estimated_travel_time,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function updateServiceRequest(id: string, updates: Partial<ServiceRequest>) {
  if (!sql) {
    throw new Error('DATABASE_URL not configured');
  }

  await ensureTable();

  const updatesArray = Object.entries(updates).filter(([_, v]) => v !== undefined);

  if (updatesArray.length === 0) return true;

  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  for (const [key, value] of updatesArray) {
    const columnMap: Record<string, string> = {
      clientName: 'client_name',
      phoneNumber: 'phone_number',
      serviceAddress: 'service_address',
      serviceLat: 'service_lat',
      serviceLng: 'service_lng',
      serviceType: 'service_type',
      description: 'description',
      photos: 'photos',
      serviceTier: 'service_tier',
      bookingType: 'booking_type',
      scheduledDateTime: 'scheduled_timestamp',
      status: 'status',
      estimatedDistance: 'estimated_distance',
      estimatedTravelTime: 'estimated_travel_time',
    };

    const column = columnMap[key] || key;
    setClauses.push(`${column} = $${paramIndex}`);
    values.push(key === 'serviceAddress' ? JSON.stringify(value) : value);
    paramIndex++;
  }

  setClauses.push(`updated_at = NOW()`);
  values.push(parseInt(id));

  await sql`
    UPDATE service_requests
    SET ${sql.unsafe(setClauses.join(', '))}
    WHERE id = $${paramIndex}
  `;

  return true;
}

export async function getServiceRequests(status?: ServiceRequest['status']) {
  if (!sql) {
    throw new Error('DATABASE_URL not configured');
  }

  await ensureTable();

  let result;
  if (status) {
    result = await sql`SELECT * FROM service_requests WHERE status = ${status} ORDER BY created_at DESC`;
  } else {
    result = await sql`SELECT * FROM service_requests ORDER BY created_at DESC`;
  }

  return result.map((row: any) => ({
    id: row.id.toString(),
    clientName: row.client_name,
    phoneNumber: row.phone_number,
    serviceAddress: typeof row.service_address === 'string' ? JSON.parse(row.service_address) : row.service_address,
    serviceType: row.service_type,
    description: row.description,
    photos: row.photos || [],
    serviceTier: row.service_tier,
    bookingType: row.booking_type,
    scheduledDateTime: row.scheduled_timestamp,
    status: row.status,
    estimatedDistance: row.estimated_distance,
    estimatedTravelTime: row.estimated_travel_time,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export function subscribeToRequests(_callback: () => void) {
  return () => {};
}

export function resetStorage() {}
export function getCurrentRequests() { return []; }
