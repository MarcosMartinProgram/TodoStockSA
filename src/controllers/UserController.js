const UserManager = require('../models/UserManager');

class UserController {

  constructor() {
    this.userManager = new UserManager();
  }

  async getAll(req, res, next) {

    try {

      const usuarios =
        await this.userManager.getAll();

      res.render(
        'usuarios/index',
        {
          title: 'Usuarios',
          usuarios
        }
      );

    } catch (error) {
      next(error);
    }

  }

async showCreateForm(req, res, next) {

  try {

    res.render(
      'usuarios/create',
      {
        title: 'Nuevo Usuario'
      }
    );

  } catch (error) {
    next(error);
  }

}

async create(req, res, next) {

  try {

    const {
      usuario,
      password,
      nombre,
      rol
    } = req.body;

    await this.userManager.create({
      usuario: usuario.trim(),
      password,
      nombre: nombre.trim(),
      rol,
      activo: true
    });

    res.redirect('/usuarios');

  } catch (error) {
    next(error);
  }

}


async showEditForm(req, res, next) {

  try {

    const usuario =
      await this.userManager.getById(req.params.id);

    if (!usuario) {
      return res.status(404).render('error', {
        title: 'Error 404',
        statusCode: 404,
        message: 'Usuario no encontrado.'
      });
    }

    res.render(
      'usuarios/edit',
      {
        title: 'Editar Usuario',
        usuario
      }
    );

  } catch (error) {
    next(error);
  }

}

async update(req, res, next) {

  try {

    const {
      usuario,
      password,
      nombre,
      rol,
      activo
    } = req.body;

    await this.userManager.update(
      req.params.id,
      {
        usuario: usuario.trim(),
        password,
        nombre: nombre.trim(),
        rol,
        activo: activo === 'true'
      }
    );

    res.redirect('/usuarios');

  } catch (error) {
    next(error);
  }

}

async delete(req, res, next) {

  try {

    await this.userManager.delete(
      req.params.id
    );

    res.redirect('/usuarios');

  } catch (error) {
    next(error);
  }

}

}

module.exports = UserController;