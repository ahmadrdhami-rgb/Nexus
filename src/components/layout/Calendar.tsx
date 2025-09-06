import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Event {
  title: string;
  date: string;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    { title: 'Sample Meeting', date: '2025-09-01T10:00:00' },
  ]);

  const handleDateClick = (arg: { dateStr: string }) => {
    const title = prompt('Enter meeting title:');
    if (title) {
      setEvents([...events, { title, date: arg.dateStr }]);
    }
  };

  const handleSendRequest = () => {
    alert('Meeting Request Sent');
  };

  const handleAccept = () => {
    alert('Meeting Accepted');
  };

  const handleDecline = () => {
    alert('Meeting Declined');
  };

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        dateClick={handleDateClick}
        editable={true}
      />
      <div className="mt-4 space-x-2">
        <button className="btn" onClick={handleSendRequest}>
          Send Request
        </button>
        <button className="btn" onClick={handleAccept}>
          Accept
        </button>
        <button className="btn" onClick={handleDecline}>
          Decline
        </button>
      </div>
    </div>
  );
};

export default Calendar;