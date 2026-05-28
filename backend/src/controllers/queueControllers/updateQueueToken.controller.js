import prisma from "../../prisma.js";

const updateQueueToken = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const token = await prisma.queueToken.findUnique({
      where: { id: req.params.id },
    });
    if (!token) {
      return res.status(404).json({
        error: "Queue token not found",
      });
    }

    const updatedToken = await prisma.queueToken.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        patient: true,
        doctor: true,
      },
    });

    res.json({ success: true, token: updatedToken });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update queue token" });
  }
};

export { updateQueueToken };
