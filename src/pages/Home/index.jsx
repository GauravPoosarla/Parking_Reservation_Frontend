import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import ReservationModal from '../../components/ReservationModal';
import CheckAvailabilityModal from '../../components/CheckAvailabilityModal';
import UpdateReservationModal from '../../components/UpdateReservationModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import QRModal from '../../components/QRModal';
import { ReservationDataContext } from '../../contexts/ReservationData';
import { toast } from 'react-toastify';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckAvailabilityModalOpen, setIsCheckAvailabilityModalOpen] = useState(false);
  const [isUpdateReservationModalOpen, setIsUpdateReservationModalOpen] = useState(false);
  const [updateReservation, setUpdateReservation] = useState({});
  const [deleteReservationId, setDeleteReservationId] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const { reservations, setReservations } = useContext(ReservationDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8000/get-reservations-of-user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(response => {
        setReservations(response.data);
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Something went wrong');
        }
      });
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  });

  const handleUpdateReservation = id => {
    setIsUpdateReservationModalOpen(true);
    const reservationToUpdate = reservations.find(reservation => reservation.id === id);
    setUpdateReservation(reservationToUpdate);
  };

  const handleDeleteReservation = id => {
    setDeleteReservationId(id);
  };

  const confirmDelete = () => {
    if (deleteReservationId) {
      const reservationToDelete = reservations.find(reservation => reservation.id === deleteReservationId);

      if (reservationToDelete) {
        axios
          .delete(`http://localhost:8000/cancel-reservation/${deleteReservationId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          })
          .then(() => {
            setReservations(prevReservations =>
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

  const handleViewQrCode = async reservationId => {
    try {
      const response = await axios.get(`http://localhost:8000/get-status-of-reservation/${reservationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const qrDataString = JSON.stringify(response.data);

      setQrCodeData(qrDataString);
      setIsQRModalOpen(true);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const sortedReservations = reservations.sort((a, b) => {
    const dateComparison = a.date.localeCompare(b.date);
    if (dateComparison !== 0) {
      return dateComparison;
    }
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div>
      <Navbar />
      <div className='container mx-auto mt-10'>
        <h1 className='text-3xl font-semibold text-center text-purple-700 mb-6'>Reservations</h1>
        <div className='flex justify-start items-center gap-x-5'>
          <button
            className='px-4 py-2 bg-purple-700 text-white rounded-full hover:bg-purple-600 focus:outline-none focus:bg-purple-600 mb-4'
            onClick={() => setIsModalOpen(true)}>
            Create Reservation
          </button>
          <button
            className='px-4 py-2 bg-purple-700 text-white rounded-full hover:bg-purple-600 focus:outline-none focus:bg-purple-600 mb-4'
            onClick={() => setIsCheckAvailabilityModalOpen(true)}>
            Check Availability
          </button>
        </div>
        <div className='bg-white rounded-md shadow-lg p-4'>
          <h2 className='text-lg font-semibold mb-2'>Your Reservations</h2>
          <div className='overflow-y-scroll max-h-96'>
            <table className='w-full border'>
              <thead className='sticky top-0 bg-purple-700 text-white'>
                <tr className='bg-purple-700 text-white'>
                  <th className='py-2 px-4 text-left'>Date</th>
                  <th className='py-2 px-4 text-left'>Time</th>
                  <th className='py-2 px-4 text-left'>Slot</th>
                  <th className='py-2 px-4 text-left'>QR code</th>
                  <th className='py-2 px-4'>
                    <div className='flex justify-end items-center pr-2'>Actions</div>
                  </th>
                  <th className='py-2 px-4 text-left'></th>
                </tr>
              </thead>
              <tbody>
                {sortedReservations.map(reservation => (
                  <tr key={reservation.id} className='border-t'>
                    <td className='py-2 px-4'>{formatDate(reservation.date)}</td>
                    <td className='py-2 px-4'>
                      {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                    </td>
                    <td className='py-2 px-4'>{reservation.slot}</td>
                    <td className='py-2 px-4'>
                      <button
                        className='hover:underline focus:outline-none'
                        onClick={() => handleViewQrCode(reservation.id)}>
                        Generate QR
                      </button>
                    </td>
                    <td className='py-2 px-4'>
                      <button
                        className='px-2 py-1 bg-white text-purple-600 rounded border border-purple-600 hover:bg-purple-600 hover:text-white focus:outline-none focus:bg-purple-600 focus:text-white'
                        onClick={() => handleUpdateReservation(reservation.id)}>
                        Edit
                      </button>
                    </td>
                    <td className='py-2 px-4'>
                      <button
                        className='px-2 py-1 bg-red-700 text-white rounded hover:bg-red-600 focus:outline-none focus:bg-red-600'
                        onClick={() => handleDeleteReservation(reservation.id)}>
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reservations.length === 0 && <p className='text-gray-500'>You don&#39;t have any reservations yet.</p>}
          </div>
        </div>
        <ConfirmationModal
          isOpen={deleteReservationId !== null}
          onClose={() => setDeleteReservationId(null)}
          onConfirm={confirmDelete}
        />
        <ReservationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <CheckAvailabilityModal
          isOpen={isCheckAvailabilityModalOpen}
          onClose={() => setIsCheckAvailabilityModalOpen(false)}
        />
        <UpdateReservationModal
          isOpen={isUpdateReservationModalOpen}
          onClose={() => setIsUpdateReservationModalOpen(false)}
          reservation={updateReservation}
        />
        <QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} qrCodeData={qrCodeData} />
      </div>
    </div>
  );
};

export default Home;
