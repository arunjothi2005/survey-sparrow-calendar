import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function Calendar({ filter }) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', startTime: '', endTime: '', color: '#3b82f6' });
  const calendarRef = useRef();

  const startOfMonth = currentDate.startOf('month');
  const startDay = startOfMonth.day();
  const daysInMonth = currentDate.daysInMonth();

  useEffect(() => {
    axios.get('/events.json').then((res) => setEvents(res.data));
  }, []);

  const getEventsForDate = (date) => {
    return events.filter(event =>
      event.date === date.format('YYYY-MM-DD') &&
      (event.title.toLowerCase().includes(filter.toLowerCase()) ||
        event.startTime.includes(filter) ||
        event.endTime.includes(filter))
    );
  };

  const renderCells = () => {
    const totalCells = startDay + daysInMonth;
    const cells = [];

    for (let i = 0; i < totalCells; i++) {
      const date = startOfMonth.add(i - startDay, 'day');
      const isToday = date.isSame(dayjs(), 'day');
      const dayEvents = getEventsForDate(date);

      cells.push(
        <div
          key={i}
          className={`${isToday ? 'bg-indigo-100 border-indigo-400 dark:bg-indigo-900' : ''} border p-2 h-32 bg-white dark:bg-gray-800 rounded shadow-sm transition duration-300 transform hover:scale-105 overflow-y-auto`}
        >
          <div className="font-semibold">{date.date()}</div>
          <div className="mt-1 space-y-1 text-sm">
            {dayEvents.map((event, idx) => (
              <div
                key={idx}
                className="text-white px-2 py-1 rounded cursor-pointer"
                style={{ backgroundColor: event.color }}
                title={`${event.title} (${event.startTime} - ${event.endTime})`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return cells;
  };

  const handleDownload = async () => {
    const canvas = await html2canvas(calendarRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save('calendar.pdf');
  };

  const handleCreateEvent = () => {
    setEvents([...events, newEvent]);
    setShowModal(false);
    setNewEvent({ title: '', date: '', startTime: '', endTime: '', color: '#3b82f6' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
          onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}
        >
          Previous
        </button>
        <h2 className="text-xl font-bold">{currentDate.format('MMMM YYYY')}</h2>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
          onClick={() => setCurrentDate(currentDate.add(1, 'month'))}
        >
          Next
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <button onClick={() => setShowModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          ➕ Add Event
        </button>
        <button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          📤 Download as PDF
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div ref={calendarRef} className="grid grid-cols-7 gap-2">
        {renderCells()}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-96 space-y-3">
            <h3 className="text-xl font-bold">Add New Event</h3>
            <input className="w-full p-2 border rounded" placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
            <input type="date" className="w-full p-2 border rounded" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
            <input type="time" className="w-full p-2 border rounded" value={newEvent.startTime} onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })} />
            <input type="time" className="w-full p-2 border rounded" value={newEvent.endTime} onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })} />
            <input type="color" className="w-full p-2 border rounded" value={newEvent.color} onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })} />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-400 rounded text-white">Cancel</button>
              <button onClick={handleCreateEvent} className="px-4 py-2 bg-green-600 text-white rounded">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
