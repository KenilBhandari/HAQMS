import { useState, useCallback, useEffect, useRef } from 'react';
import { getPatients } from '@/services/patients';

export function usePatients(baseUrl, token) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('All');
  const searchRef = useRef(search);
  const genderRef = useRef(gender);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  useEffect(() => {
    genderRef.current = gender;
  }, [gender]);

  const fetchPatients = useCallback(async (page = 1, nextSearch = searchRef.current, nextGender = genderRef.current) => {
    setLoading(true);
    try {
      const data = await getPatients(baseUrl, token, { page, search: nextSearch, gender: nextGender });
      if (data.success) {
        setPatients(data.patients);
        setPagination({
          page: data.pagination.page,
          totalPages: data.pagination.totalPages,
          totalPatients: data.pagination.totalPatients,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token]);

  return {
    patients, setPatients,
    loading,
    pagination,
    search, setSearch,
    gender, setGender,
    fetchPatients,
  };
}
