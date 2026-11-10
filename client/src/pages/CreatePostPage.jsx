import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { AuthContext } from '../context/authContext';
import { createPost } from '../services/api';
import './AuthPages.css';

const CreatePostPage = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const handleCreatePost = async (title, body) => {
    try {
      setLoading(true);
      setError('');
      await createPost(title, body);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Unable to create your post right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <PostForm
        mode="create"
        onSubmit={handleCreatePost}
        onCancel={() => navigate('/')}
        loading={loading}
        submitError={error}
      />
    </div>
  );
};

export default CreatePostPage;
