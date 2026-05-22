# TodoStock S.A. - Sistema de Gestion Backend

## Descripcion General

Sistema de gestion para **TodoStock S.A.** (distribuidora mayorista), desarrollado con Node.js, Express, Pug y MongoDB.

El proyecto evoluciono en dos etapas:

- **Etapa 1**: CRUD de productos y proveedores con persistencia en archivos JSON.
- **Etapa 2**: migracion a MongoDB, ampliacion funcional del modulo de ventas y trabajo colaborativo por ramas con integracion centralizada.

---

## Tabla de Contenidos

1. [Estado Actual del Proyecto](#estado-actual-del-proyecto)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Arquitectura](#arquitectura)
4. [Migracion de Persistencia: JSON -> MongoDB](#migracion-de-persistencia-json---mongodb)
5. [Modulos del Sistema](#modulos-del-sistema)
6. [Etapa 2 - Trabajo por Ramas e Integracion](#etapa-2---trabajo-por-ramas-e-integracion)
7. [Requisitos Previos](#requisitos-previos)
8. [Instalacion](#instalacion)
9. [Configuracion](#configuracion)
10. [Ejecucion](#ejecucion)
11. [Notas de Version](#notas-de-version)

---

## Estado Actual del Proyecto

- Version del proyecto: **2.0.0**.
- Persistencia activa: **MongoDB con Mongoose**.
- Modulos principales activos:
  - Productos
  - Proveedores
  - Clientes
  - Comprobantes
  - Pagos
  - Cuenta corriente
  - Ventas
  - Login

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

---

## Arquitectura

Patron principal: **MVC** con clases por modulo.

Flujo general:

```text
Request -> Routes -> Middlewares -> Controllers -> Managers (negocio) -> Schemas (Mongoose) -> MongoDB
```

Capas:

- **Routes**: exponen endpoints y aplican validaciones.
- **Middlewares**: validacion de payload, ids y manejo global de errores.
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

---

## Modulos del Sistema

- **Productos y Proveedores**: CRUD completo, validaciones de relacion y stock.
- **Clientes**: alta, baja, modificacion y consulta.
- **Comprobantes**: facturas/notas con impacto en cuenta corriente.
- **Pagos**: registro de pagos de clientes.
- **Cuenta corriente**: movimientos debito/credito y saldo acumulado por cliente.
- **Ventas**: acceso central a operaciones comerciales.
- **Login**: punto de entrada al sistema.

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

## Requisitos Previos

- Node.js 18 o superior.
- npm.
- Instancia MongoDB (Atlas o local).

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
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>/<database>?retryWrites=true&w=majority
```

Notas:

- `MONGODB_URI` es obligatorio para iniciar.
- `.env` no se sube al repositorio.

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

### Changelog tecnico (Etapa 2)

| Fecha | Commit | Autor | Descripcion |
| --- | --- | --- | --- |
| 2026-05-20 | `4a10480` | AgustinaBran | conexion a mongodb |
| 2026-05-22 | `c8beb3a` | Marcos Martin | merge: Agus en integracion |
| 2026-05-22 | `54f348a` | Marcos Martin | merge: rama_luis en integracion |
| 2026-05-22 | `4930323` | Marcos Martin | merge: vale-mongodb-productos en integracion |
| 2026-05-22 | `e33162a` | Marcos Martin | feat(comprobantes): facturacion POS para cliente y consumidor final (#2) |

---

## Autor

Proyecto academico para la Tecnicatura en Desarrollo de Software.

---

## Licencia

ISC
