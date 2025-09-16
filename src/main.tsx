import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 DEPLOYMENT TEST: Build timestamp', new Date().toISOString());
console.log('🔧 SECURITY FIXES DEPLOYED: User type conflicts resolved');


createRoot(document.getElementById("root")!).render(<App />);
// Force deployment Tue Sep 16 09:04:22 SAST 2025
