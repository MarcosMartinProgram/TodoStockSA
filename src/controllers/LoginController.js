// src/controllers/LoginController.js
// Login de solo estética: valida usuario y password contra valores fijos del .env
// No usa sesiones ni protege rutas — solo controla el ingreso inicial.

class LoginController {
  showForm(req, res) {
    res.render('login/index', { title: 'Ingresar', error: null });
  }

  login(req, res) {
    const { usuario, password } = req.body;

    const usuarioValido  = process.env.LOGIN_USUARIO  || 'admin';
    const passwordValido = process.env.LOGIN_PASSWORD  || 'admin123';

    // Validar que se haya ingresado algo en ambos campos
    if (!usuario || !password) {
      return res.render('login/index', {
        title: 'Ingresar',
        error: 'Ingresá usuario y contraseña.'
      });
    }

    // Validar contra credenciales fijas
    if (usuario !== usuarioValido || password !== passwordValido) {
      return res.render('login/index', {
        title: 'Ingresar',
        error: 'Usuario o contraseña incorrectos.'
      });
    }

    // Credenciales correctas → redirigir al inicio
    res.redirect('/inicio');
  }
}

module.exports = LoginController;
