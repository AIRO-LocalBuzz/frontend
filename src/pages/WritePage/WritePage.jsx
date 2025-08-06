import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { usePhoto } from '../../contexts/PhotoContext';
import iconPrev from '../../assets/icons/common/icon-prev.svg';
import iconCamera from '../../assets/icons/common/icon-camera.svg';
import iconExit from '../../assets/icons/common/icon-exit.svg';
import './WritePage.css';
import Statusbar from '../../components/statusBar';

export default function WritePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const prevPreviewUrlsRef = useRef([]);
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('id');
  const isNewWrite = searchParams.get('new') === 'true';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [travelDate, settravelDate] = useState(null);
  const [category, setCategory] = useState('');
  const [adress, setadress] = useState('');
  const [withWhoTag, setwithWhoTag] = useState('');
  const [forWhatTag, setforWhatTag] = useState('');
  const [emotionTags, setemotionTags] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const { selectedPhotos, setSelectedPhotos, resetPhotos } = usePhoto();
  const [previewUrls, setPreviewUrls] = useState([]);

  const [placeInitDone, setPlaceInitDone] = useState(false);

  const withWhoTagMap = {
    '혼자': 'ALLONE',
    '친구': 'FRIEND',
    '가족': 'FAMILY',
    '연인': 'PARTNER',
  };

  // 💡 PostForWhatTag 열거형에 맞춰 forWhatTagMap 수정
  const forWhatTagMap = {
    '업무': 'WORK',
    '세미나': 'SEMINAR',
    '학교': 'SCHOOL',
    '힐링': 'HEALING',
    '공부': 'STUDY',
    '식도락': 'CULINARY',
  };

  const emotionMap = {
    '행복': 'HAPPY',
    '설렘': 'EXCITED',
    '만족감': 'SATISFIED',
    '충만함': 'FULFILLED',
    '평온함': 'PEACEFUL',
    '여유로움': 'RELAXED',
    '감동': 'TOUCHED',
    '벅차오름': 'OVERWHELMED',
    '친근함': 'FRIENDLY',
    '따듯함': 'WARM',
  };

  const categoryOptions = [
    { key: 'food', label: '음식점', value: 'RESTORANT' },
    { key: 'cafe', label: '카페', value: 'CAFE' },
    { key: 'living', label: '숙소', value: 'ACCOMMODATION' },
    { key: 'event', label: '행사', value: 'EVENT' },
    { key: 'experience', label: '체험', value: 'EXPERIENCE' },
    { key: 'challenge', label: '챌린지', value: 'CHALLENGE' },
    { key: 'leisure', label: '여가', value: 'LEISURE' },
  ];

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
    newUrls.forEach(url => URL.revokeObjectURL(url));
  };
}, [selectedPhotos]);

const images = previewUrls.map(url => ({
  imageUrl: url.replace(/^blob:/, ''),  // 'blob:' 접두사 제거
  mimeType: 'image/jpeg',               // 필요시 확장자 기반으로 변경 가능
}));

  useEffect(() => {
    if (location.state?.selectedPlace && !placeInitDone) {
      setadress(location.state.selectedPlace);
      setPlaceInitDone(true);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.state?.selectedPlace, placeInitDone]);

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
        setadress(postToEdit.adress || '');
        setwithWhoTag(postToEdit.withWhoTag || '');
        setforWhatTag(postToEdit.forWhatTag || '');
        setemotionTags(postToEdit.emotionTags || []);
        setSelectedPhotos(postToEdit.images || []);
      } catch (error) {
        console.error('Error fetching post:', error);
        alert(error.message || '게시물을 불러오는 데 실패했습니다. 새 글쓰기 페이지로 이동합니다.');
        navigate('/write?new=true');
      }
    };

    fetchPost();
  }, [postId, navigate, setSelectedPhotos]);

  useEffect(() => {
    if (isNewWrite) {
      setTitle('');
      setContent('');
      setCategory('');
      setDate('');
      setadress('');
      setwithWhoTag('');
      setforWhatTag('');
      setemotionTags([]);
      settravelDate(null);
      setSelectedPhotos([]);
      setPreviewUrls([]);
      resetPhotos();
    }
  }, [isNewWrite, resetPhotos, setSelectedPhotos]);

  useEffect(() => {
    if (date) {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        settravelDate(parsed);
      } else {
        settravelDate(null);
      }
    } else {
      settravelDate(null);
    }
  }, [date]);
  
  const formatFullDate = (dateObj) => {
    if (!dateObj || isNaN(dateObj.getTime())) return '';
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const date = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
  };

  function formatDateToLocalISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const [modalOpen, setModalOpen] = useState(null);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(category);

  const handleEmotionTagClick = (tag) => {
    setemotionTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };
  
  const isActive = title && content && category && date && adress && emotionTags.length > 0 && withWhoTag && forWhatTag;

  const closeModal = () => {
    setModalOpen(null);
  };
  
  const handleCategoryModalClose = () => {
    setCategory(selectedCategoryKey);
    setModalOpen(null);
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

    // const postData = {
    //   title,
    //   content,
    //   status: "PUBLISHED",
    //   withWhoTag: withWhoTagMap[withWhoTag] || '',
    //   forWhatTag: forWhatTagMap[forWhatTag] || '',
    //   emotionTags: emotionTags.map(tag => emotionMap[tag]),
    //   category: categoryOptions.find(opt => opt.key === category)?.value || '',
    //   travelDate: date,
    //   adress,
    //   images: imagesData, // 💡 images 필드 추가
    //   isFeatured: false, 
    // };
    
    // const postData = {
    //   "title": "강릉 분위기 좋은 카페",
    //   "content": "정말 좋은 여행이었습니다...",
    //   "status": "PUBLISHED",
    //   "withWhoTag": "FRIEND",
    //   "forWhatTag": "HEALING",
    //   "emotionTags": [
    //     "EXCITED",
    //     "JOYFUL"
    //   ],
    //   "category": "CAFE",
    //   "travelDate": "2025-08-02",
    //   "adress": "강릉",
    //   "images": [
    //     {
    //       "imageUrl": "https://example.com/image1.jpg",
    //       "mimeType": "image/jpeg"
    //     },
    //     {
    //       "imageUrl": "https://example.com/image2.png",
    //       "mimeType": "image/png"
    //     }
    //   ],
    //   "isFeatured": false
    // };'

    // const imagesData = selectedPhotos.map(file => ({
    //   imageUrl: file instanceof File ? `temp-url/${file.name}` : file,
    //   mimeType: file instanceof File ? file.type : 'image/jpeg',
    // }));

    const postData = {
  title,
  content,
  status: "PUBLISHED", // 또는 조건에 따라 변경 가능
  withWhoTag: withWhoTagMap[withWhoTag] || '',
  forWhatTag: forWhatTagMap[forWhatTag] || '',
  emotionTags: emotionTags.map(tag => emotionMap[tag]).filter(Boolean),
  category: categoryOptions.find(opt => opt.key === category)?.value || '',
  travelDate: date,
  adress,
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
  console.log("response :: ",savedPost.id);
  navigate(`/detail/${savedPost.id}`);
} catch (e) {
  console.error('게시물 제출 실패:', e);
  alert(e.message || '게시물 저장에 실패했습니다.');
} finally {
  setLoading(false);
}
  };

  return (
    <div className="write-page">
      <header className="write-header">
        <div className="write-header-left">
          <button className="icon-button" onClick={() => navigate('/review')}>
            <img src={iconPrev} alt="이전" className="icon-prev" />
          </button>
          <h2 className="title">글쓰기</h2>
        </div>
        <button
          className={`btn-submit ${isActive && !loading ? 'active' : 'inactive'}`}
          disabled={!isActive || loading}
          onClick={handleSubmit}
        >
          {loading ? '게시 중...' : '게시하기'}
        </button>
      </header>

      <div className="write-form">
        <div className="row date-adress-row">
          <button
            type="button"
            className="input-button date-button"
            onClick={() => setModalOpen('date')}
          >
          <div className="label-group">
            <span className="label">날짜</span>
            <img src={iconPrev} alt="아래 화살표" className="icon-arrow-down" />
          </div>
            
            <span className="date-select">{formatFullDate(travelDate)}</span>
          </button>

          <div className="adress-container">
            <button
              type="button"
              className="input-button adress-button"
              onClick={() => navigate('/search', { state: { fromWrite: true, postId: postId } })}
            >
              <span className="adress-text">{adress.place_name || '위치'}</span>
            </button>
            <img src={iconPrev} alt="아래 화살표" className="icon-arrow-down-fixed" />
          </div>
        </div>

        <div className="row category-row">
          <button
            type="button"
            className={`input-button ${category ? '' : 'placeholder'}`}
            onClick={() => {
              setModalOpen('category');
              setSelectedCategoryKey(category);
            }}
          >
            <div className="label-group">
              <span className="label">카테고리</span>
              <img src={iconPrev} alt="아래 화살표" className="icon-arrow-down" />
            </div>
            <span className="category-select">
              {categoryOptions.find(opt => opt.key === category)?.label || ''}
            </span>
          </button>
        </div>

        <div className="row label-tag-row">
          <p className="label">누구와 갔나요?</p>
          <div className="tag-group">
            {['혼자', '친구', '가족', '연인'].map((tag, i) => (
              <button
                key={i}
                className={`tag-button ${withWhoTag === tag ? 'selected' : ''}`}
                onClick={() => setwithWhoTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="row label-tag-row">
          <p className="label">왜 갔나요?</p>
          <div className="tag-group">
            {['업무', '세미나', '학교', '힐링', '공부', '식도락'].map((tag, i) => (
              <button
                key={i}
                className={`tag-button ${forWhatTag === tag ? 'selected' : ''}`}
                onClick={() => setforWhatTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        <div className="row label-tag-row">
          <p className="label">어떤 감정이었나요?</p>
          <div className="tag-group">
            {['행복', '설렘', '만족감', '충만함', '평온함', '여유로움', '감동', '벅차오름', '친근함', '따듯함'].map((tag, i) => (
              <button
                key={i}
                className={`tag-button ${emotionTags.includes(tag) ? 'selected' : ''}`}
                onClick={() => handleEmotionTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div
          className="photo-placeholder"
          style={{
            justifyContent: previewUrls.length > 0 ? 'flex-start' : 'center',
          }}
        >
          {previewUrls.length === 0 ? (
            <div
              className="photo-placeholder clickable"
              onClick={() => navigate('/upload-photo')}
            >
              <div className="placeholder-content">
                <div className="plus-icon">+</div>
                <p>다녀온 사진을 추가해보세요</p>
              </div>
            </div>
          ) : (
            <div className="photo-preview-scroll">
              {previewUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`uploaded-${i}`}
                  className="photo-scroll-thumb"
                />
              ))}
            </div>
          )}
        </div>

        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="제목을 입력하세요."
          className="input-title"
        />

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="내용을 입력하세요. (최대 20,000자)"
          rows={8}
          maxLength={20000}
          className="textarea-content"
        />
      </div>

      <div className="bottom-action-buttons">
        <button className="btn-ai">AI 도구</button>
        <button className="btn-camera" onClick={() => navigate('/upload-photo')}>
          <img src={iconCamera} alt="카메라" />
        </button>
      </div>

      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-inner">

              <div className="modal-header">
                <button className="modal-close-x" onClick={closeModal}>
                  <img src={iconExit} alt="닫기" />
                </button>
              </div>

              {modalOpen === 'date' && (
                <>
                  <div className="modal-custom-date-header">
                    <span className="date-title">날짜 : </span>
                    {travelDate ? (
                      <>
                        <span className="year">{travelDate.getFullYear()}년</span>
                        <span className="month">{travelDate.getMonth() + 1}월</span>
                        <span className="date">{travelDate.getDate()}일</span>
                      </>
                    ) : (
                      <span>선택된 날짜가 없습니다</span>
                    )}
                  </div>

                  <ReactCalendar
                    onChange={(value) => {
                      settravelDate(value)
                      setDate(formatDateToLocalISO(value))
                    }}
                    value={travelDate || new Date()}
                    showNeighboringMonth={false}
                    prev2Label={null}
                    next2Label={null}
                  />
                </>
              )}

              {modalOpen === 'category' && (
                <div className="modal-category-list custom-grid">
                  {categoryOptions.map(({ key, label }) => (
                    <button
                      key={key}
                      className={`modal-category-item ${selectedCategoryKey === key ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedCategoryKey(key);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
              <button 
                className="modal-close-btn"
                onClick={modalOpen === 'category' ? handleCategoryModalClose : closeModal}
              >
                설정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}