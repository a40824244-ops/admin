import { useState } from 'react';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminDeals from './admin/AdminDeals';

const NAV_ITEMS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    key: 'products',
    label: 'Products',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M20 7H4a1 1 0 00-1 1v11a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1z" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'orders',
    label: 'Orders',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'deals',
    label: 'Deals',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const PAGE_COMPONENTS = {
  dashboard: <AdminDashboard />,
  products: <AdminProducts />,
  orders: <AdminOrders />,
  deals: <AdminDeals />,
};

export default function AdminPanel({ onExit }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: '#f5f0e8' }}>
      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-30 flex flex-col h-full transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-0 md:w-16'} overflow-hidden`}
        style={{ background: '#1a1c1b', minHeight: '100vh' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: '#2e3130' }}>
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ border: '1px solid #c5a059' }}>
            <span style={{ color: '#c5a059', fontFamily: 'Playfair Display, serif', fontSize: '14px', fontWeight: 700 }}>A</span>
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ color: '#dfba67', fontFamily: 'Playfair Display, serif', fontSize: '15px', fontWeight: 700, letterSpacing: '0.1em' }}>
                AUREX
              </div>
              <div style={{ color: '#888', fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.15em' }}>
                ADMIN PANEL
              </div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { setActivePage(item.key); if (window.innerWidth < 768) setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-5 py-3.5 transition-all text-left ${sidebarOpen ? '' : 'justify-center'}`}
                style={{
                  background: isActive ? 'rgba(197,160,89,0.12)' : 'transparent',
                  borderLeft: isActive ? '2px solid #c5a059' : '2px solid transparent',
                  color: isActive ? '#dfba67' : '#9ca3af',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.05em',
                }}
              >
                <span className="flex-shrink-0" style={{ color: isActive ? '#c5a059' : '#6b7280' }}>
                  {item.icon}
                </span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Exit Button */}
        {sidebarOpen && (
          <div className="p-4 border-t" style={{ borderColor: '#2e3130' }}>
            <button
              onClick={onExit}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-opacity hover:opacity-80"
              style={{
                background: 'rgba(220,38,38,0.1)',
                color: '#f87171',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                border: '1px solid rgba(248,113,113,0.3)',
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              EXIT ADMIN
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center gap-4 px-5 py-4 border-b flex-shrink-0" style={{ background: '#fff', borderColor: '#e0d5c5' }}>
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1.5 hover:bg-amber-50 transition-colors"
            style={{ color: '#775a19' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>

          {/* Breadcrumb */}
          <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <span className="text-xs" style={{ color: '#aaa' }}>AUREX Admin /</span>
            <span className="text-xs ml-1 font-semibold" style={{ color: '#775a19' }}>
              {NAV_ITEMS.find((n) => n.key === activePage)?.label}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 flex items-center justify-center" style={{ background: '#1a1c1b', border: '1px solid #c5a059' }}>
                <span style={{ color: '#c5a059', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700 }}>AD</span>
              </div>
              <span className="text-xs" style={{ fontFamily: 'Montserrat, sans-serif', color: '#666' }}>Admin</span>
            </div>
            <button
              onClick={onExit}
              className="sm:hidden text-xs px-3 py-1.5 border"
              style={{ borderColor: '#f87171', color: '#dc2626', fontFamily: 'Montserrat, sans-serif' }}
            >
              EXIT
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto" style={{ background: '#f9f9f7' }}>
          {PAGE_COMPONENTS[activePage]}
        </main>
      </div>
    </div>
  );
}
