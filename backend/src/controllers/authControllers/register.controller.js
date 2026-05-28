import prisma from '../../prisma.js';
import bcrypt from 'bcryptjs';
import { emailRegex, passwordRegex } from '../../utils/regex.js';

const registerController = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    const allowedRoles = ["RECEPTIONIST", "DOCTOR"];
    const safeRole = allowedRoles.includes(role) ? role : "RECEPTIONIST";

    if (!email || !password || !name) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Registration failed" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: safeRole,
      },
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({
        error: "Server error during registration",
      });
  }
};

export { registerController };
