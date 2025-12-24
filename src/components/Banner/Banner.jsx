import React, {useState} from 'react';
import './Banner.css';
import mapImg from '../../assets/images/common/img-map.png';
import exitIcon from '../../assets/icons/common/icon-exit.svg';
import KakaoMapCanvas from '../../components/Map/KakaoMapCanvas';
import BuzzMap from '../../components/Map/BuzzMap';

export default function Banner() {
  const [activeTab, setActiveTab] = useState('myPos');
  const [recenterSignal, setRecenterSignal] = useState(0);

  // 기존 북마크
  const bookmarks = [
    {
      address: '서울 강남구 테헤란로 145', // (13층, 14층)
      label: '13·14층',
      title: '강남 구름 스퀘어',
      subtitle: '함께 만들어가는'
    },
    // { lat: 37.498, lng: 127.028, title: '직접 좌표 북마크' }
  ];

  return (
    <div className='banner'>
      <div className='banner_container'>
        <div className='banner_choice'>
          <div className='choice_container'>
            <button
              className={`myPos ${activeTab === 'myPos' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('myPos');
                setRecenterSignal(n => n + 1);
              }}
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

        {/* 내 위치: 카카오 지도 (항상 렌더) */}
        <div className={`map ${activeTab === 'myPos' ? 'visible' : 'hidden'}`}>
          <div className="map-area">
            <KakaoMapCanvas
              isVisible={activeTab === 'myPos'}      // ✅ 가시성 전달
              recenterSignal={recenterSignal}
              bookmarks={bookmarks}
              closeIconSrc={exitIcon}
            />
            <button
              className='map-btn'
              aria-label="현재 위치로 이동"
              onClick={() => setRecenterSignal(n => n + 1)}
            >
              ⦿
            </button>
          </div>
        </div>

        {/* 버즈맵 (항상 렌더) */}
        <div className={`map ${activeTab === 'buzzmap' ? 'visible' : 'hidden'}`}>
          <BuzzMap imageSrc={mapImg}/>
        </div>

      </div>
    </div>
  );
}
