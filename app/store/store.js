import { createStore } from 'redux';
import reducer from 'reducers/reducers.js';

const initialState = {
  selectedkey: 0,
  kexp: 1.0,
  krdel: 1.0,
  components: [
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
