import React from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { useSocialLogin } from '../../hooks/useSocialLogin';
import Statusbar from '../../components/Statusbar/Statusbar';

const LoginPage = () => {
    const navigate = useNavigate();
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
                <Statusbar />
                <div className='login_container'>
                    <div className='intro'>
                        <img
                            className='bee_img'
                            src={`/src/assets/images/img-bee.png`}
                            alt='localbuzz_character'
                        />
                        <div className='txt'>
                            <div className='hello_txt'>
                                <p>안녕하세요.</p>
                            </div>
                            <div className='localbuzz_txt'>
                                <img
                                    className='localbuzz_logo'
                                    src={`/src/assets/images/img-localbuzz.png`}
                                    alt='localbuzz_logo'
                                />
                                <p>로컬버즈입니다 !</p>
                            </div>
                            <div className='sub_txt'>
                                <p>카카오, 구글 계정으로<br />
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
                                        src={`/src/assets/images/img-kakao_logo.png`}
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
                                        src={`/src/assets/images/img-google_logo.png`}
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