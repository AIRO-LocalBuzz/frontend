import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './ReviewPage.css'; // ReviewPage 전용 CSS 파일
import Statusbar from '../../components/statusBar';

export default function ReviewPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API에서 게시물 리스트를 가져오는 함수
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiaWF0IjoxNzU0MTYwNjY1LCJleHAiOjE3NTQxNjQyNjV9.k6UCh2FRWdGioDN4uM8qikIYc54bjVxDd4JxWUNieW0';
      if (!accessToken) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }
      
      const response = await fetch('https://airo-buzz.shop/api/v1/posts', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('게시물 목록을 불러오는 데 실패했습니다.');
      }
      const data = await response.json();
      setPosts(data.content);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostClick = (post) => {
    navigate(`/detail/${post.id}`, { state: post });
  };

  const handleEdit = (post, e) => {
    e.stopPropagation();
    navigate(`/write?id=${post.id}`);
  };

  const handleDelete = async (postId, e) => {
    e.stopPropagation();
    if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      try {
        const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiaWF0IjoxNzU0MTYwNjY1LCJleHAiOjE3NTQxNjQyNjV9.k6UCh2FRWdGioDN4uM8qikIYc54bjVxDd4JxWUNieW0';
        if (!accessToken) {
          alert('로그인이 필요합니다.');
          navigate('/login');
          return;
        }

        const response = await fetch(`https://airo-buzz.shop/api/v1/posts/${postId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('게시물 삭제에 실패했습니다.');
        }

        setPosts(posts.filter(post => post.id !== postId));
        alert('게시물이 성공적으로 삭제되었습니다.');
      } catch (err) {
        console.error("Error deleting post:", err);
        alert(err.message);
      }
    }
  };

  if (loading) {
    return <div className="review-page">게시물을 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="review-page">오류: {error}</div>;
  }
  
  return (
    <div className="review-page">
      <Statusbar />
      <header className="review-header">
        <h2>리뷰 모아보기</h2>
        <button onClick={() => navigate('/write?new=true')} className="btn-write">
          새 글 쓰기
        </button>
      </header>

      <div className="post-list-container">
        <div className="post-list">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="post-item" onClick={() => handlePostClick(post)}>
                <div className="post-thumbnail">
                  {post.images && post.images.length > 0 && (
                    <img src={post.images[0]} alt="thumbnail" />
                  )}
                </div>
                <div className="post-details">
                  <h3>{post.adress || '장소 정보 없음'}</h3>
                  <p className="post-content-preview">{post.content?.substring(0, 50)}...</p>
                  <div className="post-meta-preview">
                    <span>#{post.withWhoTag}</span>
                    <span>#{post.emotionTags}</span>
                  </div>
                </div>

                <div className="post-actions">
                  <button onClick={(e) => handleEdit(post, e)} className="btn-edit">
                    수정
                  </button>
                  <button onClick={(e) => handleDelete(post.id, e)} className="btn-delete">
                    삭제
                  </button>
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