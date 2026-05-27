const prisma = require("../../prisma");

const getDoctorReport = async (req, res) => {
  try {
    const start = Date.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const doctors = await prisma.doctor.findMany({
      include: {
        _count: {
          select: {
            appointments: true,
            queueTokens: true,
          },
        },

        appointments: {
          select: {
            status: true,
          },
        },
        queueTokens: {
          where: {
            createdAt: {
              gte: today,
            },
          },
          select: {
            id: true,
          },
        },
      },
    });

    const reportData = doctors.map((doc) => {
      const completed = doc.appointments.filter(
        (a) => a.status === "COMPLETED",
      ).length;

      const cancelled = doc.appointments.filter(
        (a) => a.status === "CANCELLED",
      ).length;

      return {
        id: doc.id,
        name: doc.name,
        department: doc.department || doc.specialization,
        specialization: doc.specialization,
        totalAppointments: doc._count.appointments,
        completedAppointments: completed,
        todayQueueSize: doc.queueTokens.length,
        cancelledAppointments: cancelled,
        revenue: completed * doc.consultationFee,
      };
    });

    const durationMs = Date.now() - start;

    console.log(`Doctor report generated in ${durationMs}ms`);

    res.status(200).json({
      success: true,
      timeTakenMs: durationMs,
      data: reportData,
    });
  } catch (error) {
    console.error("Error generating doctor report:", error);
    res
      .status(500)
      .json({ error: "Failed to generate report" });
  }
};

module.exports = { getDoctorReport };
