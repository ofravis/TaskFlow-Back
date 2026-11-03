const axios = require('axios');

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_API || process.env.REACT_APP_API_URL || process.env.VITE_API_URL || process.env.API_URL || 'http://localhost:3001',
    timeout: 5000,
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
return config;
});

api.interceptors.response.use(
resposta => resposta,
erro => {
    const ehLogin = erro.config?.url?.includes('/auth/login');
    if (erro.response?.status === 401 && !ehLogin) {
    localStorage.removeItem('token');
window.location.href = '/login';
}
return Promise.reject(erro);
}
);
export function mensagensDeErro(erro) {
const dados = erro.response?.data?.erro;
    if (!dados) return ['Não foi possível conectar à API.'];
    if (dados.detalhes) return dados.detalhes;

return [dados.mensagem];
}
export default api;