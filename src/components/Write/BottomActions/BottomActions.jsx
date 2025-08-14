import React from 'react';
import cameraIcon from '../../../assets/icons/common/icon-camera.svg';
import './BottomActions.css';

export default function BottomActions({ onCameraClick }) {
  return (
    <div className="bottom-action-buttons">
      <button className="btn-ai">AI 도구</button>
      <button className="btn-camera" onClick={onCameraClick}>
        <img src={cameraIcon} alt="카메라" />
      </button>
    </div>
  );
}