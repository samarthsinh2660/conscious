import axios from './axios';

export const analysisAPI = {
  getByReflectionId: async (reflectionId) => {
    const response = await axios.get(`/analysis/${reflectionId}`);
    return response.data;
  },

  getLatest: async () => {
    const response = await axios.get('/analysis/latest');
    return response.data;
  },

  getAll: async (params) => {
    const response = await axios.get('/analysis/all', { params });
    return response.data;
  },
};
