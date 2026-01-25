import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit2, Save, X, Trash2, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";
import PhotoUpload from "../components/PhotoUpload";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    city: "",
    state: "",
    bio: "",
    politicalBeliefs: [],
    religion: "",
    causes: [],
    lifeStage: [],
    lookingFor: [],
    profilePhoto: "",
    additionalPhotos: [],
    // NEW: Email notification settings
    emailNotifications: {
      newMatch: true,
      newMessage: true,
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        age: user.age || "",
        city: user.city || "",
        state: user.state || "",
        bio: user.bio || "",
        politicalBeliefs: user.politicalBeliefs || [],
        religion: user.religion || "",
        causes: user.causes || [],
        lifeStage: user.lifeStage || [],
        lookingFor: user.lookingFor || [],
        profilePhoto: user.profilePhoto || "",
        additionalPhotos: user.additionalPhotos || [],
        emailNotifications: user.emailNotifications || {
          newMatch: true,
          newMessage: true,
        },
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const response = await userAPI.updateProfile(formData);
      updateUser(response.data);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userAPI.deleteAccount();
      alert("Your account has been deleted.");
      logout();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account. Please try again.");
    }
  };

  const handlePhotoUpdate = (photoData) => {
    setFormData((prev) => ({
      ...prev,
      ...photoData,
    }));
    setShowPhotoUpload(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailToggle = (type) => {
    setFormData((prev) => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [type]: !prev.emailNotifications[type],
      },
    }));
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <h1>My Profile</h1>
          {!isEditing ? (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              <Edit2 size={20} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn-save" onClick={handleSave}>
                <Save size={20} />
                <span>Save</span>
              </button>
              <button
                className="btn-cancel"
                onClick={() => setIsEditing(false)}
              >
                <X size={20} />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Photo Section */}
          <section className="profile-section">
            <h2>Photos</h2>
            <div className="photo-section">
              <div className="main-photo-container">
                <img
                  src={formData.profilePhoto || "/default-avatar.png"}
                  alt="Profile"
                  className="main-photo"
                />
                {isEditing && (
                  <button
                    className="photo-edit-btn"
                    onClick={() => setShowPhotoUpload(true)}
                  >
                    <Camera size={20} />
                    <span>Change Photo</span>
                  </button>
                )}
              </div>

              {formData.additionalPhotos?.length > 0 && (
                <div className="additional-photos">
                  {formData.additionalPhotos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Additional ${index + 1}`}
                      className="additional-photo"
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
          {/* Basic Info */}
          <section className="profile-section">
            <h2>Basic Information</h2>
            {isEditing ? (
              <div className="form-fields">
                <div className="form-field">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>
              </div>
            ) : (
              <div className="info-display">
                <p>
                  <strong>Name:</strong> {user.name}, {user.age}
                </p>
                <p>
                  <strong>Location:</strong> {user.city}, {user.state}
                </p>
                <p>
                  <strong>Bio:</strong> {user.bio}
                </p>
              </div>
            )}
          </section>
          // Replace the Email Notifications section in your Profile.js with
          this:
          {/* Email Notifications */}
          <section className="profile-section">
            <h2>
              <Mail size={24} />
              Email Notifications
            </h2>
            <div className="email-settings">
              <div className="email-toggle">
                <div className="toggle-info">
                  <strong>New Match Notifications</strong>
                  <p>Get notified when someone matches with you</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.emailNotifications.newMatch}
                    onChange={async () => {
                      const newValue = !formData.emailNotifications.newMatch;
                      handleEmailToggle("newMatch");

                      // Auto-save when toggled
                      try {
                        const updated = {
                          ...formData.emailNotifications,
                          newMatch: newValue,
                        };
                        await userAPI.updateNotificationSettings(updated);
                        console.log("✅ Notification settings saved");
                      } catch (error) {
                        console.error("Error saving settings:", error);
                      }
                    }}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="email-toggle">
                <div className="toggle-info">
                  <strong>New Message Notifications</strong>
                  <p>Get notified when you receive a new message</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.emailNotifications.newMessage}
                    onChange={async () => {
                      const newValue = !formData.emailNotifications.newMessage;
                      handleEmailToggle("newMessage");

                      // Auto-save when toggled
                      try {
                        const updated = {
                          ...formData.emailNotifications,
                          newMessage: newValue,
                        };
                        await userAPI.updateNotificationSettings(updated);
                        console.log("✅ Notification settings saved");
                      } catch (error) {
                        console.error("Error saving settings:", error);
                      }
                    }}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </section>
          {/* Values Section - Only show in view mode */}
          {!isEditing && (
            <>
              <section className="profile-section">
                <h2>My Values</h2>
                <div className="values-display">
                  <div className="value-item">
                    <strong>Religion:</strong> {user.religion}
                  </div>
                  <div className="value-item">
                    <strong>Political Beliefs:</strong>{" "}
                    {user.politicalBeliefs?.join(", ")}
                  </div>
                  <div className="value-item">
                    <strong>Causes I Care About:</strong>{" "}
                    {user.causes?.join(", ")}
                  </div>
                </div>
              </section>

              <section className="profile-section">
                <h2>Life Stage</h2>
                <div className="tags-display">
                  {user.lifeStage?.map((stage) => (
                    <span key={stage} className="tag">
                      {stage}
                    </span>
                  ))}
                </div>
              </section>

              <section className="profile-section">
                <h2>Looking For</h2>
                <div className="tags-display">
                  {user.lookingFor?.map((goal) => (
                    <span key={goal} className="tag">
                      {goal}
                    </span>
                  ))}
                </div>
              </section>
            </>
          )}
          {/* Danger Zone */}
          <section className="profile-section danger-zone">
            <h2>
              <Trash2 size={24} />
              Danger Zone
            </h2>
            <div className="danger-content">
              <div className="danger-info">
                <strong>Delete Account</strong>
                <p>
                  Once you delete your account, there is no going back. All your
                  matches, messages, and profile data will be permanently
                  deleted.
                </p>
              </div>
              <button
                className="btn-delete"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setShowPhotoUpload(false)}
            >
              <X size={24} />
            </button>
            <PhotoUpload
              currentPhoto={formData.profilePhoto}
              additionalPhotos={formData.additionalPhotos}
              onPhotoUpdate={handlePhotoUpdate}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirm-modal">
            <h2>Delete Account?</h2>
            <p>
              Are you absolutely sure you want to delete your account? This
              action cannot be undone.
            </p>
            <div className="delete-confirm-actions">
              <button
                className="btn-delete-confirm"
                onClick={handleDeleteAccount}
              >
                Yes, Delete My Account
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
