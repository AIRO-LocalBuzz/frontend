import { useEffect, useRef } from 'react';

// 북마크용 SVG 
const rawBookmarkSvg = `
<svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2.01952 13C3.06741 14.3972 4.27304 15 6.01952 15C7.766 15 8.97163 14.3972 10.0195 13C10.7605 12.012 10.9248 11.2313 11.0195 10C11.143 8.39457 10.6652 7.47504 10.0195 6C9.01676 3.70929 6.01952 1 6.01952 1C6.01952 1 3.02228 3.70929 2.01952 6C1.37382 7.47504 0.896026 8.39457 1.01952 10C1.11424 11.2313 1.27855 12.012 2.01952 13Z" fill="#FFB8B8" stroke="black" stroke-width="0.5"/>
  <path d="M6.01952 1C6.01952 1 4.27367 4.54322 4.01952 7C3.89896 8.16535 3.83679 8.84276 4.01952 10C4.21212 11.2198 4.53305 11.8649 5.01952 13C5.3635 13.8026 6.01952 15 6.01952 15" stroke="black" stroke-width="0.5"/>
</svg>`;
const bookmarkSvgUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(rawBookmarkSvg);

export default function Bookmark({ mapRef, bookmarks = [], closeIconSrc, isLoaded }) {
  const markersRef = useRef([]);

  useEffect(() => {
    const map = mapRef?.current;
    if (!isLoaded || !map) return;

    const { kakao } = window;

    // 기존 북마크 정리
    markersRef.current.forEach(({ marker, overlay }) => {
      overlay?.setMap(null);
      marker?.setMap(null);
    });
    markersRef.current = [];

    if (!bookmarks || bookmarks.length === 0) return;

    const geocoder = new kakao.maps.services.Geocoder();
    const iconSize = new kakao.maps.Size(24, 32);
    const iconOffset = new kakao.maps.Point(12, 32);
    const image = new kakao.maps.MarkerImage(bookmarkSvgUrl, iconSize, { offset: iconOffset });

    // 모든 팝업 닫기
    const closeAll = () => {
      markersRef.current.forEach(({ overlay }) => overlay?.setMap(null));
    };

    const makeTag = (text, { bg, color, border } = {}) => {
      // 태그
      const tag = document.createElement('span');
      tag.textContent = text;
      tag.style.display = 'inline-block';
      tag.style.fontSize = '10px';
      tag.style.fontWeight = '600';
      tag.style.padding = '2px 4px';
      tag.style.borderRadius = '4px';
      tag.style.background = bg || '#F2F3F5';
      tag.style.color = color || '#6B7280';
      if (border) tag.style.border = `1px solid ${border}`;
      tag.style.lineHeight = '16px';
      return tag;
    };

    // 팝업: 카드 스타일 (썸네일 + 태그 + 텍스트 + 닫기)
    const makeInfoContent = (bm) => {
      // 래퍼
      const wrap = document.createElement('div');
      wrap.style.position = 'relative';
      wrap.style.width = '170px';
      wrap.style.padding = '12px';
      wrap.style.background = '#fff';
      wrap.style.borderRadius = '10px';
      wrap.style.boxSizing = 'border-box';
      wrap.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
      wrap.style.color = '#111827';
      wrap.style.fontFamily = 'inherit';

      // 닫기 버튼
      const close = document.createElement('img');
      close.alt = 'close';
      close.width = 8;
      close.height = 8;
      close.src = closeIconSrc;
      close.style.position = 'absolute';
      close.style.right = '5px';
      close.style.top = '5px';
      close.style.cursor = 'pointer';
      wrap.appendChild(close);

      // 내용 컨테이너
      const body = document.createElement('div');
      wrap.appendChild(body);

      // 썸네일
      const thumbWrap = document.createElement('div');
      thumbWrap.style.width = '100%';
      thumbWrap.style.height = '120px';
      thumbWrap.style.borderRadius = '10px';
      thumbWrap.style.background = '#E5E7EB'; // placeholder 회색
      thumbWrap.style.overflow = 'hidden';
      thumbWrap.style.marginBottom = '10px';
      body.appendChild(thumbWrap);

      if (bm.thumbnail) {
        const img = document.createElement('img');
        img.src = bm.thumbnail;
        img.alt = bm.headline || bm.title || 'thumbnail';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        thumbWrap.appendChild(img);
      } else {
        // 썸네일 없으면 회색 박스 유지
        const ph = document.createElement('div');
        ph.style.width = '100%';
        ph.style.height = '100%';
        thumbWrap.appendChild(ph);
      }

      // 태그(마감임박/NEW)
      const tags = document.createElement('div');
      tags.style.display = 'flex';
      tags.style.gap = '6px';
      tags.style.marginBottom = '6px';
      body.appendChild(tags);

      const isUrgent = bm.isUrgent ?? true;
      const isNew = bm.isNew ?? true;

      if (isUrgent) tags.appendChild(makeTag('마감임박', { bg: '#FFC400', color: '#FFFFFF' }));
      if (isNew) tags.appendChild(makeTag('NEW', { bg: '#D9D9D9', color: '#000000' }));

      // 텍스트 영역
      const subtitle = document.createElement('div');
      subtitle.textContent = bm.subtitle;
      subtitle.style.fontSize = '10px';
      subtitle.style.fontWeight = '600';
      subtitle.style.color = '#000000';
      subtitle.style.marginBottom = '2px';
      body.appendChild(subtitle);

      const headline = document.createElement('div');
      headline.textContent = bm.title;
      headline.style.fontSize = '14px';
      headline.style.fontWeight = '800';
      headline.style.letterSpacing = '0.2px';
      headline.style.marginBottom = '2px';
      body.appendChild(headline);

      const caption = document.createElement('div');
      caption.textContent = bm.address;
      caption.style.fontSize = '8px';
      caption.style.color = '#999999';
      caption.style.fontWeight = '500';
      body.appendChild(caption);

      return { wrap, closeBtn: close };
    };

    // 북마크/팝업 생성
    const placeBookmark = (bm, lat, lng) => {
      const pos = new kakao.maps.LatLng(lat, lng);

      // 북마크
      const marker = new kakao.maps.Marker({
        position: pos,
        image,
        map,
        title: bm.title,
      });

      // 팝업 (닫힘 버튼 포함)
      const { wrap, closeBtn } = makeInfoContent(bm);
      const overlay = new kakao.maps.CustomOverlay({
        position: pos,
        content: wrap,
        yAnchor: 1.05,
        xAnchor: 0.5,
        zIndex: 3,
      });

      // 북마크 클릭 → 나머지 닫고 본인만 열기
      kakao.maps.event.addListener(marker, 'click', () => {
        closeAll();
        overlay.setMap(map);
      });
      // 닫기 버튼 → 오버레이 닫기
      closeBtn.addEventListener('click', () => overlay.setMap(null));
      // 지도 클릭 시 전체 닫기
      kakao.maps.event.addListener(map, 'click', () => closeAll());
      // 보관
      markersRef.current.push({ marker, overlay, id: bm.title || bm.address });
    };

    // 좌표/주소 케이스 분기
    bookmarks.forEach((bm) => {
      if (bm.lat && bm.lng) {
        placeBookmark(bm, bm.lat, bm.lng);
      } else if (bm.address) {
        geocoder.addressSearch(bm.address, (results, status) => {
          if (status === kakao.maps.services.Status.OK && results[0]) {
            const { x, y } = results[0]; // x=lng, y=lat
            placeBookmark(bm, parseFloat(y), parseFloat(x));
          } else {
            console.warn('주소 변환 실패:', bm.address, status);
          }
        });
      }
    });

    // 언마운트/의존성 변경 시 정리
    return () => {
      markersRef.current.forEach(({ marker, overlay }) => {
        overlay?.setMap(null);
        marker?.setMap(null);
      });
      markersRef.current = [];
    };
  }, [isLoaded, mapRef, bookmarks, closeIconSrc]);

  return null;
}
