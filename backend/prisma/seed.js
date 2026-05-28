import prisma from '../src/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.queueToken.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.doctor.deleteMany({ where: { userId: null } });
  await prisma.patient.deleteMany({
    where: { id: { notIn: ['clark-kent', 'bruce-wayne'] } },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@haqms.com' },
    update: {},
    create: {
      email: 'admin@haqms.com',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'ADMIN',
    },
  });

  const receptionist = await prisma.user.upsert({
    where: { email: 'reception1@haqms.com' },
    update: {},
    create: {
      email: 'reception1@haqms.com',
      password: hashedPassword,
      name: 'Sarah Receptionist',
      role: 'RECEPTIONIST',
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor1@haqms.com' },
    update: {},
    create: {
      email: 'doctor1@haqms.com',
      password: hashedPassword,
      name: 'Dr. John Smith',
      role: 'DOCTOR',
    },
  });

  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      name: 'Dr. John Smith',
      specialization: 'Cardiology',
      department: 'Surgery',
      consultationFee: 150,
      experience: 15,
      startTime: '09:00',
      endTime: '17:00',
    },
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      name: 'Dr. Jane Doe',
      specialization: 'Neurology',
      department: 'Neurology',
      consultationFee: 200,
      experience: 12,
      startTime: '10:00',
      endTime: '18:00',
    },
  });

  const doctor3 = await prisma.doctor.create({
    data: {
      name: 'Dr. Emily Brown',
      specialization: 'Pediatrics',
      department: 'Pediatrics',
      consultationFee: 120,
      experience: 8,
      startTime: '08:00',
      endTime: '16:00',
    },
  });

  const patient1 = await prisma.patient.upsert({
    where: { id: 'clark-kent' },
    update: {},
    create: {
      id: 'clark-kent',
      name: 'Clark Kent',
      email: 'clark.kent@dailyplanet.com',
      phoneNumber: '555-0101',
      age: 35,
      gender: 'Male',
      medicalHistory: null,
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { id: 'bruce-wayne' },
    update: {},
    create: {
      id: 'bruce-wayne',
      name: 'Bruce Wayne',
      email: 'bruce.wayne@wayneenterprises.com',
      phoneNumber: '555-0102',
      age: 40,
      gender: 'Male',
      medicalHistory: null,
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      name: 'Peter Parker',
      email: 'peter.parker@dailybugle.com',
      phoneNumber: '555-0103',
      age: 25,
      gender: 'Male',
      medicalHistory: 'Allergic to penicillin. Previous surgery: none.',
    },
  });

  const patient4 = await prisma.patient.create({
    data: {
      name: 'Diana Prince',
      email: 'diana.prince@themuseum.org',
      phoneNumber: '555-0104',
      age: 30,
      gender: 'Female',
      medicalHistory: 'No known allergies. Regular checkup patient.',
    },
  });

  const patient5 = await prisma.patient.create({
    data: {
      name: 'Tony Stark',
      email: 'tony@starkindustries.com',
      phoneNumber: '555-0105',
      age: 45,
      gender: 'Male',
      medicalHistory: 'Pacemaker implanted 2020. Allergic to shellfish.',
    },
  });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const appointment1 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor.id,
      appointmentDate: new Date(today.getTime() + 9 * 60 * 60 * 1000),
      reason: 'Annual heart checkup',
      status: 'PENDING',
    },
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorId: doctor.id,
      appointmentDate: new Date(today.getTime() + 10 * 60 * 60 * 1000),
      reason: 'Chest pain evaluation',
      status: 'PENDING',
    },
  });

  const appointment3 = await prisma.appointment.create({
    data: {
      patientId: patient3.id,
      doctorId: doctor2.id,
      appointmentDate: new Date(today.getTime() + 11 * 60 * 60 * 1000),
      reason: 'Migraine consultation',
      status: 'PENDING',
    },
  });

  const appointment4 = await prisma.appointment.create({
    data: {
      patientId: patient4.id,
      doctorId: doctor3.id,
      appointmentDate: new Date(today.getTime() + 14 * 60 * 60 * 1000),
      reason: 'Child vaccination follow-up',
      status: 'COMPLETED',
    },
  });

  await prisma.queueToken.create({
    data: {
      tokenNumber: 1,
      patientId: patient1.id,
      doctorId: doctor.id,
      appointmentId: appointment1.id,
      status: 'WAITING',
    },
  });

  await prisma.queueToken.create({
    data: {
      tokenNumber: 2,
      patientId: patient2.id,
      doctorId: doctor.id,
      appointmentId: appointment2.id,
      status: 'CALLING',
    },
  });

  await prisma.queueToken.create({
    data: {
      tokenNumber: 1,
      patientId: patient4.id,
      doctorId: doctor3.id,
      appointmentId: appointment4.id,
      status: 'COMPLETED',
    },
  });

  console.log('Database seeded successfully!');
  console.log('Pre-seeded accounts (password: password123):');
  console.log('  Admin:         admin@haqms.com');
  console.log('  Receptionist:  reception1@haqms.com');
  console.log('  Doctor:        doctor1@haqms.com');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
