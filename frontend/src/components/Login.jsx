import { useState, useEffect } from 'react'

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Create particles animation effect
  useEffect(() => {
    const createParticles = () => {
      const particles = []
      for (let i = 0; i < 50; i++) {
        particles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
          opacity: Math.random() * 0.5 + 0.2
        })
      }
      return particles
    }
    
    const particles = createParticles()
    const animateParticles = () => {
      particles.forEach(particle => {
        particle.x += particle.speedX * 0.1
        particle.y += particle.speedY * 0.1
        
        if (particle.x > 100) particle.x = 0
        if (particle.x < 0) particle.x = 100
        if (particle.y > 100) particle.y = 0
        if (particle.y < 0) particle.y = 100
      })
    }
    
    const interval = setInterval(animateParticles, 50)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Normalize and validate Gmail address (trim + lowercase)
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail.endsWith('@gmail.com')) {
      setError('Please use a Gmail address')
      setIsLoading(false)
      return
    }

    try {
      // Use Vite env var if provided.
      // When developing locally (Vite dev server), window.location.origin points to the dev server (default :5173)
      // while the backend runs on port 3000. Fall back to port 3000 for localhost to reach the backend.
      const API_BASE = import.meta.env.VITE_API_BASE_URL || (() => {
        try {
          const host = window.location.hostname
          const proto = window.location.protocol
          // If running on localhost or 127.0.0.1, assume backend is at port 3000
          if (host === 'localhost' || host === '127.0.0.1') {
            return `${proto}//${host}:3000`
          }
        } catch (e) {
          // ignore and fallback to origin
        }
        return window.location.origin
      })()

      // Server expects the login route at /api/login (backend uses /api/* routes)
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // include a default userType so backend can receive it if needed
        // send normalized email to avoid casing/spacing issues
        body: JSON.stringify({ email: normalizedEmail, password, userType: 'student' }),
      })

      // Safely parse response body. Some error responses may be empty or non-JSON (HTML error pages).
      let data = {}
      try {
        const contentType = response.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          data = await response.json()
        } else {
          // Try to read as text and parse if possible, otherwise store raw text as message
          const text = await response.text()
          try {
            data = text ? JSON.parse(text) : {}
          } catch (e) {
            data = { message: text }
          }
        }
      } catch (parseErr) {
        // If parsing fails, fallback to an informative message
        console.warn('Failed to parse login response body:', parseErr)
        data = { message: `Invalid response from server (status ${response.status})` }
      }

      if (response.ok) {
        // Ensure we have a user object
        if (data && data.user) {
          onLogin(data.user)
        } else {
          setError('Login succeeded but server returned unexpected payload.')
        }
      } else {
        setError((data && data.message) || `Login failed (status ${response.status})`)
      }
    } catch (err) {
      // Surface the actual error to help diagnosing connection issues
      setError(`Connection error: ${err.message}. Please make sure the backend server is running.`)
    } finally {
      setIsLoading(false)
    }
  }

  const styles = {
    loginPage: {
      height: '100vh',
      width: '100vw',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Poppins, sans-serif'
    },
    animatedBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      zIndex: 0
    },
    morphingBlobs: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    },
    blob: {
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(70px)',
      mixBlendMode: 'multiply',
      animation: 'blob-morph 7s ease-in-out infinite'
    },
    loginContainer: {
      display: 'flex',
      height: '100vh',
      position: 'relative',
      zIndex: 1
    },
    welcomeSection: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)'
    },
    welcomeContent: {
      textAlign: 'center',
      color: 'white',
      maxWidth: '500px'
    },
    brandLogo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '2rem'
    },
    logoIcon: {
      width: '80px',
      height: '80px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1rem',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255, 255, 255, 0.3)'
    },
    loginSection: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)'
    },
    loginFormContainer: {
      width: '100%',
      maxWidth: '400px',
      background: 'white',
      padding: '3rem 2.5rem',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
    },
    formHeader: {
      textAlign: 'center',
      marginBottom: '2.5rem'
    },
    loginForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#333',
      fontSize: '0.9rem'
    },
    input: {
      padding: '1rem 1.2rem',
      border: '2px solid #e1e5e9',
      borderRadius: '12px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      background: '#f8f9fa'
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#667eea',
      background: 'white',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    },
    loginBtn: {
      padding: '1rem 2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    errorMessage: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1rem',
      background: '#fee',
      border: '1px solid #fcc',
      borderRadius: '8px',
      color: '#c33',
      fontSize: '0.9rem'
    }
  }

  return (
    <div style={styles.loginPage}>
      {/* Add CSS animations */}
      <style>{`
        @keyframes blob-morph {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 10px) scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10%, 90% { opacity: 1; }
          50% { transform: translateY(-100px) rotate(180deg); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Animated Background */}
      <div style={styles.animatedBg}>
        <div style={styles.morphingBlobs}>
          <div style={{
            ...styles.blob,
            top: 0, left: 0, width: '400px', height: '400px',
            background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
            animationDelay: '0s'
          }}></div>
          <div style={{
            ...styles.blob,
            top: '50%', right: 0, width: '300px', height: '300px',
            background: 'linear-gradient(135deg, #4ecdc4, #45b7aa)',
            animationDelay: '2s'
          }}></div>
          <div style={{
            ...styles.blob,
            bottom: 0, left: '50%', width: '350px', height: '350px',
            background: 'linear-gradient(135deg, #feca57, #ff9ff3)',
            animationDelay: '4s'
          }}></div>
          <div style={{
            ...styles.blob,
            top: '25%', left: '25%', width: '250px', height: '250px',
            background: 'linear-gradient(135deg, #48dbfb, #0abde3)',
            animationDelay: '6s'
          }}></div>
        </div>
      </div>

      <div style={styles.loginContainer}>
        {/* Welcome Section */}
        <div style={styles.welcomeSection}>
          <div style={styles.welcomeContent}>
            <div style={styles.brandLogo}>
              <div style={styles.logoIcon}>
                <i className="fas fa-graduation-cap" style={{fontSize: '2.5rem', color: 'white'}}></i>
              </div>
              <h1 style={{fontSize: '3rem', fontWeight: '700', margin: 0, textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'}}>
                Activities Hub
              </h1>
            </div>
            <p style={{fontSize: '1.2rem', opacity: 0.9, marginBottom: '3rem', lineHeight: 1.6}}>
              Connect, participate, and grow with your campus community
            </p>
            <div style={{display: 'flex', justifyContent: 'space-around', gap: '2rem'}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
                <i className="fas fa-users" style={{fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.8}}></i>
                <span style={{fontSize: '0.9rem', fontWeight: '500'}}>Join Communities</span>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
                <i className="fas fa-calendar-alt" style={{fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.8}}></i>
                <span style={{fontSize: '0.9rem', fontWeight: '500'}}>Track Activities</span>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
                <i className="fas fa-trophy" style={{fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.8}}></i>
                <span style={{fontSize: '0.9rem', fontWeight: '500'}}>Achieve Goals</span>
              </div>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div style={styles.loginSection}>
          <div style={styles.loginFormContainer}>
            <div style={styles.formHeader}>
              <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#333', marginBottom: '0.5rem'}}>Welcome Back!</h2>
              <p style={{color: '#666', fontSize: '1rem'}}>Sign in to access your activities dashboard</p>
            </div>

            <form style={styles.loginForm} onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="email">
                  <i className="fas fa-envelope" style={{color: '#667eea'}}></i>
                  Gmail Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  style={styles.input}
                  onFocus={(e) => e.target.style = {...styles.input, ...styles.inputFocus}}
                  onBlur={(e) => e.target.style = styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="password">
                  <i className="fas fa-lock" style={{color: '#667eea'}}></i>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={styles.input}
                  onFocus={(e) => e.target.style = {...styles.input, ...styles.inputFocus}}
                  onBlur={(e) => e.target.style = styles.input}
                  required
                />
              </div>

              {error && (
                <div style={styles.errorMessage}>
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}

              <button
                type="submit"
                style={{
                  ...styles.loginBtn,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                disabled={isLoading}
                onMouseEnter={(e) => !isLoading && (e.target.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => !isLoading && (e.target.style.transform = 'translateY(0)')}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '20px', height: '20px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '8px'
                    }}></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div style={{textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #eee'}}>
              <p style={{color: '#666', fontSize: '0.9rem'}}>New to Activities Hub? Contact your administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login