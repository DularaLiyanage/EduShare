import React, { useState } from 'react';
import './plan.css';
import LearningPlanService from '../../Service/LearningPlanService';

function AddLearningPlan() {
  const [formData, setFormData] = useState({
    projectName: '',
    projectLink: '',
    workingOnStatus: '',
    milestones: '',
    skills: '',
    timeline: '',
    progress: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userID = localStorage.getItem('userId');
      const fullName = localStorage.getItem('fullName');

      if (!userID || !fullName) {
        alert('Please log in to submit your learning plan.');
        window.location.href = '/';
        return;
      }

      const response = await LearningPlanService.addLearningPlan({
        ...formData,
        userID,
        fullName,
      });

      if (response.status === 200) {
        alert('Learning plan added successfully!');
        window.location.href = '/myLearningPlan';
      } else {
        alert('Failed to add learning plan.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2 className="form-title">Add New Learning Plan</h2>
        <form onSubmit={handleSubmit} className="plan-form">
          <input 
            type="text" 
            name="projectName" 
            placeholder="Project Name*" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="projectLink" 
            placeholder="Project Link*" 
            onChange={handleChange} 
            required 
          />
          <select name="workingOnStatus" onChange={handleChange} required>
            <option value="">Select Status</option>
            <option value="doing">Doing</option>
            <option value="complete">Complete</option>
          </select>
          <input 
            type="text" 
            name="milestones" 
            placeholder="Milestones* (comma separated)" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="skills" 
            placeholder="Skills* (comma separated)" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="timeline" 
            placeholder="Timeline* (e.g., 2 weeks)" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="number" 
            name="progress" 
            placeholder="Progress (%)*" 
            onChange={handleChange} 
            min="0" 
            max="100" 
            required 
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Add Learning Plan'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddLearningPlan;
