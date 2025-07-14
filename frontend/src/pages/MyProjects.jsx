import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function MyProjects() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/campaigns/mine/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        if (error.response?.status === 401) {
          alert('Please log in to view your campaigns.');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMyCampaigns();
  }, [navigate]);

  const handleDelete = (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      const token = localStorage.getItem('access_token');
      axios.delete(`http://localhost:8000/api/campaigns/${campaignId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(() => {
        // Refresh the campaigns list
        const fetchMyCampaigns = async () => {
          try {
            const response = await axios.get('http://localhost:8000/api/campaigns/mine/', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            setCampaigns(response.data);
          } catch (error) {
            console.error('Error fetching campaigns:', error);
          }
        };
        fetchMyCampaigns();
      })
      .catch(err => {
        console.error('Error deleting campaign:', err);
        alert('Failed to delete campaign. Please try again.');
      });
    }
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

  if (loading) {
    return (
      <div className="glass-home-bg min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-home-bg min-vh-100 py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">My Campaigns</h2>
          <span className="badge bg-primary fs-6">
            {campaigns.length} Campaign{campaigns.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {campaigns.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="mb-3">You haven't created any campaigns yet.</h4>
            <p className="mb-4">Start your crowdfunding journey by creating your first campaign!</p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/create-project')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
                padding: '12px 24px',
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
              🚀 Create Your First Campaign
            </button>
          </div>
        ) : (
          <div className="row">
            {campaigns.map(campaign => (
              <div key={campaign.id} className="col-lg-4 col-md-6 mb-4">
                <div className="glass-card card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-primary mb-2">
                      {campaign.title}
                    </h5>
                    
                    <p className="card-text mb-3 flex-grow-1">
                      {campaign.description && campaign.description.length > 150 
                        ? `${campaign.description.substring(0, 150)}...` 
                        : campaign.description}
                    </p>

                    <div className="mb-3">
                      <div className="row g-2">
                        <div className="col-6">
                          <small className="d-block">Start Date</small>
                          <strong>{formatDate(campaign.start_date)}</strong>
                        </div>
                        <div className="col-6">
                          <small className="d-block">End Date</small>
                          <strong>{formatDate(campaign.end_date)}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small>Progress</small>
                        <small>{campaign.progress_percentage || 0}%</small>
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
                        <small>Raised</small>
                        <strong className="text-success">
                          {formatCurrency(campaign.total_donations || 0)}
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <small>Target</small>
                        <strong className="text-primary">
                          {formatCurrency(campaign.target_amount)}
                        </strong>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="d-grid gap-2">
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-primary btn-sm flex-fill"
                            onClick={() => navigate(`/edit-campaign/${campaign.id}`)}
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}