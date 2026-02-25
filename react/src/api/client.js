import axios from 'axios';
import authService from './auth';

const apiBaseUrl = '/api';

const client = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor de peticiones: añade el token JWT a cada petición
client.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas: maneja errores 401 y refresca el token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 y no estamos en /auth/*, intentamos refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/')) {
      if (isRefreshing) {
        // Si ya se está refrescando, añadimos esta petición a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await authService.refreshAccessToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authService.logout();
        window.location.href = '/#login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const videoGameApi = {
  getAll: () => client.get('/videogame'),
  getById: (id) => client.get(`/videogame/${id}`),
  getByPlataforma: (plataforma) => client.get(`/videogame?plataforma=${plataforma}`),
  create: (videoGame) => client.post('/videogame', videoGame),
  update: (id, videoGame) => client.patch(`/videogame/${id}`, videoGame),
  delete: (id) => client.delete(`/videogame/${id}`),
};

export const userApi = {
  getAll: () => client.get('/users'),
  getById: (id) => client.get(`/users/${id}`),
  create: (user) => client.post('/users', user),
  update: (id, user) => client.patch(`/users/${id}`, user),
  delete: (id) => client.delete(`/users/${id}`),
};

export default client;
 