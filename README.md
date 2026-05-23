# TodoStock S.A. - Sistema de Gestion Backend

## Descripcion General

Sistema de gestion desarrollado para **TodoStock S.A.**, distribuidora mayorista de articulos de limpieza. La aplicacion permite administrar el inventario de **Productos** y **Proveedores** mediante operaciones CRUD completas, con persistencia en archivos JSON y una interfaz web renderizada con Pug.

Proyecto desarrollado como entrega parcial para la materia **Desarrollo Web Backend**.

---

## Tabla de Contenidos

1. [Tecnologias Utilizadas](#tecnologias-utilizadas)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Requisitos Previos](#requisitos-previos)
5. [Instalacion](#instalacion)
6. [Configuracion](#configuracion)
7. [Ejecucion](#ejecucion)
8. [Rutas Disponibles](#rutas-disponibles)
9. [API Endpoints](#api-endpoints)
10. [Reglas de Negocio y Validaciones](#reglas-de-negocio-y-validaciones)
11. [Modelos de Datos](#modelos-de-datos)

---

## Tecnologias Utilizadas

| Tecnologia  | Version | Proposito                       |
| ----------- | ------- | ------------------------------- |
| Node.js     | 18+     | Entorno de ejecucion            |
| Express     | 5.x     | Framework HTTP                  |
| Pug         | 3.x     | Motor de plantillas (vistas)    |
| dotenv      | 17.x    | Gestion de variables de entorno |
| MongoDB     | 7.x     | Base de datos NoSQL             |
| Mongoose    | 9.x     | ODM para MongoDB                |
---

## Arquitectura del Proyecto

El sistema implementa el patron **MVC (Modelo-Vista-Controlador)** estricto con Programacion Orientada a Objetos:

```
Request -> Routes -> Middlewares (validacion) -> Controllers (clases) -> Models (logica de negocio) -> MongoDB/Mongoose (persistencia)
```

- **Routes**: Definen los endpoints y aplican middlewares de validacion.
- **Controllers**: Clases que reciben las peticiones HTTP y delegan al modelo.
- **Models**: Clases que encapsulan la logica de negocio y gestionan operaciones CRUD utilizando Mongoose y MongoDB.
- **Config**: Manejo centralizado de conexion MongoDB mediante Mongoose.
- **Middlewares**: Funciones de validacion de datos obligatorios y manejo global de errores.
- **Views**: Plantillas Pug con layout base compartido.

---

## Estructura de Carpetas

```
LuminaCode/
├── app.js                          # Punto de entrada de la aplicacion
├── .env                            # Variables de entorno (no se sube al repositorio)
├── .gitignore                      # Archivos excluidos del control de versiones
├── package.json                    # Dependencias y scripts del proyecto
├── README.md                       # Documentacion del proyecto
└── src/
    ├── config/
    │   └── db.js                   # Conexion centralizada MongoDB/Mongoose
    │
    ├── controllers/
    │   ├── ProductController.js    # Controlador de productos (clase)
    │   └── ProviderController.js   # Controlador de proveedores (clase)
    │
    ├── data/
    │   ├── productos.json          # Persistencia legacy previa a MongoDB
    │   └── proveedores.json        # Persistencia legacy previa a MongoDB
    │
    ├── middlewares/
    │   ├── errorHandler.js         # Manejo global de errores (400, 404, 500)
    │   └── validators.js           # Validacion de campos obligatorios e IDs
    │
    ├── models/
    │   ├── ProductManager.js       # Modelo de productos (logica de negocio)
    │   └── ProviderManager.js      # Modelo de proveedores (logica de negocio)
    │
    ├── routes/
    │   ├── productRoutes.js        # Rutas del modulo productos
    │   └── providerRoutes.js       # Rutas del modulo proveedores
    │
    ├── schemas/
    │   ├── productSchema.js        # Schema Mongoose de productos
    │   └── providerSchema.js       # Schema Mongoose de proveedores
    │
    ├── services/
    │   └── FileSystemManager.js    # Servicio legacy de persistencia JSON
    │
    └── views/
        ├── error.pug               # Vista de errores
        ├── index.pug               # Pagina de inicio
        ├── layout.pug              # Layout base (header, nav, estilos)
        ├── products/
        │   ├── create.pug          # Formulario de creacion de producto
        │   ├── detail.pug          # Detalle de un producto
        │   ├── edit.pug            # Formulario de edicion de producto
        │   └── index.pug           # Listado de productos
        │
        └── providers/
            ├── create.pug          # Formulario de creacion de proveedor
            ├── detail.pug          # Detalle de un proveedor
            ├── edit.pug            # Formulario de edicion de proveedor
            └── index.pug           # Listado de proveedores
```

---

## Requisitos Previos

- **Node.js** version 18.0 o superior.
- **npm** (incluido con Node.js).
- Un navegador web moderno o herramienta como Postman/cURL para probar la API.

---

## Instalacion

1. Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd LuminaCode
```

2. Instalar las dependencias:

```bash
npm install
```

---

## Configuracion

El proyecto utiliza variables de entorno para los datos de configuracion. Crear un archivo `.env` en la raiz del proyecto con el siguiente contenido:

```env
PORT=3000
NODE_ENV=development
```

El archivo `.env` esta incluido en `.gitignore` y no se sube al repositorio por razones de seguridad.

---

## Ejecucion

### Modo Produccion

```bash
npm start
```

### Modo Desarrollo (auto-reload al guardar cambios)

```bash
npm run dev
```

Una vez iniciado, el servidor estara disponible en:

```
http://localhost:3000
```

---

## Rutas Disponibles

### Navegacion Web (Vistas HTML)

| Ruta                          | Descripcion                         |
| ----------------------------- | ----------------------------------- |
| `GET /`                       | Pagina de inicio                    |
| `GET /productos`              | Listado de todos los productos      |
| `GET /productos/crear`        | Formulario para crear un producto   |
| `GET /productos/:id`          | Detalle de un producto especifico   |
| `GET /productos/:id/editar`   | Formulario para editar un producto  |
| `GET /proveedores`            | Listado de todos los proveedores    |
| `GET /proveedores/crear`      | Formulario para crear un proveedor  |
| `GET /proveedores/:id`        | Detalle de un proveedor especifico  |
| `GET /proveedores/:id/editar` | Formulario para editar un proveedor |

---

## API Endpoints

Las mismas rutas funcionan como API REST cuando se envian peticiones con el header `Accept: application/json`.

### Productos

| Metodo | Ruta             | Descripcion                              | Codigo de exito |
| ------ | ---------------- | ---------------------------------------- | --------------- |
| GET    | `/productos`     | Listar productos con datos del proveedor | 200             |
| GET    | `/productos/:id` | Obtener producto por ID con proveedor    | 200             |
| POST   | `/productos`     | Crear un nuevo producto                  | 201             |
| PUT    | `/productos/:id` | Actualizar un producto existente         | 200             |
| DELETE | `/productos/:id` | Eliminar un producto                     | 200             |

### Proveedores

| Metodo | Ruta               | Descripcion                                      | Codigo de exito |
| ------ | ------------------ | ------------------------------------------------ | --------------- |
| GET    | `/proveedores`     | Listar todos los proveedores                     | 200             |
| GET    | `/proveedores/:id` | Obtener proveedor por ID con productos asociados | 200             |
| POST   | `/proveedores`     | Crear un nuevo proveedor                         | 201             |
| PUT    | `/proveedores/:id` | Actualizar un proveedor existente                | 200             |
| DELETE | `/proveedores/:id` | Eliminar un proveedor                            | 200             |

### Ejemplo de uso con cURL

Crear un producto:

```bash
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"nombre":"Lavandina x 5L","descripcion":"Concentrada","precio":1250.50,"stock":200,"proveedorId":1}'
```

Listar productos:

```bash
curl http://localhost:3000/productos -H "Accept: application/json"
```

Eliminar un proveedor:

```bash
curl -X DELETE http://localhost:3000/proveedores/1 -H "Accept: application/json"
```

---

## Reglas de Negocio y Validaciones

### Validacion de campos obligatorios

- **Producto**: nombre (string), precio (numero >= 0), stock (numero >= 0), proveedorId (numero).
- **Proveedor**: nombre (string), contacto (string), telefono (string), email (string).

### Validaciones cruzadas entre modulos

1. **Creacion de Producto**: Al crear o actualizar un producto, se verifica que el `proveedorId` corresponda a un proveedor existente en `proveedores.json`. Si no existe, se retorna un error `400 Bad Request`.

2. **Eliminacion de Proveedor**: Antes de eliminar un proveedor, se verifica que no tenga productos asociados en `productos.json`. Si existen productos vinculados, se retorna un error `400 Bad Request` indicando la cantidad de productos asociados.

3. **Validacion de ID**: Todos los parametros `:id` en las rutas se validan como numeros enteros positivos mediante middleware.

### Codigos HTTP utilizados

| Codigo | Significado           | Uso                                             |
| ------ | --------------------- | ----------------------------------------------- |
| 200    | OK                    | Operacion exitosa                               |
| 201    | Created               | Recurso creado correctamente                    |
| 400    | Bad Request           | Datos invalidos o violacion de regla de negocio |
| 404    | Not Found             | Recurso no encontrado                           |
| 500    | Internal Server Error | Error no controlado del servidor                |

---

## Modelos de Datos

### Producto

```json
{
  "id": 1,
  "nombre": "Lavandina Concentrada x 5L",
  "descripcion": "Lavandina concentrada apta para uso industrial",
  "precio": 1250.5,
  "stock": 200,
  "proveedorId": 1
}
```

### Proveedor

```json
{
  "id": 1,
  "nombre": "Limpieza Total S.R.L.",
  "contacto": "Juan Perez",
  "telefono": "011-4555-1234",
  "email": "ventas@limpiezatotal.com",
  "direccion": "Av. Corrientes 1234, CABA"
}
```

---

## Autor

Proyecto desarrollado como trabajo practico para la Tecnicatura en Desarrollo de Software - Desarrollo Web Backend.

---

## Licencia

ISC
