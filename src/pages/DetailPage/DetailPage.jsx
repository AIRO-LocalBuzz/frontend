import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './DetailPage.css';
import StatusBar from '../../components/StatusBar/StatusBar';

// DetailPage 컴포넌트는 isKakaoMapLoaded를 prop으로 받습니다.
export default function DetailPage({ isKakaoMapLoaded }) {
  const navigate = useNavigate();
  const { id } = useParams(); // URL 파라미터에서 id 가져오기
  const [postData, setPostData] = useState(null);
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // 카카오맵 마커 SVG 아이콘
  const markerSvgIcon = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC400' stroke='%23FFC400' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'%3E%3C/path%3E%3Ccircle cx='12' cy='9' r='3' fill='%23fff' stroke='%23FFC400' stroke-width='1.5'/%3E%3C/svg%3E`;


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const headers = {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiaWF0IjoxNzU0MTY1NzI3LCJleHAiOjM2MTc1NDE2NTcyN30.1E2JEdWvdSbChE0L9Jnp5ZP_X08Dy7XjYLIFv3GLcyI`,
          'Content-Type': 'application/json',
        };

        const response = await fetch(`https://airo-buzz.shop/api/v1/posts/${id}`, {
          method: 'GET',
          headers,
        });
        console.log(response.body)
        if (!response.ok) {
          throw new Error('게시물 데이터를 불러오지 못했습니다.');
        }

        const post = await response.json();
        setPostData(post);
      } catch (error) {
        console.error('게시물 조회 오류:', error);
        setPostData(null);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // 지도 초기화
  useEffect(() => {
    // 카카오맵 스크립트가 로드되었고, postData가 있으며, 장소 정보가 있고,
    // 지도 컨테이너가 준비되었으며, 지도가 초기화되지 않았을 때만 실행합니다.
    if (isKakaoMapLoaded && postData && postData.placeVisited && mapContainer.current && !mapInitialized) {
      console.log("DetailPage에서 지도 초기화 시작");

      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(postData.placeVisited, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const place = data[0];
          const placePosition = new window.kakao.maps.LatLng(place.y, place.x);

          const options = {
            center: placePosition,
            level: 3,
          };
          const newMap = new window.kakao.maps.Map(mapContainer.current, options);
          mapRef.current = newMap;

          const imageSize = new window.kakao.maps.Size(40, 40);
          const imageOption = { offset: new window.kakao.maps.Point(20, 40) };
          const markerImage = new window.kakao.maps.MarkerImage(markerSvgIcon, imageSize, imageOption);

          new window.kakao.maps.Marker({
            position: placePosition,
            map: newMap,
            image: markerImage,
          });

          setMapInitialized(true);
          console.log("DetailPage에서 지도 초기화 및 마커 표시 완료");
        } else {
          console.error("장소 검색에 실패했습니다.");
          // 검색 실패 시 기본 지도 표시
          const options = {
            center: new window.kakao.maps.LatLng(33.450701, 126.570667),
            level: 3,
          };
          new window.kakao.maps.Map(mapContainer.current, options);
          setMapInitialized(true);
        }
      });
    } else if (isKakaoMapLoaded && postData && !postData.placeVisited && !mapInitialized) {
      // 장소 정보가 없는 경우, 기본 지도를 표시하고 초기화 상태를 true로 설정합니다.
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };
      new window.kakao.maps.Map(mapContainer.current, options);
      setMapInitialized(true);
    }
  }, [isKakaoMapLoaded, postData, mapInitialized, markerSvgIcon]);

  if (!postData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-bold">
        <p>게시물을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const {
    content,
    date,
    placeVisited,
    companions = '',
    emotions = '',
    selectedPhotos
  } = postData;

  const companionsArray = companions ? [companions] : [];
  const purposesArray = emotions ? [emotions] : [];

  const formatFullDate = (dateString) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return '';
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()];
    return `${year - 2000}년 ${month}월 ${day}일 ${weekday}요일`;
  };

  return (
    <div className="detail-page-container">
      <StatusBar />
      {/* 상단 헤더 */}
      <header className="detail-header">
        <button onClick={() => navigate('/my-review')} className="back-button">
          <ChevronLeft size={24} />
        </button>
        <h1 className="detail-title">후기 상세보기</h1>
      </header>

      <div className="content-area">
        {/* 해시태그 */}
        <div className="hashtags">
          {companionsArray.map((tag, index) => <span key={`comp-${index}`} className="tag">#{tag}</span>)}
          {purposesArray.map((tag, index) => <span key={`purp-${index}`} className="tag">#{tag}</span>)}
        </div>

        {/* 유저 정보 및 위치 날짜 */}
        <div className="user-info">
          <h2 className="user-nickname">아이로</h2>
          <p className="post-meta">
            <span>{placeVisited || '위치 정보 없음'}</span> ·
            <span> {formatFullDate(date)}</span>
          </p>
        </div>

        {/* 지도 영역 */}
        <div id="map" ref={mapContainer} className="map-container">
          {!isKakaoMapLoaded && <p className="loading-map">지도 로딩 중...</p>}
          {isKakaoMapLoaded && !postData.placeVisited && <p className="loading-map">장소 정보가 없습니다.</p>}
        </div>

        {/* 사진 갤러리 (좌우 스크롤) */}
        {selectedPhotos?.length > 0 && (
          <div className="photo-gallery">
            {selectedPhotos.map((base64Url, i) => (
              <img
                key={i}
                src={base64Url}
                alt={`uploaded-${i}`}
                className="photo-scroll-thumb"
              />
            ))}
          </div>
        )}

        {/* 게시글 내용 */}
        <p className="post-content-text">{content || '내용이 없습니다.'}</p>
      </div>

      {/* 좋아요/공유 버튼 */}
      <div className="bottom-actions-fixed">
        <button className="action-button">좋아요</button>
        <button className="action-button">공유하기</button>
      </div>
    </div>
  );
}
