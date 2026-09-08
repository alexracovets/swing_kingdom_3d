# Архітектура — Swing Kingdom 3D Configurator

Новий веб-конфігуратор дитячих майданчиків Swing Kingdom. Замінює
`swingkingdom.com/design-center/`.

**Стек:** Next.js 16 (App Router, React Compiler, Turbopack) · React 19 ·
React-Three-Fiber + three.js · Tailwind CSS v4 · Zustand · Vitest.

Структура тек і конвенції наслідують `3D_T-shirts_Sportwear_Realize` з
доповненнями замовника:

- `configurator/` — парасолька всього 3D-конфігуратора; всередині розділений на
  `brain/` (логіка) і `eyes/` (відображення).
- `ui/` — **лише презентація**: атомарний дизайн + shadcn-примітиви.
- Хуки, стор, утиліти, типи — **окремі теки верхнього рівня**, не всередині `ui/`.

---

## Карта шарів

```
src/
├── configurator/                 парасолька конфігуратора
│   │
│   ├── brain/                     МОЗОК. Чиста логіка. Без React, без three.js.
│   │   ├── model/
│   │   │   ├── types/                доменні типи (PlaygroundConfig, PartInstance,
│   │   │   │                         ColorScheme, CatalogPart, …)
│   │   │   └── defaults/             DEFAULT_SCHEME, createDefaultConfig,
│   │   │                             makeInstance, nextUid
│   │   ├── catalog/
│   │   │   ├── building/             головна модель Super 59 + похідні висоти deck
│   │   │   └── registry/             індекс частин, resolveRenderable()
│   │   ├── materials/resolveColor/   логіка Colors/Materials (main → Vinyl,
│   │   │                             accent → дошки/пікети, tertiary → Coastal
│   │   │                             Gray Poly, native → залишити матеріал GLB →
│   │   │                             null, fixed, own)
│   │   ├── scene/resolveScene/       resolveScene(config) → плаский
│   │   │                             RenderableInstance[]: похідні згорнуті на базу
│   │   │                             + scale, кольори вирішені, per-instance схема
│   │   │                             змерджена над глобальною. resolveInstance()
│   │   │                             мемоізується по ключу входів (кеш чиститься
│   │   │                             від мертвих). nextInstancePosition() —
│   │   │                             автопозиція нового інстансу
│   │   ├── serialization/config/     config ⇄ рядок для share-посилання; повна
│   │   │                             валідація форми (Vec3, hex, unknown partId)
│   │   ├── constants/                один index.ts: FT_TO_UNIT, INSTANCE_SPACING_UNITS…
│   │   └── index.ts                  публічний бар'єр brain
│   │
│   ├── eyes/                      ОЧІ. Тільки React-Three-Fiber.
│   │   ├── canvas/
│   │   │   ├── ConfiguratorCanvas/       <Canvas> R3F (ssr:false), onPointerMissed
│   │   │   │                             → deselect, dispose material cache on unmount
│   │   │   └── CanvasErrorBoundary/      ловить крах R3F, дає retry
│   │   ├── scene/
│   │   │   ├── PlaygroundScene/          фон, туман, мапінг інстансів, OrbitControls
│   │   │   ├── SceneLights/              ambient + directional (VSM shadows) + env
│   │   │   └── SceneFloor/               <Grid> + shadow-catcher plane
│   │   ├── building/
│   │   │   ├── Building/                 головна модель — чистий JSX
│   │   │   ├── usePreparedModel/         useGLTF → deep-clone + підміна матеріалів
│   │   │   │   └── prepareModel/         paintClone, getModelBounds (bbox-кеш по URL)
│   │   │   └── SelectionBox/             wireframe-габарит обраного
│   │   ├── materials/getMaterial/        ResolvedMaterial → кешований
│   │   │                                 THREE.MeshStandardMaterial (+ dispose);
│   │   │                                 polygonOffset для main/accent проти z-fight
│   │   ├── constants/                    один index.ts: камера, туман, сітка, тіні
│   │   └── index.ts
│   │
│   └── index.ts                   публічна поверхня конфігуратора
│
├── ui/                           ЧИСТА ПРЕЗЕНТАЦІЯ
│   ├── components/
│   │   ├── atomic/
│   │   │   ├── atoms/ColorSwatch/
│   │   │   ├── molecules/SchemePicker/
│   │   │   ├── organisms/ConfiguratorPanel/    сайдбар: схема, список білдінгів,
│   │   │   │                                   undo/redo, reset
│   │   │   └── templates/ConfiguratorTemplate/ layout: панель + viewport
│   │   └── shared/Button/                      shadcn-примітиви (Radix)
│   └── styles/globals.css
│
├── store/
│   ├── useConfigurator/          Zustand-стор. Джерело правди — config.
│   │                             Історія (past/future, undo/redo). Селектори
│   │                             повертають примітиви / стабільні посилання.
│   └── useResolvedScene/         хук: useMemo(resolveScene(config)) — ліниве
│                                 деривування, не жадібне в set()
│
├── hooks/                        app-рівень (URL-sync, шорткати, персист)
├── lib/cn/                       framework-agnostic утиліти (cn)
└── types/                        наскрізні типи + css.d.ts
```

---

## Правило залежностей

```
ui/    ─▶ store/ ─▶ configurator/brain/
eyes/  ─▶ store/ ─▶ configurator/brain/
```

- `brain/` не імпортує нічого з `eyes/`, `ui/`, `store/`.
- `eyes/` і `ui/` **не імпортують одне одного** — зустрічаються тільки через `store/`.
- `<ConfiguratorCanvas>` вантажиться через `next/dynamic` `{ ssr: false }` з
  `ui/templates`, тож three.js не виконується на сервері.

---

## Конвенції

### Структура тек

- **Одиниця = тека.** Кожен файл коду (`.ts` / `.tsx`, крім `index.ts`, `*.test.*`,
  `*.d.ts`) лежить у теці з тим самим іменем: `Building/Building.tsx`,
  `resolveScene/resolveScene.ts`, `getMaterial/getMaterial.ts`. Тест — поряд з
  файлом у тій самій теці.
- **Компоненти й провайдери** — `PascalCase/`. **Хуки** — `useCamelCase/`.
  **Функції / модулі** — `camelCase/`.
- **Тека-контейнер** (`catalog/`, `materials/`, `scene/`, `model/`, …) групує
  одиниці й має свій `index.ts`, що збирає їхню публічну поверхню.
- **`constants/`** — виняток: один файл `index.ts` з усіма константами, без підтек.

### Експорти (barrel `index.ts`)

- Кожен реекспорт — **окремий рядок** `export { X } from "./X"`. Без `export *`,
  без багаторядкових `export { … }` блоків.
- `index.ts` реекспортує лише публічну поверхню теки.
- Звичайні `import { a, b } from "three"` у коді компонентів — норма, це не barrel.

### Коментарі

Коментарів у коді немає. Іменування і структура мають пояснювати намір.
Виняток — директиви лінтера (`eslint-disable-next-line`).

### `"use client"`

Тільки на React-компонентах (`*.tsx`) і хуках (`useX.ts`). Чисті функції
(`getMaterial`, `prepareModel`, `resolveScene`) — без директиви.

### Path-аліаси (`tsconfig.json` + `vitest.config.mts`)

| Аліас | Веде на |
|---|---|
| `@configurator` | `src/configurator` |
| `@brain` | `src/configurator/brain` |
| `@eyes` | `src/configurator/eyes` |
| `@ui` | `src/ui/components/atomic` |
| `@atoms` `@molecules` `@organisms` `@templates` | відповідні теки в `atomic/` |
| `@shared` | `src/ui/components/shared` |
| `@store` | `src/store` |
| `@hooks` | `src/hooks` |
| `@lib` | `src/lib` |
| `@types` | `src/types` |
| `@styles` | `src/ui/styles/globals.css` |
| `@/*` | `src/*` |

---

## Головна модель (тестове відображення)

`BUILDING_PART` у `configurator/brain/catalog/building/building.ts` — вежа
**Super 59** з 5-футовим deck (`public/models/buildings/Super59_5ft_Deck.glb`).
На сцену можна
поставити кілька; клік по моделі або по пункту списку в панелі — вибір.

**Слоти матеріалів GLB:**

| Слот | Роль | Що фарбує |
|---|---|---|
| `Frame` | `vinyl` | вінілові балки/стійки → **main** |
| `Board` | `accent` | дошки підлоги + пікети/поручні → **accent** |
| `Bolt`, `Screw` | `native` | метал, не чіпається схемою |
| `Angle` | `fixed` | кутові кронштейни → тёмний метал |
| `rubber` | `fixed` | гумові заглушки → чорний |

**Похідні висоти deck** (`building-3ft`, `building-7ft`) — Y-stretch трансформи
цієї 5' бази через `derivedFrom`, без власного GLB (логіка §5.2 з таблиці
клієнта).

**Per-instance кольори:** `PartInstance.scheme` перекриває глобальний
`config.scheme` поключово. Панель редагує схему **обраного** інстансу; коли нічого
не обрано — рухає глобальний default, за яким слідують усі інстанси без власної
схеми. Новий білдінг успадковує ту схему, що зараз показана в панелі.

**Історія:** стор тримає `past` / `future` (ліміт 50). Кожна мутація config
пушить попередній стан у `past` і чистить `future`. `undo` / `redo` знімають
вибір.

---

## Наступні кроки

1. `catalog/*.ts` по категорії (towers, slides, climbers…) у міру оптимізації
   моделей; кожен пушить у `registry.ts`.
2. Snap/socket-система в `brain/scene` для частин, що кріпляться до Building
   (слайди, місточки, доступ).
3. `hooks/useUrlConfigSync` — персист конфігу в URL через `brain/serialization`.
4. Окремий слайс `useSelection` (вибір + hover + camera-focus), відділити від
   `useConfigurator`.
5. Commercial-правила (`config.line` наразі inert): вищі перила при deck > 3ft,
   зазор deck → дах, standalone-only swing frames, авто Safety Signs / Ground
   Anchors. Повернути перемикач Product Line у панель, коли перше правило
   почне споживати значення.
