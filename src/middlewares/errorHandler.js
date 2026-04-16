// src/middlewares/errorHandler.js
// Middleware global de manejo de errores.
// Captura errores no controlados y responde con el código HTTP adecuado.

function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${err.message}`);

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? 'Error interno del servidor.'
    : err.message;

  // Si la petición espera JSON (API), responde en JSON
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.status(statusCode).json({ error: message });
  }

  // Para peticiones desde el navegador, renderiza la vista de error
  res.status(statusCode).render('error', {
    title: `Error ${statusCode}`,
    statusCode,
    message
  });
}

module.exports = errorHandler;
