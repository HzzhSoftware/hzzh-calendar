'use client';

import Sidebar from '../Sidebar';
import { CalendarProvider, useCalendar } from '../CalendarContext';

function MeetingPageContent() {
  const { selectedCalendar, setSelectedCalendar } = useCalendar();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar currentRoute="/calendar/meeting" />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-semibold mb-6">Meetings</h1>
          
          {/* Calendar selection */}
          <div className="flex items-center gap-2 mb-6">
            <label className="text-sm font-medium">Calendar:</label>
            <select
              className="rounded-md border px-3 py-2 text-sm"
              aria-label="Select calendar"
              value={selectedCalendar}
              onChange={(e) => setSelectedCalendar(e.target.value)}
            >
              <option value="my-home-calendar">My Home Calendar</option>
              <option value="family">Family Calendar</option>
            </select>
          </div>

          {/* Meeting content */}
          <div className="bg-white rounded-lg border p-6">
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No meetings scheduled</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new meeting or scheduling an event.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  + New Meeting
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function MeetingPage() {
  return (
    <CalendarProvider>
      <MeetingPageContent />
    </CalendarProvider>
  );
}
