import React, { useState } from "react";
import LearningPlanService from "../../Service/LearningPlanService";
import "./plan.css";

function AddLearningPlan() {
  const [formData, setFormData] = useState({
    fullName: "",
    userID: "",
    projectName: "",
    projectLink: "",
    workingOnStatus: "",
    milestones: "",
    skills: "",
    timeline: "",
    progress: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await LearningPlanService.createLearningPlan(formData);
      alert("Learning Plan added successfully!");
      window.location.href = "/allLearningPlan";
    } catch (error) {
      alert("Error adding Learning Plan");
      console.error(error);
    }
  };

  return (
    <div className="add-learning-plan">
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullName" onChange={handleChange} placeholder="Full Name" />
        <input type="text" name="userID" onChange={handleChange} placeholder="User ID" />
        <input type="text" name="projectName" onChange={handleChange} placeholder="Project Name" />
        <input type="url" name="projectLink" onChange={handleChange} placeholder="Project Link" />
        <select name="workingOnStatus" onChange={handleChange}>
          <option value="">Select Status</option>
          <option value="complete">Complete</option>
          <option value="doing">Doing</option>
        </select>
        <input type="text" name="milestones" onChange={handleChange} placeholder="Milestones" />
        <input type="text" name="skills" onChange={handleChange} placeholder="Skills" />
        <input type="text" name="timeline" onChange={handleChange} placeholder="Timeline" />
        <input type="number" name="progress" onChange={handleChange} placeholder="Progress" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddLearningPlan;
