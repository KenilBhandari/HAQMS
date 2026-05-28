import prisma from '../../prisma.js';

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
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error while fetching user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { authController };
