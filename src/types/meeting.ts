export interface MeetingType {
  id: string;
  userId: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  iconType: 'chat' | 'video' | 'meeting' | 'Clock' | 'Users' | 'Video';
}

export interface User {
  id: string;
  handle: string;
  name: string;
  email: string;
  timezone: string;
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