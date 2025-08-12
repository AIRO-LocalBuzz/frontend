// hooks/useSocialLogin.js
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useSocialLogin = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const { login } = useAuth();

  const handleMessage = useCallback((event) => {
    // Origin 검증 - 보안을 위해 신뢰할 수 있는 도메인에서만 메시지 허용
    const allowedOrigins = [
      window.location.origin,  // 현재 도메인 (자동으로 현재 포트 사용)
      'http://localhost:5173', // Vite 기본 포트
      'http://127.0.0.1:5173', // IP 주소 버전
      'http://localhost:3000', // 다른 포트도 지원 (필요시)
      'http://127.0.0.1:3000',
      // 프로덕션 도메인이 있다면 여기에 추가
      // 'https://your-production-domain.com'
    ];

    console.log('메시지 origin:', event.origin);
    console.log('현재 origin:', window.location.origin);

    if (!allowedOrigins.includes(event.origin)) {
      console.warn('허용되지 않은 origin에서의 메시지:', event.origin);
      console.warn('허용된 origins:', allowedOrigins);
      return;
    }

    console.log('팝업 창에서 메시지 수신:', event.data);

    // 타임아웃 클리어
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (event.data.type === 'OAUTH_SUCCESS') {
      const token = event.data.token;
      console.log('OAuth 성공, 토큰:', token);

      // 토큰 유효성 검사
      if (!token || typeof token !== 'string') {
        console.error('유효하지 않은 토큰:', token);
        alert('로그인 처리 중 오류가 발생했습니다.');
        return;
      }

      // 임시 토큰을 저장
      localStorage.setItem('accessToken', token);

      // 토큰 교환 API 호출
      handleTokenExchange(token);

    } else if (event.data.type === 'OAUTH_SUCCESS_NICKNAME_REQUIRED') {
      const token = event.data.token;
      console.log('OAuth 성공 - 닉네임 설정 필요, 토큰:', token);

      // 토큰 유효성 검사
      if (!token || typeof token !== 'string') {
        console.error('유효하지 않은 토큰:', token);
        alert('로그인 처리 중 오류가 발생했습니다.');
        return;
      }

      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', token);

      // 닉네임 설정 페이지로 이동
      console.log('닉네임 설정 페이지로 이동합니다.');
      navigate('/nickname');

    } else if (event.data.type === 'OAUTH_ERROR') {
      console.error('OAuth 에러:', event.data.error);

      // 에러 처리
      const errorMessage = event.data.error || '알 수 없는 오류가 발생했습니다.';
      alert('로그인에 실패했습니다: ' + errorMessage);

    } else if (event.data.type === 'OAUTH_CANCEL') {
      console.log('사용자가 로그인을 취소했습니다.');
      // 취소 시 특별한 처리가 필요하다면 여기에 추가
    }
  }, [navigate]);

  // 토큰 교환 함수
  const handleTokenExchange = useCallback(async (code) => {
    try {
      console.log('토큰 교환 API 호출 시작');

      const response = await fetch('https://airo-buzz.shop/api/v1/auth/exchange-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: code
        })
      });

      if (response.ok) {
        const tokenData = await response.json();
        console.log('토큰 교환 성공:', tokenData);

        // AuthContext를 통해 로그인 처리 (Context와 localStorage 모두 저장)
        login(tokenData);

        console.log('토큰 교환 완료! 홈으로 이동합니다.');
        navigate('/home');
      } else {
        const errorData = await response.json();
        console.error('토큰 교환 실패:', errorData);
        alert('로그인 처리 중 오류가 발생했습니다: ' + (errorData.message || '토큰 교환 실패'));
        navigate('/login');
      }
    } catch (error) {
      console.error('토큰 교환 중 오류:', error);
      alert('네트워크 오류가 발생했습니다.');
      navigate('/login');
    }
  }, [navigate, login]); // login 의존성 추가

  // 메시지 리스너 등록
  useEffect(() => {
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      // 컴포넌트 언마운트 시 타임아웃 클리어
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [handleMessage]);

  const openSocialLogin = useCallback((provider) => {
    const width = 480;
    const height = 812;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    // 기존 타임아웃이 있다면 클리어
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    console.log(`${provider} 로그인 팝업을 엽니다.`);

    const popup = window.open(
      `https://airo-buzz.shop/api/oauth2/authorization/${provider}`,
      `${provider}_oauth`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    // 팝업이 차단되었는지 확인
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      console.error('팝업이 차단되었습니다.');
      alert('팝업이 차단되었습니다. 브라우저의 팝업 차단을 해제하고 다시 시도해주세요.');
      return;
    }

    // 60초 후 타임아웃 (사용자가 팝업을 닫지 않고 방치하는 경우)
    timeoutRef.current = setTimeout(() => {
      console.log(`${provider} 로그인 타임아웃`);
      timeoutRef.current = null;

      // 선택사항: 타임아웃 시 사용자에게 알림
      // alert('로그인 시간이 초과되었습니다. 다시 시도해주세요.');
    }, 60000);

  }, []);

  // 개별 소셜 로그인 함수들
  const loginWithKakao = useCallback(() => {
    openSocialLogin('kakao');
  }, [openSocialLogin]);

  const loginWithGoogle = useCallback(() => {
    openSocialLogin('google');
  }, [openSocialLogin]);

  // 네이버 등 다른 소셜 로그인도 쉽게 추가 가능
  const loginWithNaver = useCallback(() => {
    openSocialLogin('naver');
  }, [openSocialLogin]);

  // 토큰 체크 함수 (선택사항)
  const isLoggedIn = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }, []);

  // 로그아웃 함수 (선택사항)
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  }, [navigate]);

  return {
    loginWithKakao,
    loginWithGoogle,
    loginWithNaver,
    isLoggedIn,
    logout
  };
};
