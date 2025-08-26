export interface MeetingType {
  id: string;
  userId: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  type: 'virtual'| 'phone' | 'in-person' | 'other';
  location: string;
  timezone: string;
  iconType: 'chat' | 'video' | 'meeting' | 'Clock' | 'Users' | 'Video';
  color?: string; // Optional color override
  active: boolean;
}

export interface Calendar {
  id: string;
  name: string;
  type: 'google' | 'outlook' | 'apple' | 'other';
  email?: string;
  isActive: boolean;
  lastSync?: string;
  syncStatus: 'syncing' | 'synced' | 'error' | 'disconnected';
  color?: string;
  timezone?: string;
}

export interface User {
  id: string;
  handle: string;
  name: string;
  email: string;
  timezone: string;
  avatarUrl?: string;
  bio?: string;
}

export interface Booking {
  id: string;
  meetingTypeId: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'cancelled' | 'pending';
} 