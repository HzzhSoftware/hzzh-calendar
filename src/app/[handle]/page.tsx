import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, Users, Video, MessageCircle } from "lucide-react";
import { getMeetingTypes, getUser } from '@/lib/api';
import { MeetingType } from '@/types/meeting';

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

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { handle } = params;
  
  try {
    const meetingTypes = await getMeetingTypes(handle);
    const user = await getUser(handle);

    return (
      <div className="min-h-screen p-8">
        <main className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Meet with {user.name}</h1>
            <p className="text-muted-foreground">Select the type of meeting you&apos;d like to schedule</p>
          </div>

          {meetingTypes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meetingTypes.map((type: MeetingType) => {
                const Icon = iconMap[type.iconType as keyof typeof iconMap];
                return (
                  <Card key={type.id} className="group hover:shadow-lg transition-shadow">
                    <Link href={`/${handle}/${type.id}`}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-muted-foreground" />
                          <CardTitle>{type.name}</CardTitle>
                        </div>
                        <CardDescription>{type.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <div className="text-sm">{type.duration} minutes</div>
                            <div className="text-sm font-medium">
                              {type.price === 0 ? 'Free' : `$${type.price}`}
                            </div>
                          </div>
                          <Button>
                            Book
                          </Button>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No meeting types found for this user.
            </div>
          )}
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error fetching meeting types:', error);
    return (
      <div className="min-h-screen p-8">
        <main className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find a user with the handle &quot;{handle}&quot;.
          </p>
        </main>
      </div>
    );
  }
} 