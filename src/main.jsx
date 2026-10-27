import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AdminLoginGate from './components/admin/AdminLoginGate.jsx';
import './index.css';

const storefrontUrl = import.meta.env.VITE_STOREFRONT_URL
  || 'https://aurex-two-delta.vercel.app';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminLoginGate onExit={() => window.location.assign(storefrontUrl)} />
  </StrictMode>,
);
