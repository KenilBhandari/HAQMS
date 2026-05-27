const prisma = require('../../prisma');

const updateAppointment = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const appointment = await prisma.appointment.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!appointment) {
      return res.status(404).json({
        error: 'Appointment not found'
      });
    }


    const updated = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.status(200).json({ success: true, appointment: updated });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

module.exports = { updateAppointment };
