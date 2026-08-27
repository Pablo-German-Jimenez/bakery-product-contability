import React from "react";

export default function ModalConfirmacion({
  isOpen,
  titulo = "¿Estás seguro?",
  mensaje,
  textoConfirmar = "Eliminar",
  colorBoton = "btn-danger",
  onConfirmar,
  onCancelar,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow border-0">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold text-dark">{titulo}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancelar}
              aria-label="Cerrar"
            ></button>
          </div>

          <div className="modal-body py-4 text-center">
            <p className="fs-5 mb-0 text-secondary">{mensaje}</p>
          </div>

          <div className="modal-footer bg-light justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-secondary px-4 fw-bold"
              onClick={onCancelar}
            >
              Cancelar
            </button>
            <button
              type="button"
              className={`btn ${colorBoton} px-4 fw-bold`}
              onClick={onConfirmar}
            >
              {textoConfirmar}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}