import { createStore} from 'redux';
import reducer from '../reducers/reducers.js';

const initialState = {
  selectedkey: 0,
  components: [
    {
      type: 'Suministro',
      originoruse: 'EPB',
      vector: 'ELECTRICIDAD',
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    {
      type: 'Suministro',
      originoruse: 'NEPB',
      vector: 'ELECTRICIDAD',
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    {
      type: 'Producción',
      originoruse: 'INSITU',
      vector: 'MEDIOAMBIENTE',
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    {
      type: 'Producción',
      originoruse: 'COGENERACION',
      vector: 'ELECTRICIDAD',
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }
  ]

};

export default createStore (
  reducer,
  initialState
);
