import React, { useEffect, useState } from 'react';
import LearningPlanService from '../../Service/LearningPlanService';
import './plan.css';

function AllLearningPlan() {
  const [learningPlans, setLearningPlans] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await LearningPlanService.getAllLearningPlans();
        if (response.status === 200) {
          setLearningPlans(response.data);
        } else {
          console.error('Failed to fetch learning plans');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="learning-plan">
      <h2>Learning Plan</h2>
      <div className="plan-container">
        {learningPlans.length > 0 ? (
          <div className="plan-grid">
            {learningPlans.map((plan) => (
              <div className="plan-card" key={plan.id}>
                <div className="plan-card-header">
                  <h3 className="plan-title">{plan.projectName}</h3>
                  <p className="plan-owner">By {plan.fullName}</p>
                  <a href={plan.projectLink} target="_blank" rel="noopener noreferrer" className="view-project">
                    View Project
                  </a>
                </div>
                <div className="plan-details">
                  <p>
                    <span>Status:</span> <span className={`status-tag ${plan.workingOnStatus}`}>{plan.workingOnStatus}</span>
                  </p>
                  <p>
                    <span>Milestones:</span>
                    {plan.milestones.includes(',') ? (
                      <ul>
                        {plan.milestones.split(',').map((milestone, i) => (
                          <li key={i}>{milestone.trim()}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>{plan.milestones}</span>
                    )}
                  </p>
                  <p>
                    <span>Skills:</span>
                    <div className="skills-container">
                      {plan.skills.split(',').map((skill, i) => (
                        <span key={i} className="skill-tag">{skill.trim()}</span>
                      ))}
                    </div>
                  </p>
                  <p>
                    <span>Timeline:</span> {plan.timeline}
                  </p>
                  {plan.workingOnStatus === 'doing' && plan.progress && (
                    <div className="progress-container">
                      <span>Progress:</span> {plan.progress}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No learning plans available.</p>
        )}
      </div>
    </div>
  );
}

export default AllLearningPlan;
