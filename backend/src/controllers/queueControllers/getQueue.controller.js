import prisma from '../../prisma.js';

const getQueue = async (req, res) => {
  try {
    const { doctorId, status } = req.query;

    const where = {};
    if (doctorId) where.doctorId = doctorId;
    if (status) where.status = status;

    const tokens = await prisma.queueToken.findMany({
      where,
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ success: true, tokens });
  } catch (error) {
    console.error('Error retrieving queue:', error);
    res.status(500).json({ error: 'Failed to retrieve queue' });
  }
};

export { getQueue };
