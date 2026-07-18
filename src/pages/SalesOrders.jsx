import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { salesOrders as initialOrders } from '../data/dummyData';

const ITEMS_PER_PAGE = 8;

const statusBadge = (status) => {
  const map = { Completed: 'badge-success', Pending: 'badge-warning', Cancelled: 'badge-danger' };
  return <span className={`badge ${map[status] || 'badge-neutral'}`}>{status}</span>;
};

export default function SalesOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(initialOrders);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = orders.filter(o => {
    const matchTab = tab === 'all' ||
      (tab === 'completed' && o.status === 'Completed') ||
      (tab === 'pending' && o.status === 'Pending') ||
      (tab === 'cancelled' && o.status === 'Cancelled');
    const matchSearch = !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.clientName.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleTabChange = (t) => { setTab(t); setPage(1); };

  const tabCounts = {
    all: orders.length,
    completed: orders.filter(o => o.status === 'Completed').length,
    pending: orders.filter(o => o.status === 'Pending').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Sales Orders / Transactions</div>
          <div className="page-subtitle">Complete transaction history</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{orders.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{tabCounts.completed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{tabCounts.pending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Cancelled</div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{tabCounts.cancelled}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              ['all', 'All Orders'],
              ['completed', 'Completed'],
              ['pending', 'Pending'],
              ['cancelled', 'Cancelled'],
            ].map(([key, label]) => (
              <button
                key={key}
                className={`tab ${tab === key ? 'active' : ''}`}
                onClick={() => handleTabChange(key)}
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                {label}
                <span style={{
                  marginLeft: 4,
                  fontSize: 10,
                  background: tab === key ? 'var(--primary)' : 'var(--border)',
                  color: tab === key ? '#fff' : 'var(--text-muted)',
                  padding: '1px 5px',
                  borderRadius: 10,
                }}>
                  {tabCounts[key]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="search-wrap">
            <Search className="search-icon" />
            <input
              className="search-input"
              placeholder="Search orders..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client Name</th>
                <th>Product</th>
                <th>Quantity (MT)</th>
                <th>Total Amount (₹)</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(order => (
                <tr key={order.id} style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/clients/${order.clientId}`)}>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{order.id}</td>
                  <td style={{ fontWeight: 500 }}>{order.clientName}</td>
                  <td className="td-muted">{order.product}</td>
                  <td style={{ fontWeight: 600 }}>{order.quantity}</td>
                  <td style={{ fontWeight: 700 }}>₹{order.totalAmount.toLocaleString()}</td>
                  <td className="td-muted">{order.date}</td>
                  <td onClick={e => e.stopPropagation()}>{statusBadge(order.status)}</td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <p>No orders found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-info">
            Showing {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–
            {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} orders
          </span>
          <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
            <button
              key={i}
              className={`page-btn ${page === i + 1 ? 'active' : ''}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          {totalPages > 5 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>...</span>}
          {totalPages > 5 && (
            <button className={`page-btn ${page === totalPages ? 'active' : ''}`} onClick={() => setPage(totalPages)}>
              {totalPages}
            </button>
          )}
          <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
