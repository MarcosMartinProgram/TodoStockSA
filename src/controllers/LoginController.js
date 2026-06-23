// src/controllers/LoginController.js
// Login de solo estética: valida usuario y password contra valores fijos del .env
// No usa sesiones ni protege rutas — solo controla el ingreso inicial.

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

class LoginController {

  showForm(req, res) {
    res.render('login/index', {
      title: 'Ingresar',
      error: null
    });
  }

  async login(req, res) {

    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.render('login/index', {
        title: 'Ingresar',
        error: 'Ingresá usuario y contraseña.'
      });
    }

    const user = await User.findOne({
      usuario: usuario
    });

    if (!user) {
      return res.render('login/index', {
        title: 'Ingresar',
        error: 'Usuario o contraseña incorrectos.'
      });
    }

    if (!user.activo) {
      return res.render('login/index', {
        title: 'Ingresar',
        error: 'Usuario inactivo.'
      });
    }

    const passwordCorrecta = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCorrecta) {
      return res.render('login/index', {
        title: 'Ingresar',
        error: 'Usuario o contraseña incorrectos.'
      });
    }

    
const token = jwt.sign(
  {
    id: user._id,
    usuario: user.usuario,
    rol: user.rol
  },
  process.env.JWT_SECRET,
  {
    expiresIn: '8h'
  }
);

res.cookie('token', token, {
  httpOnly: true
});

res.redirect('/inicio');

  }

}

module.exports = LoginController;