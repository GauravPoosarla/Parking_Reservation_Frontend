import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';

const CheckAvailabilityModal = ({ isOpen, onClose }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  const fetchAvailableSlots = () => {
    setIsChecking(true);
    const formattedStartTime = startTime + ':00';
    const formattedEndTime = endTime + ':00';
    axios
      .get('http://localhost:8000/available-slots-for-time', {
        params: { startTime: formattedStartTime, endTime: formattedEndTime, date },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(response => {
        setAvailableSlots(response.data);
        if (availableSlots.length > 0) {
          onClose();
          setStartTime('');
          setEndTime('');
          setDate('');
          setAvailableSlots([]);
          toast.success('Slots are available');
        } else {
          onClose();
          setStartTime('');
          setEndTime('');
          setDate('');
          setAvailableSlots([]);
          toast.error('No slots are available');
        }
      })
      .catch(error => {
        console.error('Error fetching available slots:', error);
      })
      .finally(() => {
        setIsChecking(false);
      });
  };

  const handleStartTimeChange = option => {
    setStartTime(option.value);
  };

  const handleEndTimeChange = option => {
    setEndTime(option.value);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date(0, 0, 0, hour, minute);
        const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        options.push({ value: time.toTimeString().substring(0, 5), label: formattedTime });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className={`fixed inset-0 z-10 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
          <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
        </div>
        <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
          &#8203;
        </span>
        <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
          <div>
            <div className='mt-3 text-left sm:mt-5'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>Check Availability</h3>
                <button onClick={onClose} className='text-gray-500 hover:text-gray-700 focus:outline-none focus:ring'>
                  <span className='sr-only'>Close</span>
                  <svg
                    className='h-6 w-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
              <div className='mt-6'>
                <div className='mb-4'>
                  <label htmlFor='startTime' className='block text-sm font-medium text-gray-700'>
                    Start Time
                  </label>
                  <Select
                    id='startTime'
                    name='startTime'
                    value={timeOptions.find(option => option.value === startTime)}
                    options={timeOptions}
                    onChange={handleStartTimeChange}
                    className='mt-1'
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor='endTime' className='block text-sm font-medium text-gray-700'>
                    End Time
                  </label>
                  <Select
                    id='endTime'
                    name='endTime'
                    value={timeOptions.find(option => option.value === endTime)}
                    options={timeOptions}
                    onChange={handleEndTimeChange}
                    className='mt-1'
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor='date' className='block text-sm font-medium text-gray-700'>
                    Date
                  </label>
                  <input
                    type='date'
                    id='date'
                    name='date'
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className='pl-3 pr-4 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                </div>
                <button
                  className={`w-full px-4 py-2 bg-purple-700 text-white rounded-md ${
                    startTime && endTime && date
                      ? 'hover:bg-purple-600 focus:outline-none focus:bg-purple-600'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={fetchAvailableSlots}
                  disabled={!startTime || !endTime || !date || isChecking}>
                  Check Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CheckAvailabilityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CheckAvailabilityModal;
