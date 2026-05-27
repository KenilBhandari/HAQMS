const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAppointments = async (req, res) => {
  try {
    const { doctorId, status } = req.query;

    const where = {};
    if (doctorId) where.doctorId = doctorId;
    if (status) where.status = status;

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { appointmentDate: 'asc' },
    });

    const detailedAppointments = [];
    for (const app of appointments) {
      const patient = await prisma.patient.findUnique({ where: { id: app.patientId } });
      const doctor = await prisma.doctor.findUnique({ where: { id: app.doctorId } });
      detailedAppointments.push({
        ...app,
        patient: patient ? { id: patient.id, name: patient.name, phoneNumber: patient.phoneNumber, age: patient.age, medicalHistory: patient.medicalHistory } : null,
        doctor: doctor ? { id: doctor.id, name: doctor.name, specialization: doctor.specialization } : null,
      });
    }

    res.json({
      success: true,
      count: detailedAppointments.length,
      appointments: detailedAppointments,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve appointments', details: error.message });
  }
};

module.exports = { getAppointments };
