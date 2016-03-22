import { createStore } from 'redux';
import reducer from 'reducers/reducers.js';

const initialState = {
  maxvalue: 1, // Maximum value in all component values
  selectedkey: 0, // Currently selected component
  kexp: 1.0,
  krdel: 1.0,
  components: [ // Energy components array
    {
      type: 'Suministro',
      originoruse: 'EPB',
      carrier: 'ELECTRICIDAD',
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    {
      type: 'Suministro',
      originoruse: 'NEPB',
      carrier: 'ELECTRICIDAD',
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    {
      type: 'Producción',
      originoruse: 'INSITU',
      carrier: 'MEDIOAMBIENTE',
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    {
      type: 'Producción',
      originoruse: 'COGENERACION',
      carrier: 'ELECTRICIDAD',
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }
  ]

};

export default createStore (
  reducer,
  initialState
);
