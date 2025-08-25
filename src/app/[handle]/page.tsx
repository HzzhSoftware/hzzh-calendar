import Link from "next/link";
import { Clock, Users, Video, MessageCircle } from "lucide-react";
import { getMeetingTypes, getUser } from '@/lib/api';
import { MeetingType } from '@/types/calendar';
import Image from 'next/image';

interface ProfilePageProps {
  params: {
    handle: string;
  }
}

// Map string icon types to Lucide components
const iconMap = {
  'chat': MessageCircle,
  'video': Video,
  'meeting': Users,
  'Clock': Clock,
  'Users': Users,
  'Video': Video
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (text: string) => {
  const colors = [
    '#F87171', // red-400
    '#FB923C', // orange-400
    '#FBBF24', // amber-400
    '#34D399', // emerald-400
    '#60A5FA', // blue-400
    '#818CF8', // indigo-400
    '#A78BFA', // violet-400
    '#F472B6', // pink-400
  ];
  
  // Use text to consistently get same color
  const index = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { handle } = params;
  
  try {
    const meetingTypes = await getMeetingTypes(handle);
    const user = await getUser(handle);

    return (
      <div className="min-h-screen p-8">
        <main className="max-w-3xl mx-auto">
          {/* User Profile Header */}
          <div className="mb-12 text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 relative">
              {user.avatarUrl ? (
                <Image 
                  src={user.avatarUrl} 
                  alt={user.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                  priority
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-xl font-medium text-white"
                  style={{ backgroundColor: getRandomColor(user.name) }}
                >
                  {getInitials(user.name)}
                </div>
              )}
            </div>
            <h1 className="text-2xl font-semibold mb-2">{user.name}</h1>
            <p className="text-gray-600">{user.bio || "Book a meeting with me"}</p>
          </div>

          {/* Meeting Types Grid */}
          <div className="space-y-4">
            {meetingTypes.map((type: MeetingType) => {
              const Icon = iconMap[type.iconType as keyof typeof iconMap];
              const color = type.color || getRandomColor(type.name);
              
              return (
                <Link 
                  key={type.id} 
                  href={`/${handle}/${type.id}`}
                  className="block"
                >
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: `${color}15`, // 15% opacity version of the color
                          }}
                        >
                          <Icon 
                            className="w-5 h-5"
                            style={{ color: color }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{type.name}</h3>
                            <span className="text-gray-300 mx-2">•</span>
                            <span className="text-sm text-gray-500">{type.duration} min</span>
                          </div>
                          <p className="text-sm text-gray-500">{type.description}</p>
                        </div>
                      </div>
                      <div>
                        <svg 
                          className="w-4 h-4 text-gray-400" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user data:', error);
    return (
      <div className="min-h-screen p-8">
        <main className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-semibold mb-4">User Not Found</h1>
          <p className="text-gray-600">
            Sorry, we couldn&apos;t find a user with the handle &quot;{handle}&quot;.
          </p>
        </main>
      </div>
    );
  }
} 