# TodoStock S.A. - Sistema de Gestion Backend

## Descripcion General

Sistema de gestion para **TodoStock S.A.** (distribuidora mayorista), desarrollado con Node.js, Express, Pug y MongoDB.

El proyecto evoluciono en tres etapas:

- **Etapa 1**: CRUD de productos y proveedores con persistencia en archivos JSON.
- **Etapa 2**: migracion a MongoDB, ampliacion funcional del modulo de ventas y trabajo colaborativo por ramas con integracion centralizada.
- **Etapa 3**: autenticacion real con JWT y bcrypt, control de acceso basado en roles (ADMIN / VENTAS / COMPRAS), modulo de gestion de usuarios y despliegue en Vercel.

---

## Tabla de Contenidos

1. [Estado Actual del Proyecto](#estado-actual-del-proyecto)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Arquitectura](#arquitectura)
4. [Migracion de Persistencia: JSON -> MongoDB](#migracion-de-persistencia-json---mongodb)
5. [Modulos del Sistema](#modulos-del-sistema)
6. [Etapa 2 - Trabajo por Ramas e Integracion](#etapa-2---trabajo-por-ramas-e-integracion)
7. [Etapa 3 - Autenticacion, Roles y Despliegue](#etapa-3---autenticacion-roles-y-despliegue)
8. [Requisitos Previos](#requisitos-previos)
9. [Instalacion](#instalacion)
10. [Configuracion](#configuracion)
11. [Ejecucion](#ejecucion)
12. [Despliegue en Vercel](#despliegue-en-vercel)
13. [Notas de Version](#notas-de-version)

---

## Estado Actual del Proyecto

- Version del proyecto: **2.0.0** (Etapa 3).
- Persistencia activa: **MongoDB con Mongoose**.
- Autenticacion activa: **JWT + bcryptjs**.
- Control de acceso: **RBAC por roles (ADMIN / VENTAS / COMPRAS)**.
- Despliegue: **Vercel** (serverless).
- Modulos principales activos:
  - Productos
  - Proveedores
  - Clientes
  - Comprobantes
  - Pagos
  - Cuenta corriente
  - Ventas
  - Login / Logout
  - Usuarios (gestion de cuentas del sistema)

---

## Tecnologias Utilizadas

| Tecnologia | Version | Proposito |
| --- | --- | --- |
| Node.js | 18+ | Entorno de ejecucion |
| Express | 5.x | Framework HTTP |
| Pug | 3.x | Motor de vistas |
| dotenv | 17.x | Variables de entorno |
| MongoDB | Atlas/local | Base de datos documental |
| Mongoose | 9.x | ODM para MongoDB |
| bcryptjs | 3.x | Hash y verificacion de contrasenas |
| jsonwebtoken | 9.x | Generacion y validacion de tokens JWT |
| cookie-parser | 1.x | Lectura de cookies HTTP |

---

## Arquitectura

Patron principal: **MVC** con clases por modulo.

Flujo general:

```text
Request -> Routes -> Middlewares -> Controllers -> Managers (negocio) -> Schemas (Mongoose) -> MongoDB
```

Capas:

- **Routes**: exponen endpoints y aplican validaciones.
- **Middlewares**: autenticacion JWT, control de acceso por rol, validacion de payload, ids y manejo global de errores.
- **Controllers**: coordinan requests/responses.
- **Managers**: reglas de negocio y relaciones entre modulos.
- **Schemas**: definicion de entidades y persistencia en MongoDB.
- **Views**: interfaz Pug para operacion web.

---

## Migracion de Persistencia: JSON -> MongoDB

### Situacion inicial (Etapa 1)

- Persistencia basada en archivos JSON (`src/data/*.json`).
- Servicio `FileSystemManager` para lectura/escritura.
- IDs numericos y validaciones orientadas a archivos.

### Situacion actual (Etapa 2)

- Persistencia migrada a MongoDB.
- Conexion centralizada en `src/config/db.js`.
- Entidades modeladas con schemas Mongoose:
  - `productSchema`
  - `providerSchema`
  - `clientSchema`
  - `comprobanteClienteSchema`
  - `pagosClienteSchema`
  - `ccorrienteClienteSchema`
- IDs migrados a `ObjectId`.
- Managers actualizados para operar con `find`, `findById`, `save`, `populate`, etc.

### Impacto funcional de la migracion

- Mayor consistencia de datos relacionales entre modulos.
- Mejor escalabilidad respecto al esquema basado en archivos.
- Preparacion para trabajo colaborativo concurrente con menor riesgo de colision en datos.
- Identificadores estandarizados como `ObjectId` en MongoDB (campo `_id`) en lugar de IDs numericos secuenciales.

### Estructura tecnica clave en Etapa 2

- `src/config/db.js`: conexion centralizada a MongoDB.
- `src/schemas/`: definicion de entidades con Mongoose.
- `src/models/`: reglas de negocio y operaciones CRUD con Mongoose.
- `src/data/` y `src/services/FileSystemManager.js`: componentes legacy de la etapa JSON (referencia historica/migracion).

---

## Modulos del Sistema

- **Productos y Proveedores**: CRUD completo, validaciones de relacion y stock. Acceso restringido a rol COMPRAS y ADMIN.
- **Clientes**: alta, baja, modificacion y consulta. Acceso restringido a rol VENTAS y ADMIN.
- **Comprobantes**: facturas/notas con impacto en cuenta corriente. Acceso restringido a rol VENTAS y ADMIN.
- **Pagos**: registro de pagos de clientes. Acceso restringido a rol VENTAS y ADMIN.
- **Cuenta corriente**: movimientos debito/credito y saldo acumulado por cliente. Acceso restringido a rol VENTAS y ADMIN.
- **Ventas**: acceso central a operaciones comerciales. Acceso restringido a rol VENTAS y ADMIN.
- **Login / Logout**: autenticacion con usuario y contrasena hasheada, emision y revocacion de token JWT.
- **Usuarios**: gestion de cuentas del sistema (alta, baja, modificacion, activacion). Acceso restringido a rol ADMIN.

---

## Etapa 2 - Trabajo por Ramas e Integracion

En la segunda etapa se trabajo por ramas y luego se consolido todo en una rama de integracion.

### Ramas del equipo integradas

- `Agus`
- `rama_luis`
- `vale-mongodb-productos`
- `Marcos`

### Aportes principales por rama

#### Rama `Agus`

- Commit de referencia: `4a10480`.
- Foco: **conexion a MongoDB y base de migracion**.
- Cambios clave:
  - conexion de app a base de datos
  - incorporacion/ajuste de schemas y managers de productos/proveedores
  - actualizacion de dependencias para MongoDB/Mongoose

#### Rama `rama_luis`

- Foco: **consolidacion de migracion en productos/proveedores**.
- Cambios clave:
  - ajustes en `app.js` para flujo con Mongo
  - normalizacion de `src/config/db.js`
  - ajustes de managers y schemas de productos/proveedores

#### Rama `vale-mongodb-productos`

- Foco: **alineacion final de arranque y persistencia en modulo de productos**.
- Cambio visible en integracion: ajuste de `app.js` para asegurar el flujo de inicio con MongoDB.

#### Rama `Marcos`

- Foco: **facturacion tipo punto de venta y mejoras en comprobantes**.
- Cambios clave:
  - facturacion para cliente registrado y consumidor final
  - carga de items (producto, cantidad, subtotal)
  - calculo automatico de total
  - ajuste de stock en facturacion
  - cuenta corriente solo para clientes registrados
  - actualizacion de validaciones, schemas, manager, controller y vistas de comprobantes

### Trabajo de integracion (rama `integracion/equipo-completo`)

- Se creo una rama dedicada para unir cambios sin impactar directamente en `main`.
- Se ejecutaron merges por rama, resolucion de conflictos y validaciones posteriores.
- Se genero PR desde `Marcos` hacia `integracion/equipo-completo` y se aplico merge squash.
- Resultado: consolidacion de Etapa 2 con persistencia MongoDB y mejoras funcionales de ventas/facturacion.

---

---

## Etapa 3 - Autenticacion, Roles y Despliegue

En la tercera etapa se incorporo un sistema de autenticacion real, control de acceso basado en roles y se preparo el proyecto para despliegue en Vercel.

### Autenticacion con JWT

- El `LoginController` fue reemplazado por una implementacion real que busca el usuario en MongoDB, compara la contrasena con `bcryptjs` y emite un token JWT con `jsonwebtoken`.
- El token se almacena en una cookie `httpOnly` con expiracion de 8 horas.
- Se agrego la ruta `GET /login/logout` que borra la cookie y redirige al formulario de acceso.
- El token se decodifica en cada request con un middleware global que expone `res.locals.usuario` a las vistas Pug.

### Control de acceso por roles (RBAC)

Se incorporaron dos middlewares nuevos:

- `authMiddleware`: verifica la validez del token JWT. Si no existe o expiró redirige a `/login`.
- `roleMiddleware(...roles)`: verifica que el rol del usuario logueado este entre los roles permitidos para la ruta. En caso contrario devuelve error 403.

Distribucion de accesos por rol:

| Modulo | ADMIN | VENTAS | COMPRAS |
|--------|:-----:|:------:|:-------:|
| Productos | si | — | si |
| Proveedores | si | — | si |
| Clientes | si | si | — |
| Ventas | si | si | — |
| Comprobantes | si | si | — |
| Pagos | si | si | — |
| Cuenta Corriente | si | si | — |
| Usuarios | si | — | — |

### Modulo de Usuarios

Nuevo modulo completo para la administracion de cuentas del sistema:

- Modelo `User` con campos: `usuario`, `password` (hasheada con bcrypt), `rol` (`ADMIN` / `VENTAS` / `COMPRAS`), `activo`.
- `UserManager`: operaciones CRUD contra MongoDB.
- `UserController`: maneja listado, alta, edicion y baja logica.
- Vistas Pug: `usuarios/index.pug`, `usuarios/create.pug`, `usuarios/edit.pug`.
- Script `scripts/crearAdmin.js`: crea el usuario administrador inicial en la base de datos.

### Integracion de rama_luis en main

- Se mergeo la rama `rama_luis` directamente en `main`.
- Se resolvieron conflictos en 8 archivos: `app.js`, `src/config/db.js`, `src/controllers/LoginController.js`, `src/routes/loginRoutes.js`, `src/views/layout.pug`, `package.json`, `package-lock.json` y `.env.example`.
- Se elimino `.env.example` del repositorio y se agrego al `.gitignore`.

### Despliegue en Vercel

- Se creo `vercel.json` con configuracion de build y ruteo para Express sobre `@vercel/node`.
- La conexion a MongoDB se volvio serverless-safe mediante cache en `global._mongooseCache`: si la conexion ya existe se reutiliza, evitando abrir una nueva en cada invocacion.
- `app.listen()` solo se ejecuta cuando `VERCEL` no esta definido (entorno local). En Vercel el modulo exportado directamente es usado como handler.
- La conexion a la BD se garantiza por un middleware que se ejecuta antes de cualquier ruta.

---

## Requisitos Previos

- Node.js 18 o superior.
- npm.
- Instancia MongoDB (Atlas o local).
- MongoDB Compass (opcional, recomendado para inspeccion de colecciones/documentos).

---

## Instalacion

```bash
git clone https://github.com/MarcosMartinProgram/TodoStockSA.git
cd TodoStockSA
npm install
```

Notas:

- El nombre de la carpeta local depende del nombre del repositorio clonado o del nombre que se indique al clonar.
- Si se clona con otro nombre, reemplazar `cd TodoStockSA` por el nombre real de la carpeta local.

---

## Configuracion

Crear `.env` en la raiz del proyecto:

```env
PORT=3000
NODE_ENV=development
MONGODB_ATLAS_URI=mongodb+srv://<usuario>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=<clave-secreta-larga-y-aleatoria>
```

Ejemplo alternativo para entorno local:

```env
MONGODB_URI=mongodb://localhost:27017/todostockdb
JWT_SECRET=mi-clave-local
```

Notas:

- `MONGODB_ATLAS_URI` (o `MONGODB_URI` como fallback) es obligatorio para iniciar.
- `JWT_SECRET` es obligatorio: se usa para firmar y verificar los tokens de sesion.
- `.env` no se sube al repositorio.
- En Vercel las variables de entorno se configuran desde el panel *Settings → Environment Variables*.

---

## Ejecucion

Modo desarrollo:

```bash
npm run dev
```

Modo produccion:

```bash
npm start
```

URL local por defecto:

```text
http://localhost:3000
```

---

## Despliegue en Vercel

1. Importar el repositorio desde [vercel.com](https://vercel.com) → New Project.
2. Configurar las variables de entorno en *Settings → Environment Variables*:
   - `MONGODB_ATLAS_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
3. Vercel detecta automaticamente `vercel.json` y realiza el build con `@vercel/node`.
4. Una vez desplegado, ejecutar el script de admin apuntando a la BD de produccion:

```bash
MONGODB_ATLAS_URI=<uri-produccion> node scripts/crearAdmin.js
```

## Acceso de prueba

Desde la Etapa 3 los usuarios se almacenan en MongoDB con contrasena hasheada. Para crear el usuario administrador inicial ejecutar el script:

```bash
node scripts/crearAdmin.js
```

Esto crea (o actualiza) el usuario con:

- Usuario: `admin`
- Clave: `admin123`
- Rol: `ADMIN`

El script debe ejecutarse una vez apuntando a la base de datos de destino (local o Atlas).

---

## Notas de Version

### Etapa 1

- Base MVC inicial.
- CRUD de productos/proveedores.
- Persistencia en JSON.

### Etapa 2

- Migracion de persistencia a MongoDB/Mongoose.
- Incorporacion de modulos comerciales (clientes, comprobantes, pagos, cuenta corriente, ventas).
- Integracion colaborativa por ramas.
- Consolidacion en rama de integracion para estabilizacion previa a `main`.

### Etapa 3

- Autenticacion real con JWT y bcryptjs (reemplazo del login de credenciales fijas).
- Control de acceso basado en roles: ADMIN, VENTAS, COMPRAS.
- Nuevo modulo de gestion de usuarios con CRUD completo.
- Middlewares `authMiddleware` y `roleMiddleware` aplicados a todas las rutas protegidas.
- Ruta de logout con limpieza de cookie.
- Merge de rama `rama_luis` en `main` con resolucion de conflictos.
- Configuracion de despliegue en Vercel: `vercel.json` y conexion MongoDB cacheada para serverless.

### Changelog tecnico (Etapa 2)

| Fecha | Commit | Autor | Descripcion |
| --- | --- | --- | --- |
| 2026-05-20 | `4a10480` | AgustinaBran | conexion a mongodb |
| 2026-05-22 | `c8beb3a` | Marcos Martin | merge: Agus en integracion |
| 2026-05-22 | `54f348a` | Marcos Martin | merge: rama_luis en integracion |
| 2026-05-22 | `4930323` | Marcos Martin | merge: vale-mongodb-productos en integracion |
| 2026-05-22 | `e33162a` | Marcos Martin | feat(comprobantes): facturacion POS para cliente y consumidor final (#2) |

### Changelog tecnico (Etapa 3)

| Fecha | Commit | Descripcion |
| --- | --- | --- |
| 2026-06-24 | `2254d00` | Agregado manejo de usuarios, roles y permisos, JWT, cookies y encriptacion de claves |
| 2026-06-24 | `418c8d2` | Agregado opcion logout y arreglo direccionamiento |
| 2026-06-24 | `7a0eda7` | Agregado identificacion usuario-rol logueado al sistema |
| 2026-06-24 | `9454f84` | merge: rama_luis en main - autenticacion JWT, roles y permisos, gestion de usuarios |
| 2026-06-24 | `49d374c` | chore: eliminar .env.example del repositorio y agregarlo al .gitignore |
| 2026-06-24 | `cb85443` | feat: configurar despliegue en Vercel (vercel.json, conexion MongoDB cacheada) |

---

## Estructura del proyecto

```
TodoStockSA/
├── app.js
├── vercel.json
├── scripts/
│   └── crearAdmin.js
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── LoginController.js
│   │   ├── UserController.js
│   │   ├── ProductController.js
│   │   ├── ProviderController.js
│   │   ├── ClientController.js
│   │   ├── ComprobanteClienteController.js
│   │   ├── PagosClienteController.js
│   │   └── CcorrienteClienteController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── validators.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── UserManager.js
│   │   ├── ProductManager.js
│   │   ├── ProviderManager.js
│   │   ├── ClientManager.js
│   │   ├── ComprobanteClienteManager.js
│   │   ├── PagosClienteManager.js
│   │   └── CcorrienteClienteManager.js
│   ├── routes/
│   │   ├── loginRoutes.js
│   │   ├── userRoutes.js
│   │   ├── ventasRoutes.js
│   │   ├── productRoutes.js
│   │   ├── providerRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── comprobanteClienteRoutes.js
│   │   ├── pagosClienteRoutes.js
│   │   └── ccorrienteClienteRoutes.js
│   ├── schemas/
│   │   ├── productSchema.js
│   │   ├── providerSchema.js
│   │   ├── clientSchema.js
│   │   ├── comprobanteClienteSchema.js
│   │   ├── pagosClienteSchema.js
│   │   └── ccorrienteClienteSchema.js
│   └── views/
│       ├── layout.pug
│       ├── index.pug
│       ├── login/
│       ├── usuarios/
│       ├── ventas/
│       ├── products/
│       ├── providers/
│       ├── clients/
│       ├── comprobantecliente/
│       ├── pagoscliente/
│       └── ccorrientecliente/
```

---

## Rutas del sistema

> Los parámetros de ruta se indican con `:nombre`.
> PUT y DELETE se envían desde formularios HTML usando `?_method=PUT` / `?_method=DELETE`.

### Login

| Método | Ruta | Descripción | Middleware |
|--------|------|-------------|------------|
| GET | `/login` | Muestra el formulario de acceso | — |
| POST | `/login` | Valida credenciales, emite cookie JWT y redirige a `/inicio` | — |
| GET | `/login/logout` | Borra la cookie JWT y redirige al formulario | — |

---

### Navegación

| Método | Ruta | Descripción | Middleware |
|--------|------|-------------|------------|
| GET | `/` | Redirige automáticamente a `/login` | — |
| GET | `/inicio` | Menú principal con accesos a los módulos | `authMiddleware` |
| GET | `/ventas` | Submenú del módulo de ventas | `authMiddleware`, `roleMiddleware(ADMIN, VENTAS)` |

---

### Productos

> Acceso restringido a roles: **ADMIN**, **COMPRAS**.

| Método | Ruta | Descripción | Middleware |
|--------|------|-------------|------------|
| GET | `/productos` | Listado de productos con proveedor | `authMiddleware`, `roleMiddleware` |
| GET | `/productos/crear` | Formulario de alta | `authMiddleware`, `roleMiddleware` |
| GET | `/productos/:id` | Detalle del producto | `authMiddleware`, `roleMiddleware`, `validateId` |
| GET | `/productos/:id/editar` | Formulario de edición | `authMiddleware`, `roleMiddleware`, `validateId` |
| POST | `/productos` | Crear nuevo producto | `authMiddleware`, `roleMiddleware`, `validateProduct` |
| PUT | `/productos/:id` | Actualizar producto | `authMiddleware`, `roleMiddleware`, `validateId` |
| DELETE | `/productos/:id` | Eliminar producto | `authMiddleware`, `roleMiddleware`, `validateId` |

---

### Proveedores

> No se puede eliminar un proveedor que tenga productos asociados.  
> Acceso restringido a roles: **ADMIN**, **COMPRAS**.

| Método | Ruta | Descripción | Middleware |
|--------|------|-------------|------------|
| GET | `/proveedores` | Listado de proveedores | `authMiddleware`, `roleMiddleware` |
| GET | `/proveedores/crear` | Formulario de alta | `authMiddleware`, `roleMiddleware` |
| GET | `/proveedores/:id` | Detalle con productos asociados | `authMiddleware`, `roleMiddleware`, `validateId` |
| GET | `/proveedores/:id/editar` | Formulario de edición | `authMiddleware`, `roleMiddleware`, `validateId` |
| POST | `/proveedores` | Crear nuevo proveedor | `authMiddleware`, `roleMiddleware`, `validateProvider` |
| PUT | `/proveedores/:id` | Actualizar proveedor | `authMiddleware`, `roleMiddleware`, `validateId` |
| DELETE | `/proveedores/:id` | Eliminar proveedor | `authMiddleware`, `roleMiddleware`, `validateId` |

---

### Clientes

> Acceso restringido a roles: **ADMIN**, **VENTAS**.

| Método | Ruta | Descripción | Middleware |
|--------|------|-------------|------------|
| GET | `/clientes` | Listado de clientes | `authMiddleware`, `roleMiddleware` |
| GET | `/clientes/crear` | Formulario de alta | `authMiddleware`, `roleMiddleware` |
| GET | `/clientes/:id` | Detalle con saldo actual | `authMiddleware`, `roleMiddleware`, `validateId` |
| GET | `/clientes/:id/editar` | Formulario de edición | `authMiddleware`, `roleMiddleware`, `validateId` |
| POST | `/clientes` | Crear nuevo cliente | `authMiddleware`, `roleMiddleware`, `validateClient` |
| PUT | `/clientes/:id` | Actualizar cliente | `authMiddleware`, `roleMiddleware`, `validateId` |
| DELETE | `/clientes/:id` | Eliminar cliente | `authMiddleware`, `roleMiddleware`, `validateId` |

---

### Comprobantes de Venta

> Al crear o eliminar un comprobante se actualiza automáticamente la cuenta corriente del cliente.  
> Acceso restringido a roles: **ADMIN**, **VENTAS**.

| Método | Ruta | Descripción | Middleware |
|--------|------|-------------|------------|
| GET | `/comprobantes` | Listado de comprobantes | `authMiddleware`, `roleMiddleware` |
| GET | `/comprobantes/crear` | Formulario de alta (acepta `?clienteId`) | `authMiddleware`, `roleMiddleware` |
| GET | `/comprobantes/:id` | Detalle del comprobante | `authMiddleware`, `roleMiddleware`, `validateId` |
| GET | `/comprobantes/:id/editar` | Formulario de edición | `authMiddleware`, `roleMiddleware`, `validateId` |
| POST | `/comprobantes` | Crear comprobante y movimiento en cta. cte. | `authMiddleware`, `roleMiddleware`, `validateVoucher` |
| PUT | `/comprobantes/:id` | Actualizar comprobante | `authMiddleware`, `roleMiddleware`, `validateId` |
| DELETE | `/comprobantes/:id` | Eliminar comprobante y su movimiento | `authMiddleware`, `roleMiddleware`, `validateId` |

---

### Pagos

> Al crear o eliminar un pago se actualiza automáticamente la cuenta corriente del cliente.  
> Acceso restringido a roles: **ADMIN**, **VENTAS**.

| Método | Ruta | Descripción | Middleware |
|--------|------|-------------|------------|
| GET | `/pagos` | Listado de pagos | `authMiddleware`, `roleMiddleware` |
| GET | `/pagos/crear` | Formulario de alta (acepta `?clienteId`) | `authMiddleware`, `roleMiddleware` |
| GET | `/pagos/:id` | Detalle del pago | `authMiddleware`, `roleMiddleware`, `validateId` |
| GET | `/pagos/:id/editar` | Formulario de edición | `authMiddleware`, `roleMiddleware`, `validateId` |
| POST | `/pagos` | Registrar pago y movimiento en cta. cte. | `authMiddleware`, `roleMiddleware`, `validatePayment` |
| PUT | `/pagos/:id` | Actualizar pago | `authMiddleware`, `roleMiddleware`, `validateId` |
| DELETE | `/pagos/:id` | Eliminar pago y su movimiento | `authMiddleware`, `roleMiddleware`, `validateId` |

---

### Cuenta Corriente

> Vista de solo consulta. Se alimenta automáticamente desde Comprobantes y Pagos.  
> Acceso restringido a roles: **ADMIN**, **VENTAS**.

| Método | Ruta | Descripción | Middleware |
|--------|------|-------------|------------|
| GET | `/cuenta/:clienteId` | Movimientos y saldo acumulado del cliente | `authMiddleware`, `roleMiddleware`, `validateClienteId` |

---

### Usuarios

> Acceso restringido a rol: **ADMIN**.

| Método | Ruta | Descripción | Middleware |
|--------|------|-------------|------------|
| GET | `/usuarios` | Listado de usuarios del sistema | `authMiddleware`, `roleMiddleware` |
| GET | `/usuarios/crear` | Formulario de alta | `authMiddleware`, `roleMiddleware` |
| GET | `/usuarios/:id/editar` | Formulario de edición | `authMiddleware`, `roleMiddleware` |
| POST | `/usuarios` | Crear nuevo usuario | `authMiddleware`, `roleMiddleware` |
| PUT | `/usuarios/:id` | Actualizar usuario | `authMiddleware`, `roleMiddleware` |
| DELETE | `/usuarios/:id` | Dar de baja usuario | `authMiddleware`, `roleMiddleware` |

---

## Resumen de rutas por módulo

| Módulo | GET | POST | PUT | DELETE | Total |
|--------|:---:|:----:|:---:|:------:|:-----:|
| Login | 2 | 1 | 0 | 0 | 3 |
| Navegación | 3 | 0 | 0 | 0 | 3 |
| Productos | 4 | 1 | 1 | 1 | 7 |
| Proveedores | 4 | 1 | 1 | 1 | 7 |
| Clientes | 4 | 1 | 1 | 1 | 7 |
| Comprobantes | 4 | 1 | 1 | 1 | 7 |
| Pagos | 4 | 1 | 1 | 1 | 7 |
| Cuenta Corriente | 1 | 0 | 0 | 0 | 1 |
| Usuarios | 3 | 1 | 1 | 1 | 6 |
| **Total** | **29** | **7** | **6** | **6** | **48** |

---

## Autor

Proyecto academico para la Tecnicatura en Desarrollo de Software.

---

## Licencia

Empresa de Desarrollo LUMINA CODE ( grupo 18 )
Brandemann, Agustina
Martin, Marcos
Natucci, Valeria
Specterman, Luis
