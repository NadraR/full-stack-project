import React from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import dayjs from 'dayjs';

// Validation schema
const campaignSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  description: Yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
  target_amount: Yup.number().required('Target amount is required').min(100, 'Target amount must be at least $100'),
  start_date: Yup.date()
    .min(dayjs().add(1, 'day').toDate(), 'Start date must be in the future')
    .required('Start date is required'),
  end_date: Yup.date()
    .min(Yup.ref('start_date'), 'End date must be after start date')
    .required('End date is required'),
});

const CreateProject = () => {
  const navigate = useNavigate();

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
                    <span style={{ fontSize: '24px' }}>🚀</span>
                  </div>
                  <h3 className="mb-0 text-white fw-bold">Create New Campaign</h3>
                </div>
                <p className="text-white-50 mb-0">Start your crowdfunding journey today</p>
              </div>
              <div className="card-body p-5">
      <Formik
        initialValues={{
          title: '',
          description: '',
          target_amount: '',
          start_date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
          end_date: '',
        }}
        validationSchema={campaignSchema}
                  onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
          try {
            await axios.post('http://localhost:8000/api/campaigns/', {
              ...values,
              target_amount: parseFloat(values.target_amount)
            }, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
              }
            });
                      setStatus({ success: 'Campaign created successfully! Redirecting to home...' });
                      resetForm();
                      setTimeout(() => navigate('/'), 2000);
          } catch (error) {
            setStatus({
                        error: error.response?.data?.message || 'Failed to create campaign. Please try again.'
            });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          status,
        }) => (
          <form onSubmit={handleSubmit}>
            {status?.success && (
                        <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert" style={{
                          borderRadius: '12px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)'
                        }}>
                          <div className="d-flex align-items-center">
                            <span className="me-2">✅</span>
                            <strong>Success!</strong> {status.success}
                          </div>
                          <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                        </div>
            )}
            {status?.error && (
                        <div className="alert alert-danger alert-dismissible fade show shadow-sm" role="alert" style={{
                          borderRadius: '12px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)'
                        }}>
                          <div className="d-flex align-items-center">
                            <span className="me-2">❌</span>
                            <strong>Error!</strong> {status.error}
                          </div>
                          <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                      )}

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
                            className={`form-control ${errors.title && touched.title ? 'is-invalid' : ''}`}
                            placeholder="Enter your campaign title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
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
                        {errors.title && touched.title && (
                          <div className="text-danger mt-2 d-flex align-items-center">
                            <span className="me-1">⚠️</span>
                            {errors.title}
                          </div>
                        )}
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
                            className={`form-control ${errors.description && touched.description ? 'is-invalid' : ''}`}
                            placeholder="Describe your campaign in detail..."
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
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
                        {errors.description && touched.description && (
                          <div className="text-danger mt-2 d-flex align-items-center">
                            <span className="me-1">⚠️</span>
                            {errors.description}
                          </div>
                        )}
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
                            className={`form-control ${errors.target_amount && touched.target_amount ? 'is-invalid' : ''}`}
                            placeholder="Enter target amount"
                value={values.target_amount}
                onChange={handleChange}
                onBlur={handleBlur}
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
                        {errors.target_amount && touched.target_amount && (
                          <div className="text-danger mt-2 d-flex align-items-center">
                            <span className="me-1">⚠️</span>
                            {errors.target_amount}
                          </div>
                        )}
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
                              className={`form-control ${errors.start_date && touched.start_date ? 'is-invalid' : ''}`}
                  value={values.start_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
                          {errors.start_date && touched.start_date && (
                            <div className="text-danger mt-2 d-flex align-items-center">
                              <span className="me-1">⚠️</span>
                              {errors.start_date}
                            </div>
                          )}
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
                              className={`form-control ${errors.end_date && touched.end_date ? 'is-invalid' : ''}`}
                  value={values.end_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
                          {errors.end_date && touched.end_date && (
                            <div className="text-danger mt-2 d-flex align-items-center">
                              <span className="me-1">⚠️</span>
                              {errors.end_date}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="d-grid gap-3 mt-5">
                        <button 
                type="submit"
                          disabled={isSubmitting} 
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
                            if (!isSubmitting) {
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
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Creating Campaign...
                            </>
                          ) : (
                            <>
                              <span className="me-2">🚀</span>
                              Create Campaign
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-lg"
                          onClick={() => navigate('/')}
                disabled={isSubmitting}
                          style={{
                            borderRadius: '12px',
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <span className="me-2">←</span>
                          Back to Home
                        </button>
                      </div>

                      <div className="text-center mt-4">
                        <small className="text-muted">
                          Make sure all information is accurate before creating your campaign
                        </small>
                      </div>
          </form>
        )}
      </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;