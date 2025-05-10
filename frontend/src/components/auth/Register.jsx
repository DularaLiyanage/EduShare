import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Spinner, Image } from 'react-bootstrap';
import { registerUser } from '../../Service/UserService';
import '../../css/Post.css'; // ✅ Import external CSS

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }

      await registerUser(formDataToSend);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Profile Photo</Form.Label>
              <div className="avatar-upload">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    roundedCircle
                    width={100}
                    height={100}
                    className="mb-2"
                  />
                ) : (
                  <div className="avatar-placeholder mb-2">
                    <i className="bi bi-person-circle" style={{ fontSize: '100px' }}></i>
                  </div>
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  ref={fileInputRef}
                  className="d-none"
                  id="avatar-upload"
                />
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => fileInputRef.current.click()}
                >
                  {avatarPreview ? 'Change Photo' : 'Upload Photo'}
                </Button>
              </div>
            </Form.Group>

            <Button
              disabled={loading}
              className="w-100 mt-3"
              type="submit"
            >
              {loading ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                'Register'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
