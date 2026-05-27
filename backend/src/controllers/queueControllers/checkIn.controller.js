const prisma = require('../../prisma');

const checkIn = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentId } = req.body;

    if (!patientId || !doctorId) {
      return res.status(400).json({ error: 'Patient and Doctor ID are required for check-in.' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxTokenResult = await prisma.queueToken.aggregate({
      where: {
        doctorId,
        createdAt: { gte: today },
      },
      _max: {
        tokenNumber: true,
      },
    });

    const currentMax = maxTokenResult._max.tokenNumber || 0;
    const nextTokenNumber = currentMax + 1;

    await new Promise((resolve) => setTimeout(resolve, 350));

    const newToken = await prisma.queueToken.create({
      data: {
        tokenNumber: nextTokenNumber,
        patientId,
        doctorId,
        appointmentId: appointmentId || null,
        status: 'WAITING',
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    res.status(201).json({
      message: 'Checked in successfully. Token generated.',
      token: newToken,
    });
  } catch (error) {
    console.error('Queue check-in error:', error);
    res.status(500).json({ error: 'Check-in failed', details: error.message });
  }
};

module.exports = { checkIn };
