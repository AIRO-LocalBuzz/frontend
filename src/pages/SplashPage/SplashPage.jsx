import React from 'react';
import './SplashPage.css';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar/StatusBar';
import logoImg from '../../assets/images/common/img-localbuzz.png';
import splashImg from '../../assets/images/splash/img-splash.gif';

const SplashPage = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/login');
    };

    return (
        <>
            <section className='splash'>
                <StatusBar />
                <div className='splash_container'>
                    <img
                        className='localbuzz_logo'
                        src={logoImg}
                        alt='localbuzz_logo'
                    />
                    <div className='img_container'>
                        <img
                            className='bee_gif'
                            src={splashImg}
                        />
                    </div>
                    <div className='sub_txt'>
                        <p>나의 꿀통을 채우는 여정</p>
                    </div>
                    <div className='main_txt'>
                        <p>로컬버즈로 시작해봐요 !</p>
                    </div>
                    <button className='start_btn' onClick={handleStart}>
                        <p>시작하기</p>
                    </button>
                </div>
            </section>
        </>
    );
};

export default SplashPage;
