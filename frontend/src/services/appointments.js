import { get, post, patch } from './api';

export const getAppointments = (baseUrl, token, { doctorId }) =>
  get(baseUrl, `/appointments?doctorId=${doctorId}`, token);

export const createAppointment = (baseUrl, token, data) =>
  post(baseUrl, '/appointments', token, data);

export const updateAppointment = (baseUrl, token, id, data) =>
  patch(baseUrl, `/appointments/${id}`, token, data);
