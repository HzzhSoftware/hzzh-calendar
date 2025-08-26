// MeetingCard.tsx
import React from 'react';
import { useCalendar } from './CalendarContext';
import { MeetingType } from '@/types/calendar';

const MeetingCard = ({ meeting }: { meeting: MeetingType }) => {
  const { selectedMeetingType, selectMeetingType } = useCalendar();
  const isSelected = selectedMeetingType === meeting.id;
  const isInactive = !meeting.active;

  const handleCardClick = () => {
    selectMeetingType(isSelected ? null : meeting.id);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    // copy link functionality
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick();
      }}
      className={[
        'group flex items-center justify-between p-4 rounded-lg border transition-all duration-200 focus:outline-none cursor-pointer',
        isSelected
          ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-500/50'
          : isInactive
          ? 'border-neutral-200 bg-white text-neutral-500 opacity-70 hover:bg-neutral-50'
          : 'border-neutral-200 bg-white hover:shadow-md',
      ].join(' ')}
    >
      <div className="flex-1 space-y-1">
        <div className="flex items-baseline gap-2">
          <h3
            className={[
              'text-base font-medium',
              isSelected ? 'text-primary-900' : '',
            ].join(' ')}
          >
            {meeting.name}
          </h3>
          {isInactive && (
            <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs text-neutral-600">
              Inactive
            </span>
          )}
        </div>
        <p
          className={[
            'text-sm',
            isSelected ? 'text-primary-700' : '',
          ].join(' ')}
        >
          {meeting.duration} · {meeting.type}
        </p>
        <p
          className={[
            'text-sm',
            isSelected ? 'text-primary-600' : '',
          ].join(' ')}
        >
          {meeting.description}
        </p>
      </div>

      <div className="ml-4 flex items-center gap-3">
        {meeting.active ? (
          <button
            type="button"
            aria-label="Copy scheduling link"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm transition-colors duration-200 hover:bg-neutral-50 group-focus:ring-2 group-focus:ring-primary-500/40"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M12.586 8.586a2 2 0 00-2.828 0L7 11.343a2 2 0 102.828 2.829l3.757-3.757a2 2 0 000-2.829z" />
              <path d="M11.414 11.414a2 2 0 002.828 0L17 8.586a2 2 0 00-2.828-2.828l-2.757 2.757a2 2 0 000 2.829z" />
            </svg>
            Copy link
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              // add toggleMeetingTypeActive if needed
            }}
            className="rounded-md border px-3 py-2 text-sm transition-colors duration-200 hover:bg-neutral-50 group-focus:ring-2 group-focus:ring-primary-500/40"
          >
            Turn On
          </button>
        )}
      </div>
    </div>
  );
};

export default MeetingCard;
