import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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
import AuthCallback from './pages/AuthSuccessPage/AuthCallback';
import NicknamePage from './pages/LoginPage/NicknamePage';
import useKakaoLoader from './hooks/useKakaoLoader';
import './styles/App.css';

function App() {
  const location = useLocation();
  const isKakaoMapLoaded = useKakaoLoader();

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
      <AuthProvider>
        <div className='app'>
          <div className={`app-content ${isBottomNavHidden ? 'no-bottom-nav' : ''}`}>
            <Routes>
              <Route path="/" element={<SplashPage/>}/>
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/auth/success" element={<AuthCallback/>}/>
              <Route path="/auth/nickname" element={<AuthCallback/>}/>
              <Route path="/nickname" element={<NicknamePage/>}/>
              <Route path="/auth/failure" element={<LoginPage/>}/>
              <Route path="/home" element={<HomePage isKakaoMapLoaded={isKakaoMapLoaded}/>}/>
              <Route path="/review" element={<ReviewPage/>}/>
              <Route path="/my-review" element={<MyReviewPage/>}/>
              <Route path="/detail/:id" element={<DetailPage isKakaoMapLoaded={isKakaoMapLoaded}/>}/>
              <Route path="/beehive" element={<BeeHivePage/>}/>
              <Route path="/write" element={<WritePage/>}/>
              <Route path="/upload-photo" element={<PhotoUploadPage/>}/>
              <Route path="/search" element={<SearchPage isKakaoMapLoaded={isKakaoMapLoaded}/>}/>
              <Route path="/mypage" element={<MyPage/>}/>
            </Routes>
          </div>
        </div>


        {/* isBottomNavHidden이 true일 때 BottomNav 숨기기 */}
        {!isBottomNavHidden && <BottomNav/>}
      </AuthProvider>
    </>
  );
}

export default App;
