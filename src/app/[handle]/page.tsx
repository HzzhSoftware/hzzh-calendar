import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, Users, Video } from "lucide-react";

interface ProfilePageProps {
  params: {
    handle: string;
  }
}

interface MeetingType {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  iconType: string;
}

// Map string icon types to Lucide components
const iconMap = {
  Clock,
  Users,
  Video,
};

async function getMeetingTypes(handle: string): Promise<MeetingType[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${handle}/meeting-types`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error('Failed to fetch meeting types');
  }

  return res.json();
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { handle } = params;
  const meetingTypes = await getMeetingTypes(handle);

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Meet with {handle}</h1>
          <p className="text-muted-foreground">Select the type of meeting you&apos;d like to schedule</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {meetingTypes.map((type) => {
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
      </main>
    </div>
  );
} 