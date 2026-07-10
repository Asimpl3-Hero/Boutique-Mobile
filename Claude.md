# Boutique-Mobile — Guía del repo

App móvil de Boutique. **React Native (TypeScript)** con **arquitectura modular layer-first** (organización por capa; dominio dentro de cada capa). Consume la API de `Boutique-Backend`.

> Las tasks se rigen por `agents/tasks/rules/rules.md` (en el repo raíz `Boutique`). Este archivo define la **arquitectura y estructura de carpetas** concretas de este repo, a las que esas reglas hacen referencia.

---

## Arquitectura — Modular layer-first

Regla de oro: **el código se organiza por CAPA (tipo), y dentro de cada capa se agrupa por dominio.** La lógica (services, hooks, validación, utils) vive centralizada en `src/lib/`; la UI en `src/components/` (segmentada por rol) y `src/screens/`. Cada capa/dominio expone su **API pública por un barrel `index.ts`** y se consume vía **path aliases**, nunca con rutas relativas profundas.

## Estructura de carpetas

```
src/
  assets/                     # fonts/ · images/
  components/                 # UI, segmentada por ROL (no por feature suelta):
    ui/                       #   primitivas genéricas (Button, Checkbox, TextInputField, StatusBadge)
    layout/                   #   piezas de layout (Header, patrones de fondo)
    ux/                       #   UX transversal (banners, skeletons, loaders, RoleGate, ScreenHeader)
    features/                 #   componentes complejos por dominio (modales, scanners, filtros)
  screens/                    # pantallas agrupadas por área de navegación (Auth/, Main/<sección>/, ...)
  navigation/                 # navigators, navigationRef, tipos de rutas
  lib/                        # ⬅ hub de lógica (sin JSX)
    services/                 #   por dominio: <dominio>/ + api/ (client HTTP base + config)
    hooks/                    #   hooks reutilizables (useX.ts), con barrel
    validation/               #   validadores de formularios/campos
    constants/  utils/        #   constantes y utilidades puras
  store/                      # estado global (Redux Toolkit, arquitectura Flux):
                              #   index.ts (configureStore + RootState/AppDispatch),
                              #   hooks.ts (useAppDispatch/useAppSelector), slices/<dominio>Slice.ts
  context/                    # React Context transversal (Auth, Theme, ...)
  theme/                      # tokens/ (colors, spacing, typography, scale) + styles/ + index
  types/                      # tipos globales compartidos + index
```

## Convenciones (obligatorias)

- **Barrel `index.ts` por capa/dominio** como API pública. Se importa el barrel del dominio (ej. `@lib/services/orders`), **no** un archivo interno suelto.
- **Componente / pantalla = carpeta** con `index.tsx` + `<Nombre>.styles.ts` (estilos co-localizados, separados del componente). Sin estilos inline dispersos.
- **Path aliases** en `tsconfig.json` (y babel): `@/*` → `src/*`, más `@lib`, `@store`, `@theme` apuntando a su `index.ts`. **Prohibidos** los imports relativos profundos (`../../../lib/...`).
- **Naming**: componentes/pantallas `PascalCase` (carpeta + `index.tsx`); hooks `useX.ts`; slices `<dominio>Slice.ts`; services `xService.ts` dentro de su carpeta de dominio.
- **Estado global = Redux (Redux Toolkit) con arquitectura Flux.** Flujo **unidireccional** y estricto: `View → dispatch(action) → reducer (slice) → store → selector → View`. Nada de mutar estado fuera de un reducer.
  - Un **slice por dominio** (`createSlice`): estado + reducers + actions autogeneradas. Async con `createAsyncThunk` o RTK Query (definido por task); los thunks se apoyan en `lib/services/<dominio>/`.
  - Acceso al estado **solo** vía selectores y los hooks tipados `useAppSelector` / `useAppDispatch` (nunca `useSelector`/`useDispatch` sin tipar).
  - El `Provider` de Redux se monta una vez en el bootstrap (`App`/`app/`).
- **Estado local de UI**: `useState`/`useReducer` dentro del componente. **React Context** (`context/`) solo para providers transversales no-Flux (ej. Theme). Auth/negocio va en Redux, no en Context.
- **Cliente API**: el HTTP base y su config viven en `lib/services/api/`; cada dominio (`lib/services/<dominio>/`) construye su cliente tipado encima, con sus mappers y errores propios.

## Reglas que un bloque no puede violar

- Un bloque vive **dentro de la capa/dominio que corresponde** (`components/<rol>/`, `screens/<área>/`, `lib/services/<dominio>/`, `store/`, etc.). Nada de carpetas globales que mezclen todo.
- **Lógica fuera de la UI**: los datos/negocio van en `lib/` o `store/`, no en `screens/` ni en `components/`.
- **No duplicar**: si algo lo usan dos dominios, sube a `ui/`, `lib/hooks/`, `lib/utils/` o `theme/`.
- Nombre de bloque mobile: `## Bloque N — Mobile/<Capa>[/<dominio>]: <acción>` (ej. `## Bloque 5 — Mobile/lib-services/orders: cliente tipado de POST /orders`).
