import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ChatBubbleLeftIcon, ShareIcon } from '@heroicons/react/24/outline';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/contexts/AuthContext';
import Avatar from '@/ui/Avatar';
import Button from '@/ui/Button';

const Post = ({ post, onUpdate }) => {
  const { createComment } = usePosts();
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    setLoading(true);
    try {
      await createComment({
        postId: post.postId || post.id,
        userId: user, // user is the username or user ID
        content: comment
      });
      setComment('');
      setIsCommenting(false);
      onUpdate?.(); // Refresh the post data
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* Post Header */}
      <div className="flex items-center space-x-3 mb-4">
        <Link to={`/profile/${post.userId}`}>
          <Avatar src={post.author?.avatar} alt={post.author?.name || post.userId} />
        </Link>
        <div>
          <Link 
            to={`/profile/${post.userId}`}
            className="font-medium hover:underline"
          >
            {post.author?.name || post.userId}
          </Link>
          <p className="text-sm text-gray-500">
            {post.createdAt ? 
              formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) :
              'Just now'
            }
          </p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mb-4">{post.caption}</p>
      
      {post.files && post.files.length > 0 && (
        <img 
          src={post.files[0]} 
          alt="Post content" 
          className="rounded-lg w-full mb-4 object-cover max-h-96"
        />
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <button
          onClick={() => setIsCommenting(!isCommenting)}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
        >
          <ChatBubbleLeftIcon className="h-6 w-6" />
          <span>{post.commentsCount || 0}</span>
        </button>

        <div className="flex items-center space-x-2 text-gray-500">
          <span>❤️ {post.likesCount || 0}</span>
        </div>

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
