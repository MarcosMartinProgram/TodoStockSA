const mongoose = require('mongoose');

// Caché de conexión para entornos serverless (Vercel)
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI)
      .then((m) => {
        console.log('MongoDB conectado');
        return m;
      })
      .catch((error) => {
        cached.promise = null;
        console.error('Error al conectar MongoDB:', error.message);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
