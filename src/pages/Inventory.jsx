import React from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, Package } from 'lucide-react';
import { inventoryData } from '../data/dummyData';

export default function Inventory() {
  const lowStockItems = inventoryData.filter(i => i.status === 'Low');

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Inventory</div>
          <div className="page-subtitle">Current stock levels and movement</div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="inventory-alert">
          <AlertTriangle size={18} />
          <span>
            <strong>{lowStockItems.length} product(s)</strong> are below the minimum threshold level:{' '}
            {lowStockItems.map(i => i.product).join(', ')}
          </span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{inventoryData.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Normal Stock</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            {inventoryData.filter(i => i.status === 'Normal').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Low Stock</div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>
            {lowStockItems.length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Available (MT)</div>
          <div className="stat-value">
            {inventoryData.reduce((s, i) => s + i.closing, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Current Stock Levels</div>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            As of 31 May 2024
          </span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Opening (MT)</th>
                <th>In (MT)</th>
                <th>Out (MT)</th>
                <th>Closing (MT)</th>
                <th>Threshold</th>
                <th>Status</th>
                <th>Stock Level</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map(item => {
                const pct = Math.min(100, (item.closing / (item.opening + item.in)) * 100);
                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="product-img">
                          <Package size={16} />
                        </div>
                        <span style={{ fontWeight: 500 }}>{item.product}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${item.category === 'Rice' ? 'badge-primary' : 'badge-neutral'}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="td-muted">{item.opening.toLocaleString()}</td>
                    <td>
                      <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                        +{item.in.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--danger)', fontWeight: 600 }}>
                        -{item.out.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{item.closing.toLocaleString()}</td>
                    <td className="td-muted">{item.threshold}</td>
                    <td>
                      <span className={`badge ${item.status === 'Low' ? 'badge-danger' : 'badge-success'}`}>
                        {item.status === 'Low' ? '⚠ Low' : '✓ Normal'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
                        <div style={{
                          flex: 1,
                          height: 8,
                          background: 'var(--border)',
                          borderRadius: 8,
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: item.status === 'Low' ? 'var(--danger)' : 'var(--primary)',
                            borderRadius: 8,
                          }} />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 32 }}>
                          {Math.round(pct)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
