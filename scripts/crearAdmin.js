require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8']);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../src/models/User');

async function crearAdmin() {

  try {

    await mongoose.connect(process.env.MONGODB_ATLAS_URI);

    const existe = await User.findOne({
      usuario: 'admin'
    });

    if (existe) {
      console.log('El usuario admin ya existe');
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(
      'admin123',
      10
    );

    await User.create({
      usuario: 'admin',
      password: passwordHash,
      nombre: 'Administrador',
      rol: 'ADMIN',
      activo: true
    });

    console.log('Usuario administrador creado');

    process.exit(0);

  } catch (error) {

    console.error(error);

    process.exit(1);
  }
}

crearAdmin();