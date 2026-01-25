import React, { useState, useEffect } from "react";
import { Upload, X, Check } from "lucide-react";
import "./PhotoUpload.css";

const PhotoUpload = ({
  photos = [],
  onPhotosChange,
  maxPhotos = 3,
  profilePhotoIndex = 0,
}) => {
  const [previews, setPreviews] = useState([]);
  const [selectedProfileIndex, setSelectedProfileIndex] =
    useState(profilePhotoIndex);

  // Update previews when photos prop changes
  useEffect(() => {
    setPreviews([...photos]); // Create new array to force re-render
    setSelectedProfileIndex(profilePhotoIndex);
  }, [photos, profilePhotoIndex]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    if (previews.length + files.length > maxPhotos) {
      alert(`You can only upload ${maxPhotos} photos`);
      e.target.value = ""; // Reset input
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        e.target.value = ""; // Reset input
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => {
          const newPreviews = [...prev, reader.result];
          onPhotosChange(newPreviews, selectedProfileIndex);
          return newPreviews;
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleRemovePhoto = (index) => {
    setPreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      let newProfileIndex = selectedProfileIndex;

      // Adjust profile photo index if needed
      if (index === selectedProfileIndex) {
        newProfileIndex = 0; // Default to first photo
      } else if (index < selectedProfileIndex) {
        newProfileIndex = selectedProfileIndex - 1;
      }

      setSelectedProfileIndex(newProfileIndex);
      onPhotosChange(newPreviews, newProfileIndex);
      return newPreviews;
    });
  };

  const handleSetAsProfile = (index) => {
    setSelectedProfileIndex(index);
    onPhotosChange(previews, index);
  };

  return (
    <div className="photo-upload-container">
      <div className="photo-grid">
        {/* Show existing photos */}
        {previews.map((photo, index) => (
          <div
            key={`photo-${index}-${photo.substring(0, 30)}`}
            className="photo-item"
          >
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="photo-preview"
              key={photo.substring(0, 50)} // Force image re-render
            />

            {/* Profile Photo Badge */}
            {index === selectedProfileIndex && (
              <div className="profile-badge">
                <Check size={16} />
                Profile Photo
              </div>
            )}

            {/* Actions */}
            <div className="photo-actions">
              {index !== selectedProfileIndex && (
                <button
                  type="button"
                  className="btn-set-profile"
                  onClick={() => handleSetAsProfile(index)}
                  title="Set as profile photo"
                >
                  Set as Profile
                </button>
              )}
              <button
                type="button"
                className="btn-remove"
                onClick={() => handleRemovePhoto(index)}
                title="Remove photo"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}

        {/* Upload button */}
        {previews.length < maxPhotos && (
          <label className="photo-upload-box" key={`upload-${previews.length}`}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="file-input-hidden"
              key={`file-input-${previews.length}`} // Reset input
            />
            <Upload size={32} />
            <span>Add Photo</span>
            <small>
              {previews.length}/{maxPhotos}
            </small>
          </label>
        )}
      </div>

      {previews.length === 0 && (
        <p className="upload-hint">
          📸 Upload at least one photo to continue. You can add up to{" "}
          {maxPhotos} photos.
        </p>
      )}

      {previews.length > 0 && (
        <p className="upload-hint">
          ✅ Photo {selectedProfileIndex + 1} is set as your profile picture
        </p>
      )}
    </div>
  );
};

export default PhotoUpload;
