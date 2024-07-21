import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from './Context/AuthContext.tsx'
import { SocketProvider } from './Context/SocketContext.tsx'
import { TimeProvider } from './Context/TimeContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <SocketProvider>
      <AuthProvider>
        <TimeProvider>
        <App />
        </TimeProvider>
      </AuthProvider>
    </SocketProvider>
  </BrowserRouter>
)
