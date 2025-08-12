import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePhoto } from '../../contexts/PhotoContext';
import iconPrev from '../../assets/icons/common/icon-prev.svg';
import iconCamera from '../../assets/icons/common/icon-camera.svg';
import iconExit from '../../assets/icons/common/icon-exit.svg';
import './WritePage.css';

export default function WritePage() {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [emotionTags, setemotionTags] = useState('');

  const [loading, setLoading] = useState(false);
  const { selectedPhotos, setSelectedPhotos, resetPhotos } = usePhoto();
  const [previewUrls, setPreviewUrls] = useState([]);

  // 사진 미리보기 URL 생성 및 해제
  useEffect(() => {
    if (selectedPhotos.length === 0 || typeof selectedPhotos[0] === 'string') {
      setPreviewUrls(selectedPhotos);
      return;
    }

    const urls = selectedPhotos.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedPhotos]);

  // 이펙트 훅 통합 및 API 로직 추가
  useEffect(() => {
    // 1. 검색 페이지에서 돌아온 경우, location.state의 위치 정보를 우선 반영
    if (location.state && location.state.selectedPlace) {
      // SearchPage에서 문자열을 보냈기 때문에, `.place_name` 없이 바로 사용합니다.
      setadress(location.state.selectedPlace);
      window.history.replaceState({}, document.title, location.pathname);
      return;
    }

    // 2. 수정 모드일 경우 (postId가 있을 때), API에서 게시물 로드
    const fetchPost = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('로그인이 필요합니다.');
        }

        const response = await fetch(`https://airo-buzz.shop/api/posts/${postId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const postToEdit = await response.json();

        // API 응답 데이터에 맞게 상태를 업데이트합니다.
        setTitle(postToEdit.title || '');
        setContent(postToEdit.content || '');
        setCategory(postToEdit.category || '');
        setDate(postToEdit.date || '');
        setadress(postToEdit.adress || '');
        setwithWhoTag(postToEdit.withWhoTag || '');
        setemotionTags(postToEdit.emotionTags || '');
        setSelectedPhotos(postToEdit.images || []);

      } catch (error) {
        console.error("Error fetching post:", error);
        alert(error.message || "게시물을 불러오는 데 실패했습니다. 새 글쓰기 페이지로 이동합니다.");
        navigate('/write?new=true');
      }
    };

    if (postId) {
      fetchPost();
    }

    // 3. 새 글쓰기 모드일 경우
    else if (isNewWrite) {
      setTitle('');
      setContent('');
      setCategory('');
      setDate('');
      setadress('');
      setwithWhoTag('');
      setemotionTags('');
      settravelDate(null);
      resetPhotos();
    }
  }, [postId, isNewWrite, navigate, location.state, resetPhotos, setSelectedPhotos]);

  // date 값 변경 시 travelDate 동기화
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

  // 날짜 포맷 함수
  const formatFullDate = (dateObj) => {
    if (!dateObj || isNaN(dateObj.getTime())) return '';
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const date = dateObj.getDate();
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()];
    return `${year - 2000}년 ${month}월 ${date}일 ${weekday}요일`;
  };

  function formatDateToLocalISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const [modalOpen, setModalOpen] = useState(null);
  const [customCategory, setCustomCategory] = useState('');

  // isActive 로직에 title 필드 추가
  const isActive = title && content && category && date && adress;

  const closeModal = () => {
    if (modalOpen === 'category' && customCategory) {
      setCategory('custom:' + customCategory);
    }
    setModalOpen(null);
  };

  // 게시 버튼 핸들러 (API 연동 로직으로 변경)
  const handleSubmit = async () => {
    if (!isActive || loading) {
      alert('필수 정보를 모두 입력해주세요.'); // 필수 정보 누락 시 알림
      return;
    }

    setLoading(true);

    const postData = {
      title,
      content,
      category,
      adress,
      withWhoTag,
      emotionTags,
      images: previewUrls,
    };

    // 로컬 스토리지에서 액세스 토큰 가져오기
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      let response;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      };

      if (postId) {
        response = await fetch(`https://airo-buzz.shop/api/posts/${postId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(postData),
        });
      } else {
        response = await fetch('https://airo-buzz.shop/api/posts', {
          method: 'POST',
          headers,
          body: JSON.stringify(postData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '게시물 저장 실패');
      }

      const savedPost = await response.json();

      navigate(`/detail/${savedPost.id}`);

    } catch (e) {
      console.error('게시물 제출 실패:', e);
      alert(e.message || '게시물 저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="write-page">
      {/* 상단 헤더 */}
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

      {/* 입력 폼 */}
      <div className="write-form">
        {/* 날짜와 위치 한 줄 */}
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
              <span className="adress-text">{adress || '위치'}</span>
            </button>
            <img src={iconPrev} alt="아래 화살표" className="icon-arrow-down-fixed" />
          </div>
        </div>

        {/* 카테고리 한 줄 */}
        <div className="row category-row">
          <button
            type="button"
            className={`input-button ${category ? '' : 'placeholder'}`}
            onClick={() => setModalOpen('category')}
          >
            <div className="label-group">
              <span className="label">카테고리</span>
              <img src={iconPrev} alt="아래 화살표" className="icon-arrow-down" />
            </div>
            <span className="category-select">
              {category.startsWith('custom:')
                ? category.replace('custom:', '')
                : category === 'food'
                  ? '음식'
                  : category === 'travel'
                    ? '여행'
                    : category === 'daily'
                      ? '일상'
                      : category === 'experience'
                        ? '체험'
                        : ''}
            </span>
          </button>
        </div>

        {/* 누구와 갔나요? */}
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

        {/* 왜 갔나요? */}
        <div className="row label-tag-row">
          <p className="label">왜 갔나요?</p>
          <div className="tag-group">
            {['행복', '설렘', '만족감', '충만함', '평온함', '여유로움', '감동', '벅차오름', '친근함', '따듯함'].map((tag, i) => (
              <button
                key={i}
                className={`tag-button ${emotionTags === tag ? 'selected' : ''}`}
                onClick={() => setemotionTags(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 사진 미리보기 */}
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

        {/* 제목 입력 필드 추가 */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="제목을 입력하세요."
          className="input-title"
        />

        {/* 내용 텍스트 */}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="내용을 입력하세요. (최대 20,000자)"
          rows={8}
          maxLength={20000}
          className="textarea-content"
        />
      </div>

      {/* 하단 버튼 */}
      <div className="bottom-action-buttons">
        <button className="btn-ai">AI 도구</button>
        <button className="btn-camera" onClick={() => navigate('/upload-photo')}>
          <img src={iconCamera} alt="카메라" />
        </button>
      </div>

      {/* 모달 */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-inner">

              {/* 모달 상단 헤더 (닫기 버튼 포함) */}
              <div className="modal-header">
                <button className="modal-close-x" onClick={closeModal}>
                  <img src={iconExit} alt="닫기" />
                </button>
              </div>

              {/* 모달 컨텐츠 영역 */}
              {/* 날짜 선택 */}
              {modalOpen === 'date' && (
                <>
                  {/* 상단에 표시되는 선택된 날짜 */}
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

                  {/* 실제 달력 라이브러리 */}
                  <ReactCalendar
                    onChange={(value) => {
                      settravelDate(value)
                      setDate(formatDateToLocalISO(value))
                    }}
                    value={travelDate || new Date()}
                    showNeighboringMonth={false}
                    prev2Label={null}
                    next2Label={null}
                  // locale="ko-KR"
                  />
                </>
              )}

              {/* 카테고리 선택 */}
              {modalOpen === 'category' && (
                <div className="modal-category-list custom-grid">
                  {/* 2x2 grid 버튼 */}
                  {[
                    { value: 'food', label: '음식' },
                    { value: 'travel', label: '여행' },
                    { value: 'daily', label: '일상' },
                    { value: 'experience', label: '체험' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      className={`modal-category-item ${category === opt.value ? 'selected' : ''
                        }`}
                      onClick={() => {
                        setCategory(opt.value);
                        setCustomCategory('');
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}

                  {/* 기타 입력 - 버튼 자체가 입력으로 변하는 방식 */}
                  <div className="custom-category-full">
                    {category.startsWith('custom:') ? (
                      <input
                        type="text"
                        placeholder="카테고리 입력"
                        className="modal-input-adress full-width"
                        value={customCategory || category.replace('custom:', '')}
                        onChange={(e) => setCustomCategory(e.target.value)}
                      />
                    ) : (
                      <button
                        className="modal-category-item full-width"
                        onClick={() => {
                          setCategory('custom:');
                          setCustomCategory('');
                        }}
                      >
                        기타 : 직접 입력하기
                      </button>
                    )}

                  </div>
                </div>
              )}

              <button className="modal-close-btn" onClick={closeModal}>
                설정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}