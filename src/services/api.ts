import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
//deixei para debugar, utilizei de um outro projeto essa logica
api.interceptors.request.use((config) => {
  console.log(`Requisição ${config.method?.toUpperCase()} para:`, config.url);
  console.log('Dados:', config.data);

  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token adicionado ao header');
  }

  return config;
}, (error) => {
  console.error('Erro no interceptor de request:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    console.log(`Resposta ${response.status} de:`, response.config.url);
    console.log('Dados da resposta:', response.data);
    return response;
  },
  (error) => {
    console.error('Erro na resposta:', error.response || error);

    if (error.response?.status === 401) {
      console.log('401 Unauthorized - Token inválido ou expirado');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;