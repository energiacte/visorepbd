import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import reducer from 'reducers/reducers.js';
import { cte } from 'epbdjs';
const { CTE_FP } = cte;

const initialState = {
  data: { EPnren: 0, EPren: 0, EPtotal: 0, EPrer: 0 },
  storedcomponent: {
    active: true,
    type: 'CARRIER',
    carrier: 'ELECTRICIDAD',
    ctype: 'CONSUMO',
    csubtype: 'EPB',
    values: [9.67, 7.74, 4.84, 4.35, 2.42, 2.90, 3.87, 3.39, 2.42, 3.87, 5.80, 7.74]
  },
  selectedkey: 0, // Currently selected component
  kexp: 0.0,
  area: 1,
  wfactors: CTE_FP,
  components: [ // Energy components array (ejemplo3PVBdC.csv)
    {
      active: true,
      type: 'CARRIER',
      carrier: 'ELECTRICIDAD',
      ctype: 'CONSUMO',
      csubtype: 'EPB',
      values: [9.67, 7.74, 4.84, 4.35, 2.42, 2.90, 3.87, 3.39, 2.42, 3.87, 5.80, 7.74],
      comment: 'Linea 1 de ejemplo3PVBdC.csv'
    },
    {
      active: true,
      type: 'CARRIER',
      carrier: 'ELECTRICIDAD',
      ctype: 'PRODUCCION',
      csubtype: 'INSITU',
      values: [1.13, 1.42, 1.99, 2.84, 4.82, 5.39, 5.67, 5.11, 4.54, 3.40, 2.27, 1.42],
      comment: 'Linea 2 de ejemplo3PVBdC.csv'
    },
    {
      active: true,
      type: 'CARRIER',
      carrier: 'MEDIOAMBIENTE',
      ctype: 'CONSUMO',
      csubtype: 'EPB',
      values: [21.48, 17.18, 10.74, 9.66, 5.37, 6.44, 8.59, 7.52, 5.37, 8.59, 12.89, 17.18],
      comment: 'Linea 3 de ejemplo3PVBdC.csv'
    },
    {
      active: true,
      type: 'CARRIER',
      carrier: 'MEDIOAMBIENTE',
      ctype: 'PRODUCCION',
      csubtype: 'INSITU',
      values: [21.48, 17.18, 10.74, 9.66, 5.37, 6.44, 8.59, 7.52, 5.37, 8.59, 12.89, 17.18],
      comment: 'Linea 4 de ejemplo3PVBdC.csv'
    }
  ],
  currentfilename: 'csvEPBDpanel.csv'

};

export default createStore(
  reducer,
  initialState,
  applyMiddleware(thunk)
);
