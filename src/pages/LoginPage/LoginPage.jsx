import React from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { useSocialLogin } from '../../hooks/useSocialLogin';
import Statusbar from '../../components/Statusbar/Statusbar';
import beeImg from '../../assets/images/common/img-bee.png';
import logoIconBlack from '../../assets/icons/common/icon-logo-black.svg';
import kakaoLogoImg from '../../assets/images/login/img-kakao_logo.png';
import googleLogoImg from '../../assets/images/login/img-google_logo.png';

const LoginPage = () => {
  const navigate = useNavigate();

  // TO-DO : 리팩터링 과정에서 삭제 필요
  const { loginWithKakao, loginWithGoogle, isLoggedIn } = useSocialLogin();

  // // 이미 로그인되어 있다면 홈으로 리다이렉트 (선택사항)
  // React.useEffect(() => {
  //     if (isLoggedIn()) {
  //         navigate('/home');
  //     }
  // }, [isLoggedIn, navigate]);

  const handleStart = () => {
    navigate('/home');
  };

  return (
    <>
      <section className='login'>
        <Statusbar/>
        <div className='login_container'>
          <div className='intro'>
            <img
              className='bee_img'
              src={beeImg}
              alt='localbuzz_character'
            />
            <div className='txt'>
              <div className='hello_txt'>
                <p>안녕하세요.</p>
              </div>
              <div className='localbuzz_txt'>
                <img
                  className='localbuzz_logo'
                  src={logoIconBlack}
                  alt='localbuzz_logo'
                />
                <p>로컬버즈입니다 !</p>
              </div>
              <div className='sub_txt'>
                <p>카카오, 구글 계정으로<br/>
                  3초만에 가입하고 바로 시작해보세요!</p>
              </div>
            </div>
          </div>
          <div className='signup'>
            <div className='email'>
              <button
                className='kakao'
                onClick={loginWithKakao}
              >
                <div className='kakao_container'>
                  <img
                    className='kakao_logo'
                    src={kakaoLogoImg}
                    alt='kakao_logo'
                  />
                  <p>카카오로 시작하기</p>
                </div>
              </button>
              <button
                className='google'
                onClick={loginWithGoogle}
              >
                <div className='google_container'>
                  <img
                    className='google_logo'
                    src={googleLogoImg}
                    alt='google_logo'
                  />
                  <p>구글로 시작하기</p>
                </div>
              </button>
            </div>
            <div className='or'>
              <div className='divider'></div>
              <p>또는</p>
              <div className='divider'></div>
            </div>
            <button className='non_signup' onClick={handleStart}>
              <p>가입하지 않고 둘러볼래요</p>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
