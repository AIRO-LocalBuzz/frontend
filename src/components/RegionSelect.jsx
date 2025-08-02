import React, { useRef, useEffect, useState } from 'react';
import './RegionSelect.css';

export default function RegionSelect({ activeRegion, onRegionClick }) {
    const regions = ['서울', '경기도', '강원도', '충청도', '전라도', '경상도', '제주도'];

    const scrollRef = useRef(null);
    const containerRef = useRef(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const [roundClass, setRoundClass] = useState('round-left');

    const handleMouseDown = (e) => {
        isDown.current = true;
        scrollRef.current.classList.add('dragging');
        startX.current = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft.current = scrollRef.current.scrollLeft;

        if (containerRef.current) {
            containerRef.current.style.left = '0px';
        }
    };

    const handleMouseLeave = () => {
        isDown.current = false;
        scrollRef.current.classList.remove('dragging');
    };

    const handleMouseUp = () => {
        isDown.current = false;
        scrollRef.current.classList.remove('dragging');
    };

    const handleMouseMove = (e) => {
        if (!isDown.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.7;
        scrollRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const handleScroll = () => {
        const el = scrollRef.current;
        const container = containerRef.current;
        if (!el || !container) return;

        const scrollLeft = el.scrollLeft;
        const scrollWidth = el.scrollWidth;
        const clientWidth = el.clientWidth;

        if (scrollLeft <= 0) {
            setRoundClass('round-left');
        } else if (scrollLeft + clientWidth >= scrollWidth - 1) {
            setRoundClass('round-right');
        } else {
            setRoundClass('round-middle');
        }

        container.style.left = scrollLeft <= 0 ? '16px' : '0px';
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        el.addEventListener('scroll', handleScroll);
        handleScroll(); // 초기 위치 체크

        return () => {
            el.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="region_container" ref={containerRef}>
            <div
                className={`region ${roundClass}`}
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {regions.map((region) => (
                    <button
                        key={region}
                        className={activeRegion === region ? 'active' : ''}
                        onClick={() => onRegionClick(region)}
                    >
                        <p>{region}</p>
                    </button>
                ))}
                <div className="region-end-gap" />
            </div>
        </div>
    );
}




// import React from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import './RegionSelect.css';

// export default function RegionSelect({ activeRegion, onRegionClick }) {
//     const regions = ['서울', '경기도', '강원도', '충청도', '전라도', '경상도', '제주도'];

//     return (
//         <div className='region'>
//             <Swiper spaceBetween={8} slidesPerView="auto" className="region-swiper">
//                 {regions.map(region => (
//                     <SwiperSlide key={region} style={{ width: 'auto' }}>
//                         <button
//                             className={activeRegion === region ? 'active' : ''}
//                             onClick={() => onRegionClick(region)}
//                         >
//                             <p>{region}</p>
//                         </button>
//                     </SwiperSlide>
//                 ))}
//             </Swiper>
//         </div>
//     );
// }
