const prisma = require("../../prisma");

const checkIn = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentId } = req.body;

    if (!patientId || !doctorId) {
      return res
        .status(400)
        .json({ error: "Patient and Doctor ID are required for check-in." });
    }

    const [patient, doctor] = await Promise.all([
      prisma.patient.findUnique({
        where: { id: patientId },
      }),

      prisma.doctor.findUnique({
        where: { id: doctorId },
      }),
    ]);
    if (!patient) {
      return res.status(404).json({
        error: "Patient not found",
      });
    }

    if (!doctor) {
      return res.status(404).json({
        error: "Doctor not found",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const token = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        SELECT pg_advisory_xact_lock(hashtext(${doctorId})::bigint)
      `;

      const max = await tx.queueToken.aggregate({
        where: {
          doctorId,
          createdAt: {
            gte: today,
          },
        },
        _max: {
          tokenNumber: true,
        },
      });

      const next = (max._max.tokenNumber ?? 0) + 1;

      return tx.queueToken.create({
        data: {
          tokenNumber: next,
          patientId,
          doctorId,
          appointmentId: appointmentId ?? null,

          status: "WAITING",
        },

        include: {
          patient: {
            select: {
              id: true,
              name: true,
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
    });

    res.status(201).json({
      success: true,
      message: "Checked in successfully. Token generated.",
      token,
    });
  } catch (error) {
    console.error("Check-in error:", error);

    res.status(500).json({
      error: "Check-in failed",
    });
  }
};

module.exports = { checkIn };
