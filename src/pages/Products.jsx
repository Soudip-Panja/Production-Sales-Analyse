import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, ShoppingCart, Search, Wheat, Package2 } from 'lucide-react';
import { products as initialProducts, clients, salesOrders } from '../data/dummyData';

function SellModal({ product, onClose, onSell }) {
  const [quantity, setQuantity] = useState('');
  const [clientId, setClientId] = useState('');

  const handleSell = (e) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0 || qty > product.availableQty) return;
    const client = clients.find(c => c.id === parseInt(clientId));
    onSell(product.id, qty, client);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Sell Product: {product.name} ({product.qualityType})</div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSell}>
          <div className="modal-body">
            <div style={{
              background: 'var(--primary-pale)',
              border: '1px solid var(--primary-pale2)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px',
              marginBottom: 16,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Available Stock</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>
                  {product.availableQty.toLocaleString()} MT
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Price per MT</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{product.price.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Client</label>
              <select
                className="form-select"
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                required
              >
                <option value="">-- Select Client --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity to Sell (MT)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter quantity"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                required
                min="1"
                max={product.availableQty}
                step="0.01"
              />
              {parseFloat(quantity) > product.availableQty && (
                <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>
                  Exceeds available quantity!
                </div>
              )}
            </div>

            {quantity && clientId && parseFloat(quantity) <= product.availableQty && (
              <div style={{
                background: 'var(--success-bg)',
                border: '1px solid #BBF7D0',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: 13,
                color: 'var(--success)',
                fontWeight: 600,
              }}>
                Total Amount: ₹{(parseFloat(quantity) * product.price).toLocaleString()}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <ShoppingCart size={15} />
              Confirm Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [sellProduct, setSellProduct] = useState(null);

  const filtered = products.filter(p => {
    const matchTab = tab === 'all' || 
      (tab === 'rice' && p.category === 'Rice') ||
      (tab === 'byproduct' && p.category === 'By-product');
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.qualityType.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleSell = (productId, qty, client) => {
    setProducts(prev => prev.map(p =>
      p.id === productId
        ? { ...p, availableQty: Math.max(0, p.availableQty - qty) }
        : p
    ));
  };

  const getStatusBadge = (available, total) => {
    const ratio = available / total;
    if (ratio < 0.2) return <span className="badge badge-danger">Low Stock</span>;
    if (ratio < 0.5) return <span className="badge badge-warning">Medium</span>;
    return <span className="badge badge-success">In Stock</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Products</div>
          <div className="page-subtitle">Rice & By-products inventory management</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{products.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rice Products</div>
          <div className="stat-value">{products.filter(p => p.category === 'Rice').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">By-products</div>
          <div className="stat-value">{products.filter(p => p.category === 'By-product').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Available (MT)</div>
          <div className="stat-value">{products.reduce((s, p) => s + p.availableQty, 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4 }}>
            {[['all', 'All Products'], ['rice', 'Rice'], ['byproduct', 'By-products']].map(([key, label]) => (
              <button
                key={key}
                className={`tab ${tab === key ? 'active' : ''}`}
                onClick={() => setTab(key)}
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="search-wrap">
            <Search className="search-icon" />
            <input
              className="search-input"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Quality/Type</th>
                <th>Total Qty (MT)</th>
                <th>Available Qty (MT)</th>
                <th>Price (₹/MT)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="product-img">
                        {product.category === 'Rice' ? <Wheat size={18} /> : <Package2 size={18} />}
                      </div>
                      <span style={{ fontWeight: 500 }}>{product.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${product.category === 'Rice' ? 'badge-primary' : 'badge-neutral'}`}>
                      {product.category}
                    </span>
                  </td>
                  <td className="td-muted">{product.qualityType}</td>
                  <td style={{ fontWeight: 600 }}>{product.totalQty.toLocaleString()}</td>
                  <td>
                    <span style={{
                      fontWeight: 700,
                      color: product.availableQty < product.totalQty * 0.3
                        ? 'var(--danger)'
                        : 'var(--success)'
                    }}>
                      {product.availableQty.toLocaleString()}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>₹{product.price.toLocaleString()}</td>
                  <td>{getStatusBadge(product.availableQty, product.totalQty)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn-icon"
                        title="View Details"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="btn-icon"
                        title="Sell"
                        style={{ color: 'var(--primary)', borderColor: 'var(--primary-pale2)' }}
                        onClick={() => setSellProduct(product)}
                      >
                        <ShoppingCart size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <Package2 size={40} />
                      <p>No products found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span className="pagination-info">Showing {filtered.length} products</span>
        </div>
      </div>

      {/* Sell Modal */}
      {sellProduct && (
        <SellModal
          product={sellProduct}
          onClose={() => setSellProduct(null)}
          onSell={handleSell}
        />
      )}
    </div>
  );
}
