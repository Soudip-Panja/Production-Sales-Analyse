import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Eye, ChevronLeft, ChevronRight, X, Phone, Mail, User } from 'lucide-react';
import { clients as initialClients } from '../data/dummyData';

const ITEMS_PER_PAGE = 6;

export default function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', contactPerson: '', phone: '', email: '' });

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAddClient = (e) => {
    e.preventDefault();
    const newClient = {
      id: clients.length + 1,
      name: form.name,
      contactPerson: form.contactPerson,
      phone: form.phone,
      email: form.email,
      totalOrders: 0,
      totalSpent: 0,
    };
    setClients([newClient, ...clients]);
    setForm({ name: '', contactPerson: '', phone: '', email: '' });
    setShowModal(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Clients</div>
          <div className="page-subtitle">Manage your client accounts and purchase history</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={16} />
          Add Client
        </button>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-label">Total Clients</div>
          <div className="stat-value">{clients.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Clients</div>
          <div className="stat-value">{clients.filter(c => c.totalOrders > 0).length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value rupees">
            ₹{(clients.reduce((s, c) => s + c.totalSpent, 0) / 100000).toFixed(1)}L
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{clients.reduce((s, c) => s + c.totalOrders, 0)}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Client List</div>
          <div className="search-wrap">
            <Search className="search-icon" />
            <input
              className="search-input"
              placeholder="Search clients..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Total Orders</th>
                <th>Total Spent (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(client => (
                <tr key={client.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'var(--primary-pale)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 13, color: 'var(--primary)',
                        flexShrink: 0,
                      }}>
                        {client.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 500 }}>{client.name}</span>
                    </div>
                  </td>
                  <td className="td-muted">{client.contactPerson}</td>
                  <td className="td-muted">{client.phone}</td>
                  <td className="td-muted" style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {client.email}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>{client.totalOrders}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{client.totalSpent.toLocaleString()}</td>
                  <td>
                    <button
                      className="btn-icon"
                      title="View Details"
                      onClick={() => navigate(`/clients/${client.id}`)}
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state"><p>No clients found</p></div>
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
            {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} clients
          </span>
          <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Add Client Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add New Client</div>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddClient}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Company / Client Name</label>
                  <input
                    className="form-input" placeholder="e.g. Krishna Enterprises"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Person</label>
                  <input
                    className="form-input" placeholder="e.g. Ramesh Kumar"
                    value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      className="form-input" placeholder="e.g. 9876543210"
                      value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email" className="form-input" placeholder="e.g. name@company.com"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <UserPlus size={15} />
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
