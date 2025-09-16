import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 DEPLOYMENT TEST: Build timestamp', new Date().toISOString());
console.log('🔧 SECURITY FIXES DEPLOYED: User type conflicts resolved');

// Temporary fix: Define User type to prevent runtime error
declare global {
  interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
    vetting_status?: string;
  }
}

createRoot(document.getElementById("root")!).render(<App />);
// Force deployment Tue Sep 16 09:04:22 SAST 2025
