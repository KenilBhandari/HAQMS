const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, reason } = req.body;

    if (!patientId || !doctorId || !appointmentDate) {
      return res.status(400).json({ error: 'Patient, Doctor, and Appointment Date are required.' });
    }

    const appDate = new Date(appointmentDate);
    const existingBooking = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: appDate,
        status: { not: 'CANCELLED' },
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        error: 'Double booking blocked. Doctor already has an appointment at this exact millisecond.',
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        appointmentDate: appDate,
        reason: reason || '',
        status: 'PENDING',
      },
    });

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book appointment', details: error.message });
  }
};

module.exports = { createAppointment };
