'use client';

// app/calendar/page.tsx
import Sidebar from './Sidebar';
import { CalendarProvider, useCalendar } from './CalendarContext';

function CalendarPageContent() {
  const {
    eventTypes,
    selectedEventType,
    searchQuery,
    selectedCalendar,
    setSelectedCalendar,
    activeTab,
    setActiveTab,
    toggleEventTypeActive,
    selectEventType,
  } = useCalendar();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar currentRoute="/calendar" />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-semibold mb-6">Scheduling</h1>
          {/* Sub‑navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="space-x-6 text-sm">
              <button 
                className={`border-b-2 pb-2 font-medium transition-colors duration-200 ${
                  activeTab === 'event-types' 
                    ? 'border-primary-600' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
                onClick={() => setActiveTab('event-types')}
              >
                Event types
              </button>
              <button 
                className={`border-b-2 pb-2 font-medium transition-colors duration-200 ${
                  activeTab === 'single-use-links' 
                    ? 'border-primary-600' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
                onClick={() => setActiveTab('single-use-links')}
              >
                Single‑use links
              </button>
              <button 
                className={`border-b-2 pb-2 font-medium transition-colors duration-200 ${
                  activeTab === 'meeting-polls' 
                    ? 'border-primary-600' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
                onClick={() => setActiveTab('meeting-polls')}
              >
                Meeting polls
              </button>
            </div>
          </div>

          {/* Event type cards */}
          <div className="space-y-4">
            {eventTypes
              .filter(event => 
                searchQuery === '' || 
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.format.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((event) => (
              <div
                key={event.id}
                className={`flex items-center justify-between rounded-md border px-4 py-3 cursor-pointer transition-all duration-200 ${
                  selectedEventType === event.id
                    ? 'ring-2 ring-primary-500 ring-offset-2 bg-primary-50 border-primary-200'
                    : event.active
                    ? 'bg-white hover:bg-gray-50 hover:shadow-sm'
                    : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                }`}
                onClick={() => selectEventType(selectedEventType === event.id ? null : event.id)}
              >
                <div className="flex-1">
                  <h2 className={`font-medium transition-colors duration-200 ${
                    selectedEventType === event.id ? 'text-primary-900' : ''
                  }`}>
                    {event.title}
                  </h2>
                  <p className={`text-sm transition-colors duration-200 ${
                    selectedEventType === event.id ? 'text-primary-700' : ''
                  }`}>
                    {event.duration} · {event.location} · {event.format}
                  </p>
                  <p className={`text-sm transition-colors duration-200 ${
                    selectedEventType === event.id ? 'text-primary-600' : ''
                  }`}>
                    {event.availability}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {event.active ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-neutral-50 transition-colors duration-200"
                      aria-label="Copy scheduling link"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Copy link functionality would go here
                      }}
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        {/* link icon path */}
                        <path d="M12.586 8.586a2 2 0 00-2.828 0L7 11.343a2 2 0 102.828 2.829l3.757-3.757a2 2 0 000-2.829z" />
                        <path d="M11.414 11.414a2 2 0 002.828 0L17 8.586a2 2 0 00-2.828-2.828l-2.757 2.757a2 2 0 000 2.829z" />
                      </svg>
                      Copy link
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEventTypeActive(event.id);
                      }}
                    >
                      Turn On
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Selected event type details */}
          {selectedEventType && (
            <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg animate-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-lg font-medium text-primary-900 mb-2">
                Selected: {eventTypes.find(e => e.id === selectedEventType)?.title}
              </h3>
              <p className="text-sm text-primary-700">
                This event type is currently selected. You can edit its settings or manage its availability.
              </p>
            </div>
          )}
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
