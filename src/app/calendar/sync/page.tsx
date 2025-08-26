'use client';

import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { CalendarProvider } from '../CalendarContext';
import { Calendar } from '@/types/calendar';
import AddCalendarModal from './AddCalendarModal';

function SyncPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calendars, setCalendars] = useState<Calendar[]>([
    {
      id: '1',
      name: 'My Home Calendar',
      type: 'google',
      email: 'user@gmail.com',
      isActive: true,
      lastSync: '2024-01-15T10:30:00Z',
      syncStatus: 'synced',
      color: '#4285f4',
      timezone: 'America/New_York'
    },
    {
      id: '2',
      name: 'Work Calendar',
      type: 'outlook',
      email: 'user@company.com',
      isActive: true,
      lastSync: '2024-01-15T09:15:00Z',
      syncStatus: 'synced',
      color: '#0078d4',
      timezone: 'America/New_York'
    },
    {
      id: '3',
      name: 'Family Calendar',
      type: 'apple',
      email: 'family@icloud.com',
      isActive: false,
      lastSync: '2024-01-14T16:45:00Z',
      syncStatus: 'disconnected',
      color: '#ff6b6b',
      timezone: 'America/New_York'
    }
  ]);

  const handleAddCalendar = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddNewCalendar = (newCalendar: Omit<Calendar, 'id'>) => {
    const calendarWithId: Calendar = {
      ...newCalendar,
      id: Date.now().toString(),
    };
    
    setCalendars(prev => [calendarWithId, ...prev]);
    
    // In a real app, you would also:
    // 1. Send the calendar data to your backend
    // 2. Initiate OAuth flow with the selected provider
    // 3. Handle the authorization callback
    console.log('Adding new calendar:', calendarWithId);
  };

  const getStatusColor = (status: Calendar['syncStatus']) => {
    switch (status) {
      case 'synced':
        return 'text-green-600 bg-green-100';
      case 'syncing':
        return 'text-blue-600 bg-blue-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'disconnected':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: Calendar['syncStatus']) => {
    switch (status) {
      case 'synced':
        return 'Synced';
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Error';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  const getCalendarIcon = (type: Calendar['type']) => {
    switch (type) {
      case 'google':
        return (
          <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        );
      case 'outlook':
        return (
          <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM22 5.72l-4.6-3.86-1.29 1.53 4.59 3.85L22 5.72zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
          </svg>
        );
      case 'apple':
        return (
          <svg className="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar currentRoute="/calendar/sync" />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Calendar Sync</h1>
            <button
              onClick={handleAddCalendar}
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
              Add Calendar
            </button>
          </div>

          {/* Calendar list */}
          <div className="space-y-4">
            {calendars.map((calendar) => (
              <div
                key={calendar.id}
                className={`bg-white border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                  calendar.isActive ? 'border-gray-200' : 'border-gray-100 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getCalendarIcon(calendar.type)}
                    </div>
                    <div>
                      <h3 className={`text-lg font-medium ${
                        calendar.isActive ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {calendar.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {calendar.email} • {calendar.type}
                      </p>
                      {calendar.lastSync && (
                        <p className="text-xs text-gray-400 mt-1">
                          Last synced: {new Date(calendar.lastSync).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(calendar.syncStatus)}`}>
                      {getStatusText(calendar.syncStatus)}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => console.log('Edit calendar:', calendar.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-sm text-red-500 hover:text-red-700 transition-colors"
                        onClick={() => console.log('Remove calendar:', calendar.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {calendars.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No calendars connected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by connecting your first calendar.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Add Calendar Modal */}
      <AddCalendarModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddCalendar={handleAddNewCalendar}
      />
    </div>
  );
}

export default function SyncPage() {
  return (
    <CalendarProvider>
      <SyncPageContent />
    </CalendarProvider>
  );
}
