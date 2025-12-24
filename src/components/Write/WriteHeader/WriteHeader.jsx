import React from 'react';
import prevIcon from '../../../assets/icons/common/icon-prev.svg';
import './WriteHeader.css';

export default function WriteHeader({ onBack, onSubmit, isActive, loading }) {
  return (
    <header className="write-header">
      <div className="write-header-left">
        <button className="icon-button" onClick={onBack}>
          <img src={prevIcon} alt="이전" className="icon-prev"/>
        </button>
        <h2 className="title">글쓰기</h2>
      </div>
      <button
        className={`btn-submit ${isActive && !loading ? 'active' : 'inactive'}`}
        disabled={!isActive || loading}
        onClick={onSubmit}
      >
        {loading ? '게시 중...' : '게시하기'}
      </button>
    </header>
  );
}
