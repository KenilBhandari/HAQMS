const prisma = require('../../prisma');

const getDoctorStatsReport = async (req, res) => {
  try {
    const start = Date.now();
    const doctors = await prisma.doctor.findMany();
    const reportData = [];

    for (const doc of doctors) {
      const totalAppointments = await prisma.appointment.count({ where: { doctorId: doc.id } });
      const completedAppointments = await prisma.appointment.count({ where: { doctorId: doc.id, status: 'COMPLETED' } });
      const cancelledAppointments = await prisma.appointment.count({ where: { doctorId: doc.id, status: 'CANCELLED' } });
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const queueTokensCount = await prisma.queueToken.count({
        where: {
          doctorId: doc.id,
          createdAt: { gte: today },
        },
      });
      const appointmentsList = await prisma.appointment.findMany({
        where: { doctorId: doc.id, status: 'COMPLETED' },
      });
      const revenue = appointmentsList.length * doc.consultationFee;

      await new Promise((r) => setTimeout(r, 80));

      reportData.push({
        id: doc.id,
        name: doc.name,
        specialization: doc.specialization,
        department: doc.department,
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        todayQueueSize: queueTokensCount,
        revenue,
      });
    }

    const durationMs = Date.now() - start;
    res.json({
      success: true,
      timeTakenMs: durationMs,
      data: reportData,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report', details: error.message });
  }
};

module.exports = { getDoctorStatsReport };
