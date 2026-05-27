const prisma = require("../../prisma");

const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, reason } = req.body;

    if (!patientId || !doctorId || !appointmentDate) {
      return res
        .status(400)
        .json({ error: "Patient, Doctor, and Appointment Date are required." });
    }

    const appDate = new Date(appointmentDate);

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

    if (doctor.startTime && doctor.endTime) {
      const appointmentTime = appDate.toTimeString().slice(0, 5);

      if (
        appointmentTime < doctor.startTime ||
        appointmentTime > doctor.endTime
      ) {
        return res.status(400).json({
          error: "Appointment outside doctor working hours",
        });
      }
    }

    const existingBooking = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: appDate,
        status: { not: "CANCELLED" },
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        error: "Doctor already has appointment at this time.",
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        appointmentDate: appDate,
        reason: reason || "",
        status: "PENDING",
      },
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

module.exports = { createAppointment };
