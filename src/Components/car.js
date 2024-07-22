import React from 'react';

const Car = ({ carPosition }) => {
  if (!carPosition) return null;

  return (
    <div
      style={{
        width: '18px',
        height: '18px',
        backgroundColor: 'blue',
        position: 'absolute',
        top: '1px',
        left: '1px',
        borderRadius: '50%',
      }}
    ></div>
  );
};

export default Car;
