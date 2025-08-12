import React, { useState, useRef, useEffect } from 'react';
import './Banner.css';

export default function Banner() {
    const [activeTab, setActiveTab] = useState('myPos');
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
                            className={`myPos ${activeTab === 'myPos' ? 'active' : ''}`}
                            onClick={() => setActiveTab('myPos')}
                        >
                            <p>내위치</p>
                        </button>
                        <button
                            className={`buzzmap ${activeTab === 'buzzmap' ? 'active' : ''}`}
                            onClick={() => setActiveTab('buzzmap')}
                        >
                            <p>버즈맵</p>
                        </button>
                    </div>
                </div>
                {/* 내위치 */}
                {activeTab === 'myPos' && (
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
                {/* 버즈맵 */}
                {activeTab === 'buzzmap' && (
                    <>
                        <div className='map'>
                            <div className="map-area" ref={containerRef}>
                                <div
                                    className="zoom-content"
                                >

                                    {/* 디테일 지도: zoomLevel >= 14 */}
                                    <img
                                        src={`/src/assets/images/img-map.svg`}
                                        alt="map"
                                    />

                                </div>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}
