import React from 'react';
import { Formik } from 'formik';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios'; 

const Login = () => {
  const navigate = useNavigate();
  const { updateLoginState } = useOutletContext();
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
                    <span style={{ fontSize: '24px' }}>🔐</span>
                  </div>
                  <h3 className="mb-0 text-white fw-bold">Welcome Back</h3>
                </div>
                <p className="text-white-50 mb-0">Sign in to your account to continue</p>
              </div>
              <div className="card-body p-5">
                <Formik
                  initialValues={{
                    username: '',
                    password: '',
                  }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.username) errors.username = 'Username is required';
                    if (!values.password) errors.password = 'Password is required';
                    return errors;
                  }}

                  onSubmit={async (values, { setSubmitting, setStatus }) => {
                    try {
                      const res = await axios.post('http://localhost:8000/auth/jwt/create/', {
                        username: values.username,
                        password: values.password,
                      });
                      const { access, refresh } = res.data;
                      localStorage.setItem('access_token', access);
                      localStorage.setItem('refresh_token', refresh);
                      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

                      // Update the login state in the parent component
                      localStorage.setItem('isLoggedIn', 'true');
                      localStorage.setItem('userData', JSON.stringify({ name: values.username }));
                      if (updateLoginState) updateLoginState();
                      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
                      localStorage.removeItem('redirectAfterLogin');
                      navigate(redirectPath);
                    } catch (error) {
                        let errorMessage = 'Login failed. Please check your credentials.';
                        if (error.response?.status === 401) {
                          errorMessage = 'Invalid username or password';
                        }
                        setStatus({ error: errorMessage });
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
                        <label htmlFor="username" className="form-label fw-semibold d-flex align-items-center">
                          <span className="me-2">👤</span>
                          Username <span className="text-danger ms-1">*</span>
                        </label>
                        <div className="input-group input-group-lg shadow-sm">
                          <input
                            id="username"
                            name="username"
                            type="text"
                            className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                            placeholder="Enter your username"
                            value={values.username}
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
                        {errors.username && touched.username && (
                          <div className="text-danger mt-2 d-flex align-items-center">
                            <span className="me-1">⚠️</span>
                            {errors.username}
                          </div>
                        )}
                      </div>
                      <div className="mb-4">
                        <label htmlFor="password" className="form-label fw-semibold d-flex align-items-center">
                          <span className="me-2">🔒</span>
                          Password <span className="text-danger ms-1">*</span>
                        </label>
                        <div className="input-group input-group-lg shadow-sm">
                          <input
                            id="password"
                            name="password"
                            type="password"
                            className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                            placeholder="Enter your password"
                            value={values.password}
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
                        {errors.password && touched.password && (
                          <div className="text-danger mt-2 d-flex align-items-center">
                            <span className="me-1">⚠️</span>
                            {errors.password}
                          </div>
                        )}
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
                              Signing In...
                            </>
                          ) : (
                            <>
                              <span className="me-2">🔐</span>
                              Sign In
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-lg"
                          onClick={() => navigate('/register')}
                          disabled={isSubmitting}
                          style={{
                            borderRadius: '12px',
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <span className="me-2">📝</span>
                          Create Account
                        </button>
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

export default Login; 