import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        if (!name || !email || !password || !phone) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }
        const res = await client.post('/auth/register', { name, email, password, phone });
        const user = res.data.user;
        login(res.data.token, user);
        navigate('/');
      } else {
        const res = await client.post('/auth/login', { email, password });
        const user = res.data.user;
        login(res.data.token, user);
        if (user && user.is_admin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (isRegister ? 'Registration failed' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active auth-page" id="page-login">
      <div className="auth-container">
        <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
        <p className="auth-subtitle">
          {isRegister ? 'Join us for natural and healthy foods' : 'Login to access your orders and wishlist'}
        </p>
        
        {error && <div className="error-banner" style={{color: 'red', marginBottom: '15px', textAlign: 'center'}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="John Doe"
                  required={isRegister}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="+91"
                  required={isRegister}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="you@example.com"
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-toggle">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
                style={{ paddingRight: '40px' }}
              />
              <span className="toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </span>
            </div>
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>
        <p className="auth-switch">
          {isRegister ? (
            <>Already have an account? <a onClick={(e) => { e.preventDefault(); setIsRegister(false); setError(''); }}>Sign In</a></>
          ) : (
            <>Don't have an account? <a onClick={(e) => { e.preventDefault(); setIsRegister(true); setError(''); }}>Create one</a></>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
