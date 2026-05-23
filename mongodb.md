# Configuracion de MongoDB - TodoStock S.A.

## Requisitos

- MongoDB Community Server 7.x o superior
- Node.js 18+
- npm

---

## Instalacion MongoDB

1. Descargar MongoDB Community Server desde:

https://www.mongodb.com/try/download/community

2. Instalar utilizando la opcion:

- Complete
- Install MongoDB as a Service

3. (Opcional) Instalar MongoDB Compass.

---

## Verificar instalacion

Abrir una terminal y ejecutar:

```bash
mongod --version
```

Si aparece la version instalada, MongoDB esta correctamente configurado.

---

## Variables de entorno

Crear archivo `.env` en la raiz del proyecto:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/todostockdb
```

---

## Instalacion del proyecto

```bash
npm install
```

---

## Ejecucion del servidor

Modo desarrollo:

```bash
npm run dev
```

Modo produccion:

```bash
npm start
```

---

## Conexion MongoDB

La conexion se encuentra centralizada en:

```text
src/config/db.js
```

La aplicacion utiliza Mongoose como ODM para gestionar la persistencia de datos.

---

## Schemas implementados

- `productSchema.js`
- `providerSchema.js`

Los schemas permiten definir:
- estructura de datos
- validaciones
- relaciones mediante ObjectId

---

## Verificacion funcional

Al iniciar correctamente el servidor debe visualizarse:

```text
MongoDB conectado correctamente
[TodoStock S.A.] Servidor corriendo en http://localhost:3000
```