import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/items/${id}`)
      .then(res => setItem(res.data))
      .catch(() => setError('Item not found or failed to load.'));
  }, [id]);

  if (error) return (
    <div className="auth-container">
      <div className="auth-box">
        <p className="error">{error}</p>
        <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
      </div>
    </div>
  );

  if (!item) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>📦 Lost & Found</h1>
        <button onClick={() => navigate('/dashboard')} className="btn-logout" style={{ background: '#4f46e5' }}>
          ← Back
        </button>
      </nav>

      <div className="content" style={{ maxWidth: 600 }}>
        <div className="card">
          <div className="item-header" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 24 }}>{item.itemName}</h2>
            <span className={`badge ${item.type === 'Lost' ? 'badge-lost' : 'badge-found'}`} style={{ fontSize: 15, padding: '4px 14px' }}>
              {item.type}
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['📝 Description', item.description || '—'],
                ['📍 Location', item.location],
                ['📞 Contact', item.contactInfo],
                ['👤 Reported By', item.postedBy?.name],
                ['📧 Email', item.postedBy?.email],
                ['🗓 Date', new Date(item.date || item.createdAt).toLocaleDateString()],
                ['🆔 Item ID', item._id],
              ].map(([label, value]) => (
                <tr key={label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 0', fontWeight: 600, color: '#555', width: '40%' }}>{label}</td>
                  <td style={{ padding: '10px 0', color: '#333', wordBreak: 'break-all' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;