import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar';
import StyledCalendar from '../../components/StyledCalendar';
import ConfirmationModal from '../../components/ConfirmationModal';
import { toast } from 'react-toastify';

const AdminPage = () => {
  const [parkingDetails, setParkingDetails] = useState([]);
  const [date, setDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [deleteReservationId, setDeleteReservationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    axios
      .get('http://localhost:8000/reservations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(response => {
        setParkingDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching parking details:', error);
      });
  }, []);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateReset = () => {
    setDate('');
  };

  const confirmDelete = async () => {
    if (deleteReservationId) {
      const reservationToDelete = parkingDetails.find(reservation => reservation.id === deleteReservationId);
      if (reservationToDelete) {
        axios
          .delete(`http://localhost:8000/delete-reservation-admin/${deleteReservationId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          })
          .then(() => {
            setParkingDetails(prevReservations =>
              prevReservations.filter(reservation => reservation.id !== deleteReservationId)
            );
            toast.success('Reservation deleted successfully!');
          })
          .catch(error => {
            toast.error(error.response.data.message);
          });
      } else {
        toast.error('Reservation not found.');
      }
      setDeleteReservationId(null);
    }
  };

  const handleFetchCurrentStatus = () => {
    axios
      .get('http://localhost:8000/reservations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(response => {
        setParkingDetails(response.data);
        toast.success('Current status fetched successfully!');
      })
      .catch(error => {
        toast.error(error.response.data.message);
      });
  };

  const filteredParkingDetails = parkingDetails.filter(parking => {
    const isMatchingDate = !date || parking.date === date.toISOString().split('T')[0];
    const isMatchingSearch = !searchQuery || parking.userEmail.includes(searchQuery);

    return isMatchingDate && isMatchingSearch;
  });

  const sortedParkingDetails = filteredParkingDetails.sort((a, b) => {
    const dateComparison = a.date.localeCompare(b.date);
    if (dateComparison !== 0) {
      return dateComparison;
    }
    return a.startTime.localeCompare(b.startTime);
  });

  const handleDeleteReservation = id => {
    setDeleteReservationId(id);
  };

  return (
    <div>
      <Navbar />
      <div className='container mx-auto mt-8'>
        <div className='flex items-center mb-4 gap-x-2 relative justify-between'>
          <div className='flex items-center gap-x-2'>
            <h2 className='text-2xl font-semibold text-purple-700'>All Reservations</h2>
            <FontAwesomeIcon icon={faFilter} className='text-purple-700 mt-1' onClick={toggleCalendar} />
            {showCalendar && (
              <div className='calendar-overlay absolute top-5'>
                <StyledCalendar
                  onSelectDate={date => {
                    setDate(date);
                    toggleCalendar();
                  }}
                />
              </div>
            )}
            {date && (
              <div className='flex items-center gap-x-2'>
                <p className='text-sm font-bold'>Selected date: {date.toISOString().split('T')[0]}</p>
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  className='text-red-500 cursor-pointer'
                  onClick={handleDateReset}
                />
              </div>
            )}
          </div>
          <div className='flex gap-x-2 items-center'>
            <button
              className='py-2 px-2  bg-white text-purple-600 rounded border border-purple-600 hover:bg-purple-600 hover:text-white focus:outline-none focus:bg-purple-600 focus:text-white'
              onClick={handleFetchCurrentStatus}>
              Fetch Status
            </button>
            <input
              type='text'
              placeholder='Search by user email...'
              className='py-2 px-3 border rounded-lg'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className='bg-white shadow-md rounded-lg overflow-x-auto'>
          <table className='min-w-full'>
            <thead className='bg-purple-700 text-white'>
              <tr>
                <th className='py-3 px-6 text-left'>User Email</th>
                <th className='py-3 px-6 text-left'>Date</th>
                <th className='py-3 px-6 text-left'>Start Time</th>
                <th className='py-3 px-6 text-left'>End Time</th>
                <th className='py-3 px-6 text-left'>Slot</th>
                <th className='py-3 px-6 text-left'>Check-In Status</th>
                <th className='py-3 px-6 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedParkingDetails.map(parking => (
                <tr key={parking.id} className='border-b border-gray-200'>
                  <td className='py-4 px-6'>{parking.userEmail}</td>
                  <td className='py-4 px-6'>{parking.date}</td>
                  <td className='py-4 px-6'>{parking.startTime}</td>
                  <td className='py-4 px-6'>{parking.endTime}</td>
                  <td className='py-4 px-6'>{parking.slot}</td>
                  {parking.parkingStatus === true ? (
                    <td className='py-4 px-6 text-green-600'>Checked In</td>
                  ) : (
                    <td className='py-4 px-6 text-red-600'>Not Checked In</td>
                  )}
                  <td className='py-4 px-6'>
                    <button
                      className='px-2 py-1 bg-red-700 text-white rounded hover:bg-red-600 focus:outline-none focus:bg-red-600'
                      onClick={() => handleDeleteReservation(parking.id)}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationModal
        isOpen={deleteReservationId !== null}
        onClose={() => setDeleteReservationId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AdminPage;
