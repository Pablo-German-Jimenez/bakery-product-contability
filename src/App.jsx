import React, { useState, useEffect } from "react";
import ModalNuevoProducto from "./components/ModalNuevoProducto.jsx";
import ModalConfirmacion from "./components/ModalConfirmacion.jsx"; // 👈 Importamos el modal de confirmación

const PRODUCTOS_INICIALES = [
  {
    id: "1",
    nombre: "Facturas",
    precio: 400,
    tipo: "unidad",
    variedades: [
      {
        id: "f1",
        nombre: "Factura con crema",
        precio: 450,
        img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=60",
      },
      {
        id: "f2",
        nombre: "Medialuna",
        precio: 400,
        img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "2",
    nombre: "Tortillas",
    precio: 150,
    tipo: "unidad",
    variedades: [
      {
        id: "t1",
        nombre: "Tortilla Finita",
        precio: 150,
        img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=100&auto=format&fit=crop&q=60",
      },
      {
        id: "t2",
        nombre: "Tortilla Gruesa",
        precio: 200,
        img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=100&auto=format&fit=crop&q=60",
      },
      {
        id: "t3",
        nombre: "Bollitos",
        precio: 120,
        img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "3",
    nombre: "Pan",
    precio: 3000,
    tipo: "dinero",
    variedades: [
      {
        id: "p1",
        nombre: "Pan Francés",
        precio: 3000,
        img: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=100&auto=format&fit=crop&q=60",
      },
      {
        id: "p2",
        nombre: "Pan Mignon",
        precio: 3200,
        img: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=100&auto=format&fit=crop&q=60",
      },
      {
        id: "p3",
        nombre: "Pan Sanguchero",
        precio: 3000,
        img: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=100&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "4",
    nombre: "Chipá",
    precio: 250,
    tipo: "unidad",
    variedades: [],
  },
];

export default function App() {
  const [productos, setProductos] = useState(() => {
    const guardados = localStorage.getItem("catalogo_panaderia");
    return guardados ? JSON.parse(guardados) : PRODUCTOS_INICIALES;
  });

  useEffect(() => {
    localStorage.setItem("catalogo_panaderia", JSON.stringify(productos));
  }, [productos]);

  // Estados de la app
  const [carrito, setCarrito] = useState({});
  const [categoriaAbierta, setCategoriaAbierta] = useState(null);
  const [variedadSeleccionada, setVariedadSeleccionada] = useState(null);
  const [nuevaVariedadNombre, setNuevaVariedadNombre] = useState("");

  // Estados de Modales
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null); // Guarda { id, nombre }
  const [confirmarVaciarCarrito, setConfirmarVaciarCarrito] = useState(false);

  // Agregar producto desde el modal
  const handleAgregarProducto = (nuevoProducto) => {
    setProductos([...productos, nuevoProducto]);
  };

  // Confirmar eliminación del producto
  const confirmarEliminacionProducto = () => {
    if (!productoAEliminar) return;

    setProductos(productos.filter((p) => p.id !== productoAEliminar.id));
    if (categoriaAbierta === productoAEliminar.id) setCategoriaAbierta(null);
    if (variedadSeleccionada?.producto?.id === productoAEliminar.id) {
      setVariedadSeleccionada(null);
    }
    setProductoAEliminar(null);
  };

  const cambiarPrecioProducto = (id, nuevoPrecio) => {
    setProductos(
      productos.map((p) => (p.id === id ? { ...p, precio: nuevoPrecio } : p))
    );
  };

  const cambiarPrecioVariedad = (productoId, variedadId, nuevoPrecio) => {
    setProductos((prev) =>
      prev.map((prod) => {
        if (prod.id === productoId) {
          return {
            ...prod,
            variedades: prod.variedades.map((v) =>
              v.id === variedadId ? { ...v, precio: nuevoPrecio } : v
            ),
          };
        }
        return prod;
      })
    );

    if (variedadSeleccionada && variedadSeleccionada.id === variedadId) {
      setVariedadSeleccionada((prev) => ({
        ...prev,
        precio: nuevoPrecio,
      }));
    }
  };

  const agregarNuevaVariedad = (productoId) => {
    if (!nuevaVariedadNombre.trim()) return;

    const prodActual = productos.find((p) => p.id === productoId);
    const nueva = {
      id: Date.now().toString(),
      nombre: nuevaVariedadNombre.trim(),
      precio: prodActual ? prodActual.precio : 100,
      img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=60",
    };

    setProductos(
      productos.map((prod) => {
        if (prod.id === productoId) {
          return { ...prod, variedades: [...(prod.variedades || []), nueva] };
        }
        return prod;
      })
    );

    setNuevaVariedadNombre("");
  };

  const agregarAlCarrito = (producto, montoEnPesos, nombreDetalle = null) => {
    const key = nombreDetalle ? `${producto.id}_${nombreDetalle}` : producto.id;
    const itemLabel = nombreDetalle
      ? `${producto.nombre} (${nombreDetalle})`
      : producto.nombre;

    setCarrito((prev) => {
      const itemExistente = prev[key] || {
        nombre: itemLabel,
        totalItem: 0,
        cantidad: 0,
      };
      return {
        ...prev,
        [key]: {
          nombre: itemLabel,
          totalItem: itemExistente.totalItem + montoEnPesos,
          cantidad: producto.tipo === "unidad" ? itemExistente.cantidad + 1 : 0,
        },
      };
    });
  };

  const totalGeneral = Object.values(carrito).reduce(
    (acc, item) => acc + item.totalItem,
    0
  );

  const ejecutarVaciarCarrito = () => {
    setCarrito({});
    setConfirmarVaciarCarrito(false);
  };

  const finalizarVenta = () => {
    if (totalGeneral === 0) return alert("El carrito está vacío");
    alert(`¡Venta registrada con éxito por un total de $${totalGeneral}!`);
    setCarrito({});
  };

  const tomarFotoParaVariedad = (e) => {
    const file = e.target.files[0];
    if (!file || !variedadSeleccionada) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const nuevaImagenUrl = reader.result;

      setVariedadSeleccionada((prev) => ({
        ...prev,
        img: nuevaImagenUrl,
      }));

      setProductos((prevProductos) =>
        prevProductos.map((prod) => {
          if (prod.id === variedadSeleccionada.producto.id) {
            return {
              ...prod,
              variedades: prod.variedades.map((v) =>
                v.id === variedadSeleccionada.id
                  ? { ...v, img: nuevaImagenUrl }
                  : v
              ),
            };
          }
          return prod;
        })
      );
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={styles.pantallaPrincipal}>
      {/* SECCIÓN IZQUIERDA: PRODUCTOS */}
      <div style={styles.seccionProductos}>
        <h2 style={styles.tituloSeccion}>Productos</h2>

        {/* Botón que abre el Modal de Creación */}
        <div className="card mb-3 shadow-sm border-info">
          <div className="card-body py-2">
            <button
              type="button"
              onClick={() => setMostrarModalNuevo(true)}
              className="btn btn-info w-100 fw-bold text-white"
            >
              ➕ Agregar Producto
            </button>
          </div>
        </div>

        {/* Grilla de Cards */}
        <div style={styles.grilla}>
          {productos.map((producto) => {
            const estaAbierta = categoriaAbierta === producto.id;

            return (
              <div key={producto.id} style={styles.card}>
                <div style={styles.encabezadoCard}>
                  <span
                    onClick={() => {
                      setCategoriaAbierta(estaAbierta ? null : producto.id);
                      setVariedadSeleccionada(null);
                    }}
                    style={styles.nombreProductoClickable}
                  >
                    {producto.nombre} {estaAbierta ? "▲" : "▼"}
                  </span>

                  <div className="d-flex align-items-center gap-1">
                    <span style={{ fontSize: "12px", color: "#666" }}>$</span>
                    <input
                      type="number"
                      value={producto.precio}
                      onChange={(e) =>
                        cambiarPrecioProducto(producto.id, Number(e.target.value))
                      }
                      style={styles.inputPrecio}
                      title="Editar precio base"
                    />
                    {/* Botón para abrir modal de confirmación de eliminación */}
                    <button
                      onClick={() =>
                        setProductoAEliminar({
                          id: producto.id,
                          nombre: producto.nombre,
                        })
                      }
                      className="btn btn-outline-danger btn-sm p-0 px-2 ms-1"
                      title="Eliminar producto"
                      style={{ fontSize: "12px", lineHeight: "1.5" }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Subvariedades desplegables */}
                {estaAbierta && (
                  <div style={styles.desgloseVariedades}>
                    <div style={styles.listaVariedades}>
                      {producto.variedades &&
                        producto.variedades.map((v) => {
                          const precioVariedad = v.precio ?? producto.precio;
                          const esSeleccionada = variedadSeleccionada?.id === v.id;

                          return (
                            <div
                              key={v.id}
                              onClick={() =>
                                setVariedadSeleccionada({
                                  ...v,
                                  precio: precioVariedad,
                                  producto,
                                })
                              }
                              style={{
                                ...styles.itemVariedad,
                                backgroundColor: esSeleccionada ? "#e0f2fe" : "#fff",
                                border: esSeleccionada
                                  ? "1px solid #0288d1"
                                  : "1px solid #e0e0e0",
                              }}
                            >
                              <img src={v.img} alt={v.nombre} style={styles.miniImg} />
                              <span style={styles.textoVariedad}>{v.nombre}</span>

                              <div
                                className="ms-auto d-flex align-items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span style={{ fontSize: "11px", color: "#666" }}>$</span>
                                <input
                                  type="number"
                                  value={precioVariedad}
                                  onChange={(e) =>
                                    cambiarPrecioVariedad(
                                      producto.id,
                                      v.id,
                                      Number(e.target.value)
                                    )
                                  }
                                  style={styles.inputPrecioVariedad}
                                  title="Editar precio variedad"
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    <div style={styles.formNuevaVariedad}>
                      <input
                        type="text"
                        placeholder="Nueva variedad..."
                        value={nuevaVariedadNombre}
                        onChange={(e) => setNuevaVariedadNombre(e.target.value)}
                        style={styles.inputNuevaVariedad}
                      />
                      <button
                        onClick={() => agregarNuevaVariedad(producto.id)}
                        style={styles.btnAgregarVariedad}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Botonera de compra rápida */}
                {producto.tipo === "dinero" ? (
                  <div style={styles.contenedorMultiplos}>
                    <button
                      onClick={() => agregarAlCarrito(producto, 50)}
                      style={styles.btnMultiplo}
                    >
                      +$50
                    </button>
                    <button
                      onClick={() => agregarAlCarrito(producto, 100)}
                      style={styles.btnMultiplo}
                    >
                      +$100
                    </button>
                    <button
                      onClick={() => agregarAlCarrito(producto, 500)}
                      style={styles.btnMultiplo}
                    >
                      +$500
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => agregarAlCarrito(producto, producto.precio)}
                    style={styles.btnAgregarUnidad}
                  >
                    +1 {producto.nombre} (${producto.precio})
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN CENTRAL: VISTA PREVIA Y FOTO */}
      <div style={styles.seccionAccionRapida}>
        <input
          id="input-camara"
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={tomarFotoParaVariedad}
        />

        <label htmlFor="input-camara" style={styles.btnCamara}>
          📷 Tomar nueva foto
        </label>
        <h2 style={styles.tituloSeccion}>Variedad Seleccionada</h2>
        {variedadSeleccionada ? (
          <div style={styles.contenedorTarget}>
            <p style={styles.subtituloClick}>
              ¡Hacé clic en la foto para sumar 1 unidad!
            </p>
            <div
              onClick={() =>
                agregarAlCarrito(
                  variedadSeleccionada.producto,
                  variedadSeleccionada.precio,
                  variedadSeleccionada.nombre
                )
              }
              style={styles.cardImagenGrande}
            >
              <img
                src={variedadSeleccionada.img}
                alt={variedadSeleccionada.nombre}
                style={styles.imagenGrande}
              />
              <span style={styles.badgePrecio}>
                +1 (${variedadSeleccionada.precio})
              </span>
            </div>
            <h3 style={styles.nombreSeleccionado}>
              {variedadSeleccionada.nombre}
            </h3>
            <span style={styles.tagCategoria}>
              {variedadSeleccionada.producto.nombre}
            </span>
          </div>
        ) : (
          <p style={styles.textoVacio}>
            Seleccioná una variedad de la lista para sumar por foto.
          </p>
        )}
      </div>

      {/* SECCIÓN DERECHA: RESUMEN DE COMPRA */}
      <div style={styles.seccionResumen}>
        <h2 style={styles.tituloSeccion}>Venta Actual</h2>
        <div style={styles.listaCarrito}>
          {Object.keys(carrito).length === 0 ? (
            <p style={styles.textoVacio}>No hay productos seleccionados</p>
          ) : (
            Object.entries(carrito).map(([id, item]) => (
              <div key={id} style={styles.itemCarrito}>
                <span>
                  {item.nombre} {item.cantidad > 0 && `(x${item.cantidad})`}
                </span>
                <strong>${item.totalItem}</strong>
              </div>
            ))
          )}
        </div>

        <div style={styles.pieResumen}>
          <div style={styles.contenedorTotal}>
            <span>TOTAL:</span>
            <span style={styles.montoTotal}>${totalGeneral}</span>
          </div>

          <div style={styles.contenedorBotones}>
            <button
              onClick={() => {
                if (Object.keys(carrito).length > 0) setConfirmarVaciarCarrito(true);
              }}
              style={{
                ...styles.btnAccion,
                ...styles.btnBorrar,
                opacity: Object.keys(carrito).length === 0 ? 0.5 : 1,
                cursor:
                  Object.keys(carrito).length === 0 ? "not-allowed" : "pointer",
              }}
              disabled={Object.keys(carrito).length === 0}
            >
              BORRAR
            </button>

            <button
              onClick={finalizarVenta}
              style={{ ...styles.btnAccion, ...styles.btnCobrar }}
            >
              COBRAR
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: Crear Nuevo Producto */}
      <ModalNuevoProducto
        isOpen={mostrarModalNuevo}
        onClose={() => setMostrarModalNuevo(false)}
        onAgregarProducto={handleAgregarProducto}
      />

      {/* MODAL 2: Confirmar Eliminación de Producto */}
      <ModalConfirmacion
        isOpen={!!productoAEliminar}
        titulo="Eliminar Producto"
        mensaje={`¿Estás seguro de que querés eliminar "${productoAEliminar?.nombre}" del catálogo?`}
        textoConfirmar="Eliminar"
        colorBoton="btn-danger"
        onConfirmar={confirmarEliminacionProducto}
        onCancelar={() => setProductoAEliminar(null)}
      />

      {/* MODAL 3: Confirmar Borrado de Carrito */}
      <ModalConfirmacion
        isOpen={confirmarVaciarCarrito}
        titulo="Vaciar Carrito"
        mensaje="¿Estás seguro de que querés borrar todo el pedido actual?"
        textoConfirmar="Vaciar"
        colorBoton="btn-danger"
        onConfirmar={ejecutarVaciarCarrito}
        onCancelar={() => setConfirmarVaciarCarrito(false)}
      />
    </div>
  );
}

const styles = {
  pantallaPrincipal: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f9",
  },
  seccionProductos: { flex: 2, padding: "20px", overflowY: "auto" },
  seccionAccionRapida: {
    flex: 1.2,
    padding: "20px",
    backgroundColor: "#fff",
    borderLeft: "2px solid #ddd",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  seccionResumen: {
    flex: 1.2,
    padding: "20px",
    backgroundColor: "#fff",
    borderLeft: "2px solid #ddd",
    display: "flex",
    flexDirection: "column",
  },
  tituloSeccion: {
    fontSize: "20px",
    marginBottom: "20px",
    color: "#333",
    borderBottom: "2px solid #ddd",
    paddingBottom: "10px",
    width: "100%",
  },
  grilla: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: "15px",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  encabezadoCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nombreProductoClickable: {
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
    color: "#0288d1",
    userSelect: "none",
    flex: 1,
  },
  inputPrecio: {
    width: "60px",
    padding: "3px 5px",
    textAlign: "right",
    borderRadius: "4px",
    border: "1px solid #bbb",
    fontSize: "13px",
  },
  inputPrecioVariedad: {
    width: "55px",
    padding: "2px 4px",
    textAlign: "right",
    borderRadius: "4px",
    border: "1px solid #0288d1",
    fontSize: "12px",
    fontWeight: "bold",
  },
  desgloseVariedades: {
    borderTop: "1px dashed #ccc",
    paddingTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  listaVariedades: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    maxHeight: "140px",
    overflowY: "auto",
  },
  itemVariedad: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  miniImg: {
    width: "32px",
    height: "32px",
    borderRadius: "4px",
    objectFit: "cover",
  },
  textoVariedad: { fontSize: "13px", fontWeight: "500", flex: 1 },
  formNuevaVariedad: { display: "flex", gap: "5px" },
  inputNuevaVariedad: {
    flex: 1,
    padding: "4px 8px",
    fontSize: "12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  btnAgregarVariedad: {
    padding: "4px 10px",
    backgroundColor: "#0288d1",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  contenedorMultiplos: { display: "flex", gap: "5px" },
  btnMultiplo: {
    flex: 1,
    padding: "10px 5px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
  btnAgregarUnidad: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#e1f5fe",
    color: "#0288d1",
    border: "1px solid #b3e5fc",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  btnCamara: {
    padding: "10px 15px",
    backgroundColor: "#0288d1",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  contenedorTarget: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    width: "100%",
  },
  subtituloClick: {
    fontSize: "13px",
    color: "#2e7d32",
    fontWeight: "bold",
    margin: 0,
  },
  cardImagenGrande: {
    position: "relative",
    width: "200px",
    height: "180px",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
    border: "3px solid #0288d1",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },
  imagenGrande: { width: "100%", height: "100%", objectFit: "cover" },
  badgePrecio: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    backgroundColor: "rgba(0,0,0,0.75)",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  nombreSeleccionado: {
    fontSize: "18px",
    margin: "5px 0 0 0",
    textAlign: "center",
  },
  tagCategoria: {
    fontSize: "12px",
    color: "#666",
    backgroundColor: "#f0f0f0",
    padding: "2px 8px",
    borderRadius: "10px",
  },
  listaCarrito: { flex: 1, overflowY: "auto" },
  textoVacio: {
    color: "#888",
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
  },
  itemCarrito: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
  pieResumen: { borderTop: "2px solid #ddd", paddingTop: "15px" },
  contenedorTotal: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  montoTotal: { color: "#2e7d32" },
  contenedorBotones: { display: "flex", gap: "10px" },
  btnAccion: {
    padding: "15px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  btnBorrar: { flex: 1, backgroundColor: "#d32f2f", color: "#fff" },
  btnCobrar: { flex: 2, backgroundColor: "#2e7d32", color: "#fff" },
};