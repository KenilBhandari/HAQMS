const prisma = require("../../prisma");

const getDoctorStats = async (req, res) => {
  try {
    const start = Date.now();

    const [totalDoctors, surgeonsCount, averageFee, highestExperience] =
      await Promise.all([
        prisma.doctor.count(),
        prisma.doctor.count({
          where: {
            department: "Surgery",
          },
        }),
        prisma.doctor.aggregate({
          _avg: {
            consultationFee: true,
          },
        }),
        prisma.doctor.aggregate({
          _max: {
            experience: true,
          },
        }),
      ]);

    const durationMs = Date.now() - start;

    console.log("Execution Time ", durationMs);
    res.json({
      success: true,
      stats: {
        total: totalDoctors,
        surgeons: surgeonsCount,
        averageFee: Math.round(averageFee._avg.consultationFee ?? 0),
        maxExperience: highestExperience._max.experience ?? 0,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error getting Doctor Stats",
    });
  }
};

module.exports = { getDoctorStats };
