const prisma = require("../../prisma");

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: { in: ["RECEPTIONIST", "DOCTOR"] } },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

module.exports = { getUsers };
