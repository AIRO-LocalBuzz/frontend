import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Bell } from 'lucide-react';
import './MyPage.css';
import Statusbar from '../../components/Statusbar/Statusbar';
import charImg from '../../assets/images/common/img-bee.png';

const MyPage = () => {
  const navigate = useNavigate();

  const handleClickPost = () => {
    navigate('/my-review');
  };

  return (
    <div className="mypage-container">
      <Statusbar />
      <div className='mypage'>
        {/* 상단 헤더 */}
        <header className="mypage-header">
          <h1 className="header-title">나의 꿀통</h1>
          <button className="header-bell-button">
            <Bell size={24} color="#333" />
          </button>
        </header>

        {/* 업데이트/공지사항 배너 */}
        <div className="notification-banner">
          <p className="notification-text">업데이트나 공지사항이 들어갑니다.</p>
          <ChevronRight size={18} color="#999" />
        </div>

        {/* 프로필 섹션 */}
        <div className="profile-section">
          <div className="profile-info">
            <div className="profile-avatar">
              <img
                className='bee_img'
                src={charImg}
                alt='localbuzz_character'
              />
            </div>
            <div className="profile-details">
              <div className="profile-nickname-row">
                <h2 className="profile-nickname">아이로</h2>
                <div className="profile-points-tag">
                  <p className="profile-points">1.2만 포인트</p>
                </div>
              </div>
              <p className="profile-activity">주 활동지: 서울시 강남구</p>
            </div>
          </div>
          <p className="profile-bio">
            #여행은 #나의삶
          </p>
          <div className="stats-container">
            <div className="stat-item">
              <p className="stat-label">누적 조회수</p>
              <p className="stat-value">1.9만</p>
            </div>
            <div className="stat-item">
              <p className="stat-label">작성글/댓글</p>
              <p className="stat-value">344</p>
            </div>
            <div className="stat-item">
              <p className="stat-label">공감 수</p>
              <p className="stat-value">2,563</p>
            </div>
          </div>
        </div>

        {/* 내가 쓴 글 섹션 */}
        <div className="posts-section">
          <h2 className="posts-title">내가 쓴 글</h2>
          <div className="posts-list">
            {/* 첫 번째 게시글 아이템 */}
            <div className="post-item" onClick={handleClickPost}>
              <div className="post-text-content">
                <div className="post-tags-row">
                  <span className="post-tag tag-new">신규글</span>
                  <span className="post-tag tag-popular">인기글</span>
                </div>
                <p className="post-title">제목</p>
                <p className="post-meta">
                  <span className="post-location">위치동</span> · <span className="post-time">시간 전</span> · <span className="post-views">조회수</span>
                </p>
              </div>
              <div className="post-thumbnail-container">
                <div className="post-thumbnail"></div>
              </div>
            </div>
            {/* 두 번째 게시글 아이템 */}
            <div className="post-item" onClick={handleClickPost}>
              <div className="post-text-content">
                <div className="post-tags-row">
                  <span className="post-tag tag-event">이벤트</span>
                </div>
                <p className="post-title">제목</p>
                <p className="post-meta">
                  <span className="post-location">위치동</span> · <span className="post-time">시간 전</span> · <span className="post-views">조회수</span>
                </p>
              </div>
              <div className="post-thumbnail-container">
                <div className="post-thumbnail"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="footer-buttons">
          <button className="contact-button">
            문의하기
          </button>
          <button className="logout-button">
            로그아웃하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;