import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Global User type to resolve ProfileEdit runtime references
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
