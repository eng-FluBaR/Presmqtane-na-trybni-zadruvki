# Project Map

Това приложение вече е разделено така, че да се ориентираш по-лесно:

- `index.html` - само HTML структурата на страниците и формите.
- `assets/css/styles.css` - всички цветове, layout-и, cards, navigation, таблици и SVG/чертеж styling.
- `assets/js/app.js` - изчисления, каталожни стойности, събития, визуализация и протоколи.
- `theory.html` - отделната страница с теория и формули.
- `app.py` - старият/алтернативен Streamlit вариант.

## Къде да търсиш

- Флуиди, серии тръби и K библиотеки: в началото на `assets/js/app.js`.
- Хидравлични формули: `frictionFactor`, `calculateForPipe`, `genericHydraulic`.
- Тръбна задръжка: `calculateForPipe`, `calc`, `renderMetrics`, `renderCoilDrawing`.
- CIP страница: `renderCipCalc`, `renderProfiles`, `drawSpeedChart`, `renderRecommendation`.
- Помпи: `pumpEstimate`, `renderPumpCalc`.
- Трасета: `renderRouteCalc`.
- Протоколи: `selectedProtocolSections`, `exportSelectedWordProtocol`, `exportSelectedPdfProtocol`.

## Правило за следващи промени

Ако добавяме нова настройка:

1. HTML полето отива в `index.html` в съответния page section.
2. Визуалният стил, ако има нужда, отива в `assets/css/styles.css`.
3. Четене на стойност, изчисление и render логика отиват в `assets/js/app.js`.
