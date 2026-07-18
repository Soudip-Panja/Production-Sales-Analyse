import React, { useState } from 'react';
import { Bell, Check, Factory, ShoppingCart, UserPlus, CreditCard, AlertTriangle, Trash2 } from 'lucide-react';
import { notifications as initialNotifications } from '../data/dummyData';

const iconMap = {
  production: Factory,
  order: ShoppingCart,
  client: UserPlus,
  payment: CreditCard,
  alert: AlertTriangle,
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');

  const unread = notifications.filter(n => !n.read);

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotif = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Notifications</div>
          <div className="page-subtitle">
            {unread.length} unread notification{unread.length !== 1 ? 's' : ''}
          </div>
        </div>
        {unread.length > 0 && (
          <button className="btn btn-secondary" onClick={markAllRead}>
            <Check size={15} />
            Mark all as read
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          {/* Filters */}
          <div style={{ display: 'flex', gap: 4 }}>
            {[['all', 'All'], ['unread', 'Unread'], ['read', 'Read']].map(([key, label]) => (
              <button
                key={key}
                className={`tab ${filter === key ? 'active' : ''}`}
                onClick={() => setFilter(key)}
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                {label}
                {key === 'unread' && unread.length > 0 && (
                  <span style={{
                    marginLeft: 4, fontSize: 10,
                    background: 'var(--danger)', color: '#fff',
                    padding: '1px 5px', borderRadius: 10,
                  }}>
                    {unread.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="notification-list">
          {filtered.length === 0 ? (
            <div className="empty-state" style={{ padding: 60 }}>
              <Bell size={40} style={{ opacity: 0.3 }} />
              <p>No notifications</p>
            </div>
          ) : filtered.map(notif => {
            const Icon = iconMap[notif.type] || Bell;
            return (
              <div
                key={notif.id}
                className={`notification-item ${!notif.read ? 'unread' : ''}`}
                onClick={() => markRead(notif.id)}
              >
                <div className={`notif-icon ${notif.type}`}>
                  <Icon size={17} />
                </div>
                <div className="notif-content" style={{ flex: 1 }}>
                  <div className="notif-title">{notif.message}</div>
                  {notif.detail && <div className="notif-detail">{notif.detail}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="notif-time">{notif.time}</span>
                  {!notif.read && (
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: 'var(--primary)', flexShrink: 0,
                    }} />
                  )}
                  <button
                    className="btn-icon danger"
                    style={{ padding: 4 }}
                    onClick={(e) => deleteNotif(notif.id, e)}
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
