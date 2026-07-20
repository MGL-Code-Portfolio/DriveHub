import { useState } from 'react';
import '../../css/Modals.css';
import DeleteAccount from './DeleteAccount.jsx';
import Avatar from '../layout/Avatar.jsx';
import { useAuth } from '../../contexts/AuthContext';

function ManageAccount({ isOpen, onClose }) {
  const { user, updateProfile, deleteAccount } = useAuth();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(user?.profile_picture || '');

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };


  const getProfileImage = (image) => {

    if (!image) {
      return 'https://i.pravatar.cc/150?img=12';
    }

    if (image.startsWith('http')) {
      return image;
    }

    return `http://localhost:8000${image}`;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    const formData = new FormData();

    formData.append('username', e.target.username.value);
    formData.append('bio', e.target.bio.value || '');
    formData.append('location', e.target.location.value || '');

    if (e.target.is_private) {
      formData.append('is_private', e.target.is_private.checked);
    }

    if (profileImage) {
      formData.append('profile_picture', profileImage);
    }

    try {
      await updateProfile(formData);
      onClose();
    } catch (err) {
      const errors = err.response?.data;

      if (errors) {
        const messages = Object.entries(errors).map(([key, val]) =>
          `${key}: ${Array.isArray(val) ? val.join(', ') : val}`
        );

        setError(messages.join(' | '));
      } else {
        setError('Failed to update profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
    } catch (err) {
      console.error('Error deleting account:', err);
    }
  };

  return (
    <>
      <div className="modal-overlay" style={{ zIndex: 1000 }}>
        <div
          className="modal-box shadow-lg p-0"
          style={{
            maxWidth: '500px',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
            <div>
              <h3 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.4rem' }}>
                Edit Profile
              </h3>

              <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                Update your personal details
              </p>
            </div>

            <button
              type="button"
              className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
              onClick={onClose}
              style={{
                width: '40px',
                height: '40px',
              }}
            >
              <i className="bi bi-x-lg text-secondary"></i>
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div
              className="p-4"
              style={{
                maxHeight: '65vh',
                overflowY: 'auto',
              }}
            >
              {error && (
                <div className="alert alert-danger py-2 mb-3">
                  {error}
                </div>
              )}

              <div className="d-flex flex-column align-items-center mb-4 pb-2 border-bottom">
                <div className="position-relative mb-3">
                  <Avatar
                    src={profilePreview || user?.profile_picture}
                    alt={user?.username}
                    size="xl"
                  />

                  <input
                    type="file"
                    id="profilePictureInput"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />

                  <label
                    htmlFor="profilePictureInput"
                    className="btn btn-dark position-absolute bottom-0 end-0 rounded-circle shadow d-flex align-items-center justify-content-center"
                    style={{
                      width: '36px',
                      height: '36px',
                      padding: 0,
                      border: '2px solid white',
                      cursor: 'pointer',
                    }}
                    title="Upload new photo"
                  >
                    <i className="bi bi-camera-fill" style={{ fontSize: '1rem' }}></i>
                  </label>
                </div>

                <span className="fw-semibold text-dark">
                  @{user?.username}
                </span>
              </div>

              <div className="d-flex flex-column gap-3">
                <div>
                  <label
                    className="form-label fw-semibold text-dark mb-1"
                    style={{ fontSize: '0.95rem' }}
                  >
                    Username
                  </label>

                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      @
                    </span>

                    <input
                      type="text"
                      name="username"
                      className="form-control border-start-0 ps-0 shadow-none"
                      defaultValue={user?.username}
                      style={{
                        backgroundColor: 'white',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="form-label fw-semibold text-dark mb-1"
                    style={{ fontSize: '0.95rem' }}
                  >
                    Bio
                  </label>

                  <textarea
                    name="bio"
                    className="form-control shadow-none"
                    rows="3"
                    defaultValue={user?.bio || ''}
                    style={{
                      resize: 'none',
                    }}
                  />
                </div>


                <div>
                  <label
                    className="form-label fw-semibold text-dark mb-1"
                    style={{ fontSize: '0.95rem' }}
                  >
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    className="form-control shadow-none"
                    defaultValue={user?.location || ''}
                    placeholder="E.g.: Lisboa"
                    style={{ backgroundColor: 'white' }}
                  />
                </div>


                <div className="mt-2">
                  <label
                    className="form-label fw-semibold text-dark mb-1"
                    style={{ fontSize: '0.95rem' }}
                  >
                    Privacy
                  </label>

                  <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light">
                    <div>
                      <h6
                        className="mb-0 fw-bold text-dark"
                        style={{ fontSize: '0.95rem' }}
                      >
                        Private Account
                      </h6>

                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                        Only approved friends can view your garage
                      </span>
                    </div>

                    <div className="form-check form-switch m-0">
                      <input
                        className="form-check-input shadow-none"
                        type="checkbox"
                        name="is_private"
                        defaultChecked={user?.is_private || false}
                        style={{
                          transform: 'scale(1.2)',
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top">
                  <label
                    className="form-label fw-bold text-danger mb-2"
                    style={{ fontSize: '0.95rem' }}
                  >
                    Danger Zone
                  </label>

                  <div className="d-flex align-items-center justify-content-between p-3 border border-danger border-opacity-25 rounded-3 bg-danger bg-opacity-10">
                    <div>
                      <h6
                        className="mb-0 fw-bold text-danger"
                        style={{ fontSize: '0.95rem' }}
                      >
                        Delete Account
                      </h6>

                      <span className="text-danger opacity-75" style={{ fontSize: '0.85rem' }}>
                        This action cannot be undone
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm fw-semibold rounded-3 px-3"
                      onClick={() => setIsDeleteOpen(true)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border-top bg-light d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-white border fw-semibold px-4 rounded-3 text-dark shadow-sm"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-dark fw-bold px-4 rounded-3 shadow-sm"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <DeleteAccount
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
}

export default ManageAccount;