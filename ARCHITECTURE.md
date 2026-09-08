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
│   │   ├── model/                    доменні типи + фабрики (PlaygroundConfig,
│   │   │                             PartInstance, ColorScheme, DEFAULT_SCHEME,
│   │   │                             createDefaultConfig, makeInstance)
│   │   ├── catalog/                  «3D Models List» як дані. building.ts — головна
│   │   │                             модель Super 59 + похідні варіанти висоти deck;
│   │   │                             registry.ts — індекс і resolveRenderable()
│   │   ├── materials/                логіка Colors/Materials (main → Vinyl,
│   │   │                             accent → дошки/пікети, native → залишити
│   │   │                             матеріал GLB, fixed, own)
│   │   ├── scene/                    resolveScene(config) → плаский
│   │   │                             RenderableInstance[]: похідні згорнуті на базу
│   │   │                             + scale, кольори вирішені, per-instance схема
│   │   │                             змерджена над глобальною
│   │   ├── serialization/            config ⇄ рядок для share-посилання
│   │   └── index.ts                  публічний бар'єр brain
│   │
│   ├── eyes/                      ОЧІ. Тільки React-Three-Fiber.
│   │   ├── canvas/ConfiguratorCanvas/    <Canvas> R3F (монтується ssr:false)
│   │   ├── scene/PlaygroundScene/        світло, сітка, камера; мапить інстанси
│   │   │                                 стора на компоненти
│   │   ├── building/Building/            головна модель. Вантажить GLB базової
│   │   │                                 частини, deep-clone на схему кольорів,
│   │   │                                 підміняє матеріали по імені, <primitive>
│   │   ├── materials/getMaterial/        ResolvedMaterial → кешований
│   │   │                                 THREE.MeshStandardMaterial
│   │   └── index.ts
│   │
│   └── index.ts                   публічна поверхня конфігуратора
│
├── ui/                           ЧИСТА ПРЕЗЕНТАЦІЯ
│   ├── components/
│   │   ├── atomic/
│   │   │   ├── atoms/ColorSwatch/
│   │   │   ├── molecules/SchemePicker/
│   │   │   ├── organisms/ConfiguratorPanel/    сайдбар редагування
│   │   │   └── templates/ConfiguratorTemplate/ layout: панель + viewport
│   │   └── shared/Button/                      shadcn-примітиви (Radix)
│   └── styles/globals.css
│
├── store/useConfigurator/        Zustand-міст. Тримає PlaygroundConfig,
│                                 перераховує scene при кожній зміні, тримає
│                                 selectedUid. Селектори повертають примітиви /
│                                 стабільні посилання (не свіжий об'єкт).
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

### Експорти

- Кожна функція, кожен компонент — **окремий іменований експорт**, по одному на
  рядок. Без `export *`, без масових ре-експортів.
- Кожна тека компонента / модуля має власний `index.ts`, який реекспортує лише
  публічну поверхню.
- Компонент = тека `PascalCase/` з файлом `PascalCase.tsx` + `index.ts`
  (`Building/Building.tsx`, `ConfiguratorPanel/ConfiguratorPanel.tsx`).

### Коментарі

Коментарів у коді немає. Іменування і структура мають пояснювати намір.
Виняток — директиви лінтера (`eslint-disable-next-line`).

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

`BUILDING_PART` у `configurator/brain/catalog/building.ts` — вежа **Super 59** з
5-футовим deck (`public/models/buildings/Super59_5ft_Deck.glb`). На сцену можна
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
схеми.

---

## Наступні кроки

1. `catalog/*.ts` по категорії (towers, slides, climbers…) у міру оптимізації
   моделей; кожен пушить у `registry.ts`.
2. Snap/socket-система в `brain/scene` для частин, що кріпляться до Building
   (слайди, місточки, доступ).
3. `hooks/useUrlConfigSync` — персист конфігу в URL через `brain/serialization`.
4. Commercial-правила (`config.line` наразі inert): вищі перила при deck > 3ft,
   зазор deck → дах, standalone-only swing frames, авто Safety Signs / Ground
   Anchors. Повернути перемикач Product Line у панель, коли перше правило
   почне споживати значення.
