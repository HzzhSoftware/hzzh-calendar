import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BookingPageProps {
  params: {
    handle: string;
    meetingtype: string;
  }
}

export default function BookingPage({ params }: BookingPageProps) {
  const { handle, meetingtype } = params;

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Book a {meetingtype} with {handle}</h1>
          <p className="text-muted-foreground">Select a time that works for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          <Card className="col-span-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm">
                  &larr; Previous
                </Button>
                <h2 className="text-lg font-semibold">March 2024</h2>
                <Button variant="outline" size="sm">
                  Next &rarr;
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Days */}
              <div className="hidden md:grid md:grid-cols-7 gap-4 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Available Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    className="w-full"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Meeting Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    type="text"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                  />
                </div>
                <Button className="w-full">
                  Schedule Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 