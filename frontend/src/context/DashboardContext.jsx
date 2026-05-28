'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { usePatients } from '@/hooks/usePatients';
import { useDoctors } from '@/hooks/useDoctors';
import { useDoctorWorklist } from '@/hooks/useDoctorWorklist';
import { useAdminReport } from '@/hooks/useAdminReport';
import { checkIn } from '@/services/queue';
import { getAppointments } from '@/services/appointments';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const { user, token, API_BASE_URL } = useAuth();

  const patientsHook = usePatients(API_BASE_URL, token);
  const doctorsHook = useDoctors(API_BASE_URL, token);
  const doctorWorklistHook = useDoctorWorklist(API_BASE_URL, token, doctorsHook.doctorsList, user);
  const adminReportHook = useAdminReport(API_BASE_URL, token, doctorsHook.setDoctorsList);

  const { fetchDoctorsDropdown } = doctorsHook;
  const { fetchPatients } = patientsHook;

  const [checkinMessage, setCheckinMessage] = useState('');
  const [walkinPatientId, setWalkinPatientId] = useState('');
  const [walkinDoctorId, setWalkinDoctorId] = useState('');
  const [appointmentsList, setAppointmentsList] = useState([]);

  const fetchAppointments = useCallback(async () => {
    try {
      const data = await getAppointments(API_BASE_URL, token);
      if (data.success) {
        setAppointmentsList(data.appointments);
      }
    } catch (err) {
      console.error(err);
    }
  }, [API_BASE_URL, token]);

  const handleQueueCheckin = async (patientId, doctorId, appointmentId = null) => {
    setCheckinMessage('');
    try {
      const data = await checkIn(API_BASE_URL, token, { patientId, doctorId, appointmentId });
      if (data.success) {
        setCheckinMessage(data.message);
        if (user?.role === 'DOCTOR') doctorWorklistHook.fetchDoctorWorklist();
      } else {
        setCheckinMessage(`Error check-in: ${data.error}`);
      }
      return data;
    } catch (err) {
      setCheckinMessage(`Error: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    if (token) fetchDoctorsDropdown();
  }, [token, fetchDoctorsDropdown]);

  useEffect(() => {
    if (user && (user.role === 'RECEPTIONIST' || user.role === 'ADMIN') && token) {
      const id = setTimeout(() => fetchAppointments(), 0);
      return () => clearTimeout(id);
    }
  }, [user, token, fetchAppointments]);

  const value = {
    user, token, API_BASE_URL,
    ...patientsHook,
    ...doctorsHook,
    ...doctorWorklistHook,
    ...adminReportHook,
    checkinMessage, setCheckinMessage,
    walkinPatientId, setWalkinPatientId,
    walkinDoctorId, setWalkinDoctorId,
    appointmentsList, setAppointmentsList,
    fetchAppointments,
    handleQueueCheckin,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
