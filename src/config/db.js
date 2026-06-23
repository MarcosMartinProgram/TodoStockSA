const dns = require('dns');
dns.setServers(['8.8.8.8']);

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_ATLAS_URI);
    await mongoose.connect(process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error al conectar MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
