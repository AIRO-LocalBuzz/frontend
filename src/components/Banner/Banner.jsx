import React, { useState, useRef, useEffect } from 'react';
import './Banner.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

export default function Banner() {
    const [activeTab, setActiveTab] = useState('buzzmap');
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(1);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(10);
    const containerRef = useRef(null);

    // 터치 기반 줌인/아웃 감지
    useEffect(() => {
        let initialDistance = null;

        const getDistance = (touches) => {
            const [a, b] = touches;
            return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        };

        const onTouchStart = (e) => {
            if (e.touches.length === 2) initialDistance = getDistance(e.touches);
        };

        const onTouchMove = (e) => {
            if (e.touches.length === 2 && initialDistance !== null) {
                const distance = getDistance(e.touches);
                const diff = distance - initialDistance;
                if (Math.abs(diff) > 10) {
                    setZoomLevel((prev) =>
                        diff > 0 ? Math.min(prev + 1, 20) : Math.max(prev - 1, 10)
                    );
                    initialDistance = distance;
                }
            }
        };

        const onTouchEnd = () => {
            initialDistance = null;
        };

        const onWheel = (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                setZoomLevel((prev) =>
                    e.deltaY < 0 ? Math.min(prev + 1, 20) : Math.max(prev - 1, 10)
                );
            }
        };

        const container = containerRef.current;

        container.addEventListener('touchstart', onTouchStart);
        container.addEventListener('touchmove', onTouchMove);
        container.addEventListener('touchend', onTouchEnd);

        // window에 wheel 이벤트 등록
        window.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            container.removeEventListener('touchstart', onTouchStart);
            container.removeEventListener('touchmove', onTouchMove);
            container.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('wheel', onWheel);
        };
    }, []);

    return (
        <div className='banner'>
            <div className='banner_container'>
                <div className='banner_choice'>
                    <div className='choice_container'>
                        <button
                            className={`buzzmap ${activeTab === 'buzzmap' ? 'active' : ''}`}
                            onClick={() => setActiveTab('buzzmap')}
                        >
                            <p>버즈맵</p>
                        </button>
                        <button
                            className={`magazine ${activeTab === 'magazine' ? 'active' : ''}`}
                            onClick={() => {
                                if (activeTab !== 'magazine') {
                                    setCurrent(1);
                                    setActiveTab('magazine');
                                    setTimeout(() => {
                                        if (swiperInstance) swiperInstance.slideTo(0);
                                    }, 0);
                                }
                            }}
                        >
                            <p>매거진</p>
                        </button>
                        <button
                            className={`review ${activeTab === 'review' ? 'active' : ''}`}
                            onClick={() => {
                                if (activeTab !== 'review') {
                                    setCurrent(1);
                                    setActiveTab('review');
                                    setTimeout(() => {
                                        if (swiperInstance) swiperInstance.slideTo(0);
                                    }, 0);
                                }
                            }}
                        >
                            <p>후기</p>
                        </button>
                    </div>
                </div>
                {/* 버즈맵 */}
                {activeTab === 'buzzmap' && (
                    <>
                        <div className='map'>
                            <div className="map-area" ref={containerRef}>
                                <div
                                    className="zoom-content"
                                    style={{
                                        transform: `scale(${Math.max(zoomLevel / 15, 1)})`,
                                    }}
                                >

                                    {/* 디테일 지도: zoomLevel >= 14 */}
                                    <img
                                        src={`/src/assets/images/img-map.svg`}
                                        className={`map-image map-detail ${zoomLevel >= 14 ? 'visible' : ''}`}
                                        alt="map"
                                    />

                                    {/* 기본 지도 + 일러스트 모드: zoomLevel < 14 */}
                                    <img
                                        src={`/src/assets/images/img-beehive-sample.png`}
                                        className={`map-image map-basic ${zoomLevel < 14 ? 'visible' : ''}`}
                                        alt="beehive"
                                        style={{
                                            transform: `scale(${1 + (zoomLevel - 10) * 0.03})`,
                                            transition: 'transform 0.3s ease',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {/* 매거진 */}
                {activeTab === 'magazine' && (
                    <>
                        <Swiper
                            modules={[Pagination]}
                            pagination={{
                                type: 'progressbar',
                                el: '.swiper-progressbar',
                            }}
                            onSwiper={(swiper) => {
                                setSwiperInstance(swiper);
                                setTotal(swiper.slides.length);
                            }}
                            onSlideChange={(swiper) => {
                                setCurrent(swiper.realIndex + 1);
                                setTotal(swiper.slides.length);
                            }}
                        >
                            <SwiperSlide>
                                <img
                                    className='magazine_img'
                                    src={`/src/assets/images/img-magazine1.png`}
                                    alt='magazine'
                                />
                                <div className='magazine_container'>
                                    <div className='magazine_txt'>
                                        <p className='main_txt'>9월 가족 여행지 추천</p>
                                        <p className='sub_txt'>친구 또는 가족과 떠나는 여행 프로모션에 응모해보세요!</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <img
                                    className='magazine_img'
                                    src={`/src/assets/images/img-magazine2.png`}
                                    alt='magazine'
                                />
                                <div className='magazine_container'>
                                    <div className='magazine_txt'>
                                        <p className='main_txt'>로컬밥상 따라 맛집 순례</p>
                                        <p className='sub_txt'>가을 입맛 저격! 제철 체험과 식도락 코스</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <img
                                    className='magazine_img'
                                    src={`/src/assets/images/img-magazine3.png`}
                                    alt='magazine'
                                />
                                <div className='magazine_container'>
                                    <div className='magazine_txt'>
                                        <p className='main_txt'>우리 마을에서 찍은 한 컷!</p>
                                        <p className='sub_txt'>체험 사진 올리고 커피 쿠폰 받자!</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <img
                                    className='magazine_img'
                                    src={`/src/assets/images/img-magazine4.png`}
                                    alt='magazine'
                                />
                                <div className='magazine_container'>
                                    <div className='magazine_txt'>
                                        <p className='main_txt'>MZ가 기획한 로컬 체험</p>
                                        <p className='sub_txt'>지방살이 궁금한 청년을 위한 특별한 하루</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                        <div className='page'>
                            <div className="swiper-progressbar"></div>
                            <div className="swiper-fraction">{current} / {total}</div>
                        </div>
                    </>
                )}
                {/* 후기 */}
                {activeTab === 'review' && (
                    <>
                        <Swiper
                            modules={[Pagination]}
                            pagination={{
                                type: 'progressbar',
                                el: '.swiper-progressbar',
                            }}
                            onSwiper={(swiper) => {
                                setSwiperInstance(swiper);
                                setTotal(swiper.slides.length);
                            }}
                            onSlideChange={(swiper) => {
                                setCurrent(swiper.realIndex + 1);
                                setTotal(swiper.slides.length);
                            }}
                        >
                            <SwiperSlide>
                                <img
                                    className='review_img'
                                    src={`/src/assets/images/img-review1.png`}
                                    alt='review'
                                />
                                <div className='review_container'>
                                    <div className='review_txt'>
                                        <p className='main_txt'>엄마랑 아빠랑</p>
                                        <p className='sub_txt'>10월 전라도 축제 일정 및 8월 전주 여행 후기</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <img
                                    className='review_img'
                                    src={`/src/assets/images/img-review2.png`}
                                    alt='review'
                                />
                                <div className='review_container'>
                                    <div className='review_txt'>
                                        <p className='main_txt'>나 혼자 보낸 하루</p>
                                        <p className='sub_txt'>누구 눈치도 없이, 마음이 가는 대로 걷기</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <img
                                    className='review_img'
                                    src={`/src/assets/images/img-review3.png`}
                                    alt='review'
                                />
                                <div className='review_container'>
                                    <div className='review_txt'>
                                        <p className='main_txt'>부모님과 함께한 느린 여행</p>
                                        <p className='sub_txt'>서두르지 않았기에 더 오래 기억날 것 같아요</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <img
                                    className='review_img'
                                    src={`/src/assets/images/img-review4.png`}
                                    alt='review'
                                />
                                <div className='review_container'>
                                    <div className='review_txt'>
                                        <p className='main_txt'>우리만의 조용한 마을 카페</p>
                                        <p className='sub_txt'>#커플여행 #마을포토스팟 #기억저장</p>
                                    </div>
                                </div>
                            </SwiperSlide>

                        </Swiper>
                        <div className='page'>
                            <div className="swiper-progressbar"></div>
                            <div className="swiper-fraction">{current} / {total}</div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
