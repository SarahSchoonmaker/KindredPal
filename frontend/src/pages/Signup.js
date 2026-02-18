import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PhotoUpload from "../components/PhotoUpload";
import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [profilePhotoIndex, setProfilePhotoIndex] = useState(0);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    age: "",
    gender: "",
    city: "",
    state: "",
    bio: "",
    politicalBeliefs: [],
    religion: "",
    causes: [],
    lifeStage: [],
    lookingFor: [],
  });

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const politicalOptions = [
    "Liberal",
    "Moderate",
    "Conservative",
    "Libertarian",
    "Prefer not to say",
  ];

  const religionOptions = [
    "Christian",
    "Muslim",
    "Jewish",
    "Hindu",
    "Buddhist",
    "Sikh",
    "Seeking/Undecided",
    "Agnostic",
    "Atheist",
    "Other",
    "Prefer not to say",
  ];

  const causesOptions = [
    "Environment",
    "Travel & Adventure",
    "Health & Wellness",
    "Healthcare & Medical Causes",
    "Education & Continuous Learning",
    "Art & Design",
    "Theater & Performing Arts",
    "Film & Cinema",
    "Music",
    "Books & Literature",
    "Museums & History",
    "Poetry & Writing",
    "Comedy & Entertainment",
    "Fashion & Style",
    "Video Games & Gaming",
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
    "Food & Cooking",
    "Photography",
    "Outdoor Activities",
  ];

  const lifeStageOptions = [
    // Relationship Status
    "Single",
    "In a Relationship",
    "Engaged",
    "Married",
    "Divorced",
    "Widowed",
    "Separated",
    // Family
    "Single Parent",
    "Have Children",
    "Child-free by Choice",
    "Want Children Someday",
    "Empty Nester",
    "Stay-at-Home Parent",
    "Caregiver",
    // Education
    "College Student",
    "Graduate Student",
    "Recent Graduate",
    // Career
    "Working Professional",
    "Career Focused",
    "Entrepreneur",
    "Career Transition",
    "Retired",
    "Semi-Retired",
    // Financial
    "Single Income No Kids (SINK)",
    "Dual-Income No Kids (DINK)",
  ];

  // ✅ FIXED: Aligned with backend enums
  const lookingForOptions = [
    "Friendship",
    "Romance",
    "Networking",
    "Activity Partner",
    "Mentor",
    "Community",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => {
      const array = prev[field];
      if (array.includes(value)) {
        return {
          ...prev,
          [field]: array.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [field]: [...array, value],
        };
      }
    });
  };

  const handlePhotosChange = (newPhotos, newProfileIndex) => {
    setPhotos(newPhotos);
    setProfilePhotoIndex(newProfileIndex);
  };

  const validateStep1 = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (
      !formData.name ||
      !formData.age ||
      !formData.gender ||
      !formData.city ||
      !formData.state ||
      !formData.bio
    ) {
      setError("Please fill in all required fields");
      return false;
    }
    if (formData.age < 18) {
      setError("You must be at least 18 years old");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (formData.lifeStage.length === 0) {
      setError(
        "Please select at least one life stage - this is very important for matching!",
      );
      return false;
    }
    if (formData.lookingFor.length === 0) {
      setError("Please select what you're looking for");
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (formData.politicalBeliefs.length === 0) {
      setError("Please select at least one political belief");
      return false;
    }

    if (!formData.religion) {
      setError("Please select your religious/spiritual beliefs");
      return false;
    }

    if (formData.causes.length < 3) {
      setError(
        "Please select at least 3 causes to help us find better matches",
      );
      return false;
    }

    return true;
  };

  const validateStep5 = () => {
    if (photos.length === 0) {
      setError("Please upload at least one photo");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError("");
    let isValid = false;

    switch (step) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateStep5()) {
      return;
    }

    setLoading(true);

    const { confirmPassword, ...signupData } = formData;

    // Add photos to signup data
    signupData.profilePhoto = photos[profilePhotoIndex];
    signupData.additionalPhotos = photos.filter(
      (_, i) => i !== profilePhotoIndex,
    );

    console.log("🎯 FRONTEND - Sending signup with photos");
    console.log("Profile photo length:", signupData.profilePhoto?.length || 0);
    console.log("Additional photos:", signupData.additionalPhotos?.length || 0);

    const result = await signup(signupData);

    if (result.success) {
      navigate("/discover");
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card signup-card">
          <h2>Join KindredPal</h2>
          <p className="auth-subtitle">
            Find your people based on what matters most
          </p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
          <p className="step-indicator">Step {step} of 5</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="form-step">
                <h3>Create Account</h3>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-full"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <h3>About You</h3>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      name="age"
                      className="form-input"
                      value={formData.age}
                      onChange={handleChange}
                      min="18"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      className="form-select"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-input"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      className="form-input"
                      value={formData.state}
                      onChange={handleChange}
                      maxLength={2}
                      placeholder="e.g., OR"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea
                    name="bio"
                    className="form-textarea"
                    value={formData.bio}
                    onChange={handleChange}
                    maxLength={500}
                    placeholder="Tell us about yourself..."
                    required
                  />
                  <small>{formData.bio.length}/500 characters</small>
                </div>

                <div className="button-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-step">
                <h3>Life Stage & Goals</h3>
                <p className="form-help">
                  ⭐ This is the MOST important for matching! Select all that
                  apply.
                </p>

                <div className="form-group">
                  <label className="form-label">
                    Life Stage (select all that apply) *
                  </label>
                  <div className="checkbox-grid">
                    {lifeStageOptions.map((stage) => (
                      <label
                        key={stage}
                        className={`checkbox-card ${formData.lifeStage.includes(stage) ? "selected" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.lifeStage.includes(stage)}
                          onChange={() =>
                            handleCheckboxChange("lifeStage", stage)
                          }
                        />
                        <span>{stage}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Looking For</label>
                  <div className="checkbox-grid">
                    {lookingForOptions.map((goal) => (
                      <label
                        key={goal}
                        className={`checkbox-card ${formData.lookingFor.includes(goal) ? "selected" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.lookingFor.includes(goal)}
                          onChange={() =>
                            handleCheckboxChange("lookingFor", goal)
                          }
                        />
                        <span>{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="button-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="form-step">
                <h3>Your Values & Interests</h3>
                <p className="form-help">
                  Help us find people who share your beliefs and passions
                </p>

                <div className="form-group">
                  <label className="form-label">
                    Political Beliefs (select at least 1) *
                  </label>
                  <div className="checkbox-grid">
                    {politicalOptions.map((belief) => (
                      <label
                        key={belief}
                        className={`checkbox-card ${formData.politicalBeliefs.includes(belief) ? "selected" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.politicalBeliefs.includes(belief)}
                          onChange={() =>
                            handleCheckboxChange("politicalBeliefs", belief)
                          }
                        />
                        <span>{belief}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Religion/Spirituality *</label>
                  <select
                    name="religion"
                    className="form-select"
                    value={formData.religion}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select...</option>
                    {religionOptions.map((religion) => (
                      <option key={religion} value={religion}>
                        {religion}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Causes You Care About (select at least 3) *
                  </label>
                  <div className="checkbox-grid">
                    {causesOptions.map((cause) => (
                      <label
                        key={cause}
                        className={`checkbox-card ${formData.causes.includes(cause) ? "selected" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.causes.includes(cause)}
                          onChange={() => handleCheckboxChange("causes", cause)}
                        />
                        <span>{cause}</span>
                      </label>
                    ))}
                  </div>
                  <small>{formData.causes.length} selected (minimum 3)</small>
                </div>

                <div className="button-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep(3)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="form-step">
                <h3>Add Your Photos</h3>
                <p className="form-help">
                  📸 Upload 1-3 photos. Select which one will be your main
                  profile picture.
                </p>

                <PhotoUpload
                  photos={photos}
                  onPhotosChange={handlePhotosChange}
                  maxPhotos={3}
                  profilePhotoIndex={profilePhotoIndex}
                />

                <div className="button-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep(4)}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || photos.length === 0}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="auth-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
