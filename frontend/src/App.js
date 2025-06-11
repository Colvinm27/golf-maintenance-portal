import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    course: '',
    hole: '',
    location: '',
    description: '',
    photo: null,
    memberType: '',
    memberNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.course) newErrors.course = 'Please select a course';
    if (!formData.hole) newErrors.hole = 'Please enter a hole number';
    if (!formData.location) newErrors.location = 'Please select a location';
    if (!formData.description) newErrors.description = 'Please provide a description';
    if (!formData.memberType) newErrors.memberType = 'Please select identification type';
    
    // Member number validation
    if (formData.memberType === 'member') {
      if (!formData.memberNumber) {
        newErrors.memberNumber = 'Please enter your member number';
      } else if (!/^[A-Za-z]\d{4}$/.test(formData.memberNumber)) {
        newErrors.memberNumber = 'Member number must be a letter followed by 4 digits (e.g., A1234)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
      // Clear member number when switching to guest
      ...(name === 'memberType' && value === 'guest' ? { memberNumber: '' } : {})
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus({
        success: false,
        message: 'Please fill in all required fields'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    
    const formDataToSend = new FormData();
    formDataToSend.append('course', formData.course);
    formDataToSend.append('hole', formData.hole);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('memberType', formData.memberType);
    if (formData.memberType === 'member') {
      formDataToSend.append('memberNumber', formData.memberNumber);
    }
    if (formData.photo) {
      formDataToSend.append('photo', formData.photo);
    }

    try {
      const response = await fetch('http://localhost:4000/report', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSubmitStatus({
        success: data.success,
        message: data.success ? 'Report submitted successfully!' : (data.error || 'Error submitting report.')
      });
      
      if (data.success) {
        setFormData({
          course: '',
          hole: '',
          location: '',
          description: '',
          photo: null,
          memberType: '',
          memberNumber: '',
        });
        setErrors({});
      }
    } catch (error) {
      console.error('Error details:', error);
      setSubmitStatus({
        success: false,
        message: `Error submitting report: ${error.message}. Please make sure the backend server is running.`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-brand">Golf Maintenance</div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Report Issue</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={
            <>
              <header>
                <h1>Report Maintenance Issue</h1>
                <p className="subtitle">Help us keep the course in perfect condition</p>
              </header>
              <main>
                <form onSubmit={handleSubmit} className="maintenance-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="course">
                        Course Name <span className="required">*</span>
                      </label>
                      <select
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        required
                        className={`course-select ${errors.course ? 'error' : ''}`}
                      >
                        <option value="">Select a course</option>
                        <option value="Regency Country Club">Regency Country Club</option>
                        <option value="Dominion Valley Country Club">Dominion Valley Country Club</option>
                      </select>
                      {errors.course && <span className="error-message">{errors.course}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="hole">
                        Hole Number <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        id="hole"
                        name="hole"
                        value={formData.hole}
                        onChange={handleChange}
                        min="1"
                        max="18"
                        placeholder="Enter hole (1-18)"
                        required
                        className={`hole-input ${errors.hole ? 'error' : ''}`}
                      />
                      {errors.hole && <span className="error-message">{errors.hole}</span>}
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="memberType">
                        Identification <span className="required">*</span>
                      </label>
                      <select
                        id="memberType"
                        name="memberType"
                        value={formData.memberType}
                        onChange={handleChange}
                        required
                        className={`member-type-select ${errors.memberType ? 'error' : ''}`}
                      >
                        <option value="">Select identification type</option>
                        <option value="guest">Guest</option>
                        <option value="member">Member</option>
                      </select>
                      {errors.memberType && <span className="error-message">{errors.memberType}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="location">
                        Location <span className="required">*</span>
                      </label>
                      <select
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className={`location-select ${errors.location ? 'error' : ''}`}
                      >
                        <option value="">Select location</option>
                        <option value="Green">Green</option>
                        <option value="Fairway">Fairway</option>
                        <option value="Bunker">Bunker</option>
                        <option value="Rough">Rough</option>
                        <option value="T-Box">T-Box</option>
                        <option value="Bathrooms">Bathrooms</option>
                        <option value="Water Station">Water Station</option>
                      </select>
                      {errors.location && <span className="error-message">{errors.location}</span>}
                    </div>
                  </div>

                  {formData.memberType === 'member' && (
                    <div className="form-group">
                      <label htmlFor="memberNumber">
                        Member Number <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="memberNumber"
                        name="memberNumber"
                        value={formData.memberNumber}
                        onChange={handleChange}
                        placeholder="Enter member number (e.g., A1234)"
                        required={formData.memberType === 'member'}
                        className={errors.memberNumber ? 'error' : ''}
                        maxLength="5"
                      />
                      {errors.memberNumber && <span className="error-message">{errors.memberNumber}</span>}
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="description">
                      Description <span className="required">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Please describe the maintenance issue in detail. Include any relevant information that will help our maintenance team."
                      required
                      className={errors.description ? 'error' : ''}
                    />
                    {errors.description && <span className="error-message">{errors.description}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="photo" className="file-upload-label">
                      <span className="file-upload-icon">📷</span>
                      <span className="file-upload-text">
                        {formData.photo ? formData.photo.name : 'Upload Photo (Optional)'}
                      </span>
                    </label>
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      onChange={handleChange}
                      accept="image/*"
                      className="file-input"
                    />
                  </div>

                  {submitStatus && (
                    <div className={`status-message ${submitStatus.success ? 'success' : 'error'}`}>
                      {submitStatus.message}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Report'
                    )}
                  </button>
                </form>
              </main>
            </>
          } />
          <Route path="/about" element={
            <div className="about-page">
              <h1>About Golf Maintenance Portal</h1>
              <p>This portal helps golf course members report maintenance issues quickly and efficiently.</p>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;
