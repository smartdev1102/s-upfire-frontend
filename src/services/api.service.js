import axios from 'axios';

export const baseUrl = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_API : process.env.REACT_APP_DOMAIN;

export const pairService = {
  fetchPairs: async(payload) => {
    const response = await axios.get(`${baseUrl}/pairs/${payload}`);
    return response.data;
  }
}