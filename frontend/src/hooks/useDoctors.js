import { useState, useCallback, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getDoctors, searchDoctors } from '@/services/doctors';

export function useDoctors(baseUrl, token) {
  const [doctorsList, setDoctorsList] = useState([]);
  const didInitialFetchRef = useRef(false);

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
        toast.error(data.sqlMessage || data.error);
      }
    } catch (e) {
      console.error(e);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    didInitialFetchRef.current = false;
  }, [baseUrl, token]);

  const fetchDoctorsOnce = useCallback(async () => {
    if (didInitialFetchRef.current) return;
    didInitialFetchRef.current = true;
    await fetchDoctorsDropdown();
  }, [fetchDoctorsDropdown]);

  return { doctorsList, setDoctorsList, fetchDoctorsDropdown: fetchDoctorsOnce, searchPhysicians };
}
