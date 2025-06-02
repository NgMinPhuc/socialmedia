import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { postApi } from '@/services';
import Avatar from '@/ui/Avatar';
import Button from '@/ui/Button';

const Post = ({ post, onLikeUpdate }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [comment, setComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLikeClick = async () => {
    try {
      if (isLiked) {
        await postApi.unlikePost(post.id);
        setLikesCount(prev => prev - 1);
      } else {
        await postApi.likePost(post.id);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
      onLikeUpdate?.();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      // Nếu muốn mock comment, có thể thêm vào post.comments ở FE
      // await postApi.commentOnPost(post.id, comment); // Nếu có hàm này trong mock
      setComment('');
      setIsCommenting(false);
      // Có thể trigger refresh comments nếu cần
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fix lỗi Invalid time value
  let timeAgo = '';
  if (post.createdAt) {
    const date = new Date(post.createdAt);
    if (!isNaN(date)) {
      timeAgo = formatDistanceToNow(date, { addSuffix: true });
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* Post Header */}
      <div className="flex items-center space-x-3 mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <Avatar src={post.author.avatar} alt={post.author.name} />
        </Link>
        <div>
          <Link 
            to={`/profile/${post.author.username}`}
            className="font-medium hover:underline"
          >
            {post.author.name}
          </Link>
          <p className="text-sm text-gray-500">
            {timeAgo}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mb-4">{post.content}</p>
      
      {post.image && (
        <img 
          src={post.image} 
          alt="Post content" 
          className="rounded-lg w-full mb-4 object-cover max-h-96"
        />
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <button
          onClick={handleLikeClick}
          className={`flex items-center space-x-2 ${
            isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          {isLiked ? (
            <HeartIconSolid className="h-6 w-6" />
          ) : (
            <HeartIcon className="h-6 w-6" />
          )}
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => setIsCommenting(!isCommenting)}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
        >
          <ChatBubbleLeftIcon className="h-6 w-6" />
          <span>{post.commentsCount || 0}</span>
        </button>

        <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
          <ShareIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Comment Form */}
      {isCommenting && (
        <form onSubmit={handleSubmitComment} className="mt-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loading}
              disabled={loading || !comment.trim()}
            >
              Post
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Post;
