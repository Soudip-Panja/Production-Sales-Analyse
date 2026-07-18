import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { ArrowUpRight, DollarSign, Package, ShoppingCart, Clock, ExternalLink } from 'lucide-react';
import { salesOrders, salesChartData, salesByProduct, dashboardStats } from '../data/dummyData';

const statusBadge = (status) => {
  const map = {
    Completed: 'badge-success',
    Pending: 'badge-warning',
    Cancelled: 'badge-danger',
  };
  return <span className={`badge ${map[status] || 'badge-neutral'}`}>{status}</span>;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="label">{label}</div>
        <div>₹{(payload[0].value / 1000).toFixed(0)}K</div>
      </div>
    );
  }
  return null;
};

const completedOrders = salesOrders.filter(o => o.status === 'Completed');
const totalSalesRevenue = completedOrders.reduce((s, o) => s + o.totalAmount, 0);
const totalQtySold = completedOrders.reduce((s, o) => s + o.quantity, 0);
const pendingOrders = salesOrders.filter(o => o.status === 'Pending').length;

export default function Sales() {
  const navigate = useNavigate();
  const recentOrders = salesOrders.slice(0, 6);

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap"><DollarSign size={20} /></div>
          <div className="stat-label">Total Sales (₹)</div>
          <div className="stat-value rupees">₹ {(totalSalesRevenue / 100000).toFixed(2)} L</div>
          <div className="stat-change up">
            <ArrowUpRight size={13} />
            <span>15.2%</span>
            <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>vs last month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap"><Package size={20} /></div>
          <div className="stat-label">Total Quantity Sold</div>
          <div className="stat-value">{totalQtySold.toLocaleString()} MT</div>
          <div className="stat-change up">
            <ArrowUpRight size={13} />
            <span>10.5%</span>
            <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>vs last month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap"><ShoppingCart size={20} /></div>
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{salesOrders.length}</div>
          <div className="stat-change up">
            <ArrowUpRight size={13} />
            <span>4.2%</span>
            <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>vs last month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap"><Clock size={20} /></div>
          <div className="stat-label">Pending Orders</div>
          <div className="stat-value">{pendingOrders}</div>
          <div className="stat-change down" style={{ color: 'var(--warning)' }}>
            <span>Requires attention</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Sales Trend */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Sales Trend</div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/sales/orders')}>
              <ExternalLink size={13} /> View All Orders
            </button>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={salesChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  tickFormatter={v => `${v / 1000}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone" dataKey="sales" name="Sales"
                  stroke="var(--primary)" strokeWidth={2.5}
                  dot={{ r: 3, fill: 'var(--primary)' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Product Donut */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Sales by Product</div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 200 }}>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={salesByProduct}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={75}
                    dataKey="value"
                    startAngle={90} endAngle={-270}
                  >
                    {salesByProduct.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center', pointerEvents: 'none',
              }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
                  {totalQtySold}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>MT Sold</div>
              </div>
            </div>
            <div style={{ width: '100%', marginTop: 8 }}>
              {salesByProduct.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 11, padding: '4px 0', borderBottom: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                }}>
                  <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                    {item.name}
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Sales</div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/sales/orders')}>
            View All Orders
          </button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client Name</th>
                <th>Product</th>
                <th>Qty (MT)</th>
                <th>Amount (₹)</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{order.id}</td>
                  <td style={{ fontWeight: 500 }}>{order.clientName}</td>
                  <td className="td-muted">{order.product}</td>
                  <td style={{ fontWeight: 600 }}>{order.quantity}</td>
                  <td style={{ fontWeight: 700 }}>₹{order.totalAmount.toLocaleString()}</td>
                  <td className="td-muted">{order.date}</td>
                  <td>{statusBadge(order.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
