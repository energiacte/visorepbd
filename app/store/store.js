import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import reducer from 'reducers/reducers.js';

const initialState = {
  data: { EPnren: 0, EPren: 0, EPtotal: 0, EPrer: 0,
          EPAnren: 0, EPAren: 0, EPAtotal: 0, EPArer: 0 },
  storedcomponent: {
    active: true,
    carrier: 'ELECTRICIDAD',
    ctype: 'CONSUMO',
    originoruse: 'EPB',
    values: [9.67, 7.74, 4.84, 4.35, 2.42, 2.90, 3.87, 3.39, 2.42, 3.87, 5.80, 7.74]
  },
  selectedkey: 0, // Currently selected component
  kexp: 0.0,
  krdel: 0.0,
  area: 1,
  components: [ // Energy components array (ejemplo3PVBdC.csv)
    {
      active: true,
      carrier: 'ELECTRICIDAD',
      ctype: 'CONSUMO',
      originoruse: 'EPB',
      values: [9.67, 7.74, 4.84, 4.35, 2.42, 2.90, 3.87, 3.39, 2.42, 3.87, 5.80, 7.74],
      comment: 'Linea 1 de ejemplo3PVBdC.csv'
    },
    {
      active: true,
      carrier: 'ELECTRICIDAD',
      ctype: 'PRODUCCION',
      originoruse: 'INSITU',
      values: [1.13, 1.42, 1.99, 2.84, 4.82, 5.39, 5.67, 5.11, 4.54, 3.40, 2.27, 1.42],
      comment: 'Linea 2 de ejemplo3PVBdC.csv'
    },
    {
      active: true,
      carrier: 'MEDIOAMBIENTE',
      ctype: 'CONSUMO',
      originoruse: 'EPB',
      values: [21.48, 17.18, 10.74, 9.66, 5.37, 6.44, 8.59, 7.52, 5.37, 8.59, 12.89, 17.18],
      comment: 'Linea 3 de ejemplo3PVBdC.csv'
    },
    {
      active: true,
      carrier: 'MEDIOAMBIENTE',
      ctype: 'PRODUCCION',
      originoruse: 'INSITU',
      values: [21.48, 17.18, 10.74, 9.66, 5.37, 6.44, 8.59, 7.52, 5.37, 8.59, 12.89, 17.18],
      comment: 'Linea 4 de ejemplo3PVBdC.csv'
    }
  ]

};

export default createStore(
  reducer,
  initialState,
  applyMiddleware(thunk)
);
