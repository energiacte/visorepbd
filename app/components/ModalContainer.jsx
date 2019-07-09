import React from "react";

// The gray background
const backdropStyle = {
  position: "fixed",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0,0,0,0.3)",
  padding: "10% 10%",
  zIndex: 9000
};

// The modal "window"
const modalStyle = {
  backgroundColor: "rgba(200,200,200,0.8)",
  borderRadius: 5,
  maxWidth: "80%",
  minHeight: 300,
  margin: "0 auto",
  padding: 30,
  zIndex: 10000
};

// Modal based on code from https://daveceddia.com/open-modal-in-react/
const ModalContainer = props => {
  // Render nothing if the "show" prop is false
  if (!props.show) {
    return null;
  }

  return (
    <div className="backdrop" style={backdropStyle}>
      <div className="modalcontainer" style={modalStyle}>
        {props.children}
        <div className="footer">
          <button
            className="btn btn-primary"
            id="closemodal"
            type="button"
            onClick={props.onClose}
          >
            <span className="fa fa-check" /> Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalContainer;
