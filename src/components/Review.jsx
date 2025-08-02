import React from 'react';
import './Review.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function Review() {
    const reviewItems = [
        {
            number: 1,
            desc: '제임스 최와 함께하는',
            title: '지방살이 해보기',
            writer: '덕업일치 유튜버 김00님',
            tag: ['마감임박', 'NEW'],
            image: `/src/assets/images/img-topReview1.jpg`,
        },
        {
            number: 2,
            desc: '새로운 걸 발견하고 싶다면',
            title: '동구박 우리동네',
            writer: '역사 해설가 이00님',
            tag: ['NEW'],
            image: `/src/assets/images/img-topReview2.jpg`,
        },
        {
            number: 3,
            desc: '어른도 아이도 반한 농촌 놀이터',
            title: '고구마 캐기 대작전',
            writer: '육아 인플루언서 오00님',
            tag: ['마감임박', 'NEW'],
            image: `/src/assets/images/img-topReview3.jpg`,
        },
        {
            number: 4,
            desc: '카메라에 담은 사계절',
            title: '숨은 포토스팟 투어',
            writer: '사진작가 유00님',
            tag: ['NEW'],
            image: `/src/assets/images/img-topReview4.jpg`,
        },
        {
            number: 5,
            desc: '한옥에서 하룻밤, 깊은 쉼을 느끼다',
            title: '달빛 아래 한옥스테이',
            writer: '에세이 작가 박00님',
            tag: ['NEW'],
            image: `/src/assets/images/img-topReview5.jpg`,
        }
    ];

    return (
        <div className='review_top'>
            <div className='review_title'>
                <p className='popular'>인기 후기 TOP 10</p>
                <button className='more'>
                    <p>더보기</p>
                </button>
            </div>

            <Swiper
                className='review_container'
                spaceBetween={16}
                slidesPerView={'auto'}
                slidesOffsetAfter={77}
            >
                {reviewItems.map((item, idx) => (
                    <SwiperSlide className='review_list' key={idx}>
                        <div className='review_item'>
                            <p className='number'>{item.number}</p>
                            <div className='review_img'>
                                <img src={item.image} alt={item.title} />
                            </div>
                        </div>
                        <div className='review_txt'>
                            <div className='tag'>
                                {item.tag.includes('마감임박') && (
                                    <div className='deadline'>
                                        <p>마감임박</p>
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
                                <p className='writer'>{item.writer}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
