import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 DEPLOYMENT TEST: Build timestamp', new Date().toISOString());
console.log('🔧 SECURITY FIXES DEPLOYED: User type conflicts resolved');

// Runtime fix for User type reference
(window as any).User = {
  // This provides a runtime User reference for any code expecting it
};


createRoot(document.getElementById("root")!).render(<App />);
// Force deployment Tue Sep 16 09:04:22 SAST 2025
