import { get } from './api';

export const getDoctorStats = (baseUrl, token) =>
  get(baseUrl, '/reports/doctor-stats', token);
