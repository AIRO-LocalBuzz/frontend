import React, { useEffect, useRef } from 'react';
import useKakaoLoader from '../../hooks/useKakaoLoader';
import Bookmark from '../Bookmark/Bookmark';

export default function KakaoMapCanvas({ isVisible, recenterSignal, bookmarks = [], closeIconSrc }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const myMarkerRef = useRef(null);
  const lastCoordsRef = useRef(null);
  const watchIdRef = useRef(null);
  const isLoaded = useKakaoLoader();

  // 위치 튐 방지 유틸
  const haversine = (lat1, lng1, lat2, lng2) => {
    const toRad = (d) => (d * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  };

  // 한국 대략 경계 체크(대략치)
  const inKoreaBounds = (lat, lng) => lat >= 33 && lat <= 39 && lng >= 124 && lng <= 132;

  // 필터 기준값
  const GEO_LIMITS = {
    MAX_BAD_ACCURACY: 200,      // m: 이보다 크면 부정확으로 간주
    MAX_POSITION_AGE: 15000,    // ms: 15초 이상된 수신값은 폐기
    MAX_JUMP_METERS: 800,       // m: 이전 점에서 이 거리 이상 급점프면 폐기
    ACCURACY_IMPROVE_MARGIN: 50 // m: 정확도가 이만큼 좋아졌다면 점프라도 허용
  };

  // 새 위치 수용 여부 판단
  const shouldAcceptUpdate = (prev, next) => {
    const now = Date.now();
    const age = now - next.timestamp;

    // 오래된 값/영역 밖/정확도 나쁨 → 거부
    if (age > GEO_LIMITS.MAX_POSITION_AGE) return false;
    if (!inKoreaBounds(next.lat, next.lng)) return false;
    if (next.accuracy && next.accuracy > GEO_LIMITS.MAX_BAD_ACCURACY) return false;

    // prev 없으면 첫 수신값 → 허용
    if (!prev) return true;
    const dist = haversine(prev.lat, prev.lng, next.lat, next.lng);

    // 급점프면 거부, 다만 정확도가 확 좋아지면 허용
    if (dist > GEO_LIMITS.MAX_JUMP_METERS) {
      if (
        prev.accuracy &&
        next.accuracy &&
        prev.accuracy - next.accuracy > GEO_LIMITS.ACCURACY_IMPROVE_MARGIN
      ) {
        return true;
      }
      return false;
    }
    return true;
  };

  // 내 위치 표시용 DOM (빨간 점 + 퍼지는 원)
  const buildMyLocationNode = () => {
    const wrap = document.createElement('div');
    wrap.style.position = 'relative';
    wrap.style.width = '40px';
    wrap.style.height = '40px';
    // wrap.style.transform = 'translate(-50%, -50%)';
    wrap.style.pointerEvents = 'none';

    // 퍼지는 원 애니메이션용
    if (!document.getElementById('myLocationPulseStyle')) {
      const style = document.createElement('style');
      style.id = 'myLocationPulseStyle';
      style.textContent = `
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0.6; }
          70% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // 퍼지는 원
    const halo = document.createElement('div');
    halo.style.position = 'absolute';
    halo.style.left = '50%';
    halo.style.top = '50%';
    halo.style.width = '30px';
    halo.style.height = '30px';
    halo.style.borderRadius = '50%';
    halo.style.background = 'rgba(255, 0, 0, 0.5)';
    halo.style.boxShadow = '0 0 18px rgba(255,0,0,0.3)';
    halo.style.animation = 'pulse 2s ease-out infinite';
    wrap.appendChild(halo);

    // 중심 빨간 점
    const dot = document.createElement('div');
    dot.style.position = 'absolute';
    dot.style.left = '50%';
    dot.style.top = '50%';
    dot.style.width = '12px';
    dot.style.height = '12px';
    dot.style.transform = 'translate(-50%, -50%)';
    dot.style.borderRadius = '50%';
    dot.style.background = '#FF3B30';
    dot.style.border = '2px solid #ffffff';
    dot.style.boxShadow = '0 2px 4px rgba(0,0,0,0.25)';
    wrap.appendChild(dot);

    return wrap;
  };

  // 지도 생성
  useEffect(() => {
    if (!isLoaded || !containerRef.current || mapRef.current) return;

    window.kakao.maps.load(() => {
      const { kakao } = window;

      const initMapAt = ({ lat, lng }) => {
        const center = new kakao.maps.LatLng(lat, lng);
        const map = new kakao.maps.Map(containerRef.current, { center, level: 3 });
        mapRef.current = map;

        // 커스텀 오버레이로 "빨간 동그라미" 내 위치 표시
        const content = buildMyLocationNode();
        myMarkerRef.current = new kakao.maps.CustomOverlay({
          position: center,
          content,
          xAnchor: 0.5,
          yAnchor: 0.5,
          zIndex: 4,
        });
        myMarkerRef.current.setMap(map);
      };

      const onSuccess = (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        initMapAt({ lat, lng });

        // 초기 fix도 정밀도/타임스탬프 저장
        lastCoordsRef.current = { lat, lng, accuracy, timestamp: pos.timestamp };

        watchIdRef.current = navigator.geolocation.watchPosition(
          (p) => {
            const { latitude, longitude, accuracy } = p.coords;
            const nextFix = {
              lat: latitude,
              lng: longitude,
              accuracy: typeof accuracy === 'number' ? accuracy : undefined,
              timestamp: p.timestamp,
            };
            const prevFix = lastCoordsRef.current
              ? {
                ...lastCoordsRef.current,
                accuracy: lastCoordsRef.current.accuracy ?? 9999,
                timestamp: lastCoordsRef.current.timestamp ?? Date.now(),
              }
              : null;

            // 좌표 수용 여부 판단
            if (!shouldAcceptUpdate(prevFix, nextFix)) return;

            // 통과한 좌표만 반영
            lastCoordsRef.current = nextFix;

            const ll = new kakao.maps.LatLng(nextFix.lat, nextFix.lng);
            myMarkerRef.current?.setPosition(ll);
            // 지도 이동은 기존처럼 리센터 버튼에서만 panTo
          },
          (err) => console.warn('watchPosition error:', err),
          { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
        );
      };

      const onError = () => {
        // 제주 예시 좌표
        initMapAt({ lat: 33.450701, lng: 126.570667 });
      };

      if (!navigator.geolocation) {
        onError();
        return;
      }

      navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      });
    });

    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      // 오버레이 정리
      myMarkerRef.current?.setMap?.(null);
      myMarkerRef.current = null;
      mapRef.current = null;
    };
  }, [isLoaded]);

  // 리센터
  useEffect(() => {
    if (!mapRef.current || !myMarkerRef.current || !lastCoordsRef.current) return;
    const { kakao } = window;
    const { lat, lng } = lastCoordsRef.current;
    const ll = new kakao.maps.LatLng(lat, lng);
    // if (typeof mapRef.current.relayout === 'function') mapRef.current.relayout();
    myMarkerRef.current.setPosition(ll);
    // mapRef.current.panTo(ll);
    mapRef.current.setCenter(ll);
    mapRef.current.relayout?.();
  }, [recenterSignal]);

  // 탭에서 다시 보일 때 카카오맵 리레이아웃 & 센터 보정
  useEffect(() => {
    if (!isVisible || !mapRef.current) return;
    const id = requestAnimationFrame(() => {
      try {
        mapRef.current.relayout?.();
      } catch {
      }
      if (lastCoordsRef.current) {
        const { kakao } = window;
        const { lat, lng } = lastCoordsRef.current;
        mapRef.current.setCenter(new kakao.maps.LatLng(lat, lng));
      }
    });
    return () => cancelAnimationFrame(id);
  }, [isVisible]);


  return (
    <>
      <div ref={containerRef} className="kakao-map-canvas"/>
      <Bookmark
        mapRef={mapRef}
        bookmarks={bookmarks}
        closeIconSrc={closeIconSrc}
        isLoaded={isLoaded}
      />
    </>
  );
}
