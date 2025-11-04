# 🌍 World Population Dashboard (React + Vite)

**Autor:** *Jose Ramon Bogarin*\
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

El proyecto se abre en **https://dashboard-react-ivory.vercel.app/** (por defecto en Vite).

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

**Jose Ramon bogarin o boga**\
Desarrollador Frontend --- *React / Accesibilidad / UI Testing*\
📧 tuemail@example.com\
🌐 **Demo en línea:** [https://bogarwick.vercel.app/](https://bogarwick.vercel.app/)  
📦 **Código fuente:** [https://github.com/boga2041/dasboot](https://github.com/boga2041/dashboard_react)



---

## 🧩 Suposiciones y Problemas Conocidos

### Suposiciones

- La **API del Banco Mundial** (`https://api.worldbank.org`) está disponible y responde dentro de tiempos razonables.
- El indicador de población usado es siempre **`SP.POP.TOTL`** y mantiene el mismo formato de respuesta JSON.
- El rango de años útil para el dashboard es aproximadamente **1960–2024**, por lo que en la llamada se usa `per_page=20000` asumiendo que:
  - En ese rango entran todos los registros relevantes.
  - No es necesario paginar de forma manual desde el cliente.
- El usuario cuenta con:
  - Un **navegador moderno** (Chrome, Edge, Firefox, etc.).
  - Una **conexión a Internet estable** (la aplicación no funciona offline).
- El filtrado por país se hace por **nombre exacto** (coincidencia completa con el nombre que devuelve la API del World Bank).
- No se implementó autenticación ni manejo de usuarios: el dashboard está pensado como una herramienta de consulta abierta.

### Problemas conocidos / Limitaciones

- ⚠️ **Rendimiento al cargar datos de la tabla**  
  - La primera carga del componente `DataTable` trae aproximadamente **17,000–20,000 registros** desde la API del World Bank (todos los países y años del rango seleccionado).
  - Esto puede provocar:
    - Un pequeño **retardo inicial** al cargar la tabla.
    - Un uso de memoria más alto de lo ideal.
- ⚠️ **Rendimiento al aplicar filtros de país**  
  - El filtrado por país (`countryName`) se hace **en el cliente** usando DataTables sobre todos los registros ya cargados.
  - Con tantos registros, al aplicar o cambiar el filtro se puede notar que la interfaz se vuelve **lenta** por unos instantes (especialmente en equipos menos potentes).
  - Esta decisión se tomó para simplificar la lógica (cargar una vez y reutilizar los datos) a costa de rendimiento cuando hay muchos registros.
- 🌐 **Dependencia total de la API externa**  
  - Si la API del World Bank:
    - Está caída,
    - Responde muy lento,
    - O cambia el formato de la respuesta,
  - el dashboard puede dejar de mostrar datos o lanzar mensajes de error.  
  Actualmente no hay:
    - Sistema de reintentos automáticos.
    - Caché local de respuestas.
- 🔍 **Limitaciones del filtro por país**  
  - El filtro por país usa una búsqueda de coincidencia exacta (`^Nombre País$`) sobre el nombre devuelto por la API.
  - No permite:
    - Filtrar por varios países a la vez.
    - Búsquedas parciales o por código ISO (eso se maneja solo en la lógica interna, no en el UI).
- 📱 **Limitaciones de diseño responsivo en tabla**  
  - La tabla (`DataTable`) usa un alto fijo con `scrollY: 360`, lo que en pantallas muy pequeñas puede obligar a hacer algo de scroll extra dentro del panel.
  - No se han optimizado todos los casos extremos de viewport muy estrechos, ya que el foco principal fue la experiencia en desktop y tablets.
- 📊 **Cobertura parcial de datos**  
  - Las series agregadas (`series`, `totalsByYear`, `countryTotalsLatest`) dependen totalmente de los datos que existan en la API.
  - Si un país no tiene datos para cierto año:
    - No aparece en el top de población para ese año.
    - Puede generar “saltos” en la gráfica de tendencia.

### Posibles mejoras futuras

- Implementar **paginación real en servidor** o llamadas más segmentadas (por país / por rango de años más pequeño) para mejorar el rendimiento con muchos registros.
- Añadir **filtros más avanzados** en la tabla (búsqueda por código ISO, por región, etc.).
- Agregar **caché** de respuestas de la API para reducir llamadas repetidas.
- Mejorar el soporte para pantallas muy pequeñas en la tabla (alternativas como vista compacta o tabla simplificada).
