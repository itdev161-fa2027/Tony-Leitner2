import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { deletePost, getPostById } from '../services/api';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);
        setPost(data);
        setError(null);
      } catch (err) {
        setError('Failed to load post. It may not exist or the server is down.');
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchPost();
  }, [id]);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const isOwner = user && post && (post.user?._id === user.id || post.user === user.id);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;

    try {
      setDeleting(true);
      await deletePost(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete the post. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="container loading">Loading post...</div>;
  if (error) return <div className="container error"><p>{error}</p><button onClick={() => navigate('/')} className="back-button">{'\u2190'} Back to Home</button></div>;
  if (!post) return <div className="container error">Post not found.</div>;

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="back-button">{'\u2190'} Back to Posts</button>
      <article className="post-detail">
        <h1>{post.title}</h1>
        <div className="post-detail-meta">
          <span className="post-detail-author">By {post.user?.name || 'Unknown'}</span>
          <span className="post-detail-date">{formatDate(post.createDate)}</span>
        </div>

        {isOwner && (
          <div className="post-actions">
            <button onClick={() => navigate(`/posts/${id}/edit`)} className="edit-button">Edit</button>
            <button onClick={handleDelete} className="delete-button" disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}

        <div className="post-detail-body">
          {post.body.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
