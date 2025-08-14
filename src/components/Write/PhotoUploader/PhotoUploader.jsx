import React from 'react';
import './PhotoUploader.css';

export default function PhotoUploader({ previewUrls, onPhotoClick }) {
  return (
    <div className="photo-placeholder" style={{ justifyContent: previewUrls.length > 0 ? 'flex-start' : 'center' }}>
      {previewUrls.length === 0 ? (
        <div className="photo-placeholder-inner clickable" onClick={onPhotoClick}>
          <div className="plus-icon">+</div>
          <p>다녀온 사진을 추가해보세요</p>
        </div>
      ) : (
        <div className="photo-preview-scroll">
          {previewUrls.map((url, i) => (
            <img key={i} src={url} alt={`uploaded-${i}`} className="photo-scroll-thumb" />
          ))}
        </div>
      )}
    </div>
  );
}