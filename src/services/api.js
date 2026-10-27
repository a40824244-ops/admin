const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://aurexb-9ec42955.fastapicloud.dev/api').replace(/\/+$/, '');

function adminHeaders(headers = {}) {
  const token = typeof localStorage === 'undefined'
    ? null
    : localStorage.getItem('aurex_admin_token');
  return token ? { ...headers, 'x-admin-token': token } : headers;
}

// Helper for fetch with timeout
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 4000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export const api = {
  // Check backend status
  async checkHealth() {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/health`, { timeout: 2000 });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetchWithTimeout(`${API_BASE}/products${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProductById(id) {
    const res = await fetchWithTimeout(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },

  async createProduct(product) {
    const res = await fetchWithTimeout(`${API_BASE}/products`, {
      method: 'POST',
      headers: adminHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  async updateProduct(id, updates) {
    const res = await fetchWithTimeout(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: adminHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  async deleteProduct(id) {
    const res = await fetchWithTimeout(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: adminHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
  },

  // Deals
  async getDeals() {
    const res = await fetchWithTimeout(`${API_BASE}/deals`);
    if (!res.ok) throw new Error('Failed to fetch deals');
    return res.json();
  },

  async updateHeroDeal(heroDeal) {
    const res = await fetchWithTimeout(`${API_BASE}/deals/hero`, {
      method: 'PUT',
      headers: adminHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(heroDeal)
    });
    if (!res.ok) throw new Error('Failed to update hero deal');
    return res.json();
  },

  async createDeal(deal) {
    const res = await fetchWithTimeout(`${API_BASE}/deals`, {
      method: 'POST',
      headers: adminHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(deal)
    });
    if (!res.ok) throw new Error('Failed to create deal');
    return res.json();
  },

  async updateDeal(id, updates) {
    const res = await fetchWithTimeout(`${API_BASE}/deals/${id}`, {
      method: 'PUT',
      headers: adminHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update deal');
    return res.json();
  },

  async deleteDeal(id) {
    const res = await fetchWithTimeout(`${API_BASE}/deals/${id}`, {
      method: 'DELETE',
      headers: adminHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete deal');
    return res.json();
  },

  // Orders
  async getOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetchWithTimeout(`${API_BASE}/orders${query ? `?${query}` : ''}`, {
      headers: adminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async deleteAllOrders() {
    const res = await fetchWithTimeout(`${API_BASE}/orders`, {
      method: 'DELETE',
      headers: adminHeaders()
    });
    if (res.status === 405) {
      throw new Error('Order clearing is not available on the deployed backend yet. Deploy the backend update, then try again.');
    }
    if (!res.ok) throw new Error(`Failed to delete orders (HTTP ${res.status})`);
    return res.json();
  },

  async placeOrder(orderData) {
    const res = await fetchWithTimeout(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Failed to place order');
    return res.json();
  },

  async updateOrderStatus(id, status) {
    const res = await fetchWithTimeout(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: adminHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },

  // Consultations
  async bookConsultation(bookingData) {
    const res = await fetchWithTimeout(`${API_BASE}/consultations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) throw new Error('Failed to book consultation');
    return res.json();
  },

  async getConsultations() {
    const res = await fetchWithTimeout(`${API_BASE}/consultations`, {
      headers: adminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch consultations');
    return res.json();
  },

  // VIP
  async subscribeVIP(email) {
    const res = await fetchWithTimeout(`${API_BASE}/vip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error('Failed to join VIP');
    return res.json();
  },

  // Dashboard Stats
  async getDashboardStats() {
    const res = await fetchWithTimeout(`${API_BASE}/dashboard/stats`, {
      headers: adminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Auth
  async login(password) {
    const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    return res.json();
  }
};
