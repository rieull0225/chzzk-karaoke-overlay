import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { cleanupOldStreams } from './lib/supabase'

// 앱 시작 시 2일 이상 된 데이터 정리
cleanupOldStreams();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
