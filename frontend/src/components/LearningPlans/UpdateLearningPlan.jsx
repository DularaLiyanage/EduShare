import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './plan.css';

function UpdateLearningPlan() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    projectName: '',
    projectLink: '',
    workingOnStatus: '',
    milestones: '',
    skills: '',
    timeline: '',
    progress: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/learningPlan/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          console.error('Failed to fetch learning plan data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/learningPlan/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Learning plan updated successfully!');
        window.location.href = '/myLearningPlan';
      } else {
        alert('Failed to update learning plan.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating learning plan.');
    }
  };

  return (
    <div className="update-learning-plan">
      <div className="form-container">
        <h2 className="form-title">Update Learning plan</h2>
        <h3 className="section-title">Basic Information</h3>
        <form onSubmit={handleSubmit} className="plan-form">
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            placeholder="Project Name*"
            onChange={handleChange}
          />
          <input
            type="text"
            name="projectLink"
            value={formData.projectLink}
            placeholder="Project Link*"
            onChange={handleChange}
          />
          <select name="workingOnStatus" value={formData.workingOnStatus} onChange={handleChange}>
            <option value="">Select status</option>
            <option value="doing">Doing</option>
            <option value="complete">Complete</option>
          </select>
          <input
            type="text"
            name="milestones"
            value={formData.milestones}
            placeholder="Milestones*"
            onChange={handleChange}
          />
          <input
            type="text"
            name="skills"
            value={formData.skills}
            placeholder="Skills*"
            onChange={handleChange}
          />
          <input
            type="text"
            name="timeline"
            value={formData.timeline}
            placeholder="Timeline*"
            onChange={handleChange}
          />
          <input
            type="number"
            name="progress"
            value={formData.progress}
            placeholder="Progress (%)"
            onChange={handleChange}
          />
          <button type="submit">Submit Learning plan</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateLearningPlan;
