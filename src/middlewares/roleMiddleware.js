function roleMiddleware(...rolesPermitidos) {

  return (req, res, next) => {

    if (!req.usuario) {

      return res.status(401).render('error', {
        title: 'No autorizado',
        statusCode: 401,
        message: 'Debe iniciar sesión.'
      });

    }

if (!rolesPermitidos.includes(req.usuario.rol)) {

  return res.status(403).render('error', {
    title: 'Acceso denegado',
    statusCode: 403,
    message: `Su perfil ${req.usuario.rol} no posee permisos para acceder a esta sección.`
  });

}

    next();

  };

}

module.exports = roleMiddleware;