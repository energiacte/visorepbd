import React from "react";
import { connect } from "react-redux";

import EnergyComponentEditor from "components/EnergyComponentEditor";
import EnergyComponentChart from "components/EnergyComponentChart.jsx";
import ModalContainer from "components/ModalContainer";

import {
  cloneEnergyComponent,
  removeEnergyComponent,
  editEnergyComponent
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
    const { cdata, pos, area } = this.props;
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
              pos === i ? "bg-info" : "",
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
