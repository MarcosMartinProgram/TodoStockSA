const bcrypt = require('bcryptjs');
const User = require('../models/User');

class UserManager {

  async getAll() {
    return await User.find().sort({ usuario: 1 });
  }

  async getById(id) {
    return await User.findById(id);
  }

  async create(userData) {

    const existing = await User.findOne({
      usuario: userData.usuario
    });

    if (existing) {
      const error = new Error(
        `Ya existe el usuario ${userData.usuario}.`
      );
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword =
      await bcrypt.hash(userData.password, 10);

    const newUser = new User({
      usuario: userData.usuario,
      password: hashedPassword,
      nombre: userData.nombre,
      rol: userData.rol,
      activo: userData.activo
    });

    return await newUser.save();

  }

  async update(id, userData) {

    const updateData = {
      usuario: userData.usuario,
      nombre: userData.nombre,
      rol: userData.rol,
      activo: userData.activo
    };

    if (userData.password) {

      updateData.password =
        await bcrypt.hash(userData.password, 10);

    }

    return await User.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after' }
    );

  }

  async delete(id) {

    return await User.findByIdAndUpdate(
      id,
      { activo: false },
      { returnDocument: 'after' }
    );

  }

}

module.exports = UserManager;