'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MeetingType } from '@/types/calendar';

interface CalendarContextType {
  meetingTypes: MeetingType[];
  selectedMeetingType: string | null;
  addMeetingType: (meetingType: Omit<MeetingType, 'id'>) => void;
  updateMeetingType: (id: string, updates: Partial<MeetingType>) => void;
  deleteMeetingType: (id: string) => void;
  toggleMeetingTypeActive: (id: string) => void;
  selectMeetingType: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCalendar: string;
  setSelectedCalendar: (calendar: string) => void;
  activeTab: 'meeting-types' | 'single-use-links' | 'meeting-polls';
  setActiveTab: (tab: 'meeting-types' | 'single-use-links' | 'meeting-polls') => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

const initialMeetingTypes: MeetingType[] = [
  {
    id: '1',
    userId: '1',
    name: 'ION Water',
    duration: 30,
    price: 0,
    timezone: 'America/New_York',
    iconType: 'chat',
    location: 'Google Meet',
    type: 'virtual',
    description: 'Weekdays, hours vary',
    active: true,
  },
  {
    id: '2',
    userId: '1',
    name: 'KYCombinator – Due Diligence',
    duration: 60,
    price: 0,
    timezone: 'America/New_York',
    iconType: 'chat',
    location: 'Google Meet',
    type: 'virtual',
    description: 'Thu, Fri, Sat, hours vary',
    active: false,
  },
];

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>(initialMeetingTypes);
  const [selectedMeetingType, setSelectedMeetingType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCalendar, setSelectedCalendar] = useState('my-home-calendar');
  const [activeTab, setActiveTab] = useState<'meeting-types' | 'single-use-links' | 'meeting-polls'>('meeting-types');

  const addMeetingType = (meetingType: Omit<MeetingType, 'id'>) => {
    const newMeetingType: MeetingType = {
      ...meetingType,
      id: Date.now().toString(),
    };
    setMeetingTypes(prev => [...prev, newMeetingType]);
  };

  const updateMeetingType = (id: string, updates: Partial<MeetingType>) => {
    setMeetingTypes(prev => 
      prev.map(meeting => 
        meeting.id === id ? { ...meeting, ...updates } : meeting
      )
    );
  };

  const deleteMeetingType = (id: string) => {
    setMeetingTypes(prev => prev.filter(meeting => meeting.id !== id));
    if (selectedMeetingType === id) {
      setSelectedMeetingType(null);
    }
  };

  const toggleMeetingTypeActive = (id: string) => {
    setMeetingTypes(prev => 
      prev.map(meeting => 
        meeting.id === id ? { ...meeting, active: !meeting.active } : meeting
      )
    );
  };

  const selectMeetingType = (id: string | null) => {
    setSelectedMeetingType(id);
  };

  const value: CalendarContextType = {
    meetingTypes,
    selectedMeetingType,
    addMeetingType,
    updateMeetingType,
    deleteMeetingType,
    toggleMeetingTypeActive,
    selectMeetingType,
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
