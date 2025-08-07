import React, { useState, useImperativeHandle, forwardRef } from 'react';

const AlertMessage = forwardRef((props, ref) => {
  const [alert, setAlert] = useState({
    show: false,
    title: '',
    message: '',
    type: 'info'
  });

  useImperativeHandle(ref, () => ({
    show(title, message, type = 'info') {
      setAlert({ show: true, title, message, type });

      setTimeout(() => {
        setAlert(prev => ({ ...prev, show: false }));
      }, 4000);
    }
  }));

  if (!alert.show) return null;

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-[9999] 
      p-4 rounded-lg shadow-lg text-white ${bgColors[alert.type]} 
      w-[90%] max-w-sm text-center`}>
      <h3 className="text-lg font-bold mb-2">{alert.title}</h3>
      <p>{alert.message}</p>
    </div>
  );
});

export default AlertMessage;
