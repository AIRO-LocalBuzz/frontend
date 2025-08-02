import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import './RegionSelect.css';

export default function RegionSelect({ activeRegion, onRegionClick }) {
    const regions = ['서울', '경기도', '강원도', '충청도', '전라도', '경상도', '제주도'];

    return (
        <div className='region'>
            <Swiper
                className="region-swiper"
                // spaceBetween={8}
                slidesPerView="auto"
            // slidesOffsetBefore={16}
            // slidesOffsetAfter={16}
            >
                {regions.map(region => (
                    <SwiperSlide key={region} style={{ width: 'auto' }}>
                        <button
                            className={activeRegion === region ? 'active' : ''}
                            onClick={() => onRegionClick(region)}
                        >
                            <p>{region}</p>
                        </button>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}


// swiper > 양쪽 값 주는거 찾아보기
// before, after css 조절 
