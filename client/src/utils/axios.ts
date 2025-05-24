import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // API URL
  withCredentials: true, // include credentials (cookies)
});

export default axiosInstance;