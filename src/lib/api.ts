import { MeetingType, User } from '@/types/calendar';

export async function getMeetingTypes(handle: string): Promise<MeetingType[]> {
  try {
    const response = await fetch(`https://api.kycombinator.com/calendar/users/${handle}/meeting-types`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch meeting types');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching meeting types:', error);
    throw error;
  }
} 

export async function getUser(handle: string): Promise<User> {
  try {
    const response = await fetch(`https://api.kycombinator.com/calendar/users/${handle}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
