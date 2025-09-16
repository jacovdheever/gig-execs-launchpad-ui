import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 DEPLOYMENT TEST: Build timestamp', new Date().toISOString());
console.log('🔧 SECURITY FIXES DEPLOYED: User type conflicts resolved');

// Global User type definition to resolve conflicts
declare global {
  interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
    vetting_status?: string;
    profile_photo_url?: string;
    headline?: string;
    profile_status?: string;
    status?: string;
    t_and_c_accepted?: boolean;
    profile_complete_pct?: number;
    last_login?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
  }
}

createRoot(document.getElementById("root")!).render(<App />);
// Force deployment Tue Sep 16 09:04:22 SAST 2025
