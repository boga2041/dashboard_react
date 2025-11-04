# 🌍 World Population Dashboard (React + Vite)

**Autor:** *Tu nombre*\
**Versión:** v0.1\
**Descripción:**\
Este proyecto es un **Dashboard interactivo** que consume datos reales
de la **API del World Bank (SP.POP.TOTL)** para mostrar estadísticas de
población mundial, gráficos comparativos y tendencias, con un enfoque en
**accesibilidad (A11y)**, **usabilidad**, y **buenas prácticas de
desarrollo moderno en React**.

------------------------------------------------------------------------

## 🚀 Tecnologías Principales

-   **Vite + React 19**
-   **Chart.js + react-chartjs-2**
-   **DataTables.net** para manejo de tablas dinámicas
-   **SweetAlert2** para alertas visuales
-   **Tailwind CSS** para estilos
-   **Jest + React Testing Library** para pruebas unitarias
-   **MUI (Material UI)** para componentes y compatibilidad

------------------------------------------------------------------------

## 📦 Instalación y Ejecución

``` bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar pruebas unitarias
npm test
```

El proyecto se abre en **http://localhost:5173/** (por defecto en Vite).

------------------------------------------------------------------------

## 🧭 Estructura del Proyecto

    src/
     ├─ components/
     │   ├─ App.jsx
     │   ├─ Sidebar.jsx
     │   ├─ Topbar.jsx
     │   ├─ DataTable.jsx
     │   ├─ PopulationChart.jsx
     │   ├─ PopulationLineChart.jsx
     │   ├─ TopCountriesBar.jsx
     │   ├─ StatCard.jsx
     │   ├─ PlaceholderChart.jsx
     │   └─ tests/*.test.jsx
     ├─ index.css
     └─ main.jsx

------------------------------------------------------------------------

## ♿ Accesibilidad (Punto 6)

Este dashboard fue diseñado siguiendo **principios de accesibilidad web
(WCAG 2.1)**.

### 🧩 Implementaciones clave

-   **Navegación con teclado:**
    -   Todos los botones, filtros y enlaces pueden enfocarse con `Tab`.
    -   Los puntos de los gráficos SVG tienen `tabIndex` y `aria-label`
        (ejemplo: *"Año 2001, total 1,500,000"*).
-   **Soporte para lectores de pantalla:**
    -   Uso de `role="img"`, `role="region"`, `role="complementary"` y
        `aria-label` descriptivos en gráficos, tablas y secciones.
    -   `Topbar` y `Sidebar` enlazados con `aria-controls` y
        `aria-expanded`.
    -   Anuncios automáticos de cambios de tema mediante
        `aria-live="polite"`.
-   **Contraste y modo oscuro:**
    -   Tema "dark/light" guardado en `localStorage`.
    -   Contrastes de color verificados para accesibilidad AA.

------------------------------------------------------------------------

## 🧪 Pruebas Unitarias (Punto 8)

Se implementó **Jest + React Testing Library** para garantizar la
estabilidad de los componentes principales.

### 🧰 Configuración

-   `jest-environment-jsdom` para pruebas en entorno DOM.
-   `babel-jest` con presets para React (`@babel/preset-react`).
-   Mocks de librerías complejas (`react-chartjs-2`,
    `datatables.net-react`) para pruebas livianas.

### ✅ Componentes probados

  Componente                Descripción                                      Cobertura de prueba
  ------------------------- ------------------------------------------------ ---------------------
  **Sidebar**               Navegación, roles ARIA y cambio de tema          ✔️
  **Topbar**                Botón de menú, cambios de tema, atributos ARIA   ✔️
  **StatCard**              Render de KPI y props básicas                    ✔️
  **PopulationChart**       Gráfico SVG accesible, puntos navegables         ✔️
  **PopulationLineChart**   Props, aria-label dinámico y labels              ✔️
  **DataTable**             Región accesible y descripción de tabla          ✔️

**Total:** 6 suites, 16 tests --- todos pasando ✅

    PASS  src/components/Sidebar.test.jsx
    PASS  src/components/Topbar.test.jsx
    PASS  src/components/StatCard.test.jsx
    PASS  src/components/PopulationChart.test.jsx
    PASS  src/components/PopulationLineChart.test.jsx
    PASS  src/components/DataTable.test.jsx
    Test Suites: 6 passed, 6 total
    Tests:       16 passed, 16 total

------------------------------------------------------------------------

## 🧠 Enfoque del Desarrollo

-   **Modularidad:** Cada componente independiente, reutilizable y
    testeable.
-   **Accesibilidad nativa:** ARIA, roles, navegación por teclado y
    soporte screen readers.
-   **Pruebas automatizadas:** Validación continua de UI crítica.
-   **UX responsiva:** Diseño adaptado a móviles (`max-width: 820px`).

------------------------------------------------------------------------

## 📚 API usada

**World Bank API** \> Endpoint:
`https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json`

Se obtienen datos de población total (`SP.POP.TOTL`) por país y año
desde 1960 hasta la fecha actual.

------------------------------------------------------------------------

## 💡 Mejoras Futuras

-   Añadir selector de idioma (i18n).
-   Exportar datos a CSV/Excel.
-   Test de integración con datos reales (mock de API).
-   Métricas de accesibilidad con Lighthouse CI.

------------------------------------------------------------------------

## 🧾 Licencia

Este proyecto se distribuye bajo licencia **MIT**.\
Puedes usarlo, modificarlo y distribuirlo libremente citando al autor.

------------------------------------------------------------------------

## 👨‍💻 Autor

**Tu nombre o alias**\
Desarrollador Frontend --- *React / Accesibilidad / UI Testing*\
📧 tuemail@example.com\
🌐 \[Tu portafolio o GitHub\]
