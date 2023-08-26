import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';

const AdminPage = () => {
  const [parkingDetails, setParkingDetails] = useState([]);
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

  return (
    <div>
      <Navbar />
      <div className='container mx-auto mt-8'>
        <h2 className='text-2xl font-semibold text-purple-700 mb-4'>All Reservations</h2>
        <div className='bg-white shadow-md rounded-lg overflow-x-auto'>
          <table className='min-w-full'>
            <thead className='bg-purple-700 text-white'>
              <tr>
                <th className='py-3 px-6 text-left'>ID</th>
                <th className='py-3 px-6 text-left'>Start Time</th>
                <th className='py-3 px-6 text-left'>End Time</th>
                <th className='py-3 px-6 text-left'>Date</th>
                <th className='py-3 px-6 text-left'>User Email</th>
                <th className='py-3 px-6 text-left'>Slot</th>
              </tr>
            </thead>
            <tbody>
              {parkingDetails.map(parking => (
                <tr key={parking.id} className='border-b border-gray-200'>
                  <td className='py-4 px-6'>{parking.id}</td>
                  <td className='py-4 px-6'>{parking.startTime}</td>
                  <td className='py-4 px-6'>{parking.endTime}</td>
                  <td className='py-4 px-6'>{parking.date}</td>
                  <td className='py-4 px-6'>{parking.userEmail}</td>
                  <td className='py-4 px-6'>{parking.slot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
