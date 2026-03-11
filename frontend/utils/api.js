import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';


const getHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiGet = (url) => {
    return axios.get(BASE_URL + url, {
        headers: getHeaders(),
        withCredentials: true
    });
};

export const apiPost = (url, data) => {
    return axios.post(BASE_URL + url, data, {
        headers: getHeaders(),
        withCredentials: true
    });
};

export const apiPut = (url, data) => {
    return axios.put(BASE_URL + url, data, {
        headers: getHeaders(),
        withCredentials: true
    });
};

export const apiDelete = (url) => {
    return axios.delete(BASE_URL + url, {
        headers: getHeaders(),
        withCredentials: true
    });
};


const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;