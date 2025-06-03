// Reset localStorage khi start lại FE (chỉ 1 lần mỗi lần start server)
if (!sessionStorage.getItem('localStorageReset')) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.setItem('localStorageReset', 'true');
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
