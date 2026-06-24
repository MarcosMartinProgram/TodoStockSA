const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {

  const token = req.cookies?.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.usuario = payload;

    next();

  } catch (error) {

    return res.redirect('/login');

  }
}

module.exports = authMiddleware;