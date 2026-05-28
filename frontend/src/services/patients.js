import { get, post, del } from './api';

export const getPatients = (baseUrl, token, { page = 1, search = '', gender = 'All' }) =>
  get(baseUrl, `/patients?page=${page}&limit=5&search=${encodeURIComponent(search)}&gender=${encodeURIComponent(gender)}`, token);

export const getPatientById = (baseUrl, token, id) =>
  get(baseUrl, `/patients/${id}`, token);

export const createPatient = (baseUrl, token, data) =>
  post(baseUrl, '/patients', token, data);

export const deletePatient = (baseUrl, token, id) =>
  del(baseUrl, `/patients/${id}`, token);
