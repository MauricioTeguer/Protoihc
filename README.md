# Protoihc

Este repositorio ahora conserva dos líneas de trabajo:

- el prototipo web original en la raíz (`Vite + React`)
- la nueva implementación funcional del módulo de Gestión de Categorías en:
  - `backend/` con `Node.js + Express + TypeScript + Prisma`
  - `mobile/` con `React Native + Expo`

## Estructura

```text
.
├── backend/   # API REST + Prisma + seed
├── mobile/    # App Expo mobile
├── src/       # Prototipo web original
└── ...
```

## Backend

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

### 3. Generar cliente Prisma y crear la base local

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Cargar datos iniciales

```bash
npx prisma db seed
```

### 5. Levantar el backend

```bash
npm run dev
```

API disponible en `http://localhost:3000`

Endpoints del módulo:

- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`

## Mobile Expo

### 1. Instalar dependencias

```bash
cd mobile
npm install
```

### 2. Levantar Expo

```bash
npm run start
```

Opcional:

```bash
npm run ios
npm run android
```

La app consume por defecto `http://localhost:3000` en iOS y `http://10.0.2.2:3000` en Android emulator.
Si usás un dispositivo físico, cambiá `expo.extra.apiUrl` en [mobile/app.json](/Users/mauricioteguer/Desktop/Protoihc/mobile/app.json:1) por la IP local de tu máquina.

## Prototipo web original

El prototipo anterior sigue intacto y se puede correr como antes:

```bash
npm install
npm run dev
```

URL:

```bash
http://localhost:5173/
```

## Archivos principales creados

- Backend REST y Prisma en [backend/src/app.ts](/Users/mauricioteguer/Desktop/Protoihc/backend/src/app.ts:1), [backend/src/server.ts](/Users/mauricioteguer/Desktop/Protoihc/backend/src/server.ts:1) y [backend/prisma/schema.prisma](/Users/mauricioteguer/Desktop/Protoihc/backend/prisma/schema.prisma:1)
- Seed inicial en [backend/prisma/seed.ts](/Users/mauricioteguer/Desktop/Protoihc/backend/prisma/seed.ts:1)
- Pantalla mobile de categorías en [mobile/src/screens/CategoriesScreen.tsx](/Users/mauricioteguer/Desktop/Protoihc/mobile/src/screens/CategoriesScreen.tsx:1)
- Navegación Expo en [mobile/src/navigation/AppNavigator.tsx](/Users/mauricioteguer/Desktop/Protoihc/mobile/src/navigation/AppNavigator.tsx:1)
- Cliente API mobile en [mobile/src/api/categories.ts](/Users/mauricioteguer/Desktop/Protoihc/mobile/src/api/categories.ts:1)
