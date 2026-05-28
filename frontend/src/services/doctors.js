import { get } from './api';

export const getDoctors = (baseUrl, token) =>
  get(baseUrl, '/doctors', token);

export const searchDoctors = (baseUrl, token, query) =>
  get(baseUrl, `/doctors?search=${encodeURIComponent(query)}`, token);
