import React, { useState } from 'react';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { productionRecords } from '../data/dummyData';

const ITEMS_PER_PAGE = 8;

export default function Production() {
  const [records, setRecords] = useState(productionRecords);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    date: '',
    riceMT: '',
    riceBran: '',
    husk: '',
    broken: '',
  });

  const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);
  const paginated = records.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSubmit = (e) => {
    e.preventDefault();
    const rice = parseFloat(form.riceMT) || 0;
    const bran = parseFloat(form.riceBran) || 0;
    const husk = parseFloat(form.husk) || 0;
    const broken = parseFloat(form.broken) || 0;
    const newRecord = {
      id: records.length + 1,
      date: form.date,
      riceMT: rice,
      riceBran: bran,
      husk: husk,
      broken: broken,
      totalMT: rice + bran + husk + broken,
      addedBy: 'admin',
    };
    setRecords([newRecord, ...records]);
    setForm({ date: '', riceMT: '', riceBran: '', husk: '', broken: '' });
    setShowModal(false);
    setPage(1);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Production Records</div>
          <div className="page-subtitle">Daily rice milling production log</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          Add Production
        </button>
      </div>

      {/* Summary Row */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Records', value: records.length },
          { label: 'Total Rice (MT)', value: records.reduce((s, r) => s + r.riceMT, 0).toLocaleString() },
          { label: 'Total Bran (MT)', value: records.reduce((s, r) => s + r.riceBran, 0).toLocaleString() },
          { label: 'Total Husk (MT)', value: records.reduce((s, r) => s + r.husk, 0).toLocaleString() },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Production Log</div>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Showing {paginated.length} of {records.length} records
          </span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Production Date</th>
                <th>Rice Produced (MT)</th>
                <th>Rice Bran (MT)</th>
                <th>Husk (MT)</th>
                <th>Broken (MT)</th>
                <th>Total (MT)</th>
                <th>Added By</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((rec, i) => (
                <tr key={rec.id}>
                  <td className="td-muted">{(page - 1) * ITEMS_PER_PAGE + i + 1}</td>
                  <td style={{ fontWeight: 500 }}>{rec.date}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                      {rec.riceMT.toLocaleString()}
                    </span>
                  </td>
                  <td className="td-muted">{rec.riceBran}</td>
                  <td className="td-muted">{rec.husk}</td>
                  <td className="td-muted">{rec.broken}</td>
                  <td>
                    <span style={{ fontWeight: 700 }}>{rec.totalMT.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="badge badge-primary">{rec.addedBy}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-info">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, records.length)} of {records.length}
          </span>
          <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-btn ${page === i + 1 ? 'active' : ''}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Add Production Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add Production Entry</div>
              <button className="btn-icon" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Production Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Rice Produced (MT)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 450"
                      value={form.riceMT}
                      onChange={e => setForm({ ...form, riceMT: e.target.value })}
                      required min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rice Bran (MT)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 128"
                      value={form.riceBran}
                      onChange={e => setForm({ ...form, riceBran: e.target.value })}
                      required min="0"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Husk (MT)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 85"
                      value={form.husk}
                      onChange={e => setForm({ ...form, husk: e.target.value })}
                      required min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Broken Rice (MT)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 30"
                      value={form.broken}
                      onChange={e => setForm({ ...form, broken: e.target.value })}
                      required min="0"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={15} />
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
