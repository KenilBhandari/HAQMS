import { get, post, patch } from './api';

export const getAppointments = (baseUrl, token, { doctorId, status } = {}) => {
  const params = new URLSearchParams();
  if (doctorId) params.set('doctorId', doctorId);
  if (status) params.set('status', status);
  const query = params.toString();
  return get(baseUrl, `/appointments${query ? `?${query}` : ''}`, token);
};

export const createAppointment = (baseUrl, token, data) =>
  post(baseUrl, '/appointments', token, data);

export const updateAppointment = (baseUrl, token, id, data) =>
  patch(baseUrl, `/appointments/${id}`, token, data);
