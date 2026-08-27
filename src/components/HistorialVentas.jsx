// src/components/HistorialVentas.jsx
import React from "react";

export default function HistorialVentas({ ventas, onCerrar, onLimpiarHistorial }) {
  const totalHistorico = ventas.reduce((acc, v) => acc + v.total, 0);

  return (
    <div className="card shadow border-success my-3">
      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">📊 Ventas del Día</h5>
        <button
          type="button"
          className="btn-close btn-close-white"
          onClick={onCerrar}
          aria-label="Close"
        ></button>
      </div>

      <div className="card-body">
        {ventas.length === 0 ? (
          <p className="text-muted text-center my-3">No hay ventas registradas hoy.</p>
        ) : (
          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            <ul className="list-group list-group-flush mb-3">
              {ventas.map((venta) => (
                <li
                  key={venta.id}
                  className="list-group-item d-flex justify-content-between align-items-start px-0"
                >
                  <div>
                    <span className="badge bg-secondary me-2">{venta.hora}</span>
                    <small className="text-muted">
                      {venta.items.map((i) => `${i.nombre} (${i.cantidad > 0 ? `x${i.cantidad}` : `$${i.totalItem}`})`).join(", ")}
                    </small>
                  </div>
                  <strong className="text-success">${venta.total}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center pt-2 border-top">
          <span className="fs-5 fw-bold">TOTAL ACUMULADO:</span>
          <span className="fs-4 fw-bold text-success">${totalHistorico}</span>
        </div>
      </div>

      {ventas.length > 0 && (
        <div className="card-footer bg-light d-flex justify-content-end">
          <button
            onClick={onLimpiarHistorial}
            className="btn btn-outline-danger btn-sm"
          >
            Reiniciar caja del día
          </button>
        </div>
      )}
    </div>
  );
}