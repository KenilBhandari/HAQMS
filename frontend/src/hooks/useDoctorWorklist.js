import { useState, useCallback, useEffect } from 'react';
import { getAppointments, updateAppointment } from '@/services/appointments';
import { getQueue, updateQueueToken } from '@/services/queue';

export function useDoctorWorklist(baseUrl, token, doctorsList, user) {
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [doctorQueue, setDoctorQueue] = useState([]);

  const fetchDoctorWorklist = useCallback(async () => {
    if (!user || user.role !== 'DOCTOR') return;
    const matchedDoc = doctorsList.find(d => d.userId === user.id);
    if (!matchedDoc) return;

    try {
      const [appData, queueData] = await Promise.all([
        getAppointments(baseUrl, token, { doctorId: matchedDoc.id }),
        getQueue(baseUrl, token, { doctorId: matchedDoc.id }),
      ]);
      if (appData.success) setDoctorAppointments(appData.appointments);
      if (queueData.success) setDoctorQueue(queueData.tokens);
    } catch (e) {
      console.error(e);
    }
  }, [baseUrl, token, doctorsList, user]);

  useEffect(() => {
    if (user?.role === 'DOCTOR' && doctorsList.length > 0 && token) {
      const id = setTimeout(() => fetchDoctorWorklist(), 0);
      return () => clearTimeout(id);
    }
  }, [doctorsList, user, token, fetchDoctorWorklist]);

  const handleUpdateQueueStatus = useCallback(async (tokenId, newStatus) => {
    try {
      const data = await updateQueueToken(baseUrl, token, tokenId, { status: newStatus });
      if (data.success) {
        fetchDoctorWorklist();
      } else {
        alert(`Error: ${data.error || 'Failed to update status'}`);
      }
    } catch (e) {
      console.error(e);
    }
  }, [baseUrl, token, fetchDoctorWorklist]);

  const handleCompleteAppointment = useCallback(async (appId) => {
    try {
      const data = await updateAppointment(baseUrl, token, appId, { status: 'COMPLETED' });
      if (data.success) {
        fetchDoctorWorklist();
      } else {
        alert(`Error: ${data.error || 'Failed to complete appointment'}`);
      }
    } catch (e) {
      console.error(e);
    }
  }, [baseUrl, token, fetchDoctorWorklist]);

  return {
    doctorAppointments, setDoctorAppointments,
    doctorQueue, setDoctorQueue,
    fetchDoctorWorklist,
    handleUpdateQueueStatus,
    handleCompleteAppointment,
  };
}
