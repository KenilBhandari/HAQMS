const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getDoctorStats = async (req, res) => {
  try {
    const start = Date.now();

    const totalDoctors = await prisma.doctor.count();
    const surgeonsCount = await prisma.doctor.count({ where: { department: 'Surgery' } });
    const averageFee = await prisma.doctor.aggregate({ _avg: { consultationFee: true } });
    const highestExperience = await prisma.doctor.aggregate({ _max: { experience: true } });
    const durationMs = Date.now() - start;

    res.json({
      success: true,
      data: {
        total: totalDoctors,
        surgeons: surgeonsCount,
        averageFee: Math.round(averageFee._avg.consultationFee || 0),
        maxExperience: highestExperience._max.experience || 0,
      },
      debugInfo: {
        executionTimeMs: durationMs,
        notes: 'Loaded sequentially for safety. Optimization needed.',
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDoctorStats };
