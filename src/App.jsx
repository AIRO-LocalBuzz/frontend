import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SplashPage from './pages/SplashPage/SplashPage';
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import DetailPage from './pages/DetailPage/DetailPage';
import BeeHivePage from './pages/BeeHivePage/BeeHivePage';
import WritePage from './pages/WritePage/WritePage';
import PhotoUploadPage from './pages/PhotoUploadPage/PhotoUploadPage';
import ReviewPage from './pages/ReviewPage/ReviewPage';
import MyReviewPage from './pages/MyReviewPage/MyReviewPage';
import SearchPage from './pages/SearchPage/SearchPage';
import MyPage from './pages/MyPage/MyPage';
import BottomNav from './components/BottomNav/BottomNav';
import './styles/App.css';

function App() {
  const location = useLocation();
  const [isKakaoMapLoaded, setIsKakaoMapLoaded] = useState(false);

  useEffect(() => {
    const KAKAO_APP_KEY = "25f6f1eddf013e7b80c35cf6f2b1d32d";

    // 카카오맵 스크립트가 이미 로드되어 있으면 바로 상태를 true로 변경
    if (window.kakao && window.kakao.maps) {
      setIsKakaoMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    // 스크립트 로드 성공 시
    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsKakaoMapLoaded(true);
        console.log("카카오맵 스크립트 로드 및 초기화 완료");
      });
    };

    // 스크립트 로드 실패 시
    script.onerror = () => {
      console.error("카카오맵 스크립트 로드 실패");
      // 사용자에게 에러 메시지를 보여주는 UI 로직 추가 가능
    };
    
    // 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      document.head.removeChild(script);
    };

  }, []);

  // BottomNav를 숨길 경로들 목록
  const isBottomNavHidden = 
    location.pathname === '/' ||
    location.pathname === '/splash' ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/write') ||
    location.pathname.startsWith('/upload-photo') ||
    location.pathname.startsWith('/search') ||
    location.pathname.startsWith('/detail');

  return (
    <>
      {/* isBottomNavHidden 값에 따라 동적으로 클래스 추가 */}
      <div className='app'>
        <div className={`app-content ${isBottomNavHidden ? 'no-bottom-nav' : ''}`}>
          <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/review" element={<ReviewPage />} />          
            <Route path="/my-review" element={<MyReviewPage />} />
            <Route path="/detail/:id" element={<DetailPage isKakaoMapLoaded={isKakaoMapLoaded} />} />
            <Route path="/beehive" element={<BeeHivePage />} />
            <Route path="/write" element={<WritePage />} />
            <Route path="/upload-photo" element={<PhotoUploadPage />} />
            <Route path="/search" element={<SearchPage isKakaoMapLoaded={isKakaoMapLoaded} />} />  
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
        </div>
      </div>
      
      {/* isBottomNavHidden이 true일 때 BottomNav 숨기기 */}
      {!isBottomNavHidden && <BottomNav />}
    </>
  );
}

export default App;