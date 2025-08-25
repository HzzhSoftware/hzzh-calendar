'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type EventType = {
  id: string;
  title: string;
  duration: string;
  location: string;
  format: string;
  availability: string;
  active: boolean;
};

interface CalendarContextType {
  eventTypes: EventType[];
  selectedEventType: string | null;
  addEventType: (eventType: Omit<EventType, 'id'>) => void;
  updateEventType: (id: string, updates: Partial<EventType>) => void;
  deleteEventType: (id: string) => void;
  toggleEventTypeActive: (id: string) => void;
  selectEventType: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCalendar: string;
  setSelectedCalendar: (calendar: string) => void;
  activeTab: 'event-types' | 'single-use-links' | 'meeting-polls';
  setActiveTab: (tab: 'event-types' | 'single-use-links' | 'meeting-polls') => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

const initialEventTypes: EventType[] = [
  {
    id: '1',
    title: 'ION Water',
    duration: '30 min',
    location: 'Google Meet',
    format: 'One‑on‑One',
    availability: 'Weekdays, hours vary',
    active: true,
  },
  {
    id: '2',
    title: 'KYCombinator – Due Diligence',
    duration: '1 hr',
    location: 'Google Meet',
    format: 'One‑on‑One',
    availability: 'Thu, Fri, Sat, hours vary',
    active: false,
  },
];

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [eventTypes, setEventTypes] = useState<EventType[]>(initialEventTypes);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCalendar, setSelectedCalendar] = useState('my-home-calendar');
  const [activeTab, setActiveTab] = useState<'event-types' | 'single-use-links' | 'meeting-polls'>('event-types');

  const addEventType = (eventType: Omit<EventType, 'id'>) => {
    const newEventType: EventType = {
      ...eventType,
      id: Date.now().toString(),
    };
    setEventTypes(prev => [...prev, newEventType]);
  };

  const updateEventType = (id: string, updates: Partial<EventType>) => {
    setEventTypes(prev => 
      prev.map(event => 
        event.id === id ? { ...event, ...updates } : event
      )
    );
  };

  const deleteEventType = (id: string) => {
    setEventTypes(prev => prev.filter(event => event.id !== id));
    if (selectedEventType === id) {
      setSelectedEventType(null);
    }
  };

  const toggleEventTypeActive = (id: string) => {
    setEventTypes(prev => 
      prev.map(event => 
        event.id === id ? { ...event, active: !event.active } : event
      )
    );
  };

  const selectEventType = (id: string | null) => {
    setSelectedEventType(id);
  };

  const value: CalendarContextType = {
    eventTypes,
    selectedEventType,
    addEventType,
    updateEventType,
    deleteEventType,
    toggleEventTypeActive,
    selectEventType,
    searchQuery,
    setSearchQuery,
    selectedCalendar,
    setSelectedCalendar,
    activeTab,
    setActiveTab,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
