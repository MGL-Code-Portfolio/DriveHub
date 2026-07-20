import { useState } from 'react';
import '../../css/Modals.css';
import Avatar from '../layout/Avatar.jsx';
import api from '../../api/axios';

function AddFriend({ isOpen, onClose, onFriendAdded }) {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setError('');
    setSuccess('');

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await api.get(`/users/?search=${encodeURIComponent(query)}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (user) => {
    setSending(user.id);
    setError('');
    setSuccess('');

    try {
      await api.post('/social/friends/', { receiver_id: user.id });
      setSuccess(`Friend request sent to ${user.username}!`);
      setSearchResults(prev => prev.filter(u => u.id !== user.id));
      if (onFriendAdded) onFriendAdded();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send friend request.');
    } finally {
      setSending(null);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100, background: 'rgba(0, 0, 0, 0.6)' }}>
      <div className="modal-box" style={{ maxWidth: '440px', width: '100%', borderRadius: '16px', padding: '20px', backgroundColor: '#ffffff', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', position: 'relative' }}>
        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
          <div>
            <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.2rem' }}>Add New Friend</h4>
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Search by username</p>
          </div>
          <button type="button" className="btn btn-light rounded-circle d-flex align-items-center justify-content-center border-0 p-0" onClick={onClose} style={{ width: '32px', height: '32px', cursor: 'pointer', backgroundColor: '#f8f9fa' }}>
            <i className="bi bi-x-lg text-secondary" style={{ fontSize: '0.9rem' }}></i>
          </button>
        </div>

        {error && <div className="alert alert-danger py-2 mb-2">{error}</div>}
        {success && <div className="alert alert-success py-2 mb-2">{success}</div>}

        <div className="mb-3">
          <div className="input-group bg-light rounded-3 px-3 py-1 d-flex align-items-center border">
            <i className="bi bi-search text-muted me-2"></i>
            <input type="text" className="form-control bg-transparent border-0 shadow-none ps-1" placeholder="Enter username..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} style={{ fontSize: '0.95rem', height: '38px' }} autoFocus />
          </div>
        </div>

        <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
          {searching ? (
            <p className="text-muted text-center py-3">Searching...</p>
          ) : searchQuery.trim().length >= 2 && searchResults.length === 0 ? (
            <p className="text-muted text-center py-3">No users found.</p>
          ) : (
            searchResults.map((user) => (
              <div key={user.id} className="d-flex align-items-center justify-content-between p-2 rounded-3 border bg-white shadow-sm mb-2">
                <div className="d-flex align-items-center gap-2">
                  <Avatar src={user.profile_picture} alt={user.username} size="sm" />
                  <div>
                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.92rem' }}>{user.first_name} {user.last_name}</h6>
                    <small className="text-muted">@{user.username}</small>
                  </div>
                </div>
                <button className="btn btn-aqua btn-sm rounded-3 px-3 fw-bold" style={{ fontSize: '0.8rem' }} onClick={() => handleSendRequest(user)} disabled={sending === user.id}>
                  {sending === user.id ? '...' : 'Add'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AddFriend;
