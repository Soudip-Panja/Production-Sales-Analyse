import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, User } from 'lucide-react';
import { clients, salesOrders } from '../data/dummyData';

const statusBadge = (status) => {
  const map = { Completed: 'badge-success', Pending: 'badge-warning', Cancelled: 'badge-danger' };
  return <span className={`badge ${map[status] || 'badge-neutral'}`}>{status}</span>;
};

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = clients.find(c => c.id === parseInt(id));
  const clientOrders = salesOrders.filter(o => o.clientId === parseInt(id));

  if (!client) {
    return (
      <div className="empty-state">
        <User size={48} />
        <p>Client not found</p>
        <button className="btn btn-primary" onClick={() => navigate('/clients')}>
          Back to Clients
        </button>
      </div>
    );
  }

  const totalSpent = clientOrders
    .filter(o => o.status === 'Completed')
    .reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={() => navigate('/clients')}>
            <ArrowLeft size={15} />
            Clients / Client Details
          </button>
          <div className="page-title" style={{ marginTop: 4 }}>{client.name}</div>
        </div>
      </div>

      <div className="client-detail-grid">
        {/* Left: Client Info */}
        <div>
          <div className="card">
            <div className="card-body">
              {/* Avatar */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '20px 0', borderBottom: '1px solid var(--border)', marginBottom: 16,
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-accent))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12,
                }}>
                  {client.name.charAt(0)}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' }}>
                  {client.name}
                </div>
                <span className="badge badge-success" style={{ marginTop: 6 }}>Active Client</span>
              </div>

              <div className="client-info-item">
                <User size={15} color="var(--text-muted)" />
                <span className="ci-label">Contact</span>
                <span className="ci-value">{client.contactPerson}</span>
              </div>
              <div className="client-info-item">
                <Phone size={15} color="var(--text-muted)" />
                <span className="ci-label">Phone</span>
                <span className="ci-value">{client.phone}</span>
              </div>
              <div className="client-info-item">
                <Mail size={15} color="var(--text-muted)" />
                <span className="ci-label">Email</span>
                <span className="ci-value" style={{ fontSize: 12 }}>{client.email}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <div className="stat-label">Total Orders</div>
              <div className="stat-value" style={{ color: 'var(--primary)' }}>{clientOrders.length}</div>
            </div>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <div className="stat-label">Total Spent</div>
              <div className="stat-value rupees" style={{ fontSize: 14 }}>
                ₹{(totalSpent / 100000).toFixed(2)}L
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order History */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Order History</div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {clientOrders.length} orders
            </span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Qty (MT)</th>
                  <th>Amount (₹)</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {clientOrders.length > 0 ? clientOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{order.id}</td>
                    <td>
                      <div style={{ fontSize: 12 }}>
                        <div style={{ fontWeight: 500 }}>{order.product}</div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{order.quantity}</td>
                    <td style={{ fontWeight: 700 }}>₹{order.totalAmount.toLocaleString()}</td>
                    <td className="td-muted">{order.date}</td>
                    <td>{statusBadge(order.status)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state" style={{ padding: 40 }}>
                        <p>No orders found for this client</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer summary */}
          {clientOrders.length > 0 && (
            <div style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              background: 'var(--border-light)',
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                Total Orders: <strong style={{ color: 'var(--text-primary)' }}>{clientOrders.length}</strong>
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                Total Spent: <strong style={{ color: 'var(--primary)' }}>
                  ₹{totalSpent.toLocaleString()}
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
