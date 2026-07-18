import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, Factory, Package, ShoppingCart, DollarSign,
  ArrowUpRight, ArrowDownRight, Wheat, AlertCircle, CheckCircle, UserPlus, CreditCard
} from 'lucide-react';
import {
  dashboardStats, productionChartData, productionDistribution, salesByProduct,
  recentActivities, topSellingProducts
} from '../data/dummyData';

function StatCard({ label, value, change, isUp, icon: Icon, rupees }) {
  return (
    <div className="stat-card">
      <div className="stat-icon-wrap">
        <Icon size={20} />
      </div>
      <div className="stat-label">{label}</div>
      <div className={`stat-value${rupees ? ' rupees' : ''}`}>{value}</div>
      <div className={`stat-change ${isUp ? 'up' : 'down'}`}>
        {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        <span>{Math.abs(change)}%</span>
        <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>vs last month</span>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="label">{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color || '#fff' }}>
            {p.name}: {typeof p.value === 'number' && p.value > 9999
              ? `${(p.value / 1000).toFixed(0)}k`
              : p.value} MT
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const activityIcons = {
  production: Factory,
  order: CheckCircle,
  client: UserPlus,
  payment: CreditCard,
  alert: AlertCircle,
};

export default function Dashboard() {
  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Total Rice Production"
          value="12,450 MT"
          change={dashboardStats.productionGrowth}
          isUp={true}
          icon={Wheat}
        />
        <StatCard
          label="Total By-products"
          value="3,280 MT"
          change={dashboardStats.byProductGrowth}
          isUp={true}
          icon={Package}
        />
        <StatCard
          label="Total Sales (₹)"
          value="₹ 1,24,80,000"
          change={dashboardStats.salesGrowth}
          isUp={true}
          icon={DollarSign}
          rupees
        />
        <StatCard
          label="Total Orders"
          value="184"
          change={dashboardStats.ordersGrowth}
          isUp={false}
          icon={ShoppingCart}
        />
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        {/* Production Overview Line Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Production Overview</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>This Month</div>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={productionChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone" dataKey="rice" name="Rice"
                  stroke="var(--primary)" strokeWidth={2.5}
                  dot={{ r: 3, fill: 'var(--primary)' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone" dataKey="byProducts" name="By-products"
                  stroke="#81C784" strokeWidth={2.5} strokeDasharray="4 2"
                  dot={{ r: 3, fill: '#81C784' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: 'var(--primary)' }} />
                Rice
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#81C784' }} />
                By-products
              </div>
            </div>
          </div>
        </div>

        {/* Production Distribution Donut */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Production Distribution</div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 200 }}>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={productionDistribution}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={80}
                    dataKey="value"
                    startAngle={90} endAngle={-270}
                  >
                    {productionDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center', pointerEvents: 'none',
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>79%</div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Rice</div>
              </div>
            </div>
            <div className="chart-legend" style={{ justifyContent: 'center' }}>
              {productionDistribution.map((item, i) => (
                <div className="legend-item" key={i}>
                  <div className="legend-dot" style={{ background: item.color }} />
                  {item.name} {item.value}%
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, width: '100%' }}>
              {[
                { label: 'Rice', value: '12,450 MT', color: '#1B5E20' },
                { label: 'Rice Bran', value: '1,843 MT', color: '#388E3C' },
                { label: 'Husk', value: '840 MT', color: '#66BB6A' },
                { label: 'By-products', value: '2,683 HT', color: '#81C784' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 11, padding: '4px 0', borderBottom: '1px solid var(--border)',
                  color: 'var(--text-secondary)'
                }}>
                  <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                    {item.label}
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="dashboard-bottom">
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Activities</div>
          </div>
          <div className="card-body" style={{ padding: '0 20px' }}>
            <div className="activity-list">
              {recentActivities.map((item) => {
                const Icon = activityIcons[item.type] || AlertCircle;
                return (
                  <div className="activity-item" key={item.id}>
                    <div className={`activity-dot ${item.type}`} />
                    <div className="activity-text">
                      <div style={{ fontWeight: 500 }}>{item.text}</div>
                    </div>
                    <div className="activity-time">{item.time}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Top Selling Products</div>
          </div>
          <div className="table-wrapper">
            <table className="top-selling-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty (MT)</th>
                  <th>Revenue (₹)</th>
                </tr>
              </thead>
              <tbody>
                {topSellingProducts.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{p.name}</div>
                    </td>
                    <td className="td-muted">{p.qty.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, fontSize: 12 }}>
                      ₹{p.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
