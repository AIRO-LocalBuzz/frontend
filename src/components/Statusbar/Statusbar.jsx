import React, { useEffect, useState } from 'react';
import './Statusbar.css';
import networkIcon from '../../assets/icons/statusbar/icon-network.svg';
import wifiIcon from '../../assets/icons/statusbar/icon-wifi.svg';
import batteryIcon from '../../assets/icons/statusbar/icon-battery.svg';

export default function Statusbar() {
  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
    }, 60 * 1000);

    setTime(getCurrentTime());

    return () => clearInterval(interval);
  }, []);

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  return (
    <>
      <div className='status_bar'>
        <div className='time'>
          <p>{time}</p>
        </div>
        <div className='levels'>
          <img
            className='network'
            src={networkIcon}
            alt='network'
          />
          <img
            className='wifi'
            src={wifiIcon}
            alt='wifi'
          />
          <img
            className='battery'
            src={batteryIcon}
            alt='battery'
          />
        </div>
      </div>
    </>
  )
}
