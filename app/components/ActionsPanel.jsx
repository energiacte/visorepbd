import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import GlobalVarsControl from 'components/GlobalVarsControl';

import _ from 'lodash';
import numeral from 'numeral';

import { selectEnergyComponent,
         addEnergyComponent,
         removeEnergyComponent,
         editEnergyComponent,
         changeKexp,
         changeKrdel } from 'actions/actions.js';

const ActionsPanel = (props) => {
  return (
    <div className="btn-group pull-right btn-group-xs" role="group" aria-label="acciones">
      <button className="btn" id="add" onClick={props.onAdd}>
        <span className="glyphicon glyphicon-plus"></span> Añadir
      </button>
      <button className="btn" id="remove" onClick={props.onRemove}>
        <span className="glyphicon glyphicon-minus"></span> Borrar
      </button>
        <button className="btn" id="modify" onClick={props.onUpdate}>
          <span className="glyphicon glyphicon-edit"></span> Modificar
        </button>
    </div>);
};

const validData = {
  SUMINISTRO: {
    EPB: ['BIOCARBURANTE', 'BIOMASA', 'BIOMASADENSIFICADA', 'CARBON',
          'COGENERACION', 'ELECTRICIDAD', 'ELECTRICIDADBALEARES',
          'ELECTRICIDADCANARIAS', 'ELECTRICIDADCEUTAMELILLA', 'FUELOIL',
          'GASNATURAL', 'GASOLEO', 'GLP', 'MEDIOAMBIENTE'],
    NEPB: ['BIOCARBURANTE', 'BIOMASA', 'BIOMASADENSIFICADA', 'CARBON',
           'COGENERACION', 'ELECTRICIDAD', 'ELECTRICIDADBALEARES',
           'ELECTRICIDADCANARIAS', 'ELECTRICIDADCEUTAMELILLA', 'FUELOIL',
           'GASNATURAL', 'GASOLEO', 'GLP', 'MEDIOAMBIENTE']
  },
  PRODUCCION: {
    INSITU: ['ELECTRICIDAD', 'ELECTRICIDADBALEARES',
             'ELECTRICIDADCANARIAS', 'ELECTRICIDADCEUTAMELILLA',
             'MEDIOAMBIENTE'],
    COGENERACION: ['ELECTRICIDAD', 'ELECTRICIDADBALEARES',
                   'ELECTRICIDADCANARIAS', 'ELECTRICIDADCEUTAMELILLA']
  }
};

class ECEditor extends React.Component {

  static state = {}

  render() {
    const { selectedkey, components } = this.props;
    const { ctype, originoruse, carrier, values } = components[selectedkey];

    // Mostrar Chart con tooltips con los Valores
    // Editor de Valores
    // Desplegables para otros datos

    const ctypevalues = _.keys(validData);
    const originorusevalues = _.keys(validData[ctype]);
    const carriervalues = validData[ctype][originoruse];

    return (
      <div>
        <form className="form-horizontal">
          <fieldset>
            <div className="form-group">

              <label className="col-md-1 control-label"
                     htmlFor="selectctype">Tipo</label>
              <div className="col-md-3">
                <select id="selectctype"
                        name="selectctype" className="form-control"
                        onChange={ (e) => this.handleChange(e) }
                        value={ ctype } >
                  { ctypevalues.map(val => <option key={ val } value={ val }>{ val }</option>) }
                </select>
              </div>

              <label className="col-md-1 control-label"
                     htmlFor="selectoriginoruse">Origen/Uso</label>
              <div className="col-md-3">
                <select id="selectoriginoruse"
                        name="selectoriginoruse" className="form-control"
                        onChange={ (e) => this.handleChange(e) }
                        value={ originoruse } >
                  { originorusevalues.map(val => <option key={ val } value={ val }>{ val }</option>) }
                </select>
              </div>

              <label className="col-md-1 control-label"
                     htmlFor="selectcarrier">Vector</label>
              <div className="col-md-3">
                <select id="selectcarrier"
                        name="selectcarrier" className="form-control"
                        onChange={ (e) => this.handleChange(e) }
                        value={ carrier }>
                  { carriervalues.map(val => <option key={ val } value={ val }>{ val }</option>) }
                </select>
              </div>

            </div>
          </fieldset>
        </form>

        <table id="editor"
               className="table-striped table-bordered table-condensed">
          <tbody>
            <tr>
              <td>{ values.map(val => numeral(val)
                .format('0.0')).join(',') }</td>
            </tr>
          </tbody>
        </table>

      </div>
    );
  }

  handleChange(e) {
    console.log(e.target.value,
                e.target.name);
    // this.props.someCallback(value);
  }

}

class EnergyComponentEditor extends React.Component {

  render() {
    const { selectedkey, kexp, krdel } = this.props;

    return (
      <div>
        <GlobalVarsControl
            kexp={kexp}
            krdel={krdel}
            onChangeKexp={(ev) => this.handleChangeKexp(ev)}
            onChangeKrdel={(ev) => this.handleChangeKrdel(ev)} />
        <div className="panel-body bg-info">
          <ECEditor {...this.props} />
          <ActionsPanel
              onAdd={() => this.handleAdd(selectedkey)}
              onRemove={() => this.handleRemove(selectedkey)}
              onUpdate={() => this.handleUpdate(selectedkey, {})} />
        </div>
      </div>
    );
  }

  handleChangeKexp(ev) {
    this.props.dispatch(changeKexp(ev.target.value));
  }

  handleChangeKrdel(ev) {
    this.props.dispatch(changeKrdel(ev.target.value));
  }

  handleAdd(selectedkey, event) {
    this.props.dispatch(
      addEnergyComponent(
        { active: true,
          ctype: 'PRODUCCION',
          originoruse: 'INSITU',
          carrier: 'ELECTRICIDAD',
          values: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
    }));
  }

  handleRemove(selectedkey, event) {
    this.props.dispatch(removeEnergyComponent(selectedkey));
  }

  handleUpdate(selectedkey, component, event) {
    this.props.dispatch(
      editEnergyComponent(
        selectedkey,
        { active: true,
          ctype: 'SUMINISTRO',
          originoruse: 'EPB',
          carrier: 'ELECTRICIDAD',
          values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        }));
  }

}

export default EnergyComponentEditor = connect(state => {
  return {
    kexp: state.kexp,
    krdel: state.krdel,
    selectedkey: state.selectedkey,
    components: state.components
  };
})(EnergyComponentEditor);

