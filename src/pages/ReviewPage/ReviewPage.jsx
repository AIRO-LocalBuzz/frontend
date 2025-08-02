import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './ReviewPage.css'; // ReviewPage 전용 CSS 파일
import Statusbar from '../../components/statusBar';

export default function ReviewPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    setPosts(savedPosts);
  }, []);

  const handlePostClick = (post) => {
    // 클릭된 게시물의 상세 페이지로 이동
    navigate(`/detail/${post.id}`, { state: post });
  };

  const handleEdit = (post) => {
    // 수정 페이지로 이동
    navigate(`/write?id=${post.id}`);
  };

  const handleDelete = (postId) => {
    // 삭제 로직
    const updatedPosts = posts.filter(post => post.id !== postId);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };


  return (
    <div className="review-page">
      <Statusbar />
      <header className="review-header">
        <h2>리뷰 모아보기</h2>
        <button onClick={() => navigate('/write?new=true')}>새 글 쓰기</button>
      </header>

      <div className="post-list-container">
        <div className="post-list">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="post-item" onClick={() => handlePostClick(post)}>
                <div className="post-thumbnail">
                  {post.selectedPhotos && post.selectedPhotos.length > 0 && (
                    <img src={post.selectedPhotos[0]} alt="thumbnail" />
                  )}
                </div>
                <div className="post-details">
                  <h3>{post.placeVisited || '장소 정보 없음'}</h3>
                  <p className="post-content-preview">{post.content.substring(0, 50)}...</p>
                  <div className="post-meta-preview">
                    <span>#{post.companions}</span>
                    <span>#{post.emotions}</span>
                  </div>
                </div>

                {/* 수정/삭제 버튼 추가 */}
                <div className="post-actions">
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(post); }}>수정</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}>삭제</button>
                </div>
              </div>
            ))
          ) : (
            <p>아직 작성된 글이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}