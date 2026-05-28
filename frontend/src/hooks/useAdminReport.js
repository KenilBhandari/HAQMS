import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getDoctorStats } from '@/services/reports';
import { searchDoctors } from '@/services/doctors';

export function useAdminReport(baseUrl, token, setDoctorsList) {
  const [adminReportData, setAdminReportData] = useState(null);
  const [adminReportLoading, setAdminReportLoading] = useState(false);

  const generateSystemReport = useCallback(async () => {
    setAdminReportLoading(true);
    try {
      const data = await getDoctorStats(baseUrl, token);
      if (data.success) setAdminReportData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAdminReportLoading(false);
    }
  }, [baseUrl, token]);

  const searchPhysicians = useCallback(async (query) => {
    try {
      const data = await searchDoctors(baseUrl, token, query);
      if (data.success && Array.isArray(data.doctors)) {
        if (setDoctorsList) setDoctorsList(data.doctors);
      } else {
        toast.error(data.sqlMessage || data.error);
      }
    } catch (e) {
      console.error(e);
    }
  }, [baseUrl, token, setDoctorsList]);

  return {
    adminReportData, setAdminReportData,
    adminReportLoading,
    generateSystemReport,
    searchPhysicians,
  };
}
