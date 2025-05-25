import { useState, useRef } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/ui/Button';
import Avatar from '@/ui/Avatar';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const { createPost } = usePosts();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setLoading(true);
    try {
      const formData = {
        content: content.trim(),
        image: image
      };
      
      await createPost(formData);
      setContent('');
      setImage(null);
      setImagePreview('');
      onPostCreated?.();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-4">
          <Avatar src={user?.avatar} alt={user?.name} />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="flex-1 resize-none border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            rows="3"
          />
        </div>

        {imagePreview && (
          <div className="mt-4 relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-96 rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-gray-900 bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <label className="cursor-pointer flex items-center space-x-2 text-gray-500 hover:text-blue-500">
            <PhotoIcon className="h-6 w-6" />
            <span>Add Photo</span>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <Button
            type="submit"
            loading={loading}
            disabled={loading || (!content.trim() && !image)}
          >
            Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
