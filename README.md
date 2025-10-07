# BasurApp API

API REST para la aplicación de recolección de basuras con arquitectura hexagonal.

## 🏗️ Arquitectura

El proyecto implementa **Arquitectura Hexagonal (Ports & Adapters)** con separación en tres capas:

```
src/
└── user/
    ├── domain/              # Capa de Dominio (Entidades, Value Objects)
    │   └── user.entity.ts
    ├── application/         # Capa de Aplicación (Casos de Uso)
    │   ├── use-cases/
    │   │   ├── register-user.use-case.ts
    │   │   └── confirm-email.use-case.ts
    │   └── ports/           # Interfaces (Contratos)
    │       ├── user.repository.ts
    │       └── email.service.ts
    └── infrastructure/      # Capa de Infraestructura (Adaptadores)
        ├── adapters/
        │   ├── persistence/
        │   │   ├── user.schema.ts
        │   │   └── mongoose-user.repository.ts
        │   └── messaging/
        │       └── nodemailer-email.service.ts
        └── controllers/
            ├── user.controller.ts
            └── dtos/
```

### Principios

- **Independencia de frameworks**: La lógica de negocio no depende de frameworks específicos
- **Testeable**: Fácil de testear mediante inyección de dependencias
- **Intercambiable**: Los adaptadores (BD, email) pueden cambiarse sin afectar la lógica de negocio

## 🚀 Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

## ⚙️ Configuración

Edita el archivo `.env` con tus credenciales:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/basurapp

# SMTP (Gmail como ejemplo)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicación
SMTP_FROM=noreply@basurapp.com
```

### Configurar Gmail para SMTP

1. Ve a tu cuenta de Google → Seguridad
2. Activa la verificación en dos pasos
3. Genera una contraseña de aplicación
4. Usa esa contraseña en `SMTP_PASS`

### ⚠️ Nota importante sobre VPN

**Si tienes problemas de conexión a MongoDB Atlas**, asegúrate de:
- ✅ Desconectar VPNs corporativas/universitarias que puedan bloquear el puerto 27017
- ✅ Verificar que no estés detrás de un firewall restrictivo
- ✅ Confirmar que `0.0.0.0/0` está en Network Access de MongoDB Atlas

## 🏃 Ejecución

```bash
# Desarrollo
pnpm run start:dev

# Producción
pnpm run build
pnpm run start:prod
```

La aplicación estará disponible en `http://localhost:3000`

### Despliegue en Vercel

El proyecto incluye la configuración necesaria para desplegarse como una función serverless en Vercel:

1. Asegúrate de tener configuradas las variables de entorno (`MONGODB_URI`, `JWT_SECRET`, etc.) en el panel de Vercel.
2. Desde la raíz de `IngSoftwareAPI`, ejecuta `vercel` o enlaza el repositorio en el dashboard de Vercel.
3. Vercel instalará dependencias con `pnpm install --frozen-lockfile`, ejecutará `pnpm run build` y expondrá la API desde `api/index.ts`.

El endpoint principal y la documentación Swagger quedarán disponibles en la misma URL del despliegue bajo `/api`.

## 📚 Documentación API (Swagger)

Una vez iniciada la aplicación, la documentación interactiva de Swagger está disponible en:

**http://localhost:3000/api**

Swagger proporciona:
- Documentación completa de todos los endpoints
- Ejemplos de request/response
- Posibilidad de probar los endpoints directamente desde el navegador
- Esquemas de validación de datos

## 📝 Endpoints

### POST /users/register

Registra un nuevo usuario y envía código de verificación por email.

**Request:**
```json
{
  "email": "usuario@example.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+57 300 123 4567",
  "password": "contraseña123",
  "role": "basic"
}
```

**Roles disponibles:** `basic`, `admin`, `collector`

**Response:**
```json
{
  "message": "Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.",
  "userId": "uuid-generado"
}
```

### POST /users/confirm-email

Confirma el email del usuario con el código recibido.

**Request:**
```json
{
  "email": "usuario@example.com",
  "verificationCode": "123456"
}
```

**Response:**
```json
{
  "message": "Email verificado exitosamente. Ya puedes iniciar sesión.",
  "success": true
}
```

## 👥 Roles de Usuario

- **basic** (Ciudadano): Usuario básico que puede solicitar recolecciones
- **admin** (Administrador): Gestiona usuarios, recolectores y reportes
- **collector** (Recolector): Realiza las recolecciones de basura

## 🗄️ Base de Datos

El proyecto usa **MongoDB** como base de datos no relacional. La conexión se configura mediante la variable `MONGODB_URI`.

### Modelo de Usuario

```typescript
{
  id: string              // UUID único
  email: string           // Email único
  firstName: string       // Nombre
  lastName: string        // Apellido
  phone: string           // Teléfono
  role: UserRole          // basic | admin | collector
  passwordHash: string    // Contraseña hasheada (bcrypt)
  status: UserStatus      // pending | active | disabled
  emailVerificationCode?: string
  emailVerificationExpiry?: Date
  createdAt: Date
  updatedAt: Date
}
```

## 🔧 Tecnologías

- **NestJS**: Framework Node.js
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **Nodemailer**: Envío de emails
- **bcrypt**: Hash de contraseñas
- **class-validator**: Validación de DTOs
- **class-transformer**: Transformación de objetos

## 📦 Estructura del Proyecto

- `domain/`: Entidades y lógica de negocio pura
- `application/`: Casos de uso y puertos (interfaces)
- `infrastructure/`: Implementaciones concretas (adaptadores, controladores)

Esta arquitectura permite cambiar fácilmente:
- **Base de datos**: De MongoDB a PostgreSQL modificando solo el adaptador
- **Servicio de email**: De Nodemailer a SendGrid modificando solo el adaptador
- Sin tocar la lógica de negocio en `domain/` y `application/`

## 📄 Licencia

ISC
