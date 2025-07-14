
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useOutletContext, useNavigate } from 'react-router-dom';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Add token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState('');
  const [dateInputFocused, setDateInputFocused] = useState(false); // <-- add this
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationLoading, setDonationLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { isDarkMode } = useTheme();
  const { isLoggedIn } = useOutletContext();
  const navigate = useNavigate();

  const handleProtectedClick = (path) => {
    if (!isLoggedIn) {
      localStorage.setItem("redirectAfterLogin", path);
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    getCurrentUser();
  }, []);

  // Handle donation redirect after login
  useEffect(() => {
    if (isLoggedIn) {
      const redirectPath = localStorage.getItem("redirectAfterLogin");
      if (redirectPath === "/") {
        localStorage.removeItem("redirectAfterLogin");
        // User is already on home page, no need to redirect
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, searchDate]);

  const fetchCampaigns = () => {
    setLoading(true);
    API.get('/campaigns/')
      .then(res => {
        console.log('Fetched campaigns:', res.data);
        setCampaigns(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching campaigns:', err);
        setLoading(false);
      });
  };

  const getCurrentUser = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Decode JWT token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  };

  const handleDelete = (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      API.delete(`/campaigns/${campaignId}/`)
        .then(() => {
          fetchCampaigns(); // Refresh the list
        })
        .catch(err => {
          console.error('Error deleting campaign:', err);
        });
    }
  };

  const handleEdit = (campaignId) => {
    // Navigate to edit page
    window.location.href = `/edit-campaign/${campaignId}`;
  };

  const handleDonate = (campaignId) => {
    if (!isLoggedIn) {
      // Store the home page redirect after login
      localStorage.setItem("redirectAfterLogin", "/");
      navigate("/login");
      return;
    }
    
    const campaign = campaigns.find(c => c.id === campaignId);
    setSelectedCampaign(campaign);
    setDonationAmount('');
    setShowDonationModal(true);
  };

  const submitDonation = () => {
    if (!donationAmount || isNaN(donationAmount) || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid amount greater than 0.');
      return;
    }

    setDonationLoading(true);
    const donationData = {
      campaign: selectedCampaign.id,
      amount: parseFloat(donationAmount)
    };

    API.post('/donations/', donationData)
    .then(response => {
      // Close modal and reset form
      setShowDonationModal(false);
      setDonationAmount('');
      setSelectedCampaign(null);
      
      // Show success alert
      alert('🎉 Thank you for your donation! Your contribution has been successfully processed.');
      
      // Refresh campaigns to show updated progress
      fetchCampaigns();
      
      console.log('Donation successful:', response.data);
    })
    .catch(error => {
      console.error('Error making donation:', error);
      if (error.response?.status === 401) {
        showToast('Please log in to make a donation.', 'error');
      } else {
        showToast('Failed to process donation. Please try again.', 'error');
      }
    })
    .finally(() => {
      setDonationLoading(false);
    });
  };

  const showToast = (message, type = 'info') => {
    // Create toast element
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
      toast.remove();
    });
  };

  const createToastContainer = () => {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filterCampaigns = () => {
    if (!searchDate) {
      setFilteredCampaigns(campaigns);
      return;
    }

    const filtered = campaigns.filter(campaign => {
      try {
        const campaignStartDate = new Date(campaign.start_date);
        const searchDateObj = new Date(searchDate);
        
        // Handle invalid dates
        if (isNaN(campaignStartDate.getTime()) || isNaN(searchDateObj.getTime())) {
          return false;
        }
        
        // Compare only the date part (year, month, day)
        return campaignStartDate.toDateString() === searchDateObj.toDateString();
      } catch (error) {
        console.error('Error filtering campaign by date:', error);
        return false;
      }
    });

    setFilteredCampaigns(filtered);
  };

  const clearSearch = () => {
    setSearchDate('');
  };

  if (loading) {
    return (
      <div className="glass-home-bg min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-white">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section style={{
        paddingInline: '100px',
        minHeight: '100vh',
        background: isDarkMode ? '#232136' : '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode 
            ? 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.05) 0%, transparent 50%)',
          zIndex: 1
        }}></div>

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start">
              <div className="glass-card p-5" style={{
                background: isDarkMode 
                  ? 'rgba(40, 38, 60, 0.8)' 
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                boxShadow: isDarkMode 
                  ? '0 25px 50px -12px rgba(31, 38, 135, 0.37)' 
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
              }}>
                <h1 className="display-4 fw-bold mb-4" style={{
                  color: isDarkMode ? '#fff' : '#212529',
                  textShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  🚀 Transform Ideas Into Reality
                </h1>
                <p className="lead mb-4" style={{
                  color: isDarkMode ? '#e9ecef' : '#6c757d',
                  fontSize: '1.25rem',
                  lineHeight: '1.6'
                }}>
                  Join the future of fundraising with our innovative crowdfunding platform. 
                  Connect with passionate creators, support meaningful projects, and be part 
                  of something extraordinary.
                </p>
                <div className="row text-center mb-4">
                  <div className="col-4">
                    <div className="d-flex flex-column align-items-center">
                      <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💡</span>
                      <span style={{ 
                        fontSize: '0.9rem', 
                        color: isDarkMode ? '#adb5bd' : '#6c757d',
                        fontWeight: '500'
                      }}>Innovation</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex flex-column align-items-center">
                      <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤝</span>
                      <span style={{ 
                        fontSize: '0.9rem', 
                        color: isDarkMode ? '#adb5bd' : '#6c757d',
                        fontWeight: '500'
                      }}>Community</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex flex-column align-items-center">
                      <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</span>
                      <span style={{ 
                        fontSize: '0.9rem', 
                        color: isDarkMode ? '#adb5bd' : '#6c757d',
                        fontWeight: '500'
                      }}>Impact</span>
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <button 
                    className="btn btn-primary btn-lg px-4 py-3"
                    onClick={() => document.getElementById('campaigns-section').scrollIntoView({ behavior: 'smooth' })}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease',
                      transform: 'translateY(0)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
                      e.target.style.background = 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                      e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    }}
                  >
                    🎉 Explore Campaigns
                  </button>
                  <button 
                    className="btn btn-outline-secondary btn-lg px-4 py-3"
                    onClick={() => handleProtectedClick('/create-project')}
                    style={{
                      border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'}`,
                      borderRadius: '12px',
                      fontWeight: '600',
                      color: isDarkMode ? '#fff' : '#212529',
                      background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      transform: 'translateY(0)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 8px 25px ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'}`;
                      e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
                      e.target.style.border = `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'}`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                      e.target.style.border = `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'}`;
                    }}
                  >
                    ➕ Start Your Project
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-5 mt-lg-0">
              <div className="position-relative">
                                 <div className="glass-card p-4 float-animation" style={{
                   background: isDarkMode 
                     ? 'rgba(40, 38, 60, 0.6)' 
                     : 'rgba(255, 255, 255, 0.8)',
                   backdropFilter: 'blur(15px)',
                   borderRadius: '20px',
                   border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                   transform: 'rotate(3deg)'
                 }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💰</div>
                  <h3 style={{ 
                    color: isDarkMode ? '#fff' : '#212529',
                    marginBottom: '0.5rem'
                  }}>Active Campaigns</h3>
                  <p style={{ 
                    color: isDarkMode ? '#adb5bd' : '#6c757d',
                    marginBottom: '0'
                  }}>{campaigns.length} projects seeking support</p>
                </div>
                                 <div className="glass-card p-4 position-absolute float-animation-reverse" style={{
                   background: isDarkMode 
                     ? 'rgba(40, 38, 60, 0.6)' 
                     : 'rgba(255, 255, 255, 0.8)',
                   backdropFilter: 'blur(15px)',
                   borderRadius: '20px',
                   border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                   transform: 'rotate(-2deg) translateY(-20px)',
                   top: '-20px',
                   right: '-20px',
                   zIndex: -1
                 }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</div>
                  <h4 style={{ 
                    color: isDarkMode ? '#fff' : '#212529',
                    marginBottom: '0',
                    fontSize: '1rem'
                  }}>Success Rate</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns Section */}
      <section id="campaigns-section" className="glass-home-bg py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <h2 className="mb-0 text-white">All Campaigns</h2>
              <span className="badge bg-primary fs-6 ms-3" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '8px 16px'
              }}>
                {filteredCampaigns.length} Campaign{filteredCampaigns.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Modern Search Bar */}
            <div className="d-flex align-items-center">
              <div className="position-relative" style={{ maxWidth: '350px' }}>
                <div className="glass-card" style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  padding: '8px',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                }}>
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center justify-content-center me-3" style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease'
                    }}>
                      <span style={{ fontSize: '18px', color: '#fff' }}>📅</span>
                    </div>
                    <div className="flex-grow-1 position-relative">
                      <input
                        type="date"
                        className="form-control border-0"
                        placeholder="Filter by start date..."
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        style={{
                          background: 'transparent',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: '500',
                          padding: '12px 16px',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          setDateInputFocused(true);
                          e.target.style.outline = 'none';
                          e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.3)';
                        }}
                        onBlur={(e) => {
                          setDateInputFocused(false);
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      {!searchDate && !dateInputFocused && (
                        <div className="position-absolute top-50 start-0 translate-middle-y" style={{
                          pointerEvents: 'none',
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                          fontWeight: '500',
                          paddingLeft: '16px'
                        }}>
                         
                        </div>
                      )}
                    </div>
                    {searchDate && (
                      <button 
                        className="btn d-flex align-items-center justify-content-center me-2" 
                        onClick={clearSearch}
                        title="Clear search"
                        style={{
                          width: '32px',
                          height: '32px',
                          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '12px',
                          transition: 'all 0.3s ease',
                          transform: 'scale(1)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.1)';
                          e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {searchDate && (
            <div className="mb-4">
              <div className="alert alert-info d-flex align-items-center" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                color: '#fff'
              }}>
                <span className="me-2">🔍</span>
                <span>Showing campaigns starting on <strong>{formatDate(searchDate)}</strong></span>
                <button 
                  className="btn btn-sm btn-outline-light ms-auto"
                  onClick={clearSearch}
                  style={{
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}

          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-5">
              <h4 className="">
                {searchDate ? 'No campaigns found for the selected date' : 'No campaigns found'}
              </h4>
              <p className="">
                {searchDate ? 'Try selecting a different date or clear the search.' : 'Be the first to create a campaign!'}
              </p>
              {searchDate && (
                <button className="btn btn-outline-primary mt-2" onClick={clearSearch}>
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="row">
              {filteredCampaigns.map(campaign => (
                <div key={campaign.id} className="col-lg-4 col-md-6 mb-4">
                  <div className="glass-card card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold text-primary mb-2">
                        {campaign.title}
                      </h5>
                      <p className="card-text  mb-3 flex-grow-1">
                        {campaign.description && campaign.description.length > 150 
                          ? `${campaign.description.substring(0, 150)}...` 
                          : campaign.description}
                      </p>
                      <div className="mb-3">
                        <div className="row g-2">
                          <div className="col-6">
                            <small className=" d-block">Start Date</small>
                            <strong>{formatDate(campaign.start_date)}</strong>
                          </div>
                          <div className="col-6">
                            <small className=" d-block">End Date</small>
                            <strong>{formatDate(campaign.end_date)}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="">Progress</small>
                          <small className="">{campaign.progress_percentage || 0}%</small>
                        </div>
                        <div className="progress mb-2" style={{ height: '8px' }}>
                          <div 
                            className="progress-bar bg-success" 
                            role="progressbar" 
                            style={{ width: `${campaign.progress_percentage || 0}%` }}
                            aria-valuenow={campaign.progress_percentage || 0} 
                            aria-valuemin="0" 
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <small className="">Raised</small>
                          <strong className="text-success">
                            {formatCurrency(campaign.total_donations || 0)}
                          </strong>
                        </div>
                        <div className="d-flex justify-content-between">
                          <small className="">Target</small>
                          <strong className="text-primary">
                            {formatCurrency(campaign.target_amount)}
                          </strong>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <div className="d-grid gap-2">
                          <button 
                            className="btn btn-primary btn-sm mb-2"
                            onClick={() => handleDonate(campaign.id)}
                            style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              border: 'none',
                              borderRadius: '12px',
                              fontWeight: '600',
                              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                              transition: 'all 0.3s ease',
                              padding: '8px 16px',
                              transform: 'translateY(0)',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                              e.target.style.background = 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                              e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                            }}
                          >
                            💰 Donate
                          </button>
                          {currentUser && campaign.owner === currentUser.username && (
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-primary btn-sm flex-fill"
                                onClick={() => handleEdit(campaign.id)}
                                style={{
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  border: 'none',
                                  borderRadius: '12px',
                                  fontWeight: '600',
                                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                                  transition: 'all 0.3s ease',
                                  padding: '8px 16px',
                                  transform: 'translateY(0)',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.transform = 'translateY(-2px)';
                                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                                  e.target.style.background = 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.transform = 'translateY(0)';
                                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                                  e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                                }}
                              >
                                ✏️ Edit
                              </button>
                              <button 
                                className="btn btn-primary btn-sm flex-fill"
                                onClick={() => handleDelete(campaign.id)}
                                style={{
                                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                                  border: 'none',
                                  borderRadius: '12px',
                                  fontWeight: '600',
                                  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                                  transition: 'all 0.3s ease',
                                  padding: '8px 16px',
                                  transform: 'translateY(0)',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.transform = 'translateY(-2px)';
                                  e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.4)';
                                  e.target.style.background = 'linear-gradient(135deg, #ff5252 0%, #d32f2f 100%)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.transform = 'translateY(0)';
                                  e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
                                  e.target.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)';
                                }}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Donation Modal */}
          {showDonationModal && selectedCampaign && (
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="glass-card modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">💝 Make a Donation</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setShowDonationModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <h6 className="text-primary">{selectedCampaign.title}</h6>
                      <p className=" small mb-3">
                        {selectedCampaign.description && selectedCampaign.description.length > 100 
                          ? `${selectedCampaign.description.substring(0, 100)}...` 
                          : selectedCampaign.description}
                      </p>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="donationAmount" className="form-label">Donation Amount ($)</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          className="form-control"
                          id="donationAmount"
                          placeholder="Enter amount"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                          min="1"
                          step="0.01"
                          required
                        />
                      </div>
                      <div className="form-text">
                        Minimum donation: $1.00
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setShowDonationModal(false)}
                      disabled={donationLoading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-success" 
                      onClick={submitDonation}
                      disabled={donationLoading || !donationAmount || parseFloat(donationAmount) <= 0}
                    >
                      {donationLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Processing...
                        </>
                      ) : (
                        '💝 Donate Now'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Backdrop */}
          {showDonationModal && (
            <div className="modal-backdrop fade show"></div>
          )}
        </div>
      </section>


    </>
  );
};

export default CampaignList;
