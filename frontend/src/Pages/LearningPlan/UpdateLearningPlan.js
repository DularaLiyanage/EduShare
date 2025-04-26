import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function UpdateLearningPlan() {
  const { id } = useParams();
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
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
      isValid = false;
    } else if (formData.projectName.length > 100) {
      newErrors.projectName = 'Project name must be less than 100 characters';
      isValid = false;
    }

    if (!formData.projectLink.trim()) {
      newErrors.projectLink = 'Project link is required';
      isValid = false;
    } else if (!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(formData.projectLink)) {
      newErrors.projectLink = 'Please enter a valid URL';
      isValid = false;
    }

    if (!formData.workingOnStatus) {
      newErrors.workingOnStatus = 'Please select a status';
      isValid = false;
    }

    if (!formData.milestones.trim()) {
      newErrors.milestones = 'Milestones are required';
      isValid = false;
    }

    if (!formData.skills.trim()) {
      newErrors.skills = 'Skills are required';
      isValid = false;
    }

    if (!formData.timeline.trim()) {
      newErrors.timeline = 'Timeline is required';
      isValid = false;
    }

    if (formData.workingOnStatus === 'doing' && !formData.progress) {
      newErrors.progress = 'Progress is required when status is "Doing"';
      isValid = false;
    } else if (formData.workingOnStatus === 'doing' && formData.progress) {
      const progressNum = parseInt(formData.progress);
      if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
        newErrors.progress = 'Progress must be a number between 0 and 100';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="update-learning-plan">
      <div className='nav-bar'>
        <div className='nav-bar__container'>
          <div className='nav-bar__title'>Learning plan</div>
          <div className='nav-bar__buttons'>
            <button 
              className='nav-bar__button'
              onClick={() => (window.location.href = '/allLearningPlan')}
            >
              All Learning plan
            </button>
            <button 
              className='nav-bar__button'
              onClick={() => (window.location.href = '/addLearningPlan')}
            >
              Add Learning plan
            </button>
            <button 
              className='nav-bar__button nav-bar__button--active'
              onClick={() => (window.location.href = '/myLearningPlan')}
            >
              My Learning plan
            </button>
          </div>
        </div>
      </div>

      <div className='form-container'>
        <div className='form-container__inner'>
          <h2 className="form-title">
            Update Learning plan
          </h2>
          
          <form onSubmit={handleSubmit} className="plan-form" noValidate>
            <div className="form-section">
              <h3 className="form-section-title">Basic Information</h3>
              <div className="form-group">
                <label className="form-label">Project Name*</label>
                <input 
                  type='text' 
                  name='projectName' 
                  value={formData.projectName} 
                  onChange={handleChange}
                  className={`form-input ${errors.projectName ? 'error' : ''}`}
                  placeholder="Enter a title for your plan"
                />
                {errors.projectName && <span className="error-message">{errors.projectName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Project Link*</label>
                <input 
                  type='url' 
                  name='projectLink' 
                  value={formData.projectLink} 
                  onChange={handleChange}
                  className={`form-input ${errors.projectLink ? 'error' : ''}`}
                  placeholder="Enter a link for your project"
                />
                {errors.projectLink && <span className="error-message">{errors.projectLink}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Working On Status*</label>
                <select 
                  name='workingOnStatus' 
                  value={formData.workingOnStatus} 
                  onChange={handleChange}
                  className={`form-input ${errors.workingOnStatus ? 'error' : ''}`}
                >
                  <option value="">Select status</option>
                  <option value="complete">Complete</option>
                  <option value="doing">Doing</option>
                </select>
                {errors.workingOnStatus && <span className="error-message">{errors.workingOnStatus}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Milestones*</label>
                <input 
                  type='text' 
                  name='milestones' 
                  value={formData.milestones} 
                  onChange={handleChange}
                  className={`form-input ${errors.milestones ? 'error' : ''}`}
                  placeholder="Enter milestones"
                />
                {errors.milestones && <span className="error-message">{errors.milestones}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Skills*</label>
                <input 
                  type='text' 
                  name='skills' 
                  value={formData.skills} 
                  onChange={handleChange}
                  className={`form-input ${errors.skills ? 'error' : ''}`}
                  placeholder="Enter skills"
                />
                {errors.skills && <span className="error-message">{errors.skills}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Timeline*</label>
                <input 
                  type='text' 
                  name='timeline' 
                  value={formData.timeline} 
                  onChange={handleChange}
                  className={`form-input ${errors.timeline ? 'error' : ''}`}
                  placeholder="Enter timeline"
                />
                {errors.timeline && <span className="error-message">{errors.timeline}</span>}
              </div>
              {formData.workingOnStatus === 'doing' && (
                <div className="form-group">
                  <label className="form-label">Progress*</label>
                  <input 
                    type='text' 
                    name='progress' 
                    value={formData.progress} 
                    onChange={handleChange}
                    className={`form-input ${errors.progress ? 'error' : ''}`}
                    placeholder="Enter progress"
                  />
                  {errors.progress && <span className="error-message">{errors.progress}</span>}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button 
                type='submit' 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Learning plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateLearningPlan;