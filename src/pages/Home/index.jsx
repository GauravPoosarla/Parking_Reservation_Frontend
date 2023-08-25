import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import ReservationModal from '../../components/ReservationModal';
import CheckAvailabilityModal from '../../components/CheckAvailabilityModal';
import { ReservationDataContext } from '../../contexts/ReservationData';
import { toast } from 'react-toastify';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckAvailabilityModalOpen, setIsCheckAvailabilityModalOpen] = useState(false);
  const navigate = useNavigate();
  const { reservations, setReservations } = useContext(ReservationDataContext);

  useEffect(() => {
    axios
      .get('http://localhost:8000/get-reservations-of-user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(response => {
        setReservations(response.data);
      })
      .catch(error => {
        console.error('Error fetching reservations:', error);
      });
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  });
  const handleUpdateReservation = () => {
    // Implement update reservation logic here
  };

  const handleDeleteReservation = id => {
    const reservationToDelete = reservations.find(reservation => reservation.id === id);

    if (reservationToDelete) {
      axios
        .delete(`http://localhost:8000/cancel-reservation/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(() => {
          setReservations(prevReservations => prevReservations.filter(reservation => reservation.id !== id));
          toast.success('Reservation deleted successfully!');
        })
        .catch(error => {
          console.error('Error deleting reservation:', error);
        });
    } else {
      console.error('Reservation not found.');
    }
  };

  const formatTime = time => {
    const [hours, minutes] = time.split(':');
    const formattedHours = parseInt(hours);
    const period = formattedHours >= 12 ? 'PM' : 'AM';
    const formattedHours12 = formattedHours % 12 || 12;
    return `${formattedHours12}:${minutes} ${period}`;
  };

  const formatDayWithSuffix = day => {
    if (day >= 11 && day <= 13) {
      return `${day}th`;
    }
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  };

  const formatDate = selectedDate => {
    const dateObj = new Date(selectedDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString(undefined, options);
    const dayWithSuffix = formatDayWithSuffix(dateObj.getDate());
    return formattedDate.replace(String(dateObj.getDate()), dayWithSuffix);
  };

  return (
    <div>
      <Navbar />
      <div className='container mx-auto mt-10'>
        <h1 className='text-3xl font-semibold text-center text-purple-700 mb-6'>Reservations</h1>
        <div className='flex justify-between items-center mb-4'>
          <button
            className='px-4 py-2 bg-purple-700 text-white rounded-full hover:bg-purple-600 focus:outline-none focus:bg-purple-600'
            onClick={() => setIsModalOpen(true)}>
            Create Reservation
          </button>
          <button
            className='px-4 py-2 bg-purple-700 text-white rounded-full hover:bg-purple-600 focus:outline-none focus:bg-purple-600'
            onClick={() => setIsCheckAvailabilityModalOpen(true)}>
            Check Availability
          </button>
        </div>
        <div className='bg-white rounded-md shadow-md p-4'>
          <h2 className='text-lg font-semibold mb-2'>Your Reservations</h2>
          <div className='overflow-y-scroll max-h-96'>
            <table className='w-full border'>
              <thead className='sticky top-0 bg-purple-700 text-white'>
                <tr className='bg-purple-700 text-white'>
                  <th className='py-2 px-4 text-left'>Date</th>
                  <th className='py-2 px-4 text-left'>Time</th>
                  <th className='py-2 px-4 text-left'>Slot</th>
                  <th className='py-2 px-4'></th>
                  <th className='py-2 px-4'></th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(reservation => (
                  <tr key={reservation.id} className='border-t'>
                    <td className='py-2 px-4'>{formatDate(reservation.date)}</td>
                    <td className='py-2 px-4'>
                      {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                    </td>
                    <td className='py-2 px-4'>{reservation.slot}</td>
                    <td className='py-2 px-4'>
                      <button
                        className='px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-500 focus:outline-none focus:bg-purple-600'
                        onClick={() => handleUpdateReservation(reservation.id)}>
                        Update
                      </button>
                    </td>
                    <td className='py-2 px-4'>
                      <button
                        className='px-2 py-1 bg-red-700 text-white rounded hover:bg-red-600 focus:outline-none focus:bg-red-600'
                        onClick={() => handleDeleteReservation(reservation.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reservations.length === 0 && <p className='text-gray-500'>You don&39#;t have any reservations yet.</p>}
          </div>
        </div>
        <ReservationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <CheckAvailabilityModal
          isOpen={isCheckAvailabilityModalOpen}
          onClose={() => setIsCheckAvailabilityModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Home;
