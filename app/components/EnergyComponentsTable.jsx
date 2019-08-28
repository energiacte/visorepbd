import React from "react";
import { connect } from "react-redux";

import EnergyComponentEditor from "components/EnergyComponentEditor";
import EnergyComponentChart from "components/EnergyComponentChart.jsx";
import ModalContainer from "components/ModalContainer";

import {
  cloneEnergyComponent,
  removeEnergyComponent,
  editEnergyComponent,
  selectEnergyComponent,
} from "actions/actions.js";

const get_service_icon = service => {
  switch (service) {
    case "CAL":
      return { icon: "fa-fire", color: "red", name: "Calefacción" };
    case "REF":
      return { icon: "fa-asterisk", color: "navy", name: "Refrigeración" };
    case "ACS":
      return { icon: "fa-tint", color: "blue", name: "ACS" };
    case "VEN":
      return { icon: "fa-random", color: "blue", name: "Ventilación" };
    case "ILU":
      return { icon: "fa-lightbulb-o", color: "yellow", name: "Iluminación" };
    case "HU":
      return { icon: "fa-cloud", color: "navy" };
    case "DHU":
      return { icon: "fa-cloud", color: "red" };
    case "BAC":
      return { icon: "fa-building", color: "red" };
    default:
      // NDEF y otros
      return { icon: "fa-question-circle", color: "gray" };
  }
};

// Lista de componentes energéticos -------------------------------------
export class EnergyComponentsList extends React.Component {
  // Seleccionar componente
  handleClick(i) {
    const component = this.props.cdata[i];
    this.props.onSelect(i, component);
  }

  // Cambiar estado activo del componente
  handleChange(i) {
    const component = this.props.cdata[i];
    this.props.onEdit(i, { ...component, active: !component.active });
  }

  render() {
    const { cdata, selectedkey, area } = this.props;
    const maxvalue = Math.max(
      ...cdata.map(component => Math.max(...component.values))
    );

    return (
      <table
        id="components"
        className="table table-sm table-striped table-borderless table-condensed table-hover"
      >
        <thead className="border-bottom border-dark">
          <tr>
            <th scope="col" />
            <th scope="col" className="col-lg-2">
              Vector energético
            </th>
            <th scope="col" className="col-lg-1">
              Tipo
            </th>
            <th scope="col" className="col-lg-1">
              Subtipo
            </th>
            <th scope="col" className="col-lg-1">
              Servicio
            </th>
            <th scope="col" className="col-lg-1">
              kWh/a
            </th>
            <th scope="col" className="col-lg-1">
              kWh/m²·a
            </th>
            <th scope="col" className="col-lg-1">
              Valores
            </th>
            <th scope="col" className="col-lg-4">
              Comentario
            </th>
          </tr>
        </thead>
        <tbody>
          {cdata.map((component, i) => {
            const {
              active,
              ctype,
              csubtype,
              carrier,
              service,
              values,
              comment
            } = component;
            const data = values.map((value, imes) => ({
              Mes: imes,
              Valor: value
            }));
            const rowstyles = [
              selectedkey === i ? "bg-info" : "",
              active ? "" : "inactivecomponent",
              ctype === "CONSUMO" ? "deliveredstyle" : ""
            ].join(" ");
            const sumvalues = values.reduce((a, b) => a + b, 0);
            const { icon: iconname, color: iconcolor } = get_service_icon(
              service
            );
            return (
              <tr
                key={i}
                className={rowstyles}
                onClick={_ => this.handleClick(i)}
              >
                <th scope="row">
                  <input
                    type="checkbox"
                    defaultChecked={active}
                    onClick={_e => this.handleChange(i)}
                  />
                </th>
                <td>{carrier}</td>
                <td>{ctype}</td>
                <td>{csubtype}</td>
                <td>
                  <span
                    className={`fa ${iconname}`}
                    aria-hidden="true"
                    style={{ opacity: 0.5, color: iconcolor }}
                  />{" "}
                  {service}
                </td>
                <td>
                  <p className="float-right">{sumvalues.toFixed(2)}</p>
                </td>
                <td>
                  <p className="float-right">{(sumvalues / area).toFixed(2)}</p>
                </td>
                <td>
                  <EnergyComponentChart
                    ctype={ctype}
                    data={data}
                    maxvalue={maxvalue}
                    width="100%"
                  />
                </td>
                <td>{comment}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

// Tabla de componentes energéticos -------------------------------------
// TODO: mover selectedkey y storedcomponent del estado general a estado de este componente
class EnergyComponentsTableClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showEditWindow: false }; // Mostrar ventana modal de edición
  }

  toggleEditWindow() {
    this.setState({ showEditWindow: !this.state.showEditWindow });
  }

  render() {
    const {
      area,
      cdata,
      selectedkey,
      storedcomponent
    } = this.props;

    return (
      <div>
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
                  onClick={() => this.props.cloneEnergyComponent(selectedkey)}
                >
                  <span className="fa fa-plus" /> Añadir
                </button>
                <button
                  className="btn"
                  id="remove"
                  type="button"
                  onClick={() => this.props.removeEnergyComponent(selectedkey)}
                >
                  <span className="fa fa-minus" /> Borrar
                </button>
                <button
                  className="btn"
                  id="edit"
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
                selectedkey={selectedkey}
                cdata={cdata}
                storedcomponent={storedcomponent}
                onEdit={(key, component) =>
                  this.props.editEnergyComponent(key, component)
                }
              />
            </ModalContainer>
          </div>
          {/* Tabla de componentes */}
          <div className="row">
            <div className="col">
              <EnergyComponentsList
                selectedkey={selectedkey}
                cdata={cdata}
                area={area}
                onSelect={(key, component) =>
                  this.props.selectEnergyComponent(key, component)
                }
                onEdit={(key, component) =>
                  this.props.editEnergyComponent(key, component)
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const EnergyComponentsTable = connect(
  state => ({
    area: state.area,
    storedcomponent: state.storedcomponent,
    selectedkey: state.selectedkey,
    cdata: state.cdata,
  }),
  dispatch => ({
    selectEnergyComponent: (key, component) =>
      dispatch(selectEnergyComponent(key, component)),
    editEnergyComponent: (key, component) =>
      dispatch(editEnergyComponent(key, component)),
    cloneEnergyComponent: selectedkey =>
      dispatch(cloneEnergyComponent(selectedkey)),
    removeEnergyComponent: selectedkey =>
      dispatch(removeEnergyComponent(selectedkey)),
  })
)(EnergyComponentsTableClass);

export default EnergyComponentsTable;
