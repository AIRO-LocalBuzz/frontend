import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 즉시 실행 함수로 빠른 처리
    const processCallback = () => {
      console.log('AuthCallback 페이지 로드됨');
      console.log('현재 URL:', window.location.href);
      console.log('현재 pathname:', location.pathname);

      // URL에서 토큰과 에러 파라미터 추출
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const error = urlParams.get('error');

      // URL 경로에서 nickname 여부 확인
      const isNicknameRequired = location.pathname === '/auth/nickname';

      console.log('추출된 토큰:', token);
      console.log('추출된 에러:', error);
      console.log('닉네임 설정 필요:', isNicknameRequired);

      // 부모창 존재 여부 확인 (팝업 모드)
      if (window.opener && !window.opener.closed) {
        console.log('부모창 발견, 메시지 전송 시작');

        if (token) {
          if (isNicknameRequired) {
            console.log('닉네임 설정 필요 - 닉네임 페이지 메시지 전송');
            // 닉네임 설정이 필요한 경우
            window.opener.postMessage({
              type: 'OAUTH_SUCCESS_NICKNAME_REQUIRED',
              token: token
            }, window.location.origin);
          } else {
            console.log('일반 성공 메시지 전송');
            // 일반적인 성공 케이스
            window.opener.postMessage({
              type: 'OAUTH_SUCCESS',
              token: token
            }, window.location.origin);
          }
        } else if (error) {
          console.log('에러 메시지 전송');
          window.opener.postMessage({
            type: 'OAUTH_ERROR',
            error: error
          }, window.location.origin);
        } else {
          console.log('토큰과 에러가 모두 없음');
          window.opener.postMessage({
            type: 'OAUTH_ERROR',
            error: '로그인 처리 중 오류가 발생했습니다.'
          }, window.location.origin);
        }

        console.log('팝업창 닫기 시도');
        window.close();

      } else {
        console.warn('부모창이 없거나 닫힌 상태 - 직접 접근 모드');

        // 팝업이 아닌 경우 (직접 접근한 경우)
        if (token) {
          // 토큰 저장
          localStorage.setItem('accessToken', token);

          if (isNicknameRequired) {
            console.log('직접 접근 - 닉네임 페이지로 이동');
            navigate('/nickname');
          } else {
            console.log('직접 접근 - 홈으로 이동');
            navigate('/home');
          }
        } else {
          console.log('직접 접근 - 로그인 페이지로 이동');
          navigate('/login');
        }
      }
    };

    // 즉시 실행
    processCallback();
  }, [location, navigate]);

  // 컴포넌트가 렌더링되는 동안 최소한의 UI만 표시
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div>로그인 처리 중...</div>
        <div style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>
          잠시만 기다려주세요
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
