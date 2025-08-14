import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, X } from 'lucide-react';
import './SearchPage.css';
import StatusBar from '../../components/StatusBar/StatusBar';

const SearchPage = ({ isKakaoMapLoaded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const psRef = useRef(null);
  const markersRef = useRef([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // 사용자 정의 SVG 아이콘 데이터 (노란색으로 채워진 핀 모양으로 통일)
  const markerSvgIcon = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC400' stroke='%23FFC400' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'%3E%3C/path%3E%3Ccircle cx='12' cy='9' r='3' fill='%23fff' stroke='%23FFC400' stroke-width='1.5'/%3E%3C/svg%3E`;

  // 지도 초기화 및 현재 위치 가져오기
  useEffect(() => {
    console.log("isKakaoMapLoaded: ", isKakaoMapLoaded);

    if (isKakaoMapLoaded && mapContainer.current) {
      console.log("카카오 맵 API 로딩 완료, 지도 초기화 시작");

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const pos = new window.kakao.maps.LatLng(lat, lon);

            const options = {
              center: pos,
              level: 3,
            };
            const newMap = new window.kakao.maps.Map(mapContainer.current, options);
            mapRef.current = newMap;
            psRef.current = new window.kakao.maps.services.Places();

            // 현재 위치 마커 (SVG 아이콘)
            const imageSize = new window.kakao.maps.Size(40, 40);
            const imageOption = { offset: new window.kakao.maps.Point(20, 40) };
            const markerImage = new window.kakao.maps.MarkerImage(markerSvgIcon, imageSize, imageOption);

            const marker = new window.kakao.maps.Marker({
              position: pos,
              image: markerImage,
              map: newMap,
            });
            markersRef.current.push(marker);

            console.log("현재 위치를 중심으로 지도 초기화 및 마커 표시 완료");
          },
          (error) => {
            console.error("위치 정보를 가져오는데 실패했습니다.", error);
            const options = {
              center: new window.kakao.maps.LatLng(33.450701, 126.570667),
              level: 3,
            };
            const newMap = new window.kakao.maps.Map(mapContainer.current, options);
            mapRef.current = newMap;
            psRef.current = new window.kakao.maps.services.Places();
          }
        );
      } else {
        console.error("이 브라우저는 Geolocation을 지원하지 않습니다.");
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        };
        const newMap = new window.kakao.maps.Map(mapContainer.current, options);
        mapRef.current = newMap;
        psRef.current = new window.kakao.maps.services.Places();
      }
    }
  }, [isKakaoMapLoaded]);

  const searchPlaces = () => {
    if (!psRef.current || !mapRef.current) return;

    psRef.current.keywordSearch(searchKeyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(data);
        displayPlaces(data);
        setSelectedPlace(null); // 새로운 검색 시 선택된 장소 초기화
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        setSearchResults([]);
        setSelectedPlace(null);
      } else if (status === window.kakao.maps.services.Status.ERROR) {
        setSearchResults([]);
        setSelectedPlace(null);
      }
    });
  };

  const displayPlaces = (places) => {
    const map = mapRef.current;
    const bounds = new window.kakao.maps.LatLngBounds();

    // 기존 마커 제거 (현재 위치 마커 제외)
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 검색 결과 마커 (SVG 아이콘)
    const imageSize = new window.kakao.maps.Size(40, 40);
    const imageOption = { offset: new window.kakao.maps.Point(20, 40) };
    const markerImage = new window.kakao.maps.MarkerImage(markerSvgIcon, imageSize, imageOption);

    for (let i = 0; i < places.length; i++) {
      const place = places[i];
      const placePosition = new window.kakao.maps.LatLng(place.y, place.x);

      const marker = new window.kakao.maps.Marker({
        position: placePosition,
        map: map,
        image: markerImage,
      });

      markersRef.current.push(marker);
      bounds.extend(placePosition);

      window.kakao.maps.event.addListener(marker, 'click', function () {
        setSelectedPlace(place);
      });
    }
    map.setBounds(bounds);
  };

  const handleSearch = () => {
    if (searchKeyword.trim() !== '') {
      searchPlaces();
    }
  };

  // '취소' 버튼 핸들러
  const handleCancel = () => {
    // location.state에 있는 이전 데이터를 그대로 가지고 WritePage로 돌아갑니다.
    const prevState = location.state || {};
    const navigateTo = '/write';
    navigate(navigateTo, { state: prevState });
  };

  // 장소 목록에서 클릭 시, 장소 선택만 하고 페이지 이동은 하지 않음
  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);

    if (mapRef.current) {
      const moveLatLon = new window.kakao.maps.LatLng(place.y, place.x);
      mapRef.current.setCenter(moveLatLon);
      mapRef.current.setLevel(3);
    }
  };

  // '선택 완료' 버튼 핸들러
  const handleComplete = () => {
    if (!selectedPlace) return;

    // 이전 WritePage 상태 복사
    const prevState = location.state?.currentWriteState || {};    
    const navigateTo = '/write';

    console.log("navigate 전 location.state:", prevState);
    console.log("선택된 장소:", selectedPlace);

    // 이전 상태와 선택된 장소 정보를 함께 넘겨줍니다.
    navigate(navigateTo, {
      state: {
        currentWriteState: {
          ...prevState,
          address: selectedPlace,
        },
        selectedPlace,
        fromSearch: true,
      },
    });
  };


  if (!isKakaoMapLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-bold">
        <p>지도 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="search-page-container">
      <StatusBar />
      <header className="search-header">
        <button onClick={handleCancel} className="cancel-button">
          <X size={24} />
        </button>

        <h1 className="search-title">장소 검색</h1>
        <button
          className={`complete-button ${selectedPlace ? 'active' : 'inactive'}`}
          onClick={handleComplete}
          disabled={!selectedPlace}
        >
          완료
        </button>
      </header>
      <div className="search-bar">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="장소를 검색하세요."
          className="search-input"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
        />
      </div>
      <div id="map" ref={mapContainer} className="map-container"></div>

      {/* 검색 결과 리스트 오버레이 */}
      {searchResults.length > 0 && (
        <div className="search-results-overlay">
          <ul className="search-results-list">
            {searchResults.map((place, index) => (
              <li
                key={index}
                className={`search-result-item ${selectedPlace?.id === place.id ? 'selected' : ''}`}
                onClick={() => handlePlaceSelect(place)}
              >
                <MapPin className="list-item-icon" size={20} />
                <div className="list-item-info">
                  <span className="place-name">{place.place_name}</span>
                  <span className="address-name">{place.address_name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 선택된 장소 정보 안내메시지 - 선택된 장소가 있을 때만 표시 */}
      {selectedPlace && (
        <div className="selected-place-info-overlay">
          <p className="message-title">선택한 장소</p>
          <p className="selected-place-name">{selectedPlace.place_name}</p>
          <p className="selected-place-address">{selectedPlace.address_name}</p>
          <button
            className="selected-place-complete-button"
            onClick={handleComplete}>
            선택 완료
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
