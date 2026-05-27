const prisma = require('../prisma');

const authController = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({
      message: "User details retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { authController };
