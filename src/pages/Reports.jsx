import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { FileText, Download, TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import { salesOrders, productionRecords, clients } from '../data/dummyData';

const monthlyProduction = [
  { month: 'Jan', rice: 3800, byProduct: 950 },
  { month: 'Feb', rice: 4100, byProduct: 1025 },
  { month: 'Mar', rice: 3950, byProduct: 988 },
  { month: 'Apr', rice: 4400, byProduct: 1100 },
  { month: 'May', rice: 4200, byProduct: 1050 },
];

const monthlySales = [
  { month: 'Jan', sales: 8500000 },
  { month: 'Feb', sales: 9200000 },
  { month: 'Mar', sales: 8900000 },
  { month: 'Apr', sales: 10500000 },
  { month: 'May', sales: 12480000 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="label">{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color || '#fff' }}>
            {p.name}: {p.value > 9999 ? `₹${(p.value / 100000).toFixed(1)}L` : `${p.value} MT`}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const [period, setPeriod] = useState('monthly');

  const totalRevenue = salesOrders
    .filter(o => o.status === 'Completed')
    .reduce((s, o) => s + o.totalAmount, 0);

  const totalProduced = productionRecords.reduce((s, r) => s + r.riceMT, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Reports & Analytics</div>
          <div className="page-subtitle">Business performance overview</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            className="filter-select"
            value={period}
            onChange={e => setPeriod(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="btn btn-secondary">
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="report-grid">
        {[
          { label: 'Total Revenue', value: `₹${(totalRevenue / 100000).toFixed(2)}L`, icon: DollarSign, color: 'var(--success)' },
          { label: 'Total Production', value: `${totalProduced.toLocaleString()} MT`, icon: Package, color: 'var(--primary)' },
          { label: 'Total Clients', value: clients.length, icon: Users, color: 'var(--info)' },
          { label: 'Orders Completed', value: salesOrders.filter(o => o.status === 'Completed').length, icon: TrendingUp, color: 'var(--warning)' },
          { label: 'Avg Order Value', value: `₹${Math.round(totalRevenue / salesOrders.filter(o => o.status === 'Completed').length).toLocaleString()}`, icon: DollarSign, color: 'var(--primary)' },
          { label: 'Active Products', value: 6, icon: Package, color: 'var(--success)' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon-wrap" style={{ background: `${s.color}22` }}>
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: 18 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid" style={{ marginBottom: 20 }}>
        {/* Production Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Monthly Production (MT)</div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={monthlyProduction} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rice" name="Rice" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="byProduct" name="By-product" fill="#81C784" radius={[4, 4, 0, 0]} />
              </BarChart>
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

        {/* Sales Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Monthly Sales (₹)</div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={monthlySales} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <YAxis
                  tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                  tickFormatter={v => `${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone" dataKey="sales" name="Sales"
                  stroke="var(--primary)" strokeWidth={2.5}
                  dot={{ r: 4, fill: 'var(--primary)' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Clients Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Top Clients by Revenue</div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Client Name</th>
                <th>Contact</th>
                <th>Total Orders</th>
                <th>Total Revenue (₹)</th>
                <th>Avg Order Value</th>
              </tr>
            </thead>
            <tbody>
              {clients
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .slice(0, 5)
                .map((c, i) => (
                  <tr key={c.id}>
                    <td className="td-muted">{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td className="td-muted">{c.contactPerson}</td>
                    <td>{c.totalOrders}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      ₹{c.totalSpent.toLocaleString()}
                    </td>
                    <td className="td-muted">
                      ₹{c.totalOrders > 0 ? Math.round(c.totalSpent / c.totalOrders).toLocaleString() : 0}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
