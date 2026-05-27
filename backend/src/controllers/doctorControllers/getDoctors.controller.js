const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getDoctors = async (req, res) => {
  try {
    const { search, specialization } = req.query;

    let query = 'SELECT * FROM "Doctor"';
    const conditions = [];

    if (search) {
      conditions.push(`name ILIKE '%${search}%'`);
    }

    if (specialization && specialization !== 'All') {
      conditions.push(`specialization = '${specialization}'`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    console.log(`[SQL-DEBUG] Executing Query: ${query}`);
    const doctors = await prisma.$queryRawUnsafe(query);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Database execution failure', sqlMessage: error.message });
  }
};

module.exports = { getDoctors };
