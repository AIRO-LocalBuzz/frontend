import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './ReviewPage.css'; // ReviewPage 전용 CSS 파일

export default function ReviewPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // // API에서 게시물 리스트를 가져오는 함수
  // const fetchPosts = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     // API의 모든 게시물을 가져오는 GET 요청
  //     const response = await fetch('https://airo-buzz.shop/api/posts');
  //     if (!response.ok) {
  //       throw new Error('게시물 목록을 불러오는 데 실패했습니다.');
  //     }
  //     const data = await response.json();
  //     setPosts(data); // API에서 받은 데이터로 상태 업데이트
  //   } catch (err) {
  //     console.error("Error fetching posts:", err);
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // 컴포넌트가 마운트될 때 게시물 리스트를 가져옵니다.
  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  const handlePostClick = (post) => {
    // 클릭된 게시물의 상세 페이지로 이동
    navigate(`/detail/${post.id}`, { state: post });
  };

  const handleEdit = (post) => {
    // 수정 페이지로 이동
    navigate(`/write?id=${post.id}`);
  };

  // API를 통해 게시물을 삭제하는 함수
  const handleDelete = async (postId) => {
    if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      try {
        // 특정 게시물을 삭제하는 DELETE 요청
        const response = await (`https://airo-buzz.shop/api/posts/${postId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('게시물 삭제에 실패했습니다.');
        }

        // 성공적으로 삭제되면 게시물 리스트를 다시 불러옵니다.
        // 또는, 현재 posts 상태에서 해당 게시물만 제거하여 UI를 업데이트할 수도 있습니다.
        setPosts(posts.filter(post => post.id !== postId));
        alert('게시물이 성공적으로 삭제되었습니다.');
      } catch (err) {
        console.error("Error deleting post:", err);
        alert(err.message);
      }
    }
  };

  // 로딩 상태 및 오류 메시지 UI
  if (loading) {
    return <div className="review-page">게시물을 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="review-page">오류: {error}</div>;
  }

  return (
    <div className="review-page">
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
                  {/* API 응답 필드명에 맞게 post.images[0]으로 변경 */}
                  {post.images && post.images.length > 0 && (
                    <img src={post.images[0]} alt="thumbnail" />
                  )}
                </div>
                <div className="post-details">
                  <h3>{post.adress || '장소 정보 없음'}</h3>
                  <p className="post-content-preview">{post.content.substring(0, 50)}...</p>
                  <div className="post-meta-preview">
                    {/* API 필드명에 맞게 변경 */}
                    <span>#{post.withWhoTag}</span>
                    <span>#{post.emotionTags}</span>
                  </div>
                </div>

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