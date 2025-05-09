import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import '../../css/Post.css'; // ✅ Make sure to import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend OAuth2 endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="login-page">
      <Card className="login-card shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              disabled={loading}
              className="w-100 mt-3"
              type="submit"
            >
              {loading ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                'Login'
              )}
            </Button>
          </Form>
          
          <div className="text-center mt-3">
            <p className="text-muted">- OR -</p>
            <Button
              variant="outline-primary"
              className="w-100"
              onClick={handleGoogleLogin}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                style={{ width: '20px', marginRight: '10px' }}
              />
              Continue with Google
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
