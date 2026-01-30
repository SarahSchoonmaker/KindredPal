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
    setPreviews([...photos]);
    setSelectedProfileIndex(profilePhotoIndex);
  }, [photos, profilePhotoIndex]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    if (previews.length + files.length > maxPhotos) {
      alert(`You can only upload ${maxPhotos} photos`);
      e.target.value = "";
      return;
    }

    // Process all files first, then update state once
    const filePromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        if (file.size > 5 * 1024 * 1024) {
          alert("File size must be less than 5MB");
          reject(new Error("File too large"));
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises)
      .then((newPhotos) => {
        const updatedPreviews = [...previews, ...newPhotos];
        setPreviews(updatedPreviews);
        // ✅ FIX: Call onPhotosChange with the new array, not inside setPreviews
        if (typeof onPhotosChange === "function") {
          onPhotosChange(updatedPreviews, selectedProfileIndex);
        }
      })
      .catch((error) => {
        console.error("Error loading photos:", error);
      });

    e.target.value = "";
  };

  const handleRemovePhoto = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    let newProfileIndex = selectedProfileIndex;

    // Adjust profile photo index if needed
    if (index === selectedProfileIndex) {
      newProfileIndex = 0;
    } else if (index < selectedProfileIndex) {
      newProfileIndex = selectedProfileIndex - 1;
    }

    setPreviews(newPreviews);
    setSelectedProfileIndex(newProfileIndex);

    // ✅ FIX: Call onPhotosChange after state is calculated
    if (typeof onPhotosChange === "function") {
      onPhotosChange(newPreviews, newProfileIndex);
    }
  };

  const handleSetAsProfile = (index) => {
    setSelectedProfileIndex(index);

    // ✅ FIX: Call onPhotosChange with current previews
    if (typeof onPhotosChange === "function") {
      onPhotosChange(previews, index);
    }
  };

  return (
    <div className="photo-upload-container">
      <div className="photo-grid">
        {/* Show existing photos */}
        {previews.map((photo, index) => (
          <div key={`photo-${index}`} className="photo-item">
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="photo-preview"
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
          <label className="photo-upload-box">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="file-input-hidden"
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
