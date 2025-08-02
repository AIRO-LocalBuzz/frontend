import React from 'react';
import { useNavigate } from 'react-router-dom';
import dropdownIcon from '../../assets/icons/common/icon-dropdown-orange.svg'
import heartIcon from '../../assets/icons/common/icon-heart.svg'
import commentIcon from '../../assets/icons/common/icon-comment.svg'

import './BeeHivePage.css'; 

function BeeHivePage() {
  const navigate = useNavigate();

  
  return (
    <div className="beehive-page">
      <header className="beehive-header">
        <h2>벌집 페이지</h2>
      </header>

      <div className="main-content">
        <section className="weekly-rank">
          <div className="weekly-rank-header">
            <h2>이번 주 순위</h2>
            <button className="rank-more-button">
              <img src={dropdownIcon} alt="더보기" />
            </button>
          </div>
          <div className='rank-item-container'>
            <div className="rank-item">
            <span className="rank-number">1</span> 활동 5개 후기
            </div>
            <div className="rank-item">
              <span className="rank-number">2</span> 나를 찾아가는 과정! 취향 획득!
            </div>
            {/* ... 나머지 순위 아이템 ... */}
          </div>     
        </section>

        <section className="announcements">
          <h2>공지</h2>
          <div className='announcement-item'>
            <span className="announcement-item-category">[이벤트]</span>
            여름 키트 무료 나눔 이벤트가 시작됩니다. 라이브 방송 참여하세요!
          </div>

          <div className='announcement-item'>
            <span className="announcement-item-category">[휴가지 공지]</span>
            이터널 상담소 휴가공지 08/02 ~ 08/06
          </div>
        </section>

        <section className="review-preview" onClick={() => navigate('/review')}>
          <div className="review-header-preview">
            <span>체험 / 음식점 / 가족</span>
            <span className="review-date-preview">tlsgP226</span>
          </div>
          <h3>가족여행</h3>
          <p>--</p>
          <div className="review-actions-preview">
            <span>공감 0</span>
            <span>조회수 26</span>
            <span>댓글 1</span>
          </div>
          <div className="review-buttons-preview">
            <button className="like-button">
              <img src={heartIcon} alt="공감하기" />
              공감하기
            </button>
            <button className="comment-button">
              <img src={commentIcon} alt="댓글달기" />
              댓글달기
            </button>
          </div>
        </section>

        <section className="another-review-preview">
          <div className="review-header-preview">
            <span>체험 / 건강</span>
            <span className="review-date-preview">lily kim254</span>
          </div>
          <h3>3가지 활동 중에 고민이에요</h3>
          <div className="review-comment-preview">
            <p>댓글 부분?</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BeeHivePage;