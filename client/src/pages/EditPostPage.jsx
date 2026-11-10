import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { AuthContext } from '../context/authContext';
import { getPostById, updatePost } from '../services/api';
import './AuthPages.css';

const EditPostPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);

        if (data.user?._id !== user.id && data.user !== user.id) {
          navigate('/');
          return;
        }

        setPost(data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.msg || 'Unable to load this post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const handleUpdatePost = async (title, body) => {
    try {
      setSubmitting(true);
      setError('');
      await updatePost(id, title, body);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Unable to update this post right now.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container loading">Loading post...</div>;
  if (!post) return <div className="container error"><p>{error || 'Post not found.'}</p></div>;

  return (
    <div className="auth-page">
      <PostForm
        mode="edit"
        initialData={post}
        onSubmit={handleUpdatePost}
        onCancel={() => navigate(`/posts/${id}`)}
        loading={submitting}
        submitError={error}
      />
    </div>
  );
};

export default EditPostPage;
