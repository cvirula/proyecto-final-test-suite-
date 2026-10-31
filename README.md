# Lumen · Sistema de biblioteca

Lumen es una aplicación full-stack para administrar el catálogo de una biblioteca. Permite buscar libros, filtrar por disponibilidad, registrar y editar ejemplares, gestionar préstamos y devoluciones, y consultar estadísticas en tiempo real.

## Tecnologías

- **Frontend:** React 19, Vite y CSS responsive. React permite construir la interfaz por componentes y Vite ofrece un entorno rápido y simple.
- **Backend:** Node.js 24 y Express 5. Se eligieron por compartir JavaScript entre ambos lados y facilitar una API REST pequeña.
- **Persistencia:** SQLite mediante el módulo nativo `node:sqlite`. Es una base de datos real, portable y sin servicios externos para el evaluador.
- **Pruebas:** Vitest, Testing Library, Supertest, Cypress y k6.
- **CI:** GitHub Actions en cada `push` y `pull_request`.

## Funcionalidad y endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Estado del servicio |
| GET | `/api/books` | Lista, busca y filtra libros |
| GET | `/api/books/:id` | Consulta un libro |
| POST | `/api/books` | Registra un libro |
| PUT | `/api/books/:id` | Edita un libro |
| DELETE | `/api/books/:id` | Elimina un libro disponible |
| POST | `/api/books/:id/borrow` | Registra un préstamo |
| POST | `/api/books/:id/return` | Registra una devolución |
| GET | `/api/stats` | Devuelve estadísticas |

## Ejecución local

Requisito: Node.js 22.13 o posterior (recomendado Node.js 24).

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. La API se ejecuta en `http://localhost:3100`. La base se crea automáticamente en `.data/library.db` y se carga con cinco libros de ejemplo.

## Pruebas automatizadas

```bash
npm run test:unit          # lógica de validación del backend
npm run test:integration   # API + SQLite real en memoria
npm run test:frontend      # componentes React
npm run test:e2e           # flujo completo con Cypress
npm run load               # carga con k6 (requiere k6 instalado y la API activa)
npm run check              # unitarias, integración, frontend y build
```

### Niveles cubiertos

1. **Unitarias:** verifican normalización y reglas de validación en `backend/tests/unit`; también prueban el componente `BookCard` de forma aislada.
2. **Integración:** levantan Express conectado a una base SQLite independiente por prueba y validan persistencia, duplicados, estadísticas y el ciclo préstamo/devolución.
3. **E2E:** Cypress abre la aplicación real y completa los flujos de alta, búsqueda, préstamo, devolución y filtros.
4. **Carga:** k6 simula hasta 10 usuarios concurrentes durante 40 segundos. Exige menos de 1% de errores y un percentil 95 menor a 500 ms.

## Integración continua y protección

`.github/workflows/ci.yml` ejecuta cinco checks separados en cada push y pull request: unitarias, integración, build, E2E y carga.

Para impedir aprobaciones con pruebas fallidas en GitHub:

1. Ve a **Settings → Branches → Add branch protection rule**.
2. Usa `main` como patrón.
3. Activa **Require a pull request before merging**.
4. Activa **Require status checks to pass before merging** y selecciona los cinco checks del workflow.
5. Activa **Require branches to be up to date before merging**.

La protección es una configuración del repositorio de GitHub; no puede imponerse solamente desde un archivo del código.

## Estructura

```text
backend/          API, base de datos y pruebas unitarias/integración
frontend/         aplicación React y pruebas de componentes
cypress/e2e/      pruebas de extremo a extremo
load-tests/       escenario k6
.github/workflows pipeline de CI
```

## Guion sugerido para la demostración (5 minutos)

1. **0:00–0:40:** objetivo y arquitectura.
2. **0:40–2:10:** agregar un libro, buscarlo, prestarlo y devolverlo.
3. **2:10–3:30:** ejecutar `npm run test:integration` o `npm run test:e2e`.
4. **3:30–4:20:** mostrar los jobs verdes de GitHub Actions.
5. **4:20–5:00:** explicar pirámide de pruebas, SQLite y reflexión personal.

