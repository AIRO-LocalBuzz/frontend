import {useEffect, useState} from 'react';

let kakaoLoadingPromise = null;

export default function useKakaoLoader() {
  const [loaded, setLoaded] = useState(!!window.kakao?.maps);

  useEffect(() => {
    if (loaded) return;

    if (!kakaoLoadingPromise) {
      kakaoLoadingPromise = new Promise((resolve, reject) => {
        const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_MAP_APP_KEY;
        if (!KAKAO_APP_KEY) {
          reject(new Error('VITE_KAKAO_MAP_APP_KEY is missing'));
          return;
        }

        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services`;
        script.async = true;
        script.onload = () => {
          window.kakao.maps.load(() => resolve());
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    kakaoLoadingPromise
      .then(() => setLoaded(true))
      .catch((e) => {
        console.error('Kakao SDK load failed', e);
        setLoaded(false);
      });
  }, [loaded]);

  return loaded;
}
