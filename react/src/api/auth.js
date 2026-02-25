import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  ?? (import.meta.env.DEV ? '/api' : '');

const authClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const TOKEN_KEY = 'arcadia_access_token';
const REFRESH_KEY = 'arcadia_refresh_token';
const USER_KEY = 'arcadia_user';

export const authService = {
  /**
   * Registra un nuevo usuario
   */
  register: async (username, email, password) => {
    const response = await authClient.post('/auth/register', {
      username,
      email,
      password,
    });
    const { accessToken, refreshToken, user } = response.data;
    authService.setTokens(accessToken, refreshToken);
    authService.setUser(user);
    return response.data;
  },

  /**
   * Inicia sesión
   */
  login: async (email, password) => {
    const response = await authClient.post('/auth/login', {
      email,
      password,
    });
    const { accessToken, refreshToken, user } = response.data;
    authService.setTokens(accessToken, refreshToken);
    authService.setUser(user);
    return response.data;
  },

  /**
   * Cierra sesión
   */
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Obtiene el accessToken
   */
  getAccessToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Obtiene el refreshToken
   */
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_KEY);
  },

  /**
   * Guarda los tokens
   */
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  },

  /**
   * Obtiene el usuario guardado
   */
  getUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Guarda el usuario
   */
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Verifica si hay sesión activa
   */
  isAuthenticated: () => {
    return !!authService.getAccessToken();
  },

  /**
   * Refresca el accessToken usando el refreshToken
   */
  refreshAccessToken: async () => {
    const refreshToken = authService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await authClient.post('/auth/refresh', {
      refreshToken,
    });
    const { accessToken } = response.data;
    localStorage.setItem(TOKEN_KEY, accessToken);
    return accessToken;
  },
};

export default authService;
