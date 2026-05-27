const prisma = require('../../prisma');
const { phoneRegex, emailRegex } = require('../../utils/regex');

const createPatient = async (req, res) => {
  try {
    const { name, email, phoneNumber, age, gender, medicalHistory } = req.body;
    const parsedAge = parseInt(age);

    if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 120) {
      return res.status(400).json({ error: 'Invalid age' });
    }

    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    if (!name || !phoneRegex.test(phoneNumber) || !gender) {
      return res.status(400).json({ error: 'Name, phoneNumber, age, and gender are required.' });
    }

    const patient = await prisma.patient.create({
      data: {
        name,
        email: email || null,
        phoneNumber,
        age: parsedAge,
        gender,
        medicalHistory: medicalHistory || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
      },
    });

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register patient' });
  }
};

module.exports = { createPatient };
