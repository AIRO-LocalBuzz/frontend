import React from 'react';
import './Lists.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function Lists({ listItems, category }) {
    return (
        <div className='lists'>
            <div className='list_title'>
                <p className='list_type'>{category} 리스트</p>
                <button className='more'>
                    <p>더보기</p>
                </button>
            </div>

            <Swiper
                className='lists_container'
                spaceBetween={8}
                slidesPerView={'auto'}
                slidesOffsetAfter={77}
            >
                {listItems.map((item, idx) => (
                    <SwiperSlide className='list' key={idx}>
                        <div className='list_img'>
                            {item.isPlaceholder ? (
                                <div className='placeholder_box'>
                                    <p className='placeholder_text'>콘텐츠 준비 중입니다.</p>
                                </div>
                            ) : (
                                // <img src='/src/assets/images/bee.png' alt='sample' />
                                <img src={item.image} alt='list thumbnail' />
                            )}
                        </div>
                        {!item.isPlaceholder && (
                            <div className='list_txt'>
                                <div className='tag'>
                                    {item.tag.includes('인기') && (
                                        <div className='popular'>
                                            <p>인기</p>
                                        </div>
                                    )}
                                    {item.tag.includes('NEW') && (
                                        <div className='new'>
                                            <p>NEW</p>
                                        </div>
                                    )}
                                </div>
                                <div className='main_txt'>
                                    <p className='desc'>{item.desc}</p>
                                    <p className='title'>{item.title}</p>
                                    <p className='town'>{item.town}</p>
                                </div>
                            </div>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
