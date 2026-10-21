# Taller Repair

Aplicación de escritorio local y offline para gestionar un taller de reparación de smartphones, tablets y otros dispositivos electrónicos.

## Requisitos

- Node.js 22.12 o posterior y npm.
- En Linux, las herramientas de compilación necesarias para `better-sqlite3`.

## Desarrollo

```bash
npm ci
npm run rebuild:native
npm run dev
```

La base de datos SQLite y las fotos se guardan en la carpeta `userData` de Electron; no se envían a ningún servidor. El renderer solo accede a las funciones tipadas que expone `src/preload/index.ts`.

## Comprobaciones

```bash
npm run typecheck
npm test
npm run build
```

Las migraciones se generan desde el esquema Drizzle y se aplican al iniciar la aplicación:

```bash
npm run db:generate
```

## Instalador de Windows

Ejecuta `npm run package:win` en Windows para crear el instalador NSIS. La compilación del addon nativo de SQLite se realiza para Electron durante el empaquetado.

## Alcance inicial

El prototipo incluye el panel, el registro básico de una reparación y las tablas de clientes, dispositivos, reparaciones, historial y fotos. Las vistas de herramientas, proveedores, informes y ajustes todavía son marcadores de posición. Los adaptadores de microscopio, fuente de alimentación y multímetro informan que no están disponibles hasta definir sus modelos y protocolos.
