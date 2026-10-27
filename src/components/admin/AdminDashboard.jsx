import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const EMPTY_STATS = {
  totalRevenue: 0,
  revenueGrowth: 0,
  totalOrders: 0,
  ordersGrowth: 0,
  totalProducts: 0,
  avgOrderValue: 0,
  avgOrderGrowth: 0,
  pendingOrders: 0,
  shippedOrders: 0,
  deliveredOrders: 0,
};

const StatCard = ({ icon, label, value, sub, subPositive = true }) => (
  <div className="bg-white border border-[#d1c5b4]/40 p-5 flex flex-col gap-3 regal-shadow hover:border-[#c5a059] transition-all">
    <div className="flex items-center justify-between">
      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#7f7667]">{label}</span>
      <div className="w-9 h-9 flex items-center justify-center border border-[#c5a059]/30 bg-[#c5a059]/8 text-[#775a19]">
        {icon}
      </div>
    </div>
    <div>
      <p className="font-serif text-3xl text-[#1a1c1b] font-normal">{value}</p>
      {sub && (
        <p className={`font-sans text-[10px] mt-1 flex items-center gap-1 ${subPositive ? 'text-emerald-600' : 'text-red-500'}`}>
          <span>{subPositive ? '▲' : '▼'}</span>
          <span>{sub}</span>
        </p>
      )}
    </div>
  </div>
);

const RevenueBar = ({ month, revenue, orders, maxRevenue }) => {
  const pct = Math.max(10, Math.round(((revenue || 0) / (maxRevenue || 1)) * 100));
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <span className="font-sans text-[9px] text-[#7f7667]">${((revenue || 0) / 1000).toFixed(0)}k</span>
      <div className="w-full bg-[#f4f4f2] relative" style={{ height: '100px' }}>
        <div
          className="absolute bottom-0 w-full bg-gradient-to-t from-[#775a19] to-[#c5a059] transition-all duration-700"
          style={{ height: `${pct}%` }}
        />
      </div>
      <span className="font-sans text-[10px] uppercase tracking-wider text-[#4e4639]">{month}</span>
      <span className="font-sans text-[9px] text-[#7f7667]">{orders || 0} orders</span>
    </div>
  );
};

const STATUS_CONFIG = {
  delivered: { label: 'Delivered', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  shipped:   { label: 'Shipped',   bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
  processing:{ label: 'Processing',bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [monthlyRev, setMonthlyRev] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [syncedWithBackend, setSyncedWithBackend] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const res = await api.getDashboardStats();
        if (isMounted && res.success && res.data) {
          if (res.data.stats) setStats(res.data.stats);
          if (Array.isArray(res.data.monthlyRevenue)) setMonthlyRev(res.data.monthlyRevenue);
          if (Array.isArray(res.data.recentOrders)) setRecentOrders(res.data.recentOrders);
          setSyncedWithBackend(true);
        }
      } catch (err) {
        if (isMounted) setLoadError(`Could not load live dashboard data: ${err.message}`);
      }
    };
    fetchDashboard();
    const intervalId = window.setInterval(fetchDashboard, 15000);
    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const s = stats;
  const maxRev = Math.max(...monthlyRev.map(m => m.revenue || 0), 1000);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">

      {/* Page Title */}
      <div>
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-2xl text-[#1a1c1b]">Dashboard Overview</h2>
          {syncedWithBackend ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-sans bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Backend
            </span>
          ) : null}
        </div>
        <p className="font-sans text-xs text-[#7f7667] mt-1">Live Store Performance & Order Real-time Data</p>
        {loadError && <p role="alert" className="mt-2 text-sm text-red-700">{loadError}</p>}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
          label="Total Revenue"
          value={`$${(s.totalRevenue || 0).toLocaleString()}`}
          sub={`${s.revenueGrowth || 0}% vs last month`}
          subPositive={true}
        />
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/></svg>}
          label="Total Orders"
          value={s.totalOrders || 0}
          sub={`${s.ordersGrowth || 0}% vs last month`}
          subPositive={true}
        />
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"/></svg>}
          label="Avg Order Value"
          value={`$${(s.avgOrderValue || 0).toLocaleString()}`}
          sub={`${s.avgOrderGrowth || 0}% vs last month`}
          subPositive={true}
        />
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>}
          label="Active Products"
          value={s.totalProducts || 0}
          sub="Stored in database"
          subPositive={true}
        />
      </div>

      {/* Order Status Strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 p-4 text-center">
          <p className="font-serif text-3xl text-amber-700">{s.pendingOrders || 0}</p>
          <p className="font-sans text-[10px] uppercase tracking-widest text-amber-600 mt-1">Processing</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-4 text-center">
          <p className="font-serif text-3xl text-blue-700">{s.shippedOrders || 0}</p>
          <p className="font-sans text-[10px] uppercase tracking-widest text-blue-600 mt-1">Shipped</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-4 text-center">
          <p className="font-serif text-3xl text-emerald-700">{s.deliveredOrders || 0}</p>
          <p className="font-sans text-[10px] uppercase tracking-widest text-emerald-600 mt-1">Delivered</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-[#d1c5b4]/40 p-6 regal-shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif text-lg text-[#1a1c1b]">Revenue Trend</h3>
            <p className="font-sans text-[10px] text-[#7f7667]">Last 6 months</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-sans text-[10px] text-[#7f7667]">
              <span className="w-3 h-3 bg-gradient-to-t from-[#775a19] to-[#c5a059] inline-block"></span>
              Revenue
            </span>
          </div>
        </div>
        <div className="flex items-end gap-3">
          {monthlyRev.length > 0
            ? monthlyRev.map((m) => <RevenueBar key={m.month} {...m} maxRevenue={maxRev} />)
            : <p className="w-full py-8 text-center font-sans text-sm text-[#7f7667]">No order activity yet.</p>}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-[#d1c5b4]/40 regal-shadow">
        <div className="p-5 border-b border-[#d1c5b4]/30 flex items-center justify-between">
          <h3 className="font-serif text-lg text-[#1a1c1b]">Recent Acquisitions</h3>
          <span className="font-sans text-[10px] uppercase tracking-widest text-[#775a19]">Latest Orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f9f9f7] border-b border-[#d1c5b4]/30">
              <tr>
                {['Order ID','Client','Location','Total','Status','Date'].map(h => (
                  <th key={h} className="px-5 py-3 font-sans text-[9px] uppercase tracking-[0.18em] text-[#7f7667]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length ? recentOrders.map((order, i) => {
                const st = STATUS_CONFIG[order.status] || STATUS_CONFIG.processing;
                return (
                  <tr key={order.id} className={`border-b border-[#d1c5b4]/20 ${i % 2 === 0 ? '' : 'bg-[#f9f9f7]/50'} hover:bg-[#ffdea5]/10 transition-colors`}>
                    <td className="px-5 py-3.5 font-sans text-xs text-[#775a19] font-semibold">{order.id}</td>
                    <td className="px-5 py-3.5 font-serif text-sm text-[#1a1c1b]">{order.customer}</td>
                    <td className="px-5 py-3.5 font-sans text-xs text-[#7f7667]">{order.location || 'Online Order'}</td>
                    <td className="px-5 py-3.5 font-serif text-sm text-[#1a1c1b]">${(order.total || 0).toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-sans font-semibold border ${st.bg} ${st.text} ${st.border}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-sans text-xs text-[#7f7667]">{order.date}</td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center font-sans text-sm text-[#7f7667]">
                    No website orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
