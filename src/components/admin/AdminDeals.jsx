import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const EMPTY_DEAL = {
  id: '', name: '', type: '', volume: '', price: '', originalPrice: '', badge: '', subtitle: '', image: ''
};

function DealModal({ deal, onSave, onClose }) {
  const [form, setForm] = useState({ ...EMPTY_DEAL, ...deal });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleImageFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      set('image', uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="bg-white border w-full max-w-lg mx-auto p-6 max-h-[92vh] overflow-y-auto shadow-2xl" style={{ borderColor: '#c5a059' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5 border-b border-[#e0d5c5]/40 pb-3">
          <h3 className="text-lg font-semibold" style={{ fontFamily: 'Playfair Display, serif', color: '#1a1c1b' }}>
            {deal.id ? 'Edit Deal' : 'Add New Deal'}
          </h3>
          <button onClick={onClose} className="text-2xl cursor-pointer text-[#888] hover:text-[#1a1c1b]">×</button>
        </div>
        <div className="space-y-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {[
            ['Name', 'name', 'text', 'e.g. AUREX Flagship Trio'],
            ['Badge', 'badge', 'text', 'e.g. BEST SELLER / LIMITED DUO'],
            ['Type', 'type', 'text', 'e.g. PARFUM DUO or ATTAR SET'],
            ['Volume', 'volume', 'text', 'e.g. 2 x 50ml or 5 x 6ml'],
            ['Price (Rs.)', 'price', 'number', 'e.g. 2999'],
            ['Original Price (Rs.)', 'originalPrice', 'number', 'e.g. 3499'],
            ['Subtitle', 'subtitle', 'text', 'e.g. Handcrafted luxury coffret gift package...'],
          ].map(([label, key, type, placeholder]) => (
            <div key={key}>
              <label className="block text-xs font-medium mb-1" style={{ color: '#555' }}>{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key] || ''}
                onChange={(e) => set(key, e.target.value)}
                className="w-full px-3 py-2 text-xs border outline-none focus:border-[#775a19]"
                style={{ borderColor: '#e0d5c5', color: '#1a1c1b', background: '#faf9f7' }}
              />
            </div>
          ))}

          {/* Deal Image Upload */}
          <div className="pt-2">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1a1c1b' }}>
              Deal Image (Upload Photo)
            </label>
            <div className="border-2 border-dashed border-[#d1c5b4] hover:border-[#775a19] rounded-lg p-3 text-center bg-[#f9f9f7] transition-all">
              {form.image ? (
                <div className="flex items-center gap-3 text-left">
                  <img
                    src={form.image}
                    alt="Deal Preview"
                    className="w-16 h-16 object-cover rounded border border-[#c5a059] shrink-0 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1a1c1b] truncate">Deal Photo Selected</p>
                    <p className="text-[10px] text-[#7f7667] mb-2">Ready to save with deal offer</p>
                    <div className="flex gap-2">
                      <label className="px-2.5 py-1 bg-[#1a1c1b] text-[#dfba67] text-[10px] uppercase tracking-wider cursor-pointer hover:bg-[#775a19] transition-colors rounded">
                        Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => set('image', '')}
                        className="px-2.5 py-1 border border-red-300 text-red-600 hover:bg-red-50 text-[10px] uppercase tracking-wider cursor-pointer rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <svg className="w-7 h-7 mx-auto text-[#7f7667] mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-[#1a1c1b] font-medium mb-0.5">Click to choose image from your device</p>
                  <p className="text-[10px] text-[#7f7667] mb-2">Supports any image format (JPG, PNG, WEBP, GIF, SVG, etc.)</p>
                  <label className="inline-block px-3.5 py-1 bg-[#775a19] text-white text-[10px] uppercase tracking-wider cursor-pointer hover:bg-[#1a1c1b] transition-colors rounded">
                    Browse Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Or paste Image URL / Path (e.g. /images/products/deal.jpeg)"
                value={form.image || ''}
                onChange={(e) => set('image', e.target.value)}
                className="w-full px-3 py-1.5 text-xs border outline-none font-sans"
                style={{ borderColor: '#e0d5c5', color: '#1a1c1b', background: '#faf9f7' }}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6 border-t border-[#e0d5c5]/40 pt-4">
          <button
            onClick={() => onSave(form)}
            className="flex-1 py-2.5 text-xs font-semibold tracking-wider cursor-pointer hover:bg-[#775a19] transition-colors uppercase"
            style={{ background: '#1a1c1b', color: '#c5a059' }}
          >
            SAVE DEAL
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-semibold tracking-wider border cursor-pointer hover:bg-[#f9f9f7] transition-colors uppercase"
            style={{ borderColor: '#c5a059', color: '#775a19' }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDeals() {
  const [deals, setDeals] = useState([]);
  const [heroDeal, setHeroDeal] = useState({});
  const [modalDeal, setModalDeal] = useState(null);
  const [editingHero, setEditingHero] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [syncedWithBackend, setSyncedWithBackend] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const loadDeals = async () => {
      try {
        const res = await api.getDeals();
        if (isMounted && res.success) {
          if (res.data.hero) setHeroDeal(res.data.hero);
          if (Array.isArray(res.data.curated)) {
            setDeals(res.data.curated.map((d, i) => ({ ...d, _key: d.id || `deal-${i}` })));
          }
          setSyncedWithBackend(true);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      }
    };
    loadDeals();
    return () => { isMounted = false; };
  }, []);

  const savings = (orig, price) => {
    const o = parseFloat(orig), p = parseFloat(price);
    if (!o || !p || o <= p) return null;
    return Math.round(((o - p) / o) * 100);
  };

  const handleSaveDeal = async (form) => {
    const isEdit = form.id && deals.some((d) => d.id === form.id);
    const dealPayload = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice)
    };

    try {
      if (isEdit) {
        await api.updateDeal(form.id, dealPayload);
      } else {
        const res = await api.createDeal(dealPayload);
        if (res.success && res.data) {
          dealPayload.id = res.data.id;
        }
      }
    } catch (err) {
      setError(err.message);
      return;
    }

    if (form._key && deals.some((d) => d._key === form._key)) {
      setDeals((prev) => prev.map((d) => d._key === form._key ? { ...dealPayload, _key: form._key } : d));
    } else {
      setDeals((prev) => [...prev, { ...dealPayload, _key: dealPayload.id || `deal-${Date.now()}` }]);
    }
    setModalDeal(null);
  };

  const handleSaveHero = async (form) => {
    const heroPayload = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice)
    };
    try {
      await api.updateHeroDeal(heroPayload);
    } catch (err) {
      setError(err.message);
      return;
    }
    setHeroDeal(heroPayload);
    setEditingHero(false);
  };

  const handleDelete = async (key) => {
    const targetDeal = deals.find(d => d._key === key || d.id === key);
    if (targetDeal && targetDeal.id) {
      try {
        await api.deleteDeal(targetDeal.id);
      } catch (err) {
        setError(err.message);
        return;
      }
    }
    setDeals((prev) => prev.filter((d) => d._key !== key));
    setDeleteTarget(null);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Playfair Display, serif', color: '#1a1c1b' }}>
              Deals Management
            </h2>
            {syncedWithBackend ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-sans bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Backend Connected
              </span>
            ) : null}
          </div>
          {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
          <p className="text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif', color: '#888' }}>
            Manage featured deals and curated offers
          </p>
        </div>
        <button
          onClick={() => setModalDeal({ ...EMPTY_DEAL })}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold tracking-wider cursor-pointer"
          style={{ background: '#1a1c1b', color: '#c5a059', fontFamily: 'Montserrat, sans-serif' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
          ADD DEAL
        </button>
      </div>

      {/* Hero Deal Card */}
      <div className="mb-8 border p-5" style={{ borderColor: '#c5a059', background: '#fffbf2' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" style={{ color: '#c5a059' }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#775a19', fontFamily: 'Montserrat, sans-serif' }}>
              Featured Hero Deal
            </span>
          </div>
          <button
            onClick={() => setEditingHero(true)}
            className="text-xs px-3 py-1.5 border font-medium cursor-pointer"
            style={{ borderColor: '#c5a059', color: '#775a19', fontFamily: 'Montserrat, sans-serif' }}
          >
            EDIT
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {heroDeal.image && (
            <img src={heroDeal.image} alt={heroDeal.name} className="w-full h-40 object-cover" />
          )}
          <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <p className="font-semibold text-base mb-1" style={{ fontFamily: 'Playfair Display, serif', color: '#1a1c1b' }}>{heroDeal.name}</p>
            {heroDeal.badge && <span className="text-xs px-2 py-0.5 mb-2 inline-block" style={{ background: '#dfba67', color: '#1a1c1b' }}>{heroDeal.badge}</span>}
            <p className="text-xs mt-2" style={{ color: '#888' }}>{heroDeal.type} · {heroDeal.volume}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="font-bold text-lg" style={{ color: '#775a19' }}>Rs. {parseFloat(heroDeal.price || 0).toLocaleString()}</span>
              {heroDeal.originalPrice && (
                <span className="text-sm line-through" style={{ color: '#aaa' }}>Rs. {parseFloat(heroDeal.originalPrice).toLocaleString()}</span>
              )}
              {savings(heroDeal.originalPrice, heroDeal.price) && (
                <span className="text-xs px-2 py-0.5" style={{ background: '#fef08a', color: '#854d0e' }}>
                  {savings(heroDeal.originalPrice, heroDeal.price)}% OFF
                </span>
              )}
            </div>
            {heroDeal.subtitle && <p className="text-xs mt-2" style={{ color: '#666' }}>{heroDeal.subtitle}</p>}
          </div>
        </div>
      </div>

      {/* Curated Deals Table */}
      <h3 className="text-base font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#1a1c1b' }}>
        Curated Deals ({deals.length})
      </h3>
      <div className="border overflow-x-auto" style={{ borderColor: '#e0d5c5' }}>
        <table className="w-full text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          <thead>
            <tr style={{ background: '#f5f0e8', borderBottom: '1px solid #e0d5c5' }}>
              {['Product', 'Badge', 'Type', 'Volume', 'Price', 'Original', 'Savings', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: '#775a19' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deals.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12" style={{ color: '#aaa' }}>No deals found</td></tr>
            ) : (
              deals.map((deal, idx) => {
                const savePct = savings(deal.originalPrice, deal.price);
                return (
                  <tr key={deal._key} className="border-b hover:bg-amber-50/40"
                    style={{ borderColor: '#f0ebe0', background: idx % 2 === 0 ? '#fff' : '#fdfcf9' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {deal.image && <img src={deal.image} alt={deal.name} className="w-10 h-10 object-cover flex-shrink-0" />}
                        <span className="font-medium" style={{ color: '#1a1c1b' }}>{deal.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {deal.badge && (
                        <span className="text-xs px-2 py-0.5 whitespace-nowrap" style={{ background: '#dfba67', color: '#1a1c1b' }}>{deal.badge}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#666' }}>{deal.type || '—'}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#666' }}>{deal.volume || '—'}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: '#775a19' }}>Rs. {parseFloat(deal.price || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs line-through" style={{ color: '#aaa' }}>
                      {deal.originalPrice ? `Rs. ${parseFloat(deal.originalPrice).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {savePct ? (
                        <span className="text-xs px-2 py-0.5" style={{ background: '#fef08a', color: '#854d0e' }}>{savePct}% OFF</span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setModalDeal({ ...deal })}
                          className="text-xs px-2.5 py-1 border cursor-pointer hover:border-[#775a19]"
                          style={{ borderColor: '#c5a059', color: '#775a19' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(deal._key)}
                          className="text-xs px-2.5 py-1 border cursor-pointer hover:border-red-600"
                          style={{ borderColor: '#f87171', color: '#dc2626' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Deal Modal */}
      {modalDeal && (
        <DealModal deal={modalDeal} onSave={handleSaveDeal} onClose={() => setModalDeal(null)} />
      )}

      {/* Edit Hero Modal */}
      {editingHero && (
        <DealModal deal={heroDeal} onSave={handleSaveHero} onClose={() => setEditingHero(false)} />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setDeleteTarget(null)}>
          <div className="bg-white border p-6 max-w-sm mx-4" style={{ borderColor: '#c5a059' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: '#1a1c1b' }}>Confirm Delete</h3>
            <p className="text-sm mb-5" style={{ fontFamily: 'Montserrat, sans-serif', color: '#666' }}>Are you sure you want to remove this deal?</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteTarget)} className="flex-1 py-2 text-sm font-semibold cursor-pointer" style={{ background: '#dc2626', color: '#fff' }}>DELETE</button>
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 text-sm border font-semibold cursor-pointer" style={{ borderColor: '#e0d5c5', color: '#666' }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
