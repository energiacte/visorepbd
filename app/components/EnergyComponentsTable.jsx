import React from "react";
import { connect } from "react-redux";

import EnergyComponentEditor from "components/EnergyComponentEditor";
import EnergyComponentsList from "components/EnergyComponentsList";
import ModalContainer from "components/ModalContainer";

import {
  cloneEnergyComponent,
  removeEnergyComponent,
  editEnergyComponent
} from "actions/actions.js";

// Tabla de componentes energéticos -------------------------------------
class EnergyComponentsTableClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // ¿Ventana modal de edición visible?
      showEditWindow: false,
      // Posición del elemento seleccionado (índice)
      pos: props.cdata.length < 1 ? null : 0,
      // Último elemento seleccionado (y que será editado)
      storedcomponent: props.cdata[0]
    }; // Mostrar ventana modal de edición
  }

  toggleEditWindow() {
    this.setState({ showEditWindow: !this.state.showEditWindow });
  }

  render() {
    const { area, cdata } = this.props;

    const { pos, storedcomponent } = this.state;

    return (
      <div className="container-fluid">
        {/* Acciones de edición de componentes */}
        <div className="row">
          <div className="col float-right">
            <div
              className="btn-group float-right btn-group-xs"
              role="group"
              aria-label="acciones"
            >
              <button
                className="btn"
                id="add"
                type="button"
                onClick={() => this.props.cloneEnergyComponent(pos)}
              >
                <span className="fa fa-plus" /> Añadir
              </button>
              <button
                className="btn"
                id="remove"
                disabled={cdata.length < 1 ? true : false}
                type="button"
                onClick={() => {
                  this.props.removeEnergyComponent(pos);
                  // Mantenemos la posición salvo que sea al final (len-2) o al inicio (0)
                  const newpos = Math.max(0, Math.min(cdata.length - 2, pos));
                  this.setState({
                    pos: newpos,
                    storedcomponent: cdata.length != 0 ? cdata[newpos] : {}
                  });
                }}
              >
                <span className="fa fa-minus" /> Borrar
              </button>
              <button
                className="btn"
                id="edit"
                disabled={cdata.length < 1 ? true : false}
                type="button"
                onClick={() => this.toggleEditWindow()}
              >
                <span className="fa fa-edit" /> Editar
              </button>
            </div>
          </div>
          {/* Ventana modal de edición de componente */}
          <ModalContainer
            show={this.state.showEditWindow}
            onClose={() => this.toggleEditWindow()}
          >
            <EnergyComponentEditor
              selectedkey={pos}
              cdata={cdata}
              storedcomponent={storedcomponent}
              onEdit={(key, component) =>
                this.props.editEnergyComponent(key, component) &&
                this.setState({ storedcomponent: component })
              }
            />
          </ModalContainer>
        </div>
        {/* Tabla de componentes */}
        <div className="row">
          <div className="col">
            <EnergyComponentsList
              pos={pos}
              cdata={cdata}
              area={area}
              onSelect={(i, component) =>
                this.setState({
                  pos: i,
                  storedcomponent: component
                })
              }
              onEdit={(i, component) =>
                this.props.editEnergyComponent(i, component)
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

const EnergyComponentsTable = connect(
  state => ({
    area: state.area,
    cdata: state.cdata
  }),
  dispatch => ({
    editEnergyComponent: (id, component) =>
      dispatch(editEnergyComponent(id, component)),
    cloneEnergyComponent: id => dispatch(cloneEnergyComponent(id)),
    removeEnergyComponent: id => dispatch(removeEnergyComponent(id))
  })
)(EnergyComponentsTableClass);

export default EnergyComponentsTable;
