import axios from './axios';

export const reflectionAPI = {
  create: async (data) => {
    const response = await axios.post('/reflections', data);
    return response.data;
  },

  getAll: async (params) => {
    const response = await axios.get('/reflections', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`/reflections/${id}`);
    return response.data;
  },

  checkToday: async () => {
    const response = await axios.get('/reflections/today');
    return response.data;
  },
};
