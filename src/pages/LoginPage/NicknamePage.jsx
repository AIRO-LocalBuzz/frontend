import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';

const NicknamePage = () => {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {login} = useAuth();

  // 토큰 확인 - 로그인 상태가 아니면 로그인 페이지로 리다이렉트
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('토큰이 없어서 로그인 페이지로 이동');
      navigate('/login');
    }
  }, [navigate]);

  const handleNicknameSubmit = async (e) => {
    e.preventDefault();

    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    if (nickname.length < 1 || nickname.length > 20) {
      setError('닉네임은 1자 이상 20자 이하로 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setError('토큰이 없습니다. 다시 로그인해주세요.');
        navigate('/login');
        return;
      }

      console.log('닉네임 설정 API 호출 시작');

      const response = await fetch('https://airo-buzz.shop/api/v1/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          nickname: nickname.trim()
        })
      });

      if (response.ok) {
        const tokenData = await response.json();
        console.log('회원가입 성공:', tokenData);

        // AuthContext를 통해 로그인 처리
        login(tokenData);
        navigate('/home');
      } else {
        const errorData = await response.json();
        console.error('회원가입 실패:', errorData);
        setError(errorData.message || '닉네임 설정에 실패했습니다.');
      }
    } catch (err) {
      console.error('닉네임 설정 오류:', err);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setError('토큰이 없습니다. 다시 로그인해주세요.');
        navigate('/login');
        return;
      }

      console.log('토큰 교환 API 호출 시작');

      const response = await fetch('https://airo-buzz.shop/api/v1/auth/exchange-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: token
        })
      });

      if (response.ok) {
        const tokenData = await response.json();
        console.log('토큰 교환 성공:', tokenData);

        // AuthContext를 통해 로그인 처리
        login(tokenData);
        navigate('/home');
      } else {
        const errorData = await response.json();
        console.error('토큰 교환 실패:', errorData);
        setError(errorData.message || '토큰 교환에 실패했습니다.');
      }
    } catch (err) {
      console.error('토큰 교환 오류:', err);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
          <h2 style={{margin: '0 0 10px 0', color: '#333'}}>
            닉네임 설정
          </h2>
          <p style={{color: '#666', margin: 0}}>
            사용할 닉네임을 입력해주세요
          </p>
        </div>

        <form onSubmit={handleNicknameSubmit}>
          <div style={{marginBottom: '20px'}}>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e1e1e1',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
            />
          </div>

          {error && (
            <div style={{
              color: '#dc3545',
              fontSize: '14px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div style={{display: 'flex', gap: '10px'}}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: '1',
                padding: '15px',
                backgroundColor: isLoading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              {isLoading ? '설정 중...' : '완료'}
            </button>

            {/* <button
              type="button"
              onClick={handleSkip}
              disabled={isLoading}
              style={{
                flex: '1',
                padding: '15px',
                backgroundColor: isLoading ? '#ccc' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              {isLoading ? '처리 중...' : '나중에'}
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NicknamePage;
