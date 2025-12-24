import React from 'react';
import { useNavigate } from 'react-router-dom';
import dropdownIcon from '../../assets/icons/common/icon-dropdown-orange.svg'
import heartIcon from '../../assets/icons/common/icon-heart.svg'
import commentIcon from '../../assets/icons/common/icon-comment.svg'

import './BeeHivePage.css';
import Statusbar from '../../components/Statusbar/Statusbar';

function BeeHivePage() {
  const navigate = useNavigate();


  return (
    <div className="beehive-container">
      <Statusbar/>
      <div className='beehive-page'>

      </div>
      <header className="beehive-header">
        <h2>벌집 페이지</h2>
      </header>

      <div className="main-content">
        <section className="weekly-rank">
          <div className="weekly-rank-header">
            <h2>이번 주 순위</h2>
            <button className="rank-more-button">
              <img src={dropdownIcon} alt="더보기"/>
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
              <svg className='heart-icon' src={heartIcon} alt="공감하기" width="18" height="16" viewBox="0 0 18 16"
                fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.749 1.5C14.7645 1.5 16.3328 3.06164 16.333 5.08301C16.333 6.32508 15.7816 7.53476 14.6055 8.97363C13.4184 10.4259 11.7016 11.9875 9.53613 13.9512L9.53418 13.9521L8.99902 14.4385L8.46387 13.9521L8.46289 13.9512L6.92383 12.5488C5.47195 11.2133 4.28381 10.0628 3.39355 8.97363C2.21746 7.53476 1.66602 6.32508 1.66602 5.08301C1.66618 3.06175 3.23372 1.50017 5.24902 1.5C6.3967 1.5 7.51486 2.03964 8.24023 2.88477L8.99902 3.76855L9.75781 2.88477C10.4831 2.03969 11.6014 1.5001 12.749 1.5Z"
                  stroke="url(#paint0_linear_2416_1022)" stroke-width="2"/>
                <defs>
                  <linearGradient id="paint0_linear_2416_1022" x1="16.9993" y1="9" x2="2.33268" y2="4.66667"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FF8D28"/>
                    <stop offset="1" stop-color="#BA5700"/>
                  </linearGradient>
                </defs>
              </svg>


              공감하기
            </button>
            <button className="comment-button">
              <img src={commentIcon} alt="댓글달기"/>
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
            <p>댓글</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BeeHivePage;
