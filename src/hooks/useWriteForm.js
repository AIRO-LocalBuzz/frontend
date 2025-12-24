import {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {usePhoto} from '../contexts/PhotoContext';

// 컴포넌트 밖에서 선언하여 불필요한 재선언 방지
export const withWhoTagMap = {'혼자': 'ALLONE', '친구': 'FRIEND', '가족': 'FAMILY', '연인': 'PARTNER'};
export const forWhatTagMap = {
  '업무': 'WORK',
  '세미나': 'SEMINAR',
  '학교': 'SCHOOL',
  '힐링': 'HEALING',
  '공부': 'STUDY',
  '식도락': 'CULINARY'
};
export const emotionMap = {
  '행복': 'HAPPY',
  '설렘': 'EXCITED',
  '만족감': 'SATISFIED',
  '충만함': 'FULFILLED',
  '평온함': 'PEACEFUL',
  '여유로움': 'RELAXED',
  '감동': 'TOUCHED',
  '벅차오름': 'OVERWHELMED',
  '친근함': 'FRIENDLY',
  '따듯함': 'WARM'
};
export const categoryOptions = [{key: 'food', label: '음식점', value: 'RESTORANT'}, {
  key: 'cafe',
  label: '카페',
  value: 'CAFE'
}, {key: 'living', label: '숙소', value: 'ACCOMMODATION'}, {
  key: 'event',
  label: '행사',
  value: 'EVENT'
}, {key: 'experience', label: '체험', value: 'EXPERIENCE'}, {
  key: 'challenge',
  label: '챌린지',
  value: 'CHALLENGE'
}, {key: 'leisure', label: '여가', value: 'LEISURE'}];

export const useWriteForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const {selectedPhotos, setSelectedPhotos, resetPhotos} = usePhoto();

  // 원본 코드의 모든 상태 관리
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [travelDate, setTravelDate] = useState(null);
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState(''); // 원본 변수명 유지
  const [withWhoTag, setWithWhoTag] = useState(''); // 원본 변수명 유지
  const [forWhatTag, setForWhatTag] = useState(''); // 원본 변수명 유지
  const [emotionTags, setEmotionTags] = useState([]); // 원본 변수명 유지
  const [loading, setLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [modalOpen, setModalOpen] = useState(null);

  // 딱 한 번만 초기화되도록 useRef 추가
  const initializedRef = useRef(false);
  const prevPreviewUrlsRef = useRef([]);

  const postId = searchParams.get('id');
  const isNewWrite = searchParams.get('new') === 'true';


  // 사진 미리보기 로직
  useEffect(() => {
    if (selectedPhotos.length === 0) {
      if (prevPreviewUrlsRef.current.length !== 0) {
        setPreviewUrls([]);
        prevPreviewUrlsRef.current = [];
      }
      return;
    }

    const isFileArray = selectedPhotos[0] instanceof File;

    if (!isFileArray) {
      const isSame = prevPreviewUrlsRef.current.length === selectedPhotos.length &&
        prevPreviewUrlsRef.current.every((url, i) => url === selectedPhotos[i]);
      if (!isSame) {
        setPreviewUrls(selectedPhotos);
        prevPreviewUrlsRef.current = selectedPhotos;
      }
      return;
    }

    const newUrls = selectedPhotos.map(file => URL.createObjectURL(file));
    const isSameFiles = prevPreviewUrlsRef.current.length === newUrls.length &&
      prevPreviewUrlsRef.current.every((url, i) => url === newUrls[i]);

    if (!isSameFiles) {
      setPreviewUrls(newUrls);
      prevPreviewUrlsRef.current = newUrls;
    }

    return () => {
      console.log('[디버그] selectedPhotos 변경됨', selectedPhotos);
      newUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedPhotos]);

  const images = previewUrls.map(url => ({
    imageUrl: url.replace(/^blob:/, ''),  // 'blob:' 접두사 제거
    mimeType: 'image/jpeg',               // 필요시 확장자 기반으로 변경 가능
  }));


  // location.state로부터 상태 복원 로직
  useEffect(() => {
    const state = location.state;
    if (!state) return;

    console.log('✅ location.state 복원:', state);

    // 복원할 기본 데이터 (이전 글쓰기 상태)
    const dataToRestore = state.currentWriteState || state;

    // 주소는 새로 선택한 selectedPlace가 있으면 그것으로 덮어쓰기
    if (state.selectedPlace) {
      setAddress(state.selectedPlace);
    } else if (dataToRestore.address) {
      setAddress(dataToRestore.address);
    }

    if (dataToRestore) {
      // 1. 이전 글쓰기 상태를 먼저 전체 복원합니다.
      if (dataToRestore.title) setTitle(dataToRestore.title);
      if (dataToRestore.content) setContent(dataToRestore.content);
      if (dataToRestore.category) setCategory(dataToRestore.category);
      if (dataToRestore.date) setDate(dataToRestore.date);
      if (dataToRestore.withWhoTag) setWithWhoTag(dataToRestore.withWhoTag);
      if (dataToRestore.forWhatTag) setForWhatTag(dataToRestore.forWhatTag);
      if (dataToRestore.emotionTags) setEmotionTags(dataToRestore.emotionTags);

      // 기존 주소도 일단 복원
      if (dataToRestore.address) setAddress(dataToRestore.address);
    }

    // 2. SearchPage에서 새로 선택한 위치가 있다면, 주소만 그것으로 덮어씁니다.
    if (state.selectedPlace) {
      setAddress(state.selectedPlace);
    }

    // 3. 복원이 완료된 후 state를 제거하여 새로고침 시 초기화 방지
    window.history.replaceState({}, document.title, location.pathname);

  }, [location.state]);


  // 게시물 수정 시 데이터 fetch 로직
  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiaWF0IjoxNzU0MTY1NzI3LCJleHAiOjM2MTc1NDE2NTcyN30.1E2JEdWvdSbChE0L9Jnp5ZP_X08Dy7XjYLIFv3GLcyI';
        if (!accessToken) throw new Error('로그인이 필요합니다.');

        const response = await fetch(`https://airo-buzz.shop/api/v1/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch post');

        const postToEdit = await response.json();

        setTitle(postToEdit.title || '');
        setContent(postToEdit.content || '');
        setCategory(postToEdit.category || '');
        setDate(postToEdit.date || '');
        setAddress(postToEdit.address || '');
        setWithWhoTag(postToEdit.withWhoTag || '');
        setForWhatTag(postToEdit.forWhatTag || '');
        setEmotionTags(postToEdit.emotionTags || []);
        setSelectedPhotos(postToEdit.images || []);
      } catch (error) {
        console.error('Error fetching post:', error);
        alert(error.message || '게시물을 불러오는 데 실패했습니다. 새 글쓰기 페이지로 이동합니다.');
        navigate('/write?new=true');
      }
    };

    fetchPost();
  }, [postId, navigate, setSelectedPhotos]);


  // 새 글 작성 시 초기화 로직
  useEffect(() => {
    // '처음 새 글쓰기 페이지에 들어왔을 때만 초기화' 되게 함
    const isFreshStart =
      isNewWrite &&
      !location.state?.selectedPlace &&
      !location.state?.fromPhoto &&
      !location.state?.fromSearch &&
      !initializedRef.current;

    if (isFreshStart) {
      console.log('✅ 새 글쓰기 초기화 실행');

      setTitle('');
      setContent('');
      setCategory('');
      setDate('');
      setAddress('');
      setWithWhoTag('');
      setForWhatTag('');
      setEmotionTags([]);
      setTravelDate(null);
      setSelectedPhotos([]);
      setPreviewUrls([]);
      resetPhotos();

      initializedRef.current = true;
    }
  }, [isNewWrite, location.state, resetPhotos, setSelectedPhotos]); // 의존성 배열에 location.state 추가


  // date 문자열 -> travelDate 객체 동기화 로직
  useEffect(() => {
    if (date) {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        setTravelDate(parsed);
      } else {
        setTravelDate(null);
      }
    } else {
      setTravelDate(null);
    }
  }, [date]);


  // 원본 코드의 모든 핸들러 및 유틸리티 함수
  const handleEmotionTagClick = (tag) => {
    setEmotionTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  };

  const handleSubmit = async () => {
    if (!isActive || loading) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setLoading(true);

    const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiaWF0IjoxNzU0MTY1NzI3LCJleHAiOjM2MTc1NDE2NTcyN30.1E2JEdWvdSbChE0L9Jnp5ZP_X08Dy7XjYLIFv3GLcyI';

    if (!accessToken) {
      alert('로그인이 필요합니다.');
      setLoading(false);
      navigate('/login');
      return;
    }

    const postData = {
      title,
      content,
      status: "PUBLISHED", // 또는 조건에 따라 변경 가능
      withWhoTag: withWhoTagMap[withWhoTag] || '',
      forWhatTag: forWhatTagMap[forWhatTag] || '',
      emotionTags: emotionTags.map(tag => emotionMap[tag]).filter(Boolean),
      category: categoryOptions.find(opt => opt.key === category)?.value || '',
      travelDate: date,
      address,
      images: images, // images는 URL 문자열 배열 등 JSON에 포함될 데이터 형태여야 함
      isFeatured: false
    };

    console.log("전송될 JSON 데이터:", JSON.stringify(postData, null, 2));

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      };

      const response = await fetch(
        postId
          ? `https://airo-buzz.shop/api/v1/posts/${postId}`
          : 'https://airo-buzz.shop/api/v1/posts',
        {
          method: postId ? 'PUT' : 'POST',  // 수정이면 PUT, 신규면 POST (필요 시 변경)
          headers,
          body: JSON.stringify(postData),
        }
      );


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '게시물 저장 실패');
      }

      const savedPost = await response.json();
      console.log("response :: ", savedPost.id);
      navigate(`/detail/${savedPost.id}`);
    } catch (e) {
      console.error('게시물 제출 실패:', e);
      alert(e.message || '게시물 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatFullDate = (dateObj) => {
    if (!dateObj || isNaN(dateObj.getTime())) return '';
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const date = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
  };

  const formatDateToLocalISO = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isActive = title && content && category && date && address && emotionTags.length > 0 && withWhoTag && forWhatTag;

  // UI 컴포넌트에서 필요한 모든 것을 return
  return {
    navigate, location, title, content, date, travelDate, category, address, withWhoTag,
    forWhatTag, emotionTags, loading, previewUrls, modalOpen, isActive, postId,
    selectedPhotos,
    setTitle, setContent, setDate, setTravelDate, setCategory, setAddress, setWithWhoTag,
    setForWhatTag, setEmotionTags, setLoading, setModalOpen,
    handleEmotionTagClick, handleSubmit, formatFullDate, formatDateToLocalISO
  };
};
