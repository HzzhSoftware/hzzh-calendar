'use client';

import React, { useState } from 'react';
import { Calendar } from '@/types/calendar';

interface AddCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCalendar: (calendar: Omit<Calendar, 'id'>) => void;
}

const AddCalendarModal = ({ isOpen, onClose, onAddCalendar }: AddCalendarModalProps) => {
  const [selectedType, setSelectedType] = useState<Calendar['type']>('google');
  const [calendarName, setCalendarName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!calendarName.trim() || !email.trim()) {
      return;
    }

    const newCalendar: Omit<Calendar, 'id'> = {
      name: calendarName.trim(),
      type: selectedType,
      email: email.trim(),
      isActive: true,
      lastSync: new Date().toISOString(),
      syncStatus: 'syncing',
      color: getDefaultColor(selectedType),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    onAddCalendar(newCalendar);
    handleClose();
  };

  const handleClose = () => {
    setCalendarName('');
    setEmail('');
    setSelectedType('google');
    onClose();
  };

  const getDefaultColor = (type: Calendar['type']) => {
    switch (type) {
      case 'google':
        return '#4285f4';
      case 'outlook':
        return '#0078d4';
      case 'apple':
        return '#ff6b6b';
      default:
        return '#6b7280';
    }
  };

  const getCalendarIcon = (type: Calendar['type']) => {
    switch (type) {
      case 'google':
        return (
          <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        );
      case 'outlook':
        return (
          <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM22 5.72l-4.6-3.86-1.29 1.53 4.59 3.85L22 5.72zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
          </svg>
        );
      case 'apple':
        return (
          <svg className="w-6 h-6 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add Calendar</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Calendar Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Calendar Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['google', 'outlook', 'apple'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`p-4 border-2 rounded-lg transition-all duration-200 flex flex-col items-center space-y-2 ${
                    selectedType === type
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {getCalendarIcon(type)}
                  <span className="text-sm font-medium capitalize text-gray-700">
                    {type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Name */}
          <div>
            <label htmlFor="calendarName" className="block text-sm font-medium text-gray-700 mb-2">
              Calendar Name
            </label>
            <input
              type="text"
              id="calendarName"
              value={calendarName}
              onChange={(e) => setCalendarName(e.target.value)}
              placeholder="e.g., Work Calendar, Personal Calendar"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          {/* Info Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-700">
              You&apos;ll be redirected to {selectedType} to authorize access to your calendar.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!calendarName.trim() || !email.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Connect Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCalendarModal;
