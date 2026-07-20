import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Modals.css';
import Avatar from '../layout/Avatar.jsx';
import RemoveFriend from "./RemoveFriend.jsx";
import AddFriend from "./AddFriend.jsx";
import api from '../../api/axios';

function FriendsList({ isOpen, onClose, onRequestHandled }) {
  const navigate = useNavigate();
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendships, setFriendships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('friends');

  const fetchFriends = async () => {
    try {
      const res = await api.get('/social/friends/');
      setFriendships(res.data);
    } catch (err) {
      console.error('Error fetching friends:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
      setActiveTab('friends');
    }
  }, [isOpen]);

  const handleRemoveClick = (friendship) => {
    setSelectedFriend(friendship);
    setIsRemoveOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedFriend) return;
    try {
      await api.delete(`/social/friends/${selectedFriend.id}/`);
      setIsRemoveOpen(false);
      setSelectedFriend(null);
      fetchFriends();
    } catch (err) {
      console.error('Error removing friend:', err);
    }
  };

  const handleAccept = async (friendshipId) => {
    try {
      await api.put(`/social/friends/${friendshipId}/`, { status: 'accepted' });
      fetchFriends();
      if (onRequestHandled) onRequestHandled();
    } catch (err) {
      console.error('Error accepting friend:', err);
    }
  };

  const handleReject = async (friendshipId) => {
    try {
      await api.delete(`/social/friends/${friendshipId}/`);
      fetchFriends();
      if (onRequestHandled) onRequestHandled();
    } catch (err) {
      console.error('Error rejecting friend:', err);
    }
  };

  const handleMessageClick = () => {
    onClose();
    navigate('/messages');
  };

  if (!isOpen) return null;

  const acceptedFriends = friendships.filter(f => f.status === 'accepted');
  const incomingRequests = friendships.filter(f => f.status === 'pending');

  const getFriendPicture = (f) => f.sender_picture || f.receiver_picture || null;
  const getFriendName = (f) => f.sender_name || f.receiver_name;

  return (
    <>
      <div className="modal-overlay" style={{ zIndex: 1000, background: 'rgba(0, 0, 0, 0.6)' }}>
        <div className="modal-box" style={{ maxWidth: '600px', width: '100%', borderRadius: '16px', padding: '24px', backgroundColor: '#ffffff', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', position: 'relative' }}>
          <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
            <div className="d-flex align-items-center gap-3">
              <h2 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.4rem' }}>Friends</h2>
              {incomingRequests.length > 0 && <span className="badge bg-danger rounded-pill">{incomingRequests.length}</span>}
            </div>
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-aqua btn-sm rounded-3 px-3 fw-bold d-flex align-items-center gap-1" onClick={() => setIsAddOpen(true)} style={{ fontSize: '0.85rem', padding: '8px 14px', height: '36px' }}>
                <i className="bi bi-person-plus-fill"></i> Add Friend
              </button>
              <button type="button" className="btn btn-light rounded-circle d-flex align-items-center justify-content-center border-0 p-0" onClick={onClose} style={{ width: '32px', height: '32px', cursor: 'pointer', backgroundColor: '#f8f9fa' }}>
                <i className="bi bi-x-lg text-secondary" style={{ fontSize: '0.9rem' }}></i>
              </button>
            </div>
          </div>

          <div className="d-flex gap-2 mb-3">
            <button className={`btn btn-sm rounded-3 px-3 fw-bold ${activeTab === 'friends' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setActiveTab('friends')}>
              Friends ({acceptedFriends.length})
            </button>
            <button className={`btn btn-sm rounded-3 px-3 fw-bold ${activeTab === 'requests' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setActiveTab('requests')}>
              Requests {incomingRequests.length > 0 && <span className="badge bg-danger ms-1 rounded-pill" style={{ fontSize: '0.7rem' }}>{incomingRequests.length}</span>}
            </button>
          </div>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : activeTab === 'requests' ? (
            <div className="d-flex flex-column gap-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {incomingRequests.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-person-check" style={{ fontSize: '2rem' }}></i>
                  <p className="mt-2 mb-0">No pending requests.</p>
                </div>
              ) : incomingRequests.map((f) => (
                <div key={f.id} className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-white border shadow-sm">
                  <div className="d-flex align-items-center gap-3">
                    <Avatar src={getFriendPicture(f)} alt={getFriendName(f)} size="md" />
                    <div>
                      <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.95rem' }}>{getFriendName(f)}</h6>
                      <small className="text-muted">wants to be your friend</small>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-aqua btn-sm rounded-3 px-3 fw-bold" onClick={() => handleAccept(f.id)}>Accept</button>
                    <button className="btn btn-outline-secondary btn-sm rounded-3 px-3" onClick={() => handleReject(f.id)}>Decline</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex flex-column gap-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {acceptedFriends.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-people" style={{ fontSize: '2rem' }}></i>
                  <p className="mt-2 mb-0">No friends yet.</p>
                  <p className="small">Use "Add Friend" to connect with other drivers.</p>
                </div>
              ) : acceptedFriends.map((f) => (
                <div key={f.id} className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-white border shadow-sm">
                  <div className="d-flex align-items-center gap-3">
                    <Avatar src={getFriendPicture(f)} alt={getFriendName(f)} size="md" />
                    <div>
                      <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.95rem' }}>{getFriendName(f)}</h6>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-light btn-sm rounded-3 border px-2 py-1" onClick={handleMessageClick} title="Send Message">
                      <i className="bi bi-chat-left-text text-secondary"></i>
                    </button>
                    <button className="btn btn-light btn-sm rounded-3 border px-2 py-1" onClick={() => handleRemoveClick(f)} title="Remove Friend">
                      <i className="bi bi-person-x text-danger"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <RemoveFriend isOpen={isRemoveOpen} onClose={() => { setIsRemoveOpen(false); setSelectedFriend(null); }} onConfirm={handleConfirmRemove} friendName={selectedFriend ? getFriendName(selectedFriend) : ""} />
      <AddFriend isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onFriendAdded={fetchFriends} />
    </>
  );
}

export default FriendsList;
