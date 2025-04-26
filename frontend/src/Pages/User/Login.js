import React, { useState } from 'react';
import axios from 'axios';
import './auth.css'
function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/user/login', formData);
            const { userId, fullName } = response.data;
            localStorage.setItem('userId', userId);
            localStorage.setItem('fullName', fullName);
            alert('Login successful!');
            window.location.href = '/allLearningPlan';
        } catch (error) {
            alert('Invalid email or password');
        }
    };

    return (
        <div class="auth-container">
            <h2 class="auth-title">Login</h2>
            <form class="auth-form" onSubmit={handleSubmit}>
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
                <button class="auth-button" type="submit">Login</button>
                <p class="auth-link" onClick={() => (window.location.href = '/register')}>
                    Don't have an account? <span>Register</span>
                </p>
            </form>
        </div>
    );
}

export default Login;
