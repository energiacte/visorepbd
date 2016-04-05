import { createStore } from 'redux';
import reducer from 'reducers/reducers.js';

const initialState = {
  selectedkey: 0, // Currently selected component
  kexp: 1.0,
  krdel: 1.0,
  components: [ // Energy components array
    {
      carrier: 'ELECTRICIDAD',
      ctype: 'SUMINISTRO',
      originoruse: 'EPB',
      values: [9.67,7.74,4.84,4.35,2.42,2.90,3.87,3.39,2.42,3.87,5.80,7.74]
    },
    {
      carrier: 'ELECTRICIDAD',
      ctype: 'SUMINISTRO',
      originoruse: 'NEPB',
      values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
      carrier: 'MEDIOAMBIENTE',
      ctype: 'SUMINISTRO',
      originoruse: 'EPB',
      values: [21.48,17.18,10.74,9.66,5.37,6.44,8.59,7.52,5.37,8.59,12.89,17.18]
    },
    {
      carrier: 'MEDIOAMBIENTE',
      ctype: 'PRODUCCION',
      originoruse: 'COGENERACION',
      values: [21.48,17.18,10.74,9.66,5.37,6.44,8.59,7.52,5.37,8.59,12.89,17.18]
    }
  ]

};

export default createStore (
  reducer,
  initialState
);
