import React from 'react';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
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
                    <span style={{ fontSize: '24px' }}>📝</span>
                  </div>
                  <h3 className="mb-0 text-white fw-bold">Create Account</h3>
                </div>
                <p className="text-white-50 mb-0">Join our crowdfunding community today</p>
              </div>
              <div className="card-body p-5">
                <Formik
                  initialValues={{
                    username: '',
                    email: '',
                    phone: '',
                    password: '',
                    re_password: '',
                  }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.username) errors.username = 'Username is required';
                    if (!values.email) errors.email = 'Email is required';
                    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email))
                      errors.email = 'Invalid email';
                    if (!values.phone) errors.phone = 'Phone is required';
                    else if (!/^01[0125][0-9]{8}$/.test(values.phone))
                      errors.phone = 'Invalid Egyptian phone';
                    if (!values.password) errors.password = 'Password is required';
                    if (values.password !== values.re_password)
                      errors.re_password = 'Passwords must match';
                    return errors;
                  }}
                  onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
                    try {
                      const res = await axios.post('http://localhost:8000/auth/users/', values );

                      setStatus({ success: "Registration successful! Redirecting to login..." });
                      resetForm();
                      // Redirect to login after 2 seconds
                      setTimeout(() => {
                        navigate('/login');
                      }, 2000);
                    } catch (err) {
                      setStatus({
                        error:
                          err.response?.data
                            ? JSON.stringify(err.response.data)
                            : 'Something went wrong',
                      });
                    }
                    setSubmitting(false);
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

                      {[
                        ['username', 'Username', '👤'],
                        ['email', 'Email', '📧'],
                        ['phone', 'Phone', '📱'],
                        ['password', 'Password', '🔒'],
                        ['re_password', 'Confirm Password', '🔐'],
                      ].map(([name, label, icon], i) => (
                        <div className="mb-4" key={i}>
                          <label htmlFor={name} className="form-label fw-semibold d-flex align-items-center">
                            <span className="me-2">{icon}</span>
                            {label} <span className="text-danger ms-1">*</span>
                          </label>
                          <div className="input-group input-group-lg shadow-sm">
                            <input
                              id={name}
                              name={name}
                              type={name.includes('password') ? 'password' : 'text'}
                              className={`form-control ${errors[name] && touched[name] ? 'is-invalid' : ''}`}
                              placeholder={`Enter your ${label.toLowerCase()}`}
                              value={values[name]}
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
                          {errors[name] && touched[name] && (
                            <div className="text-danger mt-2 d-flex align-items-center">
                              <span className="me-1">⚠️</span>
                              {errors[name]}
                            </div>
                          )}
                        </div>
                      ))}

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
                              Creating Account...
                            </>
                          ) : (
                            <>
                              <span className="me-2">🚀</span>
                              Create Account
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-lg"
                          onClick={() => navigate('/login')}
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
                          Back to Login
                        </button>
                      </div>

                      <div className="text-center mt-4">
                        <small className="text-muted">
                          By creating an account, you agree to our Terms of Service and Privacy Policy
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

export default Register;
