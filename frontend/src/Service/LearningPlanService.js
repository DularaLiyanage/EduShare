import axios from 'axios';

const BASE_URL = 'http://localhost:8080/learningPlan';

class LearningPlanService {
  getAllLearningPlans() {
    return axios.get(`${BASE_URL}`);
  }

  getLearningPlansByUser(userID) {
    return axios.get(`${BASE_URL}?userID=${userID}`);
  }

  addLearningPlan(plan) {
    return axios.post(`${BASE_URL}`, plan);
  }

  updateLearningPlan(id, plan) {
    return axios.put(`${BASE_URL}/${id}`, plan);
  }

  deleteLearningPlan(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
}

export default new LearningPlanService();
