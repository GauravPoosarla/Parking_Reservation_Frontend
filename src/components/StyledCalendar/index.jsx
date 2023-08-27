import React, { useState } from 'react';
import Calendar from 'react-calendar';
import PropTypes from 'prop-types';
import 'react-calendar/dist/Calendar.css';
import './StyledCalendar.css';

const StyledCalendar = ({ onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = date => {
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    setSelectedDate(date);
    onSelectDate(date);
  };

  return (
    <div className='w-full max-w-md mx-auto p-4'>
      <Calendar onChange={handleDateChange} value={selectedDate} className='rounded-lg shadow-md' />
    </div>
  );
};

StyledCalendar.propTypes = {
  onSelectDate: PropTypes.func.isRequired,
};

export default StyledCalendar;
