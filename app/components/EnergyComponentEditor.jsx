import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import ActionsPanel from 'components/ActionsPanel';
import EnergyComponentChart from 'components/EnergyComponentChart';
import { getvalues, CURVENAMES } from '../epbdutils';

import _ from 'lodash';

import { addEnergyComponent,
         removeEnergyComponent,
         editEnergyComponent,
         fetchData } from 'actions/actions.js';

const validData = {
  CONSUMO: {
    EPB: ['BIOCARBURANTE', 'BIOMASA', 'BIOMASADENSIFICADA', 'CARBON',
          //'COGENERACION',
          'ELECTRICIDAD', 'ELECTRICIDADBALEARES',
          'ELECTRICIDADCANARIAS', 'ELECTRICIDADCEUTAMELILLA', 'FUELOIL',
          'GASNATURAL', 'GASOLEO', 'GLP', 'MEDIOAMBIENTE', 'RED1', 'RED2'],
    NEPB: ['BIOCARBURANTE', 'BIOMASA', 'BIOMASADENSIFICADA', 'CARBON',
           //'COGENERACION',
           'ELECTRICIDAD', 'ELECTRICIDADBALEARES',
           'ELECTRICIDADCANARIAS', 'ELECTRICIDADCEUTAMELILLA', 'FUELOIL',
           'GASNATURAL', 'GASOLEO', 'GLP', 'MEDIOAMBIENTE', 'RED1', 'RED2']
  },
  PRODUCCION: {
    INSITU: ['ELECTRICIDAD', 'ELECTRICIDADBALEARES',
             'ELECTRICIDADCANARIAS', 'ELECTRICIDADCEUTAMELILLA',
             'MEDIOAMBIENTE'],
    COGENERACION: ['ELECTRICIDAD', 'ELECTRICIDADBALEARES',
                   'ELECTRICIDADCANARIAS', 'ELECTRICIDADCEUTAMELILLA']
  }
};

class EnergyComponentEditor extends React.Component {

  // Carga los indicadores al inicializar
  componentWillMount() {
    const { dispatch, kexp, krdel, area, components } = this.props;
    dispatch(fetchData(kexp, krdel, area, components));
  }

  // Actualiza indicadores al cambiar las propiedades relevantes
  componentWillReceiveProps(nextProps) {
    const { dispatch, kexp, krdel, area, components } = nextProps;
    dispatch(fetchData(kexp, krdel, area, components));
  }

  render() {
    const { kexp, krdel, area, selectedkey, components } = this.props;
    const { ctype, originoruse, carrier, values } = components[selectedkey];

    const ctypevalues = _.keys(validData);
    const originorusevalues = _.keys(validData[ctype]);
    const carriervalues = validData[ctype][originoruse];
    const data = values.map((value, imes) => { return { Mes: imes, Valor: value }; });

    const currenttotalenergy = _.sum(values);

    return (
      <div>
        <div className="panel-body bg-info">
          <div key={ 'selected' + selectedkey } >
            <form className="form-horizontal"
                  onSubmit={ (e) => { e.preventDefault(); make} }>
              <fieldset>
                <div className="form-group">

                  <label className="col-md-1 control-label"
                         htmlFor="selectctype">Tipo</label>
                  <div className="col-md-3">
                    <select ref="selectctype"
                            name="selectctype" className="form-control"
                            onChange={ (e) => this.handleChange(e) }
                            value={ ctype } >
                      { ctypevalues.map(val => <option key={ val } value={ val }>{ val }</option>) }
                    </select>
                  </div>

                  <label className="col-md-1 control-label"
                         htmlFor="selectoriginoruse">Origen/Uso</label>
                  <div className="col-md-3">
                    <select ref="selectoriginoruse"
                            name="selectoriginoruse" className="form-control"
                            onChange={ (e) => this.handleChange(e) }
                            value={ originoruse } >
                      { originorusevalues.map(val => <option key={ val } value={ val }>{ val }</option>) }
                    </select>
                  </div>

                  <label className="col-md-1 control-label"
                         htmlFor="selectcarrier">Vector</label>
                  <div className="col-md-3">
                    <select ref="selectcarrier"
                            name="selectcarrier" className="form-control"
                            onChange={ (e) => this.handleChange(e) }
                            value={ carrier }>
                      { carriervalues.map(val => <option key={ val } value={ val }>{ val }</option>) }
                    </select>
                  </div>

                </div>

                <div className="form-group">

                  <label className="col-md-1 control-label"
                         htmlFor="selectcurve">Curva</label>
                  <div className="col-md-3">
                    <select ref={ (ref) => this.CurveSelect = ref }
                            name="selectcurve" className="form-control"
                            defaultValue={ CURVENAMES[0] }
                            onChange={ (e) => this.updateValues() }>
                      { CURVENAMES.map(val => <option key={ val } value={ val }>{ val }</option>) }
                    </select>
                  </div>

                  <label className="col-md-1 control-label"
                         htmlFor="rangecontrol">Energía Total</label>
                  <div className="col-md-2">
                    <input className="form-control"
                           ref={ (ref) => this.totalEnergyRange = ref }
                           name="totalenergyrange"
                           type="range"
                           min="0"
                           max={ Math.max(10, 10 + 1.5 * Math.round(currenttotalenergy / 5) * 5) }
                           step="5"
                           defaultValue={ currenttotalenergy }
                           onChange={ (e) => this.handleChangeTotalEnergy(e) } />
                  </div>
                  <div className="col-md-2">
                    <input className="form-control"
                           ref={ (ref) => this.totalEnergyEntry = ref }
                           name="totalenergyentry"
                           type="number"
                           lang="es"
                           min="0"
                           step="0.01"
                           defaultValue={ currenttotalenergy }
                           onChange={ (e) => this.handleChangeTotalEnergy(e) }/>
                  </div>
                  <div className="col-md-3">
                  <EnergyComponentChart ctype={ ctype }
                                        maxvalue={ _.max(values) }
                                        data={ data }
                                        width="100%" height="40px" />
                  </div>
                </div>

              </fieldset>
            </form>

          </div>

          <ActionsPanel
              onAdd={() => this.handleAdd(selectedkey)}
              onRemove={() => this.handleRemove(selectedkey)}
              onRestore={() => this.handleRestore()} />
        </div>
      </div>
    );
  }

  // Handle changes in ctype, originoruse and carrier select boxes
  // It tries to keep coherent values
  handleChange(e) {
    const { selectedkey, components } = this.props;
    let prop = e.target.name.replace(/^select/, '');
    let value = e.target.value;
    let currentcomponent = { ...components[selectedkey] };

    if (currentcomponent[prop] === value) { return; }

    if (prop === 'ctype') {
      const originorusekey0 = Object.keys(validData[value])[0];
      currentcomponent.ctype = value;
      currentcomponent.originoruse = originorusekey0;
      if (!_.includes(
        validData[value][originorusekey0],
        currentcomponent.carrier)) {
          currentcomponent.carrier = validData[value][originorusekey0][0];
      }
    }

    if (prop === 'originoruse') {
      const currctype = currentcomponent.ctype;
      currentcomponent.originoruse = value;
      if (!_.includes(
        validData[currctype][value],
        currentcomponent.carrier)) {
          currentcomponent.carrier = validData[currctype][value][0];
      }
    }

    if (prop === 'carrier') {
      currentcomponent.carrier = value;
    }

    this.props.dispatch(editEnergyComponent(selectedkey, currentcomponent));
  }

  // Handle changes in total energy through UI
  handleChangeTotalEnergy(e) {
    const newvalue = e.target.value;

    if (e.target.name === 'totalenergyrange') {
      if (this.totalEnergyEntry.value === newvalue) { return; }
      this.totalEnergyEntry.value = newvalue;
    }

    if (e.target.name === 'totalenergyentry') {
      if (this.totalEnergyRange.value === newvalue) { return; }

      let rangemax = this.totalEnergyRange.max;
      if (rangemax <= newvalue) {
        this.totalEnergyRange.max = rangemax * 2;
      }
      this.totalEnergyRange.value = newvalue;
    }
    this.updateValues();
  }

  // Update current energycomponent values using editor UI state
  updateValues() {
    const { selectedkey, components } = this.props;
    let currentcomponent = { ...components[selectedkey] };
    let currentvalues = currentcomponent.values;
    let newvalues = getvalues(this.CurveSelect.value,
                              this.totalEnergyEntry.value,
                              currentvalues);
    currentcomponent.values = newvalues;
    this.props.dispatch(
      editEnergyComponent(selectedkey, currentcomponent)
    );
  }

  // Add component to component list
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

  // Remove current component to component list
  handleRemove(selectedkey, event) {
    this.props.dispatch(removeEnergyComponent(selectedkey));
  }

  // Restore current component to stored state
  handleRestore(event) {
    const storedcomponent = this.props.storedcomponent;
    const currenttotalenergy = _.sum(storedcomponent.values);

    this.CurveSelect.value = CURVENAMES[0];
    this.totalEnergyRange.max = Math.max(10, 10 + 2 * Math.round(currenttotalenergy / 100) * 100);
    this.totalEnergyRange.value = currenttotalenergy;
    this.totalEnergyEntry.value = currenttotalenergy;

    this.props.dispatch(
      editEnergyComponent(this.props.selectedkey, storedcomponent));
  }

}

export default EnergyComponentEditor = connect(state => {
  return {
    kexp: state.kexp,
    krdel: state.krdel,
    area: state.area,
    storedcomponent: state.storedcomponent,
    selectedkey: state.selectedkey,
    components: state.components
  };
})(EnergyComponentEditor);

