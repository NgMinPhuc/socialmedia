const Avatar = ({ src, alt, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex-shrink-0`}>
      {src ? (
        <img
          src={src}
          alt={alt || 'User avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500">
          {alt ? alt.charAt(0).toUpperCase() : 'U'}
        </div>
      )}
    </div>
  );
};

export default Avatar;
