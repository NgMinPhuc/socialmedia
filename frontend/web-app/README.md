# Social Media Application

A modern, full-featured social media platform built with React, TypeScript, and Tailwind CSS. This application provides a complete social networking experience with real-time messaging, post sharing, user interactions, and more.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NgMinPhuc/socialmedia.git
   cd socialmedia
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The application will automatically reload when you make changes

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

## 🏗️ Project Structure

```
social-media/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Feed/         # Feed-related components
│   │   ├── Navbar/       # Navigation components
│   │   ├── Post/         # Post-related components
│   │   ├── Sidebar/      # Sidebar components
│   │   └── Loading/      # Loading components
│   ├── pages/            # Page components
│   │   ├── Auth/         # Authentication pages
│   │   ├── Profile/      # User profile pages
│   │   ├── Search/       # Search functionality
│   │   ├── Messages/     # Chat/messaging
│   │   ├── Notifications/ # Notifications
│   │   └── Settings/     # User settings
│   ├── layout/           # Layout components
│   │   ├── AuthLayout.jsx    # Layout for auth pages
│   │   └── MainLayout.jsx    # Main app layout
│   ├── contexts/         # React Context providers
│   │   └── AuthContext.jsx   # Authentication state
│   ├── hooks/            # Custom React hooks
│   │   ├── usePosts.js   # Posts management
│   │   └── useUsers.js   # User management
│   ├── services/         # API services
│   │   ├── authService.js    # Authentication API
│   │   ├── postApi.js        # Posts API
│   │   ├── userApi.js        # Users API
│   │   ├── chatApi.js        # Chat/messaging API
│   │   ├── searchApi.js      # Search API
│   │   ├── notificationApi.js # Notifications API
│   │   └── axiosConfig.js    # HTTP client configuration
│   ├── ui/               # UI components
│   │   ├── Button.jsx    # Button component
│   │   └── Input.jsx     # Input component
│   ├── App.jsx           # Root component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── .vscode/              # VS Code configuration
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md            # This file
```

## ✨ Features

### 🔐 Authentication System
- User registration and login
- Password reset functionality
- Protected routes
- Persistent authentication state

### 👤 User Management
- User profiles with customizable information
- Follow/unfollow functionality
- User search and discovery
- Profile picture and banner uploads

### 📝 Posts & Content
- Create posts with text and media
- Like and comment on posts
- Share posts
- Real-time feed updates
- Media upload support (images, videos)

### 💬 Messaging System
- Real-time chat functionality
- Private messaging
- Message history
- Online status indicators

### 🔍 Search & Discovery
- Search for users and posts
- Advanced filtering options
- Trending content
- Hashtag support

### 🔔 Notifications
- Real-time notifications
- Different notification types (likes, comments, follows, messages)
- Mark as read functionality
- Notification preferences

### ⚙️ Settings & Preferences
- Account settings
- Privacy controls
- Notification preferences
- Theme customization

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

### State Management
- **React Context API** - Global state management
- **Custom hooks** - Reusable state logic

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **VS Code** - Recommended IDE with configured settings

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_WEBSOCKET_URL=ws://localhost:8080
```

### VS Code Setup
The project includes VS Code configuration for optimal development experience:

- **Extensions**: Recommended extensions for React development
- **Settings**: Configured for Tailwind CSS and React
- **Debugging**: Launch configurations for debugging
- **Tasks**: Build and development tasks

## 🌐 API Integration

The application is designed to work with a REST API backend. Key endpoints include:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset

### Posts
- `GET /posts` - Get feed
- `POST /posts` - Create post
- `PUT /posts/:id/like` - Like/unlike post
- `POST /posts/:id/comments` - Add comment

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `POST /users/:id/follow` - Follow user
- `GET /users/search` - Search users

### Messages
- `GET /messages` - Get conversations
- `POST /messages` - Send message
- WebSocket connection for real-time messaging

## 📱 Mobile Responsiveness

The application is fully responsive and works well on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
The application is ready for deployment on platforms like:
- **Vercel** - Zero configuration deployment
- **Netlify** - Static site hosting
- **GitHub Pages** - Free hosting for static sites

## 🤝 Development Workflow

1. **Start development server**: `npm run dev`
2. **Make changes** to components in `/src`
3. **View changes** in browser (hot reload enabled)
4. **Run linting**: `npm run lint`
5. **Test build**: `npm run build`
6. **Commit changes** with clear commit messages

## 🐛 Troubleshooting

### Common Issues

**Port 3000 already in use**
```bash
# Kill process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3001
```

**Dependencies issues**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Build failures**
```bash
# Check for TypeScript errors
npm run build

# Fix linting issues
npm run lint --fix
```

### VS Code Issues
- Install recommended extensions
- Restart VS Code after installing extensions
- Check that TypeScript and ESLint extensions are working

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [Vite Documentation](https://vitejs.dev/guide)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/docs)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:
- Create an issue on GitHub
- Check the troubleshooting section above
- Review the documentation links provided

---

**Happy coding! 🎉**
