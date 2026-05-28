import prisma from '../../prisma.js';

const getPatients = async (req, res) => {
  try {
    const { search, gender } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { phoneNumber: { contains: search } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(gender && gender !== 'All' && { gender: { equals: gender, mode: 'insensitive' } }),
    };

    const [patients, totalPatients] = await Promise.all([
      prisma.patient.findMany({ where, skip: offset, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.patient.count({ where }),
    ]);

    res.status(200).json({
      success:true,
      patients,
      pagination: { page, limit, totalPatients, totalPages: Math.ceil(totalPatients / limit) },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

export { getPatients };
