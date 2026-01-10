# Configuración Docker

Esta configuración utiliza Docker para ejecutar la aplicación Node.js con dos bases de datos SQLite separadas (producción y testing).

## Arquitectura

- **pokemon-app**: Contenedor Node.js con la aplicación y Prisma
- **Volúmenes**:
  - `production-db`: Base de datos de producción
  - `testing-db`: Base de datos de testing

## Requisitos

- Docker Desktop instalado
- Puerto 5173 disponible

## Instalación y Configuración Inicial

### 1. Iniciar el contenedor

```bash
docker compose up -d
```

Esto:

- Construye la imagen de la aplicación
- Crea los volúmenes para las bases de datos
- Inicia el contenedor en segundo plano
- Genera el cliente de Prisma automáticamente

### 2. Inicializar las bases de datos (solo primera vez)

```bash
docker exec -it pokemon-app sh -c "chmod +x init-databases.sh && ./init-databases.sh"
```

Esto ejecuta las migraciones en:

- Base de datos de producción (`/data/production/prod.db`)
- Base de datos de testing (`/data/testing/test.db`)

**Importante:** Este comando solo necesitas ejecutarlo:

- La primera vez que inicias la aplicación
- Después de eliminar los volúmenes con `docker compose down -v`
- Cuando agregues nuevas migraciones al proyecto

**No es necesario** ejecutarlo cada vez que reinicies el contenedor con `docker compose up -d`, ya que los datos persisten en los volúmenes Docker.

### 3. Acceder a la aplicación

La aplicación estará disponible en: **http://localhost:5173**

Si tienes Swagger configurado: **http://localhost:5173/api-docs**

## Uso Diario

### Iniciar la aplicación

```bash
docker compose up -d
```

### Detener la aplicación

```bash
docker compose down
```

### Reiniciar la aplicación

```bash
docker compose restart
```

### Ver logs en tiempo real

```bash
docker compose logs -f app
```

## Ejecutar Tests

Para ejecutar los tests dentro del contenedor usando la base de datos de testing:

```bash
docker exec -it pokemon-app sh -c "chmod +x run-tests.sh && ./run-tests.sh"
```

Este comando:

- Usa la base de datos de testing (`/data/testing/test.db`)
- Ejecuta Jest con la configuración correcta
- Muestra los resultados en la consola

## Comandos Útiles

### Acceder al shell del contenedor

```bash
docker exec -it pokemon-app sh
```

### Ver archivos de base de datos

```bash
# Base de datos de producción
docker exec -it pokemon-app ls -la /data/production/

# Base de datos de testing
docker exec -it pokemon-app ls -la /data/testing/
```

### Ejecutar comandos de Prisma

```bash
# Ver estado de las migraciones
docker exec -it pokemon-app npx prisma migrate status

# Generar cliente de Prisma
docker exec -it pokemon-app npx prisma generate

# Abrir Prisma Studio (requiere puerto adicional)
docker exec -it pokemon-app npx prisma studio
```

### Limpiar y reiniciar desde cero

```bash
# Detener contenedor y eliminar volúmenes (ELIMINA TODOS LOS DATOS)
docker compose down -v

# Reconstruir imagen desde cero
docker compose build --no-cache

# Iniciar de nuevo
docker compose up -d

# Inicializar bases de datos
docker exec -it pokemon-app sh -c "chmod +x init-databases.sh && ./init-databases.sh"
```

## Scripts Disponibles

### `init-databases.sh`

Inicializa ambas bases de datos ejecutando las migraciones de Prisma.

**Uso:**

```bash
docker exec -it pokemon-app sh -c "chmod +x init-databases.sh && ./init-databases.sh"
```

**Cuándo usarlo:**

- Primera vez que inicias la aplicación
- Después de agregar nuevas migraciones
- Si necesitas actualizar el schema de las bases de datos

### `run-tests.sh`

Ejecuta los tests usando la base de datos de testing.

**Uso:**

```bash
docker exec -it pokemon-app sh -c "chmod +x run-tests.sh && ./run-tests.sh"
```

**Cuándo usarlo:**

- Para verificar que todo funciona correctamente
- Antes de hacer commit de cambios
- En procesos de CI/CD

## Estructura de Datos

### Base de Datos de Producción

- **Ubicación en contenedor:** `/data/production/prod.db`
- **Variable de entorno:** `DATABASE_URL=file:/data/production/prod.db`
- **Uso:** Datos reales de la aplicación en ejecución

### Base de Datos de Testing

- **Ubicación en contenedor:** `/data/testing/test.db`
- **Variable de entorno:** `DATABASE_TEST_URL=file:/data/testing/test.db`
- **Uso:** Datos temporales durante tests (se limpian entre tests)

## Variables de Entorno

El contenedor usa las siguientes variables:

```yaml
NODE_ENV: production
PORT: 5173
DATABASE_URL: file:/data/production/prod.db
DATABASE_TEST_URL: file:/data/testing/test.db
POKEAPI_URL: https://pokeapi.co/api/v2
```

## Persistencia de Datos

Los datos se almacenan en volúmenes Docker que persisten entre reinicios del contenedor:

- **production-db**: Mantiene los datos de producción
- **testing-db**: Mantiene los datos de testing

Para eliminar los datos permanentemente, usa:

```bash
docker compose down -v
```

## Copiar a Otra Computadora

Para ejecutar esta aplicación en otra PC:

1. **Copiar el proyecto completo** (excepto `node_modules/` y archivos `.db` locales)

2. **Ejecutar los comandos de instalación:**

   ```bash
   docker compose up -d
   docker exec -it pokemon-app sh -c "chmod +x init-databases.sh && ./init-databases.sh"
   ```

3. **Verificar que funciona:**
   - Abrir http://localhost:5173
   - Ejecutar tests: `docker exec -it pokemon-app sh -c "chmod +x run-tests.sh && ./run-tests.sh"`

## Troubleshooting

### El contenedor no inicia

```bash
# Ver logs de error
docker compose logs app
```

### Error "port already in use"

Cambiar el puerto en `compose.yaml`:

```yaml
ports:
  - 3000:5173 # Cambiar 5173 por otro puerto disponible
```

### Las migraciones fallan

```bash
# Verificar estado
docker exec -it pokemon-app npx prisma migrate status

# Ver logs detallados
docker exec -it pokemon-app sh -c "DATABASE_URL=file:/data/production/prod.db npx prisma migrate deploy"
```

### Los tests fallan

```bash
# Verificar que la base de datos de testing existe
docker exec -it pokemon-app ls -la /data/testing/

# Reinicializar base de datos de testing
docker exec -it pokemon-app sh -c "DATABASE_URL=file:/data/testing/test.db npx prisma migrate deploy"
```
