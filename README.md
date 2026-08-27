# 🥐 Bakery Point of Sale (POS) & Catalog Manager

Aplicación web interactiva desarrollada en **React** y **Vite** diseñada para agilizar el punto de venta, la gestión dinámica de catálogo y el registro diario de caja en panaderías y comercios minoristas.

---

## 🚀 Características Principales

* **Venta Rápida Multimodal:**
  * Cobro por **unidades fijas** (facturas, tortillas, chipá).
  * Cobro por **fracción de dinero/peso** con botones de acceso rápido (+$50, +$100, +$500) para productos como pan.
  * **Carga por imagen:** Suma unidades directamente haciendo clic en la fotografía de la variedad seleccionada.
* **Gestión Dinámica de Catálogo:**
  * Modificación de precios base y precios por subvariedad en tiempo real.
  * Creación y eliminación de productos mediante modales de confirmación.
  * Agregado dinámico de variedades personalizadas.
  * Carga y captura de fotos locales en vivo para cada variedad.
* **Caja y Control del Día:**
  * Registro de transacciones con marca temporal (timestamp) y detalle de ítems.
  * Panel desplegable para consultar el total acumulado de ventas del día.
  * Opción de reinicio de caja diaria.
* **Persistencia Local:**
  * Sincronización automática de catálogo y ventas en `localStorage`.

---

## 🛠️ Tecnologías Utilizadas

* **React 18 / 19** (Hooks: `useState`, `useEffect`)
* **Vite** (Build tool y entorno de desarrollo)
* **Bootstrap 5** (Componentes base y utilidades de layout)
* **CSS3 Puro** (Arquitectura modular en clases kebab-case)

---

## 📁 Estructura del Proyecto

```text
panaderia-front/
├── public/                     # Recursos estáticos e imágenes base (.png, .svg)
├── src/
│   ├── components/
│   │   ├── styles/
│   │   │   └── PanelStyles.css # Estilos globales y clases del panel
│   │   ├── HistorialVentas.jsx # Componente de auditoría y total del día
│   │   ├── ModalAviso.jsx
│   │   ├── ModalConfirmacion.jsx
│   │   ├── ModalNuevoProducto.jsx
│   │   └── ProductsCard.jsx
│   ├── App.jsx                 # Componente principal / Lógica de estado
│   ├── index.css
│   └── main.jsx
├── package.json
└── vite.config.js
