import React, { useEffect, useState } from "react";
import LearningPlanService from '../../Service/LearningPlanService';

import "./plan.css";

function MyLearningPlan() {
  const [learningPlans, setLearningPlans] = useState([]);
  const userID = localStorage.getItem("userId");

  useEffect(() => {
    LearningPlanService.getLearningPlansByUserId(userID)
      .then((response) => setLearningPlans(response.data))
      .catch((error) => console.error("Error fetching user plans:", error));
  }, [userID]);

  return (
    <div className="my-learning-plans">
      {learningPlans.map((plan) => (
        <div key={plan.id} className="plan-item">
          <h3>{plan.projectName}</h3>
          <p>{plan.workingOnStatus}</p>
        </div>
      ))}
    </div>
  );
}

export default MyLearningPlan;
