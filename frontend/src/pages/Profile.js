import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit2, Save, X, Trash2, Mail, UserMinus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";
import api from "../services/api";
import PhotoUpload from "../components/PhotoUpload";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
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
    emailNotifications: {
      newMatch: true,
      newMessage: true,
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
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
    };

    fetchUserData();
  }, [user]);

  const handleUnmatch = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to unmatch with ${userName}? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await api.post(`/users/unmatch/${userId}`);
      alert("Unmatched successfully");
      navigate("/matches");
    } catch (error) {
      console.error("Error unmatching:", error);
      alert("Failed to unmatch");
    }
  };

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
          <div className="header-actions">
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

          {/* Values & Preferences - Only show in edit mode */}
          {isEditing && (
            <>
              <section className="profile-section">
                <h2>Political Beliefs</h2>
                <div className="form-field">
                  <select
                    name="politicalBeliefs"
                    value={formData.politicalBeliefs[0] || ""}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        politicalBeliefs: [e.target.value],
                      }));
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="Liberal">Liberal</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Conservative">Conservative</option>
                    <option value="Libertarian">Libertarian</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </section>

              <section className="profile-section">
                <h2>Religion</h2>
                <div className="form-field">
                  <select
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                  >
                    <option value="">Select...</option>
                    <option value="Christian">Christian</option>
                    <option value="Jewish">Jewish</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Spiritual">Spiritual</option>
                    <option value="Agnostic">Agnostic</option>
                    <option value="Atheist">Atheist</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </section>

              <section className="profile-section">
                <h2>Life Stage</h2>
                <div className="form-field">
                  <select
                    name="lifeStage"
                    value={formData.lifeStage[0] || ""}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        lifeStage: [e.target.value],
                      }));
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="Single">Single</option>
                    <option value="In a Relationship">In a Relationship</option>
                    <option value="Engaged">Engaged</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Single Parent">Single Parent</option>
                    <option value="Have Children">Have Children</option>
                    <option value="Child-free by Choice">
                      Child-free by Choice
                    </option>
                    <option value="Want Children Someday">
                      Want Children Someday
                    </option>
                    <option value="Empty Nester">Empty Nester</option>
                    <option value="Stay-at-Home Parent">
                      Stay-at-Home Parent
                    </option>
                    <option value="Caregiver">Caregiver</option>
                    <option value="College Student">College Student</option>
                    <option value="Graduate Student">Graduate Student</option>
                    <option value="Recent Graduate">Recent Graduate</option>
                    <option value="Working Professional">
                      Working Professional
                    </option>
                    <option value="Career Focused">Career Focused</option>
                    <option value="Entrepreneur">Entrepreneur</option>
                    <option value="Career Transition">Career Transition</option>
                    <option value="Retired">Retired</option>
                    <option value="Semi-Retired">Semi-Retired</option>
                    <option value="Single Income No Kids (SINK)">
                      Single Income No Kids (SINK)
                    </option>
                    <option value="Dual-Income No Kids (DINK)">
                      Dual-Income No Kids (DINK)
                    </option>
                  </select>
                </div>
              </section>

              <section className="profile-section">
                <h2>Looking For</h2>
                <div className="form-field">
                  <select
                    name="lookingFor"
                    value={formData.lookingFor[0] || ""}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        lookingFor: [e.target.value],
                      }));
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="Friendship">Friendship</option>
                    <option value="Romance">Romance</option>
                    <option value="Networking">Networking</option>
                    <option value="Activity Partner">Activity Partner</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Community">Community</option>
                  </select>
                </div>
              </section>

              <section className="profile-section">
                <h2>Causes & Interests</h2>
                <p className="section-subtitle">
                  Select up to 5 causes you care about
                </p>
                <div className="causes-checkboxes">
                  {[
                    "Environment",
                    "Travel & Adventure",
                    "Health & Wellness",
                    "Healthcare & Medical Causes",
                    "Education & Continuous Learning",
                    "Arts & Culture",
                    "Community Service",
                    "Animal Welfare",
                    "Social Justice",
                    "Technology & Innovation",
                    "Entrepreneurship",
                    "Fitness & Active Living",
                    "Skilled Trades & Craftsmanship",
                    "Ministry",
                    "Psychology & Mental Health",
                    "Philosophy",
                  ].map((cause) => (
                    <label key={cause} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.causes.includes(cause)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({
                            ...prev,
                            causes: checked
                              ? [...prev.causes, cause]
                              : prev.causes.filter((c) => c !== cause),
                          }));
                        }}
                        disabled={
                          !formData.causes.includes(cause) &&
                          formData.causes.length >= 5
                        }
                      />
                      {cause}
                    </label>
                  ))}
                </div>
              </section>
            </>
          )}

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
                    {Array.isArray(user.politicalBeliefs)
                      ? user.politicalBeliefs.join(", ")
                      : user.politicalBeliefs}
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
                  <span className="tag">
                    {Array.isArray(user.lifeStage)
                      ? user.lifeStage.join(", ")
                      : user.lifeStage}
                  </span>
                </div>
              </section>

              <section className="profile-section">
                <h2>Looking For</h2>
                <div className="tags-display">
                  <span className="tag">
                    {Array.isArray(user.lookingFor)
                      ? user.lookingFor.join(", ")
                      : user.lookingFor}
                  </span>
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
