import React, { useEffect, useState } from 'react';


function AllLearningPlan() {
  const [learningPlan, setLearningPlan] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/learningPlan');
        if (response.ok) {
          const data = await response.json();
          setLearningPlan(data);
        } else {
          console.error('Failed to fetch learning Plan data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);




  return (
    <div className="learning-Plan">
      <div className='nav-bar'>
        <div className='nav-bar__container'>
          <div className='nav-bar__title'>Learning Plan</div>
          <div className='nav-bar__buttons'>
            <button
              className='nav-bar__button nav-bar__button--active'
              onClick={() => (window.location.href = '/allLearningPlan')}
            >
              All Learning Plan
            </button>
            <button
              className='nav-bar__button'
              onClick={() => (window.location.href = '/addLearningPlan')}
            >
              Add Learning Plan
            </button>
            <button
              className='nav-bar__button'
              onClick={() => (window.location.href = '/myLearningPlan')}
            >
              My Learning Plan
            </button>
          </div>
        </div>
      </div>
      <div className='Plan-container'>
        <div className='Plan-container__inner'>
          {learningPlan.length > 0 ? (
            <div className="Plan-grid">
              {learningPlan.map((item) => (
                <div
                  key={item.id}
                  className="Plan-card"
                >
                  <div className="Plan-card__header">
                    <h3 className="Plan-card__title">{item.projectName}</h3>
                    <p className="Plan-card__owner">by {item.fullName}</p>
                  </div>

                  <div className="Plan-card__meta">
                    <div className="Plan-card__data">

                      <div className="Plan-card__data-item_rwo">
                        <a
                          href={item.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="Plan-card__link-btn"
                        >
                          View Project
                        </a>
                      </div>

                      <div className="Plan-card__data-item">
                        <span className="Plan-card__data-label">Status</span>
                        <p className={`Plan-card__data-value Plan-card__data-value--status Plan-card__data-value--${item.workingOnStatus}`}>
                          {item.workingOnStatus}
                        </p>
                      </div>

                      <div className="Plan-card__data-item">
                        <span className="Plan-card__data-label">Milestones</span>
                        {item.milestones.includes(',') ? (
                          <ul className="Plan-card__list">
                            {item.milestones.split(',').map((milestone, i) => (
                              <li key={i} className="Plan-card__list-item">{milestone.trim()}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="Plan-card__data-value">{item.milestones}</p>
                        )}
                      </div>

                      <div className="Plan-card__data-item">
                        <span className="Plan-card__data-label">Skills</span>
                        <div className="skills-container">
                          {item.skills.split(',').map((skill, i) => (
                            <span key={i} className="skill-tag">{skill.trim()}</span>
                          ))}
                        </div>
                      </div>

                      <div className="Plan-card__data-item">
                        <span className="Plan-card__data-label">Timeline</span>
                        <p className="Plan-card__data-value">{item.timeline}</p>
                      </div>

                      {item.workingOnStatus === 'doing' && item.progress && (
                        <div className="Plan-card__data-item">
                          <span className="Plan-card__data-label">Progress</span>
                          <div className="progress-container" style={{ "--progress": item.progress }}>
                            <svg className="progress-circle" viewBox="0 0 64 64">
                              <circle className="progress-bg" cx="32" cy="32" r="30"></circle>
                              <circle className="progress-fill" cx="32" cy="32" r="30"></circle>
                            </svg>
                            <span className="progress-text">{item.progress}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="Plan-empty">
              <p className="Plan-empty__message">No learning Plan data available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllLearningPlan;