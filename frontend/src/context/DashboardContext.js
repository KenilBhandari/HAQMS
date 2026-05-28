'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { usePatients } from '@/hooks/usePatients';
import { useDoctors } from '@/hooks/useDoctors';
import { useDoctorWorklist } from '@/hooks/useDoctorWorklist';
import { useAdminReport } from '@/hooks/useAdminReport';
import { checkIn } from '@/services/queue';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const { user, token, API_BASE_URL } = useAuth();

  const patientsHook = usePatients(API_BASE_URL, token);
  const doctorsHook = useDoctors(API_BASE_URL, token);
  const doctorWorklistHook = useDoctorWorklist(API_BASE_URL, token, doctorsHook.doctorsList, user);
  const adminReportHook = useAdminReport(API_BASE_URL, token, doctorsHook.setDoctorsList);

  const [checkinMessage, setCheckinMessage] = useState('');
  const [walkinPatientId, setWalkinPatientId] = useState('');
  const [walkinDoctorId, setWalkinDoctorId] = useState('');

  const handleQueueCheckin = async (patientId, doctorId, appointmentId = null) => {
    setCheckinMessage('');
    try {
      const data = await checkIn(API_BASE_URL, token, { patientId, doctorId, appointmentId });
      if (data.success) {
        setCheckinMessage(`Checked in! Generated Token #${data.token.tokenNumber}`);
        if (user?.role === 'DOCTOR') doctorWorklistHook.fetchDoctorWorklist();
      } else {
        setCheckinMessage(`Error check-in: ${data.error}`);
      }
    } catch (err) {
      setCheckinMessage(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    if (token) doctorsHook.fetchDoctorsDropdown();
  }, [token]);

  useEffect(() => {
    if (user && (user.role === 'RECEPTIONIST' || user.role === 'ADMIN') && token) {
      patientsHook.fetchPatients(1);
    }
  }, [user, token]);

  const value = {
    user, token, API_BASE_URL,
    ...patientsHook,
    ...doctorsHook,
    ...doctorWorklistHook,
    ...adminReportHook,
    checkinMessage, setCheckinMessage,
    walkinPatientId, setWalkinPatientId,
    walkinDoctorId, setWalkinDoctorId,
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
