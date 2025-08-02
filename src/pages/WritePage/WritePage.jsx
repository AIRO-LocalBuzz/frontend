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

  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [category, setCategory] = useState('');
  const [placeVisited, setPlaceVisited] = useState('');
  const [companions, setCompanions] = useState('');
  const [emotions, setEmotions] = useState('');
  
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

  // 이 useEffect를 통합하고 로딩 순서를 변경했습니다.
  // 1. 새 위치 정보가 있으면 최우선으로 반영
  // 2. 아니면 기존 게시물 로드
  // 3. 아니면 새 글쓰기 모드 초기화
  // 4. 아니면 초안(draft) 로드
  useEffect(() => {
    // 1. 검색 페이지에서 돌아온 경우, location.state의 위치 정보를 우선 반영
    //    그리고 history state를 정리하여 뒤로가기 시 중복 업데이트를 막습니다.
    if (location.state && location.state.selectedPlace) {
      setPlaceVisited(location.state.selectedPlace);
      window.history.replaceState({}, document.title, location.pathname);
      return; // 여기서 함수를 종료하여 아래의 localStorage 로직을 실행하지 않음
    }

    // 2. 수정 모드일 경우 (postId가 있을 때)
    if (postId) {
      const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
      const postToEdit = savedPosts.find(p => p.id === Number(postId));

      if (postToEdit) {
        setContent(postToEdit.content || '');
        setCategory(postToEdit.category || '');
        setDate(postToEdit.date || '');
        setPlaceVisited(postToEdit.placeVisited || ''); // localStorage에서 저장된 위치값 로드
        setCompanions(postToEdit.companions || '');
        setEmotions(postToEdit.emotions || '');
        setSelectedPhotos(postToEdit.selectedPhotos || []);
      } else {
        navigate('/write?new=true');
      }
    }
    // 3. 새 글쓰기 모드일 경우
    else if (isNewWrite) {
      setContent('');
      setCategory('');
      setDate('');
      setPlaceVisited('');
      setCompanions('');
      setEmotions('');
      setSelectedDate(null);
      localStorage.removeItem('writeDraft');
      resetPhotos();
    }
    // 4. 기존 초안(draft) 로드
    else {
      const saved = localStorage.getItem('writeDraft');
      if (saved) {
        const parsed = JSON.parse(saved);
        setContent(parsed.content || '');
        setCategory(parsed.category || '');
        setDate(parsed.date || '');
        setPlaceVisited(parsed.placeVisited || '');
        setCompanions(parsed.companions || '');
        setEmotions(parsed.emotions || '');
      }
    }
  }, [postId, isNewWrite, navigate, location.search, location.state]);

  // date 값 변경 시 selectedDate 동기화
  useEffect(() => {
    if (date) {
      const parsed = new Date(date)
      if (!isNaN(parsed.getTime())) {
        setSelectedDate(parsed)
      }
    }
  }, [date])

  // 값이 바뀔 때마다 localStorage에 저장
  useEffect(() => {
    const allEmpty = !content && !category && !date && !placeVisited && !companions && !emotions
    if (allEmpty) return

    const draft = { content, category, date, placeVisited, companions, emotions }
    localStorage.setItem('writeDraft', JSON.stringify(draft))
  }, [content, category, date, placeVisited, companions, emotions])
  
  // 날짜 포맷 함수 추가
  const formatFullDate = (dateObj) => {
    if (!dateObj || isNaN(dateObj.getTime())) return ''
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth() + 1
    const date = dateObj.getDate()
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()]
    return `${year-2000}년 ${month}월 ${date}일 ${weekday}요일`
  }

  function formatDateToLocalISO(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [modalOpen, setModalOpen] = useState(null)
  const [customCategory, setCustomCategory] = useState('');

  const isActive = content && category && date && placeVisited

  const closeModal = () => {
    if (modalOpen === 'category' && customCategory) {
      setCategory('custom:' + customCategory);
    }
    setModalOpen(null);
  }

  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  // 게시 버튼 핸들러
  const handleSubmit = async () => {
    if (isActive && !loading) {
      setLoading(true);

      const processedPhotos = await Promise.all(
        selectedPhotos.map(file => {
          if (typeof file === 'string') {
            return file;
          }
          return resizeImage(file, 800, 800);
        })
      );

      const newPostId = postId ? Number(postId) : Date.now();

      const postData = {
        id: newPostId,
        content,
        category,
        date,
        placeVisited,
        companions,
        emotions,
        selectedPhotos: processedPhotos,
        selectedDate,
      };

      try {
        let savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
        if (postId) {
          savedPosts = savedPosts.map(post => post.id === Number(postId) ? postData : post);
        } else {
          savedPosts.push(postData);
        }
        localStorage.setItem('posts', JSON.stringify(savedPosts));
        localStorage.removeItem('writeDraft');
        
        navigate(`/detail/${newPostId}`);
      } catch (e) {
        console.error('Failed to submit post:', e);
        alert('게시물 저장에 실패했습니다. 다시 시도해 주세요.');
      } finally {
        setLoading(false);
      }
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
        <div className="row date-placeVisited-row">
          <button
            type="button"
            className="input-button date-button"
            onClick={() => setModalOpen('date')}
          >
          <div className="label-group">
            <span className="label">날짜</span>
            <img src={iconPrev} alt="아래 화살표" className="icon-arrow-down" />
          </div>
            
            <span className="date-select">{formatFullDate(selectedDate)}</span>
          </button>

          <div className="placeVisited-container">
            <button
              type="button"
              className="input-button placeVisited-button"
              onClick={() => navigate('/search', { state: { fromWrite: true, postId: postId } })}
            >
              <span className="placeVisited-text">{placeVisited || '위치'}</span>
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
                className={`tag-button ${companions === tag ? 'selected' : ''}`}
                onClick={() => setCompanions(tag)}
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
                className={`tag-button ${emotions === tag ? 'selected' : ''}`}
                onClick={() => setEmotions(tag)}
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
                    {selectedDate ? (
                      <>
                        <span className="year">{selectedDate.getFullYear()}년</span>
                        <span className="month">{selectedDate.getMonth() + 1}월</span>
                        <span className="date">{selectedDate.getDate()}일</span>
                      </>
                    ) : (
                      <span>선택된 날짜가 없습니다</span>
                    )}
                  </div>

                  {/* 실제 달력 라이브러리 */}
                  <ReactCalendar
                    onChange={(value) => {
                      setSelectedDate(value)
                      setDate(formatDateToLocalISO(value))
                    }}
                    value={selectedDate || new Date()}
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
                    className={`modal-category-item ${
                      category === opt.value ? 'selected' : ''
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
                        className="modal-input-placeVisited full-width"
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
  )
}
