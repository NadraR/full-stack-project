import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_amount: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://localhost:8000/api/campaigns/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const campaign = response.data;
      setFormData({
        title: campaign.title,
        description: campaign.description,
        target_amount: campaign.target_amount,
        start_date: campaign.start_date,
        end_date: campaign.end_date
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      if (error.response?.status === 404) {
        setError('Campaign not found.');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to edit this campaign.');
      } else {
        setError('Failed to load campaign. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required.');
      setSubmitting(false);
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required.');
      setSubmitting(false);
      return;
    }
    if (!formData.target_amount || parseFloat(formData.target_amount) < 100) {
      setError('Target amount must be at least $100.');
      setSubmitting(false);
      return;
    }
    if (!formData.start_date || !formData.end_date) {
      setError('Start date and end date are required.');
      setSubmitting(false);
      return;
    }
    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      setError('End date must be after start date.');
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`http://localhost:8000/api/campaigns/${id}/`, {
        ...formData,
        target_amount: parseFloat(formData.target_amount)
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccess('Campaign updated successfully! Redirecting to My Projects...');
      setTimeout(() => {
        navigate('/my-projects');
      }, 2000);
    } catch (error) {
      console.error('Error updating campaign:', error);
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          const errorMessages = Object.values(errorData).flat();
          setError(errorMessages.join(', '));
        } else {
          setError(errorData);
        }
      } else {
        setError('Failed to update campaign. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-home-bg min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="glass-home-bg min-vh-100 py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-sm-10">
              <div className="glass-card card shadow-lg border-0" style={{
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}>
                <div className="card-header bg-gradient-danger text-center py-4" style={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                  borderRadius: '20px 20px 0 0',
                  border: 'none'
                }}>
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{
                      width: '50px',
                      height: '50px',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                    }}>
                      <span style={{ fontSize: '24px' }}>❌</span>
                    </div>
                    <h3 className="mb-0 text-white fw-bold">Error</h3>
                  </div>
                </div>
                <div className="card-body p-5 text-center">
                  <div className="alert alert-danger shadow-sm" role="alert" style={{
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)'
                  }}>
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="me-2">⚠️</span>
                      <strong>{error}</strong>
                    </div>
                  </div>
                <button 
                    className="btn btn-outline-secondary btn-lg mt-3"
                  onClick={() => navigate('/my-projects')}
                    style={{
                      borderRadius: '12px',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span className="me-2">←</span>
                  Back to My Projects
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-home-bg min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10 col-sm-12">
            <div className="glass-card card shadow-lg border-0" style={{
              borderRadius: '20px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}>
              <div className="card-header bg-gradient-primary text-center py-4" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px 20px 0 0',
                border: 'none'
              }}>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{
                    width: '50px',
                    height: '50px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}>
                    <span style={{ fontSize: '24px' }}>✏️</span>
                  </div>
                  <h3 className="mb-0 text-white fw-bold">Edit Campaign</h3>
                </div>
                <p className="text-white-50 mb-0">Update your campaign information</p>
              </div>
              <div className="card-body p-5">
                {success && (
                  <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert" style={{
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)'
                  }}>
                    <div className="d-flex align-items-center">
                      <span className="me-2">✅</span>
                    <strong>Success!</strong> {success}
                    </div>
                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="title" className="form-label fw-semibold d-flex align-items-center">
                      <span className="me-2">📝</span>
                      Campaign Title <span className="text-danger ms-1">*</span>
                    </label>
                    <div className="input-group input-group-lg shadow-sm">
                    <input
                        id="title"
                        name="title"
                      type="text"
                      className="form-control"
                        placeholder="Enter your campaign title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                        style={{
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="description" className="form-label fw-semibold d-flex align-items-center">
                      <span className="me-2">📄</span>
                      Description <span className="text-danger ms-1">*</span>
                    </label>
                    <div className="input-group input-group-lg shadow-sm">
                    <textarea
                      id="description"
                      name="description"
                        className="form-control"
                        placeholder="Describe your campaign in detail..."
                      value={formData.description}
                      onChange={handleChange}
                        rows="4"
                      required
                        style={{
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="target_amount" className="form-label fw-semibold d-flex align-items-center">
                      <span className="me-2">💰</span>
                      Target Amount ($) <span className="text-danger ms-1">*</span>
                    </label>
                    <div className="input-group input-group-lg shadow-sm">
                      <span className="input-group-text" style={{
                        borderRadius: '12px 0 0 12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}>$</span>
                      <input
                        id="target_amount"
                        name="target_amount"
                        type="number"
                        className="form-control"
                        placeholder="Enter target amount"
                        value={formData.target_amount}
                        onChange={handleChange}
                        min="100"
                        step="0.01"
                        required
                        style={{
                          borderRadius: '0 12px 12px 0',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                    <div className="form-text mt-1">Minimum amount: $100.00</div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label htmlFor="start_date" className="form-label fw-semibold d-flex align-items-center">
                        <span className="me-2">📅</span>
                        Start Date <span className="text-danger ms-1">*</span>
                      </label>
                      <div className="input-group input-group-lg shadow-sm">
                      <input
                          id="start_date"
                          name="start_date"
                        type="date"
                        className="form-control"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                          style={{
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <label htmlFor="end_date" className="form-label fw-semibold d-flex align-items-center">
                        <span className="me-2">⏰</span>
                        End Date <span className="text-danger ms-1">*</span>
                      </label>
                      <div className="input-group input-group-lg shadow-sm">
                      <input
                          id="end_date"
                          name="end_date"
                        type="date"
                        className="form-control"
                        value={formData.end_date}
                        onChange={handleChange}
                        required
                          style={{
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="d-grid gap-3 mt-5">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary btn-lg shadow-lg"
                      style={{
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        padding: '12px 24px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        transform: 'translateY(0)',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (!submitting) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
                          e.target.style.background = 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                        e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                      }}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Updating Campaign...
                        </>
                      ) : (
                        <>
                          <span className="me-2">💾</span>
                          Update Campaign
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg"
                      onClick={() => navigate('/my-projects')}
                      disabled={submitting}
                      style={{
                        borderRadius: '12px',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <span className="me-2">←</span>
                      Back to My Projects
                    </button>
                  </div>

                  <div className="text-center mt-4">
                    <small className="text-muted">
                      Make sure all information is accurate before updating your campaign
                    </small>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProject; 