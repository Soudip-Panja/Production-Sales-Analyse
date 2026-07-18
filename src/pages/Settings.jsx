import React, { useState } from 'react';
import { Save, Upload, Building, User, Bell, Users, Sliders } from 'lucide-react';

const TABS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'company', label: 'Company Details', icon: Building },
  { key: 'units', label: 'Units', icon: Sliders },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'users', label: 'Users', icon: Users },
];

function ProfileTab() {
  const [form, setForm] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@srilakshmi.com',
    phone: '9876543210',
    role: 'Super Admin',
  });

  return (
    <div className="settings-section">
      <div className="settings-section-title">Profile Information</div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">First Name</label>
          <input className="form-input" value={form.firstName}
            onChange={e => setForm({ ...form, firstName: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input className="form-input" value={form.lastName}
            onChange={e => setForm({ ...form, lastName: e.target.value })} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" className="form-input" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input className="form-input" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Role</label>
        <input className="form-input" value={form.role} disabled
          style={{ background: 'var(--border-light)', color: 'var(--text-muted)' }} />
      </div>
    </div>
  );
}

function CompanyTab() {
  const [form, setForm] = useState({
    name: 'Sri Lakshmi Rice Mill',
    email: 'info@srilakshmimill.com',
    phone: '9876543210',
    address: '456, NH Road, Raipur, Chhattisgarh - 492001',
    gstin: 'PO, NMWV (Hod, 049)',
  });

  return (
    <div>
      <div className="settings-section">
        <div className="settings-section-title">Company Logo</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 'var(--radius)',
            background: 'var(--primary-pale)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--primary-pale2)',
          }}>
            <span style={{ fontSize: 28 }}>🌾</span>
          </div>
          <div>
            <label className="company-logo-upload" style={{ display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer' }}>
              <Upload size={18} />
              <span>Change Logo</span>
              <input type="file" accept="image/*" style={{ display: 'none' }} />
            </label>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
              JPG, PNG, SVG (Max. 2MB)
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">Company Information</div>
        <div className="form-group">
          <label className="form-label">Company Name</label>
          <input className="form-input" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Address</label>
          <textarea className="form-input" rows={3} value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            style={{ resize: 'vertical', fontFamily: 'inherit' }} />
        </div>
        <div className="form-group">
          <label className="form-label">GSTIN / PAN</label>
          <input className="form-input" value={form.gstin}
            onChange={e => setForm({ ...form, gstin: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

function UnitsTab() {
  const [units, setUnits] = useState({
    weight: 'MT (Metric Ton)',
    currency: 'INR (₹)',
    dateFormat: 'DD MMM YYYY',
  });

  return (
    <div className="settings-section">
      <div className="settings-section-title">Measurement Units</div>
      <div className="form-group">
        <label className="form-label">Weight Unit</label>
        <select className="form-select" value={units.weight}
          onChange={e => setUnits({ ...units, weight: e.target.value })}>
          <option>MT (Metric Ton)</option>
          <option>KG (Kilogram)</option>
          <option>Quintal</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Currency</label>
        <select className="form-select" value={units.currency}
          onChange={e => setUnits({ ...units, currency: e.target.value })}>
          <option>INR (₹)</option>
          <option>USD ($)</option>
          <option>EUR (€)</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Date Format</label>
        <select className="form-select" value={units.dateFormat}
          onChange={e => setUnits({ ...units, dateFormat: e.target.value })}>
          <option>DD MMM YYYY</option>
          <option>DD/MM/YYYY</option>
          <option>MM/DD/YYYY</option>
          <option>YYYY-MM-DD</option>
        </select>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState({
    productionAlert: true,
    orderComplete: true,
    lowStock: true,
    newClient: false,
    paymentReceived: true,
    emailDigest: false,
  });

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const items = [
    { key: 'productionAlert', label: 'Production Entry Alerts', desc: 'Notify when new production entry is added' },
    { key: 'orderComplete', label: 'Order Completion Alerts', desc: 'Notify when an order is completed' },
    { key: 'lowStock', label: 'Low Stock Alerts', desc: 'Notify when stock falls below threshold' },
    { key: 'newClient', label: 'New Client Alerts', desc: 'Notify when a new client is added' },
    { key: 'paymentReceived', label: 'Payment Received Alerts', desc: 'Notify when payment is received' },
    { key: 'emailDigest', label: 'Daily Email Digest', desc: 'Receive a daily summary via email' },
  ];

  return (
    <div className="settings-section">
      <div className="settings-section-title">Notification Preferences</div>
      {items.map(item => (
        <div key={item.key} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 0', borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{item.desc}</div>
          </div>
          <button
            onClick={() => toggle(item.key)}
            style={{
              width: 44, height: 24, borderRadius: 12,
              background: settings[item.key] ? 'var(--primary)' : 'var(--border)',
              border: 'none', cursor: 'pointer',
              position: 'relative', transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute',
              left: settings[item.key] ? 22 : 2,
              top: 2,
              width: 20, height: 20,
              borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>
      ))}
    </div>
  );
}

function UsersTab() {
  const users = [
    { id: 1, name: 'Admin User', email: 'admin@srilakshmimill.com', role: 'Super Admin', status: 'Active' },
    { id: 2, name: 'Manager One', email: 'manager@srilakshmimill.com', role: 'Manager', status: 'Active' },
    { id: 3, name: 'Operator User', email: 'operator@srilakshmimill.com', role: 'Operator', status: 'Inactive' },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">System Users</div>
        <button className="btn btn-primary btn-sm">
          + Add User
        </button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 12, fontWeight: 700,
                    }}>
                      {u.name.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 500 }}>{u.name}</span>
                  </div>
                </td>
                <td className="td-muted">{u.email}</td>
                <td><span className="badge badge-primary">{u.role}</span></td>
                <td>
                  <span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Settings() {
  const [tab, setTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Settings</div>
          <div className="page-subtitle">System configuration and preferences</div>
        </div>
        {tab !== 'users' && (
          <button
            className="btn btn-primary"
            onClick={handleSave}
            style={{ background: saved ? 'var(--success)' : 'var(--primary)' }}
          >
            <Save size={15} />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        )}
      </div>

      {/* Settings Tabs */}
      <div className="settings-tabs">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`settings-tab ${tab === key ? 'active' : ''}`}
            onClick={() => setTab(key)}
          >
            <Icon size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'profile' && <ProfileTab />}
      {tab === 'company' && <CompanyTab />}
      {tab === 'units' && <UnitsTab />}
      {tab === 'notifications' && <NotificationsTab />}
      {tab === 'users' && <UsersTab />}
    </div>
  );
}
