import React, { useEffect, useState } from "react";
import LearningPlanService from '../../Service/LearningPlanService';

import "./plan.css";

function AllLearningPlan() {
  const [learningPlans, setLearningPlans] = useState([]);

  useEffect(() => {
    LearningPlanService.getAllLearningPlans()
      .then((response) => setLearningPlans(response.data))
      .catch((error) => console.error("Error fetching plans:", error));
  }, []);

  return (
    <div className="learning-plan-list">
      {learningPlans.map((plan) => (
        <div key={plan.id} className="plan-item">
          <h3>{plan.projectName}</h3>
          <p>{plan.workingOnStatus}</p>
        </div>
      ))}
    </div>
  );
}

export default AllLearningPlan;
