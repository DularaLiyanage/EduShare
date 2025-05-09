import axios from "axios";

const API_URL = "http://localhost:8080/learningPlan";

class LearningPlanService {
  // Create Learning Plan
  createLearningPlan(data) {
    return axios.post(API_URL, data);
  }

  // Get All Learning Plans
  getAllLearningPlans() {
    return axios.get(API_URL);
  }

  // Get Learning Plans by User ID
  getLearningPlansByUserId(userID) {
    return axios.get(`${API_URL}/user/${userID}`);
  }

  // Get Learning Plan by ID
  getLearningPlanById(id) {
    return axios.get(`${API_URL}/${id}`);
  }

  // Update Learning Plan
  updateLearningPlan(id, data) {
    return axios.put(`${API_URL}/${id}`, data);
  }

  // Delete Learning Plan
  deleteLearningPlan(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

export default new LearningPlanService();
