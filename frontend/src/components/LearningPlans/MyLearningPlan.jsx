import React, { useEffect, useState } from 'react';
import LearningPlanService from '../../Service/LearningPlanService';
import './plan.css';
import { useNavigate } from 'react-router-dom';

function MyLearningPlan() {
  const [learningPlan, setLearningPlan] = useState([]);
  const navigate = useNavigate();
  const userID = localStorage.getItem('userId');

  useEffect(() => {
    if (userID) {
      const fetchData = async () => {
        try {
          const response = await LearningPlanService.getAllLearningPlans();
          if (response.status === 200) {
            const filteredData = response.data.filter(
              (item) => item.userID === userID
            );
            setLearningPlan(filteredData);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
      fetchData();
    }
  }, [userID]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await LearningPlanService.deleteLearningPlan(id);
        setLearningPlan((prev) => prev.filter((plan) => plan.id !== id));
        alert('Learning plan deleted successfully!');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/updateLearningPlan/${id}`);
  };

  return (
    <div className="learning-plan">
      <h2 className="form-title">My Learning Plans</h2>
      <div className="plan-grid">
        {learningPlan.map((item) => (
          <div key={item.id} className="plan-card">
            <div className="plan-card-header">
              <h3 className="plan-title">{item.projectName}</h3>
              <p className="plan-owner">By {item.fullName}</p>
            </div>

            <div className="plan-details">
              <p>
                <span>Status:</span> {item.workingOnStatus}
              </p>
              <p>
                <span>Timeline:</span> {item.timeline}
              </p>
              <p>
                <span>Milestones:</span>
              </p>
              <ul>
                {item.milestones.split(',').map((milestone, index) => (
                  <li key={index}>{milestone.trim()}</li>
                ))}
              </ul>
              <p>
                <span>Skills:</span>
              </p>
              <div className="skills-container">
                {item.skills.split(',').map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill.trim()}
                  </span>
                ))}
              </div>

              {item.workingOnStatus === 'doing' && (
                <div className="progress-container">
                  <div className="progress-circle">
                    <div
                      className="progress-bar"
                      style={{ '--progress': `${item.progress}%` }}
                    />
                    <span className="progress-text">
                      {item.progress}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="plan-card-actions">
              <button
                className="btn-edit"
                onClick={() => handleUpdate(item.id)}
              >
                Edit
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyLearningPlan;
