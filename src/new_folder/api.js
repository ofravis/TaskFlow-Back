const axios = require('axios');

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || process.env.VITE_API_URL || process.env.API_URL || 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
    const storage = typeof window !== 'undefined' ? window.localStorage : undefined;
    const token = storage ? storage.getItem('token') : null;

    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (resposta) => resposta,
    (erro) => {
        if (erro.response?.status === 401 && typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem('token');
            if (typeof window.location !== 'undefined') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(erro);
    }
);

module.exports = api;