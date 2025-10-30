import axios from './axios';

export const profileAPI = {
  createOrUpdate: async (data) => {
    const response = await axios.post('/profile', data);
    return response.data;
  },

  get: async () => {
    const response = await axios.get('/profile');
    return response.data;
  },
};
