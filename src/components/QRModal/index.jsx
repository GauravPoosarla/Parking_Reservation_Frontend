import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';

const QRModal = ({ isOpen, onClose, qrCodeData }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-10 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      <div className='flex items-center justify-center min-h-screen px-4 pb-10 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
          <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
        </div>
        <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
          &#8203;
        </span>
        <div className='inline-block align-bottom bg-white rounded-lg pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6'>
          <div className='flex justify-end'>
            <button
              type='button'
              className='text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
              onClick={onClose}>
              <span className='sr-only'>Close</span>
              <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
          <div className='mt-3 text-center sm:mt-5'>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>QR Code</h3>
            <div className='mt-2'>
              <div className='flex justify-center'>
                <QRCode value={qrCodeData} size={150} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

QRModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  qrCodeData: PropTypes.string.isRequired,
};

export default QRModal;
