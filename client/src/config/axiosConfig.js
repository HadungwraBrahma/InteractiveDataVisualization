import axios from 'axios';

// axios.defaults.baseURL = "http://localhost:8000"; // For dev
axios.defaults.baseURL = "https://interactivedatavisualization.onrender.com";
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

export default axios;
