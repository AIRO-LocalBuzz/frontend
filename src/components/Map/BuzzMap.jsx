import React, { useRef, useEffect, useState } from 'react';

export default function BuzzMap({
  imageSrc,
  minZoom = 10,
  maxZoom = 20,
  initialZoom = 10,
}) {
  const containerRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(initialZoom);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // 10 → 1.0x, 30 → 4.0x (계수 0.15를 키우면 확대 더 커짐)
  const getScale = () => 1 + (zoomLevel - minZoom) * 0.15;

  // 현재 스케일에서 허용 가능한 패닝 한계
  const getBounds = (scale) => {
    const el = containerRef.current;
    if (!el) return { maxX: 0, maxY: 0 };
    const cw = el.clientWidth, ch = el.clientHeight;
    const maxX = Math.max(0, (cw * scale - cw) / 2);
    const maxY = Math.max(0, (ch * scale - ch) / 2);
    return { maxX, maxY };
  };

  const clampPan = (x, y, scale) => {
    const { maxX, maxY } = getBounds(scale);
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  };

  // 핀치/휠 줌
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
            diff > 0 ? Math.min(prev + 1, maxZoom) : Math.max(prev - 1, minZoom)
          );
          initialDistance = distance;
        }
      }
    };

    const onTouchEnd = () => { initialDistance = null; };

    const onWheel = (e) => {
      e.preventDefault();
      setZoomLevel((prev) =>
        e.deltaY < 0 ? Math.min(prev + 1, maxZoom) : Math.max(prev - 1, minZoom)
      );
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    container.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('wheel', onWheel);
    };
  }, [minZoom, maxZoom]);

  // 드래그 패닝
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onPointerDown = (e) => {
      if (!e.isPrimary) return;
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
      try { el.setPointerCapture(e.pointerId); } catch { }
      el.classList.add('dragging');
    };

    const onPointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      const scale = getScale();
      setPan(clampPan(dragStartRef.current.panX + dx, dragStartRef.current.panY + dy, scale));
    };

    const onPointerUp = (e) => {
      isDraggingRef.current = false;
      try { el.releasePointerCapture(e.pointerId); } catch { }
      el.classList.remove('dragging');
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
    };
  }, [pan.x, pan.y, zoomLevel]);

  // 줌 변경 시 패닝 한계 재적용
  useEffect(() => {
    const scale = getScale();
    setPan((p) => clampPan(p.x, p.y, scale));
  }, [zoomLevel]);

  return (
    <div className='map'>
      <div className='map-area' ref={containerRef}>
        <div
          className='zoom-content'
          style={{
            backgroundColor: '#f8fcf6',
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${getScale()})`,
            transformOrigin: 'center center',
            willChange: 'transform',
            transition: isDraggingRef.current ? 'none' : 'transform 0.12s ease-out',
          }}
        >
          <img
            src={imageSrc}
            className='map-image map-detail visible'
            alt='map'
            draggable={false}
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
}
