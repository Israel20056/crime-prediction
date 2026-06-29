import axios from 'axios';

const BASE_URL = 'https://crimewatch-backend-ljak.onrender.com/api';

export const fetchStats = () => axios.get(`${BASE_URL}/stats`);
export const fetchCrimes = (params) => axios.get(`${BASE_URL}/crimes`, { params });
export const fetchPrediction = (body) => axios.post(`${BASE_URL}/predict`, body);