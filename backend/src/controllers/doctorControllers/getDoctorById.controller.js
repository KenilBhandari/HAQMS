import prisma from '../../prisma.js';

const getDoctorById = async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: req.params.id },
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json({ success: true, doctor });
  } catch (error) {
    console.error('Error retrieving doctor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { getDoctorById };
