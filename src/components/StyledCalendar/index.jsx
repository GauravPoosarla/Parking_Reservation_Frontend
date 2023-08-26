import React, { useState } from 'react';
import Calendar from 'react-calendar';
import PropTypes from 'prop-types';
import 'react-calendar/dist/Calendar.css';
import './StyledCalendar.css';

const StyledCalendar = ({ onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = date => {
    setSelectedDate(date);
    onSelectDate(date); // Pass the selected date to the parent component
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
