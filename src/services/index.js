// Export all services directly
export { default as authService } from './authService';
export { default as userService } from './userApi';
export { default as postService } from './postApi';
export { default as searchService } from './searchApi';
export { default as notificationService } from './notificationApi';
export { default as chatService } from './chatService';

// Backward compatibility exports
export { default as userApi } from './userApi';
export { default as postApi } from './postApi';
export { default as searchApi } from './searchApi';
export { default as notificationApi } from './notificationApi';
