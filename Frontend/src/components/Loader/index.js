import React from 'react';
import { loading } from '../../assets';

const Loader = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.3)', // Black background with opacity
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex:'9999'
    }}>
      <img src={loading} alt="Loading..." />
    </div>
  );
};

export default Loader;