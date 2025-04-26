import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/user/register', formData);
      alert('Registration successful!');
      window.location.href = '/';
    } catch (error) {
      alert('Error registering user');
    }
  };

  return (
    <div class="auth-container">
      <h2 class="auth-title">Register</h2>
      <form class="auth-form" onSubmit={handleSubmit}>
        <input
          class="auth-input"
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          class="auth-input"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          class="auth-input"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button class="auth-button" type="submit">Register</button>
        <p class="auth-link" onClick={() => (window.location.href = '/')}>
          You have an account? <span>Login</span>
        </p>
        
      </form>
    </div>
  );
}

export default Register;
