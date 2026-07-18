import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wheat, Package2 } from 'lucide-react';
import { products, stockHistory } from '../data/dummyData';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === parseInt(id));
  const history = stockHistory[parseInt(id)] || [];

  if (!product) {
    return (
      <div className="empty-state">
        <Package2 size={48} />
        <p>Product not found</p>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={() => navigate('/products')}>
            <ArrowLeft size={15} />
            Products / Product Details
          </button>
          <div className="page-title" style={{ marginTop: 4 }}>{product.name}</div>
        </div>
      </div>

      <div className="product-detail-grid">
        {/* Left: Product Info */}
        <div>
          <div className="product-info-card">
            <div className="product-img-large">
              {product.category === 'Rice'
                ? <Wheat size={80} strokeWidth={1} />
                : <Package2 size={80} strokeWidth={1} />}
            </div>
            <div className="product-info-body">
              <div className="product-info-row">
                <span className="label">Category</span>
                <span className="value">
                  <span className={`badge ${product.category === 'Rice' ? 'badge-primary' : 'badge-neutral'}`}>
                    {product.category}
                  </span>
                </span>
              </div>
              <div className="product-info-row">
                <span className="label">Quality Type</span>
                <span className="value">{product.qualityType}</span>
              </div>
              <div className="product-info-row">
                <span className="label">Price (MT)</span>
                <span className="value" style={{ color: 'var(--primary)' }}>
                  ₹{product.price.toLocaleString()}
                </span>
              </div>
              <div className="product-info-row">
                <span className="label">Total Qty (MT)</span>
                <span className="value">{product.totalQty.toLocaleString()}</span>
              </div>
              <div className="product-info-row">
                <span className="label">Available Qty (MT)</span>
                <span className="value" style={{ color: 'var(--success)' }}>
                  {product.availableQty.toLocaleString()}
                </span>
              </div>
              <div className="product-info-row">
                <span className="label">Sold (MT)</span>
                <span className="value" style={{ color: 'var(--warning)' }}>
                  {(product.totalQty - product.availableQty).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Stock Progress */}
          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-header">
              <div className="card-title">Stock Utilization</div>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Available</span>
                <span style={{ fontWeight: 600 }}>
                  {Math.round((product.availableQty / product.totalQty) * 100)}%
                </span>
              </div>
              <div style={{
                height: 10,
                background: 'var(--border)',
                borderRadius: 10,
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(product.availableQty / product.totalQty) * 100}%`,
                  height: '100%',
                  background: 'var(--primary)',
                  borderRadius: 10,
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 4, color: 'var(--text-muted)' }}>
                <span>0 MT</span>
                <span>{product.totalQty.toLocaleString()} MT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Stock History */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Stock History</div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {history.length} entries
            </span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>In (MT)</th>
                  <th>Out (MT)</th>
                  <th>Balance (MT)</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? history.map((h, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{h.date}</td>
                    <td>
                      {h.inMT != null
                        ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>+{h.inMT}</span>
                        : <span className="td-muted">—</span>}
                    </td>
                    <td>
                      {h.outMT != null
                        ? <span style={{ color: 'var(--danger)', fontWeight: 600 }}>-{h.outMT}</span>
                        : <span className="td-muted">—</span>}
                    </td>
                    <td style={{ fontWeight: 700 }}>{h.balanceMT.toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4}>
                      <div className="empty-state" style={{ padding: 40 }}>
                        <p>No stock history available</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
