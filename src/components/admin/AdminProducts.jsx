import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const STATUS = {
  active:  { label: 'Active',   bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  low:     { label: 'Low Stock',bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  soldout: { label: 'Sold Out', bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200' },
};

const STOCK_STATUS = (s) => s === 0 ? 'soldout' : s <= 5 ? 'low' : 'active';

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncedWithBackend, setSyncedWithBackend] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', type: '', volume: '', price: '', category: 'Attar', badge: '', subtitle: '', image: '' });

  // Load from backend API on mount
  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await api.getProducts();
        if (isMounted && res.success && Array.isArray(res.data)) {
          setProducts(res.data);
          setSyncedWithBackend(true);
        } else if (isMounted) {
          setError('The products service returned an invalid response.');
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProducts();
    return () => { isMounted = false; };
  }, []);

  const categories = ['All', 'Attar', 'Extraits de Parfum', 'Archival Blends', 'Tester Vials', 'Pure Attars (Dahn Al Oudh)'];

  const filtered = products.filter(p => {
    const matchSearch = (p.name || '').toLowerCase().includes(search.toLowerCase()) || 
                        (p.type || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this product from the store?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleStockChange = async (id, delta) => {
    const current = products.find(p => p.id === id);
    if (!current) return;
    const nextStock = Math.max(0, (current.stock || 0) + delta);
    try {
      await api.updateProduct(id, { stock: nextStock });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: nextStock } : p));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageFileChange = (e, isEditing = false) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target.result;
      if (isEditing) {
        setEditingProduct(prev => ({ ...prev, image: base64 }));
      } else {
        setNewProduct(prev => ({ ...prev, image: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const id = newProduct.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `prod-${Date.now()}`;
    const productPayload = {
      ...newProduct,
      id,
      price: Number(newProduct.price),
      stock: 10,
      rating: 4.8,
      reviewsCount: 0,
      image: newProduct.image,
      description: newProduct.subtitle || '',
      accords: { top: '—', heart: '—', base: '—' },
      sillage: 85,
      longevity: '24+ Hours',
      origin: 'AUREX',
      presentation: newProduct.subtitle || `${newProduct.volume || ''} Flacon`
    };

    try {
      const res = await api.createProduct(productPayload);
      if (res.success && res.data) {
        setProducts(prev => [...prev, res.data]);
      } else {
        throw new Error('The products service returned an invalid response.');
      }
    } catch (requestError) {
      setError(requestError.message);
      return;
    }

    setNewProduct({ name: '', type: '', volume: '', price: '', category: 'Attar', badge: '', subtitle: '', image: '' });
    setShowAddModal(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await api.updateProduct(editingProduct.id, editingProduct);
    } catch (err) {
      setError(err.message);
      return;
    }
    setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl text-[#1a1c1b]">Product Inventory</h2>
            {syncedWithBackend ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-sans bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Backend Connected
              </span>
            ) : null}
          </div>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <p className="font-sans text-xs text-[#7f7667] mt-1">{products.length} active formulations in the store</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a1c1b] text-[#dfba67] hover:bg-[#775a19] hover:text-white transition-all font-sans text-xs uppercase tracking-[0.18em] cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7f7667]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#d1c5b4]/40 focus:border-[#775a19] focus:outline-none font-sans text-xs text-[#1a1c1b] placeholder:text-[#7f7667]"
          />
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="px-4 py-2.5 bg-white border border-[#d1c5b4]/40 focus:border-[#775a19] focus:outline-none font-sans text-xs text-[#1a1c1b] appearance-none"
        >
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#d1c5b4]/40 regal-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f9f9f7] border-b border-[#d1c5b4]/30">
              <tr>
                {['Product','Category','Type / Volume','Price','Stock','Status','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 font-sans text-[9px] uppercase tracking-[0.18em] text-[#7f7667] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const st = STATUS[STOCK_STATUS(p.stock ?? 0)];
                return (
                  <tr key={p.id} className={`border-b border-[#d1c5b4]/20 ${i % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f7]/50'} hover:bg-[#ffdea5]/10 transition-colors`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-contain bg-[#f4f4f2] p-1 border border-[#d1c5b4]/30 shrink-0" />
                        <div>
                          <p className="font-serif text-sm text-[#1a1c1b] whitespace-nowrap">{p.name}</p>
                          <p className="font-sans text-[10px] text-[#7f7667]">{p.badge}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-[#4e4639] max-w-[130px]">
                      <span className="truncate block">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-[#7f7667] whitespace-nowrap">{p.type} · {p.volume}</td>
                    <td className="px-4 py-3 font-serif text-sm text-[#775a19]">${p.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleStockChange(p.id, -1)} className="w-6 h-6 border border-[#d1c5b4] text-[#1a1c1b] hover:bg-[#f4f4f2] text-sm flex items-center justify-center cursor-pointer">−</button>
                        <span className="font-sans text-xs text-[#1a1c1b] w-6 text-center">{p.stock ?? 0}</span>
                        <button onClick={() => handleStockChange(p.id, +1)} className="w-6 h-6 border border-[#d1c5b4] text-[#1a1c1b] hover:bg-[#f4f4f2] text-sm flex items-center justify-center cursor-pointer">+</button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-widest font-sans font-semibold border ${st.bg} ${st.text} ${st.border}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-1.5 border border-[#d1c5b4]/40 hover:border-[#775a19] text-[#775a19] transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 border border-[#d1c5b4]/40 hover:border-red-400 text-red-500 transition-colors cursor-pointer"
                          title="Remove"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[#d1c5b4]/20 bg-[#f9f9f7]">
          <p className="font-sans text-[10px] text-[#7f7667]">Showing {filtered.length} of {products.length} formulations</p>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1a1c1b]/60 backdrop-blur-xs" onClick={() => setShowAddModal(false)}/>
          <div className="relative bg-white border border-[#c5a059] w-full max-w-lg p-6 regal-shadow z-10 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-[#7f7667] hover:text-[#1a1c1b] cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <h3 className="font-serif text-xl text-[#1a1c1b] mb-5">Add New Formulation</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[#4e4639] mb-1">Formulation Name *</label>
                  <input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. Oud Malaki" className="w-full px-3 py-2 border border-[#d1c5b4] focus:border-[#775a19] focus:outline-none font-sans text-xs" />
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[#4e4639] mb-1">Type</label>
                  <input value={newProduct.type} onChange={e => setNewProduct({...newProduct, type: e.target.value})} placeholder="e.g. Pure Attar" className="w-full px-3 py-2 border border-[#d1c5b4] focus:border-[#775a19] focus:outline-none font-sans text-xs" />
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[#4e4639] mb-1">Volume</label>
                  <input value={newProduct.volume} onChange={e => setNewProduct({...newProduct, volume: e.target.value})} placeholder="e.g. 12ml / 50ml" className="w-full px-3 py-2 border border-[#d1c5b4] focus:border-[#775a19] focus:outline-none font-sans text-xs" />
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[#4e4639] mb-1">Price (Rs.) *</label>
                  <input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} placeholder="e.g. 1699 or 400" className="w-full px-3 py-2 border border-[#d1c5b4] focus:border-[#775a19] focus:outline-none font-sans text-xs" />
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[#4e4639] mb-1">Badge</label>
                  <input value={newProduct.badge} onChange={e => setNewProduct({...newProduct, badge: e.target.value})} placeholder="e.g. Best Seller / Pure Attar" className="w-full px-3 py-2 border border-[#d1c5b4] focus:border-[#775a19] focus:outline-none font-sans text-xs" />
                </div>
                <div className="col-span-2">
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[#4e4639] mb-1">Category</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full px-3 py-2 border border-[#d1c5b4] focus:border-[#775a19] focus:outline-none font-sans text-xs cursor-pointer">
                    <option value="Attar">Attar</option>
                    <option value="Extraits de Parfum">Extraits de Parfum</option>
                    <option value="Archival Blends">Archival Blends</option>
                    <option value="Tester Vials">Tester Vials</option>
                    <option value="Pure Attars (Dahn Al Oudh)">Pure Attars (Dahn Al Oudh)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[#4e4639] mb-1">Subtitle / Description</label>
                  <input value={newProduct.subtitle} onChange={e => setNewProduct({...newProduct, subtitle: e.target.value})} placeholder="e.g. Aged oud & smoky incense..." className="w-full px-3 py-2 border border-[#d1c5b4] focus:border-[#775a19] focus:outline-none font-sans text-xs" />
                </div>

                {/* Product Image Upload Section */}
                <div className="col-span-2 pt-1">
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[#4e4639] mb-1.5 font-semibold">
                    Product Image (Upload Photo)
                  </label>
                  <div className="border-2 border-dashed border-[#d1c5b4] hover:border-[#775a19] rounded-lg p-3 text-center bg-[#f9f9f7] transition-all">
                    {newProduct.image ? (
                      <div className="flex items-center gap-3 text-left">
                        <img
                          src={newProduct.image}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded border border-[#c5a059] shrink-0 bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#1a1c1b] truncate">Image Selected</p>
                          <p className="text-[10px] text-[#7f7667] mb-2">Ready to save with formulation</p>
                          <div className="flex gap-2">
                            <label className="px-2.5 py-1 bg-[#1a1c1b] text-[#dfba67] text-[10px] uppercase tracking-wider cursor-pointer hover:bg-[#775a19] transition-colors rounded">
                              Change Photo
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(e, false)}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => setNewProduct({ ...newProduct, image: '' })}
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
                            onChange={(e) => handleImageFileChange(e, false)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  {/* Or Manual Image Path */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-wider text-[#7f7667] whitespace-nowrap">Or Image Path:</span>
                    <input
                      type="text"
                      placeholder="e.g. /images/products/my-perfume.jpeg"
                      value={newProduct.image}
                      onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                      className="flex-1 px-2.5 py-1 border border-[#d1c5b4] focus:border-[#775a19] focus:outline-none font-sans text-xs"
                    />
                  </div>
                </div>

              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-[#d1c5b4] text-[#4e4639] hover:bg-[#f4f4f2] font-sans text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#1a1c1b] text-[#dfba67] hover:bg-[#775a19] hover:text-white transition-all font-sans text-xs uppercase tracking-wider cursor-pointer">Add to Vault</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1a1c1b]/60 backdrop-blur-xs" onClick={() => setEditingProduct(null)}/>
          <div className="relative bg-white border border-[#c5a059] w-full max-w-lg p-6 regal-shadow z-10 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setEditingProduct(null)} className="absolute top-4 right-4 text-[#7f7667] hover:text-[#1a1c1b] cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <h3 className="font-serif text-xl text-[#1a1c1b] mb-5">Edit Formulation</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[#4e4639] mb-1">Name</label>
                  <input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full px-3 py-2 border border-[#d1c5b4] focus:border-[#775a19] focus:outline-none font-sans text-xs" />
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[#4e4639] mb-1">Price (Rs.)</label>
                  <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full px-3 py-2 border border-[#d1c5b4] focus:border-[#775a19] focus:outline-none font-sans text-xs" />
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[#4e4639] mb-1">Volume</label>
                  <input value={editingProduct.volume} onChange={e => setEditingProduct({...editingProduct, volume: e.target.value})} className="w-full px-3 py-2 border border-[#d1c5b4] focus:border-[#775a19] focus:outline-none font-sans text-xs" />
                </div>
                <div className="col-span-2">
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[#4e4639] mb-1">Subtitle</label>
                  <input value={editingProduct.subtitle || ''} onChange={e => setEditingProduct({...editingProduct, subtitle: e.target.value})} className="w-full px-3 py-2 border border-[#d1c5b4] focus:border-[#775a19] focus:outline-none font-sans text-xs" />
                </div>

                {/* Edit Image Field */}
                <div className="col-span-2 pt-1">
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[#4e4639] mb-1.5 font-semibold">
                    Product Image
                  </label>
                  <div className="flex items-center gap-3 border border-[#d1c5b4] p-2.5 rounded bg-[#f9f9f7]">
                    {editingProduct.image ? (
                      <img
                        src={editingProduct.image}
                        alt="Current"
                        className="w-14 h-14 object-cover rounded border border-[#c5a059] shrink-0 bg-white"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-200 flex items-center justify-center text-gray-400 text-xs rounded">
                        No Pic
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <label className="inline-block px-3 py-1 bg-[#1a1c1b] text-[#dfba67] text-[10px] uppercase tracking-wider cursor-pointer hover:bg-[#775a19] transition-colors rounded mb-1">
                        Upload New Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileChange(e, true)}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Or Image Path..."
                        value={editingProduct.image || ''}
                        onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                        className="w-full px-2 py-1 border border-[#d1c5b4] text-[11px] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 py-2.5 border border-[#d1c5b4] text-[#4e4639] hover:bg-[#f4f4f2] font-sans text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#775a19] text-white hover:bg-[#1a1c1b] transition-all font-sans text-xs uppercase tracking-wider cursor-pointer">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
