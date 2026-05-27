const prisma = require('../../prisma');

const getPatientById = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: req.params.id },
      include: { appointments: true },
    });

    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json({ success: true, patient });
  } catch (error) {
    console.error('Error retrieving patient:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getPatientById };
