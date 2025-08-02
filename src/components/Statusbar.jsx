import React, { useEffect, useState } from 'react';
import './Statusbar.css';

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
                        src={`/src/assets/images/img-network.png`}
                        alt='network'
                    />
                    <img
                        className='wifi'
                        src={`/src/assets/images/img-wifi.png`}
                        alt='wifi'
                    />
                    <img
                        className='battery'
                        src={`/src/assets/images/img-battery.png`}
                        alt='battery'
                    />
                </div>
            </div>
        </>
    )
}
