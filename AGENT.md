# AGENTS.md

# Dairy Pasteurization Engineering Application

## Purpose

You are an AI development assistant working on a web application for the dairy processing industry.

The application is used for engineering and technological calculations related to:

- Pasteurization systems
- Holding tubes / holding time
- CIP systems
- Pumps and flow calculations
- Pipe volume calculations
- Pressure and flow relationships
- Dairy process utilities

The application must prioritize:
- engineering clarity;
- calculation transparency;
- stable and maintainable code;
- hygienic process logic;
- professional industrial UI.

---

# Core Development Rules

## Main Objective

Build a professional industrial engineering application with:

- accurate calculations;
- readable structure;
- modern UI;
- strong validation;
- stable browser rendering through `index.html`.

The app should feel like industrial engineering software, not a generic calculator.

---

# Language Rules

## Development Language
All:
- code,
- comments,
- variables,
- functions,
- internal documentation

must be written in English.

## UI Language
All visible UI text must be written in Bulgarian.

Examples:
- „Дебит“
- „Време на задържане“
- „Налягане“
- „Обем на тръбата“
- „Температура“
- „Предупреждение“

---

# Engineering Unit Standards

## Primary Units

Always use these units as default throughout the application:

| Parameter | Unit |
|---|---|
| Length | meter (m) |
| Pipe diameter | millimeter (mm) |
| Volume | liter (L) |
| Flow rate | liters per second (L/s) |
| Flow rate | liters per hour (L/h) |
| Time | seconds (s) |
| Pressure | bar |
| Temperature | °C |

## Unit Handling Rules

- Always display units next to values.
- Never hide units.
- Always convert internally in a predictable manner.
- Keep unit conversions explicit in code comments.

Example:
```js
// Convert L/h to L/s
const flowLs = flowLh / 3600;