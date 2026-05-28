const prisma = require('../../prisma');

const getAppointments = async (req, res) => {
  try {
    const { doctorId, status } = req.query;
    
    const validStatuses = ["PENDING", "COMPLETED", "CANCELLED"];
    const where = {};
    
    if (doctorId) where.doctorId = doctorId;
    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: "Invalid status",
        });
      }
      where.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: {
        appointmentDate: "asc",
      },

      include: {
        patient: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            age: true,
            medicalHistory: true,
          },
        },

        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve appointments' });
  }
};

module.exports = { getAppointments };
