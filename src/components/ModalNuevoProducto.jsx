import { useState } from "react";

export default function ModalNuevoProducto({ isOpen, onClose, onAgregarProducto }) {
  // Estados locales del formulario
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [tipo, setTipo] = useState("unidad");

  // Si no está abierto, no renderiza nada
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    // Creamos el objeto del nuevo producto
    const nuevoProducto = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      precio: Number(precio) || 0,
      tipo: tipo,
      variedades: [],
    };

    // Enviamos el producto al componente padre (App.jsx)
    onAgregarProducto(nuevoProducto);

    // Limpiamos los campos y cerramos
    setNombre("");
    setPrecio("");
    setTipo("unidad");
    onClose();
  };

  const handleCancelar = () => {
    setNombre("");
    setPrecio("");
    setTipo("unidad");
    onClose();
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold text-primary">➕ Nuevo Producto</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCancelar}
              aria-label="Cerrar"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3 text-start">
                <label className="form-label fw-bold small text-muted">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Facturas con crema, Criollos..."
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-3 text-start">
                <label className="form-label fw-bold small text-muted">
                  Precio Base ($)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  className="form-control"
                  placeholder="Ej: 500"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3 text-start">
                <label className="form-label fw-bold small text-muted">
                  Tipo de Venta
                </label>
                <select
                  className="form-select"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="unidad">Por Unidad</option>
                  <option value="dinero">Por Monto de Dinero ($)</option>
                </select>
              </div>
            </div>

            <div className="modal-footer bg-light">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary fw-bold">
                Guardar Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}