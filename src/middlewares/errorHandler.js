// src/middlewares/errorHandler.js
// Middleware global de manejo de errores.

function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${err.message}`);

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? 'Error interno del servidor.'
    : err.message;

  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.status(statusCode).json({ error: message });
  }

  try {
    res.status(statusCode).render('error', {
      title: `Error ${statusCode}`,
      statusCode,
      message
    });
  } catch (_renderErr) {
    // Fallback si el motor de vistas no está disponible
    res.status(statusCode).send(
      `<!DOCTYPE html><html><body><h1>Error ${statusCode}</h1><p>${message}</p></body></html>`
    );
  }
}

module.exports = errorHandler;
