import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import imgMap from '../../assets/images/img-map.svg'
import imgBeehive from '../../assets/images/img-beehive-sample.png'
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [zoomLevel, setZoomLevel] = useState(12);
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
            diff > 0 ? Math.min(prev + 1, 20) : Math.max(prev - 1, 1)
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
          e.deltaY < 0 ? Math.min(prev + 1, 20) : Math.max(prev - 1, 1)
        );
      }
    };

    const container = containerRef.current;

    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchmove', onTouchMove);
    container.addEventListener('touchend', onTouchEnd);

    // 가장 확실한 대응: window에 wheel 이벤트 등록
    window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>꽃밭 페이지</h2>
      <p>손가락으로 핀치하면 줌 레벨이 조절됩니다.</p>
      <button onClick={() => navigate('/review')}>콘텐츠 리스트 보기</button>

      <div className="map-area" ref={containerRef}>
        <div
          className="zoom-content"
          style={{
            transform: `scale(${Math.max(zoomLevel / 15, 1)})`, // ✅ 어느 구간이든 확대 가능하게 함
            transition: 'transform 0.5s ease',
            transformOrigin: 'center center',
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          
          {/* 디테일 지도: zoomLevel >= 13 */}
          <img
            src={imgMap}
            className="map-image"
            style={{
              opacity: zoomLevel >= 13 ? 1 : 0,  // 확대하면 보임
              transition: 'opacity 0.3s ease',
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              top: 0,
              left: 0,
              zIndex: 2,
            }}
          />

          {/* 기본 지도 + 일러스트 모드: zoomLevel < 13 */}
          <img
            src={imgBeehive}
            className="map-image"
            style={{
              opacity: zoomLevel < 13 ? 1 : 0, // 기본 상태와 축소 시 유지
              transition: 'opacity 0.3s ease',
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />

        </div>
      </div>


    </div>
  );
}
