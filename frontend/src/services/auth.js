import { post } from './api';

export const login = (baseUrl, { email, password }) =>
  post(baseUrl, '/auth/login', null, { email, password });

export const register = (baseUrl, { name, email, password, role }) =>
  post(baseUrl, '/auth/register', null, { name, email, password, role });
