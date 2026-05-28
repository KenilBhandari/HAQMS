import { useState, useCallback } from 'react';
import { getDoctors, searchDoctors } from '@/services/doctors';

export function useDoctors(baseUrl, token) {
  const [doctorsList, setDoctorsList] = useState([]);

  const fetchDoctorsDropdown = useCallback(async () => {
    try {
      const data = await getDoctors(baseUrl, token);
      if (data.doctors) setDoctorsList(data.doctors);
    } catch (e) {
      console.error(e);
    }
  }, [baseUrl, token]);

  const searchPhysicians = useCallback(async (query) => {
    try {
      const data = await searchDoctors(baseUrl, token, query);
      if (data.success && Array.isArray(data.doctors)) {
        setDoctorsList(data.doctors);
      } else {
        alert(`API Error: ${data.sqlMessage || data.error}`);
      }
    } catch (e) {
      console.error(e);
    }
  }, [baseUrl, token]);

  return { doctorsList, setDoctorsList, fetchDoctorsDropdown, searchPhysicians };
}
