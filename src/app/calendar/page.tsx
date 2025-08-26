'use client';

// app/calendar/page.tsx
import Sidebar from './Sidebar';
import { CalendarProvider, useCalendar } from './CalendarContext';
import MeetingCard from './MeetingCard';

function CalendarPageContent() {
  const {
    meetingTypes,
    searchQuery,
  } = useCalendar();

  const handleAddMeeting = () => {
    // Add meeting functionality would go here
    console.log('Add meeting clicked');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar currentRoute="/calendar" />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Meeting Types</h1>
            <button
              onClick={handleAddMeeting}
              className="inline-flex items-center gap-2 btn btn-primary hover:btn-primary-focus"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Meeting
            </button>
          </div>

          {/* Meeting type cards */}
          <div className="space-y-4">
            {meetingTypes
              .filter(meeting => 
                searchQuery === '' || 
                meeting.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                meeting.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                meeting.type.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <CalendarProvider>
      <CalendarPageContent />
    </CalendarProvider>
  );
}
