import prisma from "../../prisma.js";

class CheckInError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const tokenIncludes = {
  patient: { select: { id: true, name: true } },
  doctor: { select: { id: true, name: true, specialization: true } },
};

const getNextTokenNumber = async (tx, doctorId, today) => {
  const max = await tx.queueToken.aggregate({
    where: { doctorId, createdAt: { gte: today } },
    _max: { tokenNumber: true },
  });
  return (max._max.tokenNumber ?? 0) + 1;
};

const checkIn = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentId } = req.body;
    const { role } = req.user;

    if (!patientId || !doctorId) {
      return res.status(400).json({ error: "Patient and Doctor ID are required for check-in." });
    }

    const [patient, doctor] = await Promise.all([
      prisma.patient.findUnique({ where: { id: patientId } }),
      prisma.doctor.findUnique({ where: { id: doctorId } }),
    ]);
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        SELECT pg_advisory_xact_lock(hashtext(${doctorId})::bigint)
      `;

      if (role === 'DOCTOR') {
        const existingCalling = await tx.queueToken.findFirst({
          where: { doctorId, status: 'CALLING', createdAt: { gte: today } },
        });
        if (existingCalling) {
          throw new CheckInError(409, 'Finish consulting current patient first');
        }

        const existingToken = await tx.queueToken.findFirst({
          where: { patientId, doctorId, status: 'WAITING', createdAt: { gte: today } },
        });

        if (existingToken) {
          const updated = await tx.queueToken.update({
            where: { id: existingToken.id },
            data: { status: 'CALLING' },
            include: tokenIncludes,
          });
          return { token: updated, message: 'Patient called for consultation' };
        }

        const tokenNumber = await getNextTokenNumber(tx, doctorId, today);
        const created = await tx.queueToken.create({
          data: { tokenNumber, patientId, doctorId, appointmentId: appointmentId ?? null, status: 'CALLING' },
          include: tokenIncludes,
        });
        return { token: created, message: 'Patient called for consultation' };
      }

      const existing = await tx.queueToken.findFirst({
        where: { patientId, status: { in: ['WAITING', 'CALLING'] }, createdAt: { gte: today } },
      });
      if (existing) {
        throw new CheckInError(409, 'Patient already checked in for today');
      }

      const tokenNumber = await getNextTokenNumber(tx, doctorId, today);
      const created = await tx.queueToken.create({
        data: { tokenNumber, patientId, doctorId, appointmentId: appointmentId ?? null, status: 'WAITING' },
        include: tokenIncludes,
      });
      return { token: created, message: 'Checked in successfully. Token generated.' };
    });

    res.status(201).json({ success: true, message: result.message, token: result.token });
  } catch (error) {
    if (error instanceof CheckInError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    console.error("Check-in error:", error);
    res.status(500).json({ error: "Check-in failed" });
  }
};

export { checkIn };
