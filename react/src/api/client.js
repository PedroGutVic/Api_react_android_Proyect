import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  ?? (import.meta.env.DEV ? '/api' : '');

const client = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

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
 