import axios from 'axios';

const API_URL = 'http://localhost:8080/api/events';

export const fetchEvents = () => axios.get(API_URL);
export const addEvent = (event) => axios.post(API_URL, event);
export const updateEvent = (id, event) => axios.put(`${API_URL}/${id}`, event);
export const deleteEvent = (id) => axios.delete(`${API_URL}/${id}`);
