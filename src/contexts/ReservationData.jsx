import React from 'react';
import { createContext } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';

export const ReservationDataContext = createContext({});

const ReservationDataProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);

  return (
    <ReservationDataContext.Provider value={{ reservations, setReservations }}>
      {children}
    </ReservationDataContext.Provider>
  );
};

ReservationDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ReservationDataProvider };
