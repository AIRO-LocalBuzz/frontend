// context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState({
    accessToken: null,
    refreshToken: null
  });
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드 시 localStorage에서 토큰 복원
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    const name = localStorage.getItem('name');
    const provider = localStorage.getItem('provider');

    if (accessToken && refreshToken && userId && email && name && provider) {
      setTokens({ accessToken, refreshToken });
      setUser({
        id: parseInt(userId),
        email,
        name,
        provider
      });
    }

    setIsLoading(false);
  }, []);

  // 로그인 (토큰 저장)
  const login = (tokenData) => {
    // 토큰 저장
    localStorage.setItem('accessToken', tokenData.accessToken);
    localStorage.setItem('refreshToken', tokenData.refreshToken);
    localStorage.setItem('userId', tokenData.userId.toString());
    localStorage.setItem('email', tokenData.email);
    localStorage.setItem('name', tokenData.name);
    localStorage.setItem('provider', tokenData.provider);

    // 상태 업데이트
    setTokens({
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken
    });
    setUser({
      id: tokenData.userId,
      email: tokenData.email,
      name: tokenData.name,
      provider: tokenData.provider
    });

    console.log('사용자 로그인 완료:', tokenData);
  };

  // 로그아웃
  const logout = () => {
    // localStorage 클리어
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('provider');

    // 상태 초기화
    setTokens({ accessToken: null, refreshToken: null });
    setUser(null);

    console.log('사용자 로그아웃 완료');
  };

  // 로그인 상태 확인
  const isAuthenticated = () => {
    return !!(tokens.accessToken && tokens.refreshToken);
  };

  // API 요청용 헤더 생성
  const getAuthHeaders = () => {
    if (!tokens.accessToken) {
      return {
        'Content-Type': 'application/json'
      };
    }

    return {
      'Authorization': `Bearer ${tokens.accessToken}`,
      'Content-Type': 'application/json'
    };
  };

  const value = {
    user,
    tokens,
    isLoading,
    login,
    logout,
    isAuthenticated,
    getAuthHeaders
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
