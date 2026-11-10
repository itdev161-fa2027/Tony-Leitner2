import { useEffect, useState } from 'react';
import './PostForm.css';

const PostForm = ({ mode, initialData, onSubmit, onCancel, loading, submitError }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    body: initialData?.body || ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        body: initialData.body || ''
      });
    }
  }, [initialData]);

  const { title, body } = formData;

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!body.trim()) {
      newErrors.body = 'Body is required';
    } else if (body.trim().length < 10) {
      newErrors.body = 'Body must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    await onSubmit(title.trim(), body.trim());
  };

  return (
    <div className="post-form">
      <h2>{mode === 'create' ? 'Create New Post' : 'Edit Post'}</h2>
      {submitError && <div className="form-error">{submitError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="post-title">Title</label>
          <input
            id="post-title"
            type="text"
            name="title"
            value={title}
            onChange={onChange}
            className={errors.title ? 'input-error' : ''}
            placeholder="Enter post title"
            disabled={loading}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body">Body</label>
          <textarea
            id="post-body"
            name="body"
            value={body}
            onChange={onChange}
            className={errors.body ? 'input-error' : ''}
            placeholder="Write your post content here..."
            rows="12"
            disabled={loading}
          />
          {errors.body && <span className="field-error">{errors.body}</span>}
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (mode === 'create' ? 'Creating...' : 'Saving...') : (mode === 'create' ? 'Create Post' : 'Save Changes')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
