import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Factory, Package, ShoppingCart, Users, BarChart2,
  Archive, Bell, Settings, LogOut, Menu, X, Wheat
} from 'lucide-react';
import { notifications } from '../data/dummyData';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/production', icon: Factory, label: 'Production' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/sales', icon: ShoppingCart, label: 'Sales' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/reports', icon: BarChart2, label: 'Reports' },
  { to: '/inventory', icon: Archive, label: 'Inventory' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const unreadCount = notifications.filter(n => !n.read).length;

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Wheat size={20} color="#fff" />
          </div>
          <div className="sidebar-logo-text">
            <span className="brand-name">RICE MILL</span>
            <span className="brand-sub">Management</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon className="nav-icon" size={17} />
              <span>{label}</span>
              {label === 'Notifications' && unreadCount > 0 && (
                <span className="nav-badge">{unreadCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="sidebar-bottom">
          <div className="nav-item" style={{ cursor: 'pointer' }}>
            <LogOut className="nav-icon" size={17} />
            <span>Logout</span>
          </div>
        </div>
      </aside>
    </>
  );
}

function Header({ title, subtitle, onMenuClick }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        <div>
          <div className="header-title">{title}</div>
          {subtitle && <div className="header-subtitle">{subtitle}</div>}
        </div>
      </div>
      <div className="header-right">
        <button className="header-btn">
          <Bell size={18} />
          {unreadCount > 0 && <span className="notif-dot" />}
        </button>
        <div className="header-user">
          <div className="user-avatar">A</div>
          <div className="user-info">
            <div className="user-name">Admin</div>
            <div className="user-role">Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}

const routeTitles = {
  '/': { title: 'Dashboard', subtitle: 'Overview of your rice mill operations' },
  '/production': { title: 'Production', subtitle: 'Track daily rice production records' },
  '/products': { title: 'Products', subtitle: 'Rice & By-products inventory' },
  '/sales': { title: 'Sales Dashboard', subtitle: 'Monitor sales and revenue' },
  '/sales/orders': { title: 'Sales Orders', subtitle: 'All transactions and orders' },
  '/clients': { title: 'Clients', subtitle: 'Manage client accounts' },
  '/reports': { title: 'Reports', subtitle: 'Analytics and business reports' },
  '/inventory': { title: 'Inventory', subtitle: 'Stock levels and movement' },
  '/notifications': { title: 'Notifications', subtitle: 'System alerts and updates' },
  '/settings': { title: 'Settings', subtitle: 'System configuration' },
};

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const path = location.pathname;
  const titleData = Object.entries(routeTitles).find(([key]) =>
    key === path || (key !== '/' && path.startsWith(key))
  )?.[1] || { title: 'Rice Mill', subtitle: '' };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Header
          title={titleData.title}
          subtitle={titleData.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
