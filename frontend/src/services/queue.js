import { get, post, patch } from './api';

export const getQueue = (baseUrl, token, { doctorId } = {}) =>
  get(baseUrl, doctorId ? `/queue?doctorId=${encodeURIComponent(doctorId)}` : '/queue', token);

export const checkIn = (baseUrl, token, data) =>
  post(baseUrl, '/queue/checkin', token, data);

export const updateQueueToken = (baseUrl, token, id, data) =>
  patch(baseUrl, `/queue/${id}`, token, data);
