import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LearningPlanService from '../../Service/LearningPlanService';

import "./plan.css";

function UpdateLearningPlan() {
  const { id } = useParams();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    LearningPlanService.getLearningPlanById(id)
      .then((response) => setFormData(response.data))
      .catch((error) => console.error("Error fetching plan:", error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    LearningPlanService.updateLearningPlan(id, formData)
      .then(() => alert("Updated successfully!"))
      .catch((error) => console.error("Error updating plan:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="projectName" value={formData.projectName} onChange={(e) => setFormData({...formData, projectName: e.target.value})} />
      <button type="submit">Update</button>
    </form>
  );
}

export default UpdateLearningPlan;
