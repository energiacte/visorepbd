/* -*- coding: utf-8 -*-

Copyright (c) 2016 Ministerio de Fomento
                   Instituto de Ciencias de la Construcción Eduardo Torroja (IETcc-CSIC)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Author(s): Rafael Villar Burke <pachi@ietcc.csic.es>,
           Daniel Jiménez González <dani@ietcc.csic.es>
*/

import _ from 'lodash';

// ---------------------------------------------------------------------------------------------------------
// Default values for energy efficiency calculation
//
// These are aimed towards energy efficiency evaluation in the spanish
// building code regulations (Código Técnico de la Edificación CTE).
//
// Weighting factors are based on primary energy use.
// ---------------------------------------------------------------------------------------------------------

export const K_EXP = 0.0;
export const K_RDEL = 0.0;
export const FACTORESDEPASO = [
        // FpA - weighting factors accounting for the resources used to produce this energy
        // FpB - weighting factors accounting for the resources avoided by the external grid due to the export
        //  Energy carrier         origin          use         step Fpren  Fpnren
        ['ELECTRICIDAD',        'grid',         'input',     'A', 0.414, 1.954], // Delivered energy
        ['ELECTRICIDAD',        'INSITU',       'input',     'A', 1.000, 0.000], // Produced energy
        ['ELECTRICIDAD',        'INSITU',       'to_grid',   'A', 1.000, 0.000], // Produced and exported to the grid
        ['ELECTRICIDAD',        'INSITU',       'to_nEPB',   'A', 1.000, 0.000], // Produced and exported to nEPB uses
        ['ELECTRICIDAD',        'INSITU',       'to_grid',   'B', 0.414, 1.954], // Savings to the grid due to produced and exported to the grid energy
        ['ELECTRICIDAD',        'INSITU',       'to_nEPB',   'B', 0.414, 1.954], // Savings to the grid due to produced and exported to nEPB uses
        ['ELECTRICIDAD',        'COGENERACION', 'input',     'A', 0.000, 0.000], // There is no delivery from grid for this carrier
        ['ELECTRICIDAD',        'COGENERACION', 'to_grid',   'A', 0.000, 2.500], // User defined!
        ['ELECTRICIDAD',        'COGENERACION', 'to_nEPB',   'A', 0.000, 2.500], // User defined!
        ['ELECTRICIDAD',        'COGENERACION', 'to_grid',   'B', 0.414, 1.954], // Savings to the grid when exporting to the grid
        ['ELECTRICIDAD',        'COGENERACION', 'to_nEPB',   'B', 0.414, 1.954], // Savings to the grid when exporting to nEPB uses

        ['ELECTRICIDADBALEARES','grid',         'input',     'A', 0.082, 2.968], // Delivered energy
        ['ELECTRICIDADBALEARES','INSITU',       'input',     'A', 1.000, 0.000], // Produced energy
        ['ELECTRICIDADBALEARES','INSITU',       'to_grid',   'A', 1.000, 0.000], // Produced and exported to the grid
        ['ELECTRICIDADBALEARES','INSITU',       'to_nEPB',   'A', 1.000, 0.000], // Produced and exported to nEPB uses
        ['ELECTRICIDADBALEARES','INSITU',       'to_grid',   'B', 0.082, 2.968], // Savings to the grid due to produced and exported to the grid energy
        ['ELECTRICIDADBALEARES','INSITU',       'to_nEPB',   'B', 0.082, 2.968], // Savings to the grid due to produced and exported to nEPB uses
        ['ELECTRICIDADBALEARES','COGENERACION', 'input',     'A', 0.000, 0.000], // There is no delivery from grid for this carrier
        ['ELECTRICIDADBALEARES','COGENERACION', 'to_grid',   'A', 0.000, 2.500], // User defined!
        ['ELECTRICIDADBALEARES','COGENERACION', 'to_nEPB',   'A', 0.000, 2.500], // User defined!
        ['ELECTRICIDADBALEARES','COGENERACION', 'to_grid',   'B', 0.082, 2.968], // Savings to the grid when exporting to the grid
        ['ELECTRICIDADBALEARES','COGENERACION', 'to_nEPB',   'B', 0.082, 2.968], // Savings to the grid when exporting to nEPB uses

        ['ELECTRICIDADCANARIAS','grid',         'input',     'A', 0.070, 2.924], // Delivered energy
        ['ELECTRICIDADCANARIAS','INSITU',       'input',     'A', 1.000, 0.000], // Produced energy
        ['ELECTRICIDADCANARIAS','INSITU',       'to_grid',   'A', 1.000, 0.000], // Produced and exported to the grid
        ['ELECTRICIDADCANARIAS','INSITU',       'to_nEPB',   'A', 1.000, 0.000], // Produced and exported to nEPB uses
        ['ELECTRICIDADCANARIAS','INSITU',       'to_grid',   'B', 0.070, 2.924], // Savings to the grid due to produced and exported to the grid energy
        ['ELECTRICIDADCANARIAS','INSITU',       'to_nEPB',   'B', 0.070, 2.924], // Savings to the grid due to produced and exported to nEPB uses
        ['ELECTRICIDADCANARIAS','COGENERACION', 'input',     'A', 0.000, 0.000], // There is no delivery from grid for this carrier
        ['ELECTRICIDADCANARIAS','COGENERACION', 'to_grid',   'A', 0.000, 2.500], // User defined!
        ['ELECTRICIDADCANARIAS','COGENERACION', 'to_nEPB',   'A', 0.000, 2.500], // User defined!
        ['ELECTRICIDADCANARIAS','COGENERACION', 'to_grid',   'B', 0.070, 2.924], // Savings to the grid when exporting to the grid
        ['ELECTRICIDADCANARIAS','COGENERACION', 'to_nEPB',   'B', 0.070, 2.924], // Savings to the grid when exporting to nEPB uses

        ['ELECTRICIDADCEUTAMELILLA','grid',     'input',     'A', 0.072, 2.718], // Delivered energy
        ['ELECTRICIDADCEUTAMELILLA','INSITU',   'input',     'A', 1.000, 0.000], // Produced energy
        ['ELECTRICIDADCEUTAMELILLA','INSITU',   'to_grid',   'A', 1.000, 0.000], // Produced and exported to the grid
        ['ELECTRICIDADCEUTAMELILLA','INSITU',   'to_nEPB',   'A', 1.000, 0.000], // Produced and exported to nEPB uses
        ['ELECTRICIDADCEUTAMELILLA','INSITU',   'to_grid',   'B', 0.072, 2.718], // Savings to the grid due to produced and exported to the grid energy
        ['ELECTRICIDADCEUTAMELILLA','INSITU',   'to_nEPB',   'B', 0.072, 2.718], // Savings to the grid due to produced and exported to nEPB uses
        ['ELECTRICIDADCEUTAMELILLA','COGENERACION','input',  'A', 0.000, 0.000], // There is no delivery from grid for this carrier
        ['ELECTRICIDADCEUTAMELILLA','COGENERACION','to_grid','A', 0.000, 2.500], // User defined!
        ['ELECTRICIDADCEUTAMELILLA','COGENERACION','to_nEPB','A', 0.000, 2.500], // User defined!
        ['ELECTRICIDADCEUTAMELILLA','COGENERACION','to_grid','B', 0.072, 2.718], // Savings to the grid when exporting to the grid
        ['ELECTRICIDADCEUTAMELILLA','COGENERACION','to_nEPB','B', 0.072, 2.718], // Savings to the grid when exporting to nEPB uses

        ['MEDIOAMBIENTE',       'grid',         'input',     'A', 1.000, 0.000], // Grid is able to deliver this carrier
        ['MEDIOAMBIENTE',       'INSITU',       'input',     'A', 1.000, 0.000], // in-situ production of this carrier
        ['MEDIOAMBIENTE',       'INSITU',       'to_grid',   'A', 0.000, 0.000], // export to grid is not accounted for
        ['MEDIOAMBIENTE',       'INSITU',       'to_nEPB',   'A', 1.000, 0.000], // export to nEPB uses in step A
        ['MEDIOAMBIENTE',       'INSITU',       'to_grid',   'B', 0.000, 0.000], // Savings to the grid when exporting to grid
        ['MEDIOAMBIENTE',       'INSITU',       'to_nEPB',   'B', 1.000, 0.000], // Savings to the grid when exporting to nEPB uses

        // BIOCARBURANTE == BIOMASA DENSIFICADA (PELLETS)
        ['BIOCARBURANTE',       'grid',         'input',     'A', 1.028, 0.085], // Delivered energy
        ['BIOMASA',             'grid',         'input',     'A', 1.003, 0.034], // Delivered energy
        ['BIOMASADENSIFICADA',  'grid',         'input',     'A', 1.028, 0.085], // Delivered energy
        ['CARBON',              'grid',         'input',     'A', 0.002, 1.082], // Delivered energy
        // FUELOIL == GASOLEO
        ['FUELOIL',             'grid',         'input',     'A', 0.003, 1.179], // Delivered energy
        ['GASNATURAL',          'grid',         'input',     'A', 0.005, 1.190], // Delivered energy
        ['GASOLEO',             'grid',         'input',     'A', 0.003, 1.179], // Delivered energy
        ['GLP',                 'grid',         'input',     'A', 0.030, 1.201], // Delivered energy
        ['RED1',                'grid',         'input',     'A', 0.000, 1.300], // User defined!, district heating/cooling carrier
        ['RED2',                'grid',         'input',     'A', 0.000, 1.300]  // User defined!, district heating/cooling carrier
].map(([vector, fuente, uso, step, fren, fnren]) => {
  return { vector, fuente, uso, step, fren, fnren };
});

// ------------------------------------------------------------------------------------
// Constraints
// ------------------------------------------------------------------------------------

export const VALIDDATA = {
  CONSUMO: {
    EPB: ['BIOCARBURANTE', 'BIOMASA', 'BIOMASADENSIFICADA', 'CARBON',
          // 'COGENERACION',
          'ELECTRICIDAD', 'ELECTRICIDADBALEARES',
          'ELECTRICIDADCANARIAS', 'ELECTRICIDADCEUTAMELILLA', 'FUELOIL',
          'GASNATURAL', 'GASOLEO', 'GLP', 'MEDIOAMBIENTE', 'RED1', 'RED2'],
    NEPB: ['BIOCARBURANTE', 'BIOMASA', 'BIOMASADENSIFICADA', 'CARBON',
           // 'COGENERACION',
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

// Custom exception
function UserException(message) {
  this.message = message;
  this.name = 'UserException';
}

const EMPTYCOMPONENT = { active: true, carrier: 'ELECTRICIDAD', ctype: 'CONSUMO', originoruse: 'EPB', values: [0.0] };

// -----------------------------------------------------------------------------------
// Vector utilities
// -----------------------------------------------------------------------------------

// Elementwise minimum min res[i] = min(vec1[i], vec2[i])
function vecvecmin(vec1, vec2) {
  return _.zip(vec1, vec2).map(zarray => _.min(zarray));
}

// Elementwise sum res[i] = vec1[i] + vec2[i] + ... + vecj[i]
function veclistsum(veclist) {
  return _.zip(...veclist).map(valsi => _.sum(valsi));
}

// Elementwise sum of arrays
function vecvecsum(vec1, vec2) {
  return vec1.map((el, ii) => el + vec2[ii]);
}

// Elementwise difference res[i] = vec1[i] - vec2[i]
function vecvecdif(vec1, vec2) {
  return _.zip(vec1, vec2).map(([v1, v2]) => v1 - v2);
}

// Elementwise multiplication res[i] = vec1[i] * vec2[i]
function vecvecmul(vec1, vec2) {
  return _.zip(vec1, vec2).map(([v1, v2]) => v1 * v2);
}

// Multiply vector by scalar
function veckmul(vec1, k) {
  return vec1.map(v => v * k);
}


// -----------------------------------------------------------------------------------
// Input/Output functions
// -----------------------------------------------------------------------------------

// Read energy input data from string and return a list of energy components
//
// List of energy components has the following structure:
//
// [ {carrier: carrier1, ctype: ctype1, originoruse: originoruse1, values: [...values1], comment: comment1},
//   {carrier: carrier2, ctype: ctype2, originoruse: originoruse2, values: [...values2], comment: comment2},
//   ...
// ]
//
// * carrier is an energy carrier
// * ctype is either 'PRODUCCION' or 'CONSUMO' por produced or used energy
// * originoruse defines:
//   - the energy origin for produced energy (INSITU or COGENERACION)
//   - the energy end use (EPB or NEPB) for delivered energy
// * values is a list of energy values, one for each timestep
// * comment is a comment string for the vector
export function readenergystring(datastring) {
  const datalines = datastring.replace('\n\r', '\n').split('\n')
    .map(line => line.trim())
    .filter(line => !(line === '' || line.startsWith('vector')));
  const [commentlines, componentlines] = _.partition(datalines,
                                                     line => line.startsWith('#'));

  let components = componentlines
      .map(line => {
        const parts = line.split('#').map(pp => pp.trim());
        return (parts.length > 1) ? [parts[0], parts[1]] : [parts[0], ''];
      })
      .map(([fieldsstring, comment]) => {
        const fieldslist = fieldsstring.split(',').map(ff => ff.trim());
        let [ carrier, ctype, originoruse, ...values ] = fieldslist;
        // Minimal consistency checks
        if (fieldslist.length > 3
            && _.indexOf(_.keys(VALIDDATA), ctype) > -1
            && _.indexOf(_.keys(VALIDDATA[ctype]), originoruse) > -1
            && _.indexOf(VALIDDATA[ctype][originoruse], carrier) > -1) {
          values = values.map(Number);
          return { carrier, ctype, originoruse, values, comment };
        }
        return null;
      })
      .filter(v => v !== null);
  if (components.length === 0) components.push(EMPTYCOMPONENT);

  const meta = {};
  commentlines
    .filter(line => line.startsWith('#CTE_'))
    .map(line => line.slice('#CTE_'.length))
    .map(line => {
      let [key, value] = line.split(':').map(l => l.trim());
      //TODO: allow here lists of numbers too
      value = value.match(/^-?\d*[\.|,]?\d+$/) ? parseFloat(value) : value;
      meta[key] = value;
    });
  return { components, meta };
}

// Save energy data and metadata to string
export function saveenergystring(components, meta) {
  const metalines = [
    `#CTE_Name: EPBDpanel`,
    `#CTE_Datetime: ${ new Date().toLocaleString() }`,
    `#CTE_Area_ref: ${ meta.area.toFixed(1) }`,
    `#CTE_kexp: ${ meta.kexp.toFixed(2) }`,
    `#CTE_krdel: ${ meta.krdel.toFixed(2) }`
  ];
  const componentlines = components
        .filter(cc => cc.active)
        .map(
          cc => {
            const { carrier, ctype, originoruse, values, comment } = cc;
            const valuelist = values.map(v=> v.toFixed(2)).join(',');
            return `${ carrier },${ ctype },${ originoruse },${ valuelist } #${ comment }`;
          }
        );
  return [...metalines, 'vector,tipo,src_dst', ...componentlines].join('\n');
}

// Read energy weighting factors data from string
export function readfactors(factorsstring) {
  return factorsstring.replace('\n\r', '\n').split('\n')
    .map(line => line.trim())
    .filter(line => !(line === ''
                      || line.startsWith('#')
                      || line.startsWith('vector')))
    .map(line => {
      let parts = line.split('#').map(part => part.trim());
      return (parts.lenght > 1) ? [parts[0], parts[1]] : [parts[0], ''];
    })
    .map(([fieldsstring, comment]) => {
      const fieldslist = fieldsstring.split(',').map(ff => ff.trim());
      if (fieldslist.length !== 6) {
        throw new UserException('Wrong number of fields in ' + fieldsstring);
      }
      let [ vector, fuente, uso, step, fren, fnren ] = fieldslist;
      fren = parseFloat(fren);
      fnren = parseFloat(fnren);
      return { vector, fuente, uso, step, fren, fnren, comment };
    });
}

// Format energy efficiency indicators as string from primary energy data
export function ep2string(EP, area = 1.0) {
  const areafactor = 1.0 / area;

  const eparen = areafactor * EP.EPpasoA.ren,
        epanren = areafactor * EP.EPpasoA.nren,
        epatotal = eparen + epanren,
        eparer = epatotal ? eparen / epatotal : 0.0;

  const epren = areafactor * EP.EP.ren,
        epnren = areafactor * EP.EP.nren,
        eptotal = epren + epnren,
        eprer = eptotal ? epren / eptotal : 0.0;

  return 'EP(step A)  , ren =' + eparen.toFixed(1) + ', nren=' + epanren.toFixed(1) + ', '
    + 'tot =' + epatotal.toFixed(1) + ', RER =' + eparer.toFixed(2) + '\n'
    + 'EP(step A+B), ren =' + epren.toFixed(1) + ', nren=' + epnren.toFixed(1) + ', '
    + 'tot =' + eptotal.toFixed(1) + ', RER =' + eprer.toFixed(2) + '\n';
}

// Convert EP object to epdict
export function ep2dict(EP, area = 1.0) {
  const areafactor = 1.0 / area;
  const EPAren = areafactor * EP.EPpasoA.ren,
        EPAnren = areafactor * EP.EPpasoA.nren,
        EPAtotal = EPAren + EPAnren,
        EPArer = (EPAtotal === 0) ? 0 : EPAren / EPAtotal;
  const EPren = areafactor * EP.EP.ren,
        EPnren = areafactor * EP.EP.nren,
        EPtotal = EPren + EPnren,
        EPrer = (EPtotal === 0) ? 0 : EPren / EPtotal;
  return { EPAren, EPAnren, EPAtotal, EPArer, EPren, EPnren, EPtotal, EPrer };
}

// Energy calculation functions --------------------------------------------------------

// Origin for produced energy must be either 'INSITU' or 'COGENERACION'
const VALIDORIGINS = ['INSITU', 'COGENERACION'];

// Calculate timestep energy balance for carrier
//
//
//    carrierdata: { 'CONSUMO': { 'EPB': [vi1, ..., vin],
//                                'NEPB': [vj1, ..., vjn] },
//                'PRODUCCION': { 'INSITU': [vk1, ..., vkn]},
//                                'COGENERACION' : [vl1, ..., vln] }
//                  } // n: number of timesteps
//
//    k_rdel: redelivery factor [0, 1]
//
//    This follows the EN15603 procedure for calculation of delivered and
//    exported energy components.
//
//    Returns:
//
//    components = { 'grid':
//                       { 'input': value },
//                   'INSITU':
//                       { 'input': [ va1, ..., van ],
//                         'to_nEPB': [ vb1, ..., vbn ],
//                         'to_grid': [ vc1, ..., vcn ] },
//                   'COGENERACION':
//                       { 'input': [ va1, ..., van ],
//                         'to_nEPB': [ vb1, ..., vbn ],
//                         'to_grid': [ vc1, ..., vcn ] },
//                 }
//
function components_t_forcarrier(carrierdata, k_rdel) {
  // Energy used by technical systems for EPB services, for each time step
  let E_EPus_t = carrierdata.CONSUMO.EPB;
  // Energy used by technical systems for non-EPB services, for each time step
  let E_nEPus_t = carrierdata.CONSUMO.NEPB;

  // (Electricity) produced on-site and inside the assessment boundary, by origin
  let E_pr_t_byorigin = carrierdata.PRODUCCION;

  // (Electric) energy produced on-site and inside the assessment boundary, for each time step (formula 23)
  let E_pr_t = veclistsum(VALIDORIGINS.map(origin => E_pr_t_byorigin[origin]));

  // Produced energy from all origins for EPB services for each time step (formula 24)
  let E_pr_used_EPus_t = vecvecmin(E_EPus_t, E_pr_t);

  // Exported energy for each time step (produced energy not consumed in EPB uses) (formula 25)
  let E_exp_t = vecvecdif(E_pr_t, E_pr_used_EPus_t);

  // Exported energy by production origin for each time step, weigthing done by produced energy
  let F_exp_t = E_pr_t.map((E_pr_ti, ii) => E_pr_ti === 0 ? 0 : E_exp_t[ii] / E_pr_ti);
  let E_exp_t_byorigin = VALIDORIGINS
      .reduce((obj, origin) => { obj[origin] = vecvecmul(E_pr_t_byorigin[origin], F_exp_t);
                                 return obj;
                               }, {});

  // Exported (electric) energy used for non-EPB uses for each time step (formula 26)
  let E_exp_used_nEPus_t = vecvecmin(E_exp_t, E_nEPus_t);
  // Exported energy used for non-EPB services for each time step, by origin, weighting done by exported energy
  let F_exp_used_nEPus_t = E_exp_t.map(
    (E_exp_ti, i) => { return E_exp_ti === 0 ? 0 : E_exp_used_nEPus_t[i] / E_exp_ti; }
  );
  let E_exp_used_nEPus_t_byorigin = VALIDORIGINS
      .reduce((obj, origin) => { obj[origin] = vecvecmul(E_exp_t_byorigin[origin], F_exp_used_nEPus_t);
                                 return obj;
                               }, {});

  // Exported energy not used for any service for each time step (formula 27)
  // Note: this is later affected by k_rdel for redelivery and k_exp for exporting
  let E_exp_nused_t = vecvecdif(E_exp_t, E_exp_used_nEPus_t);
  // Exported energy not used for any service for each time step, by origin, weighting done by exported energy
  let F_exp_nused_t = E_exp_t.map((E_exp_ti, i) => { return E_exp_ti === 0? 0: E_exp_nused_t[i] / E_exp_ti; });
  let E_exp_nused_t_byorigin = VALIDORIGINS
      .reduce((obj, origin) => { obj[origin] = vecvecmul(E_exp_t_byorigin[origin], F_exp_nused_t);
                                 return obj;
                               }, {});

  // Annual exported energy not used for any service (formula 28)
  let E_exp_nused_an = _.sum(E_exp_nused_t);

  // Delivered (electric) energy for each time step (formula 29)
  let E_del_t = vecvecdif(E_EPus_t, E_pr_used_EPus_t);
  // Annual delivered (electric) energy for EPB uses (formula 30)
  let E_del_an = _.sum(E_del_t);

  // Annual temporary exported (electric) energy (formula 31)
  let E_exp_tmp_an = Math.min(E_exp_nused_an, E_del_an);

  // Temporary exported energy for each time step (formula 32)
  // E_exp_tmp_t = np.zeros(numsteps) if (E_exp_nused_an == 0) else E_exp_tmp_an * E_exp_nused_t / E_exp_nused_an // not used

  // Redelivered energy for each time step (formula 33)
  let E_del_rdel_t = E_del_t.map(E_del_ti => E_del_an === 0 ? 0 : E_exp_tmp_an * E_del_ti / E_del_an);

  // Annual redelivered energy
  // E_del_rdel_an = _.sum(E_del_rdel_t) // not used

  // Exported (electric) energy to the grid for each time step (formula 34)
  // E_exp_grid_t = vecdif(E_exp_nused_t, E_exp_tmp_t) // not used

  // Annual exported (electric) energy to the grid (formula 35)
  let E_exp_grid_an = E_exp_nused_an - E_exp_tmp_an;
  // Energy exported to grid, by origin, weighting done by exported and not used energy
  let F_exp_grid_an = E_exp_nused_an === 0 ? 0 : E_exp_grid_an / E_exp_nused_an;
  let E_exp_grid_t_byorigin = VALIDORIGINS
      .reduce((obj, origin) => { obj[origin] = veckmul(E_exp_nused_t_byorigin[origin], F_exp_grid_an);
                                 return obj;
                               }, {});

  // (Electric) energy delivered by the grid for each time step (formula 36)
  // E_del_grid_t = vecdif(E_del_t, E_del_rdel_t)  // not used

  // Annual (electric) energy delivered by the grid (formula 37)
  // E_del_grid_an = E_del_an - E_del_rdel_an // not used

  // Corrected delivered energy for each time step (formula 38)
  let E_del_t_corr = E_del_t.map((E_del_ti, i) => { return E_del_ti - k_rdel * E_del_rdel_t[i]; });

  // Corrected temporary exported energy (formula 39)
  // E_exp_tmp_t_corr = [E_exp_tmp_ti * (1 - k_rdel) for E_exp_tmp_ti in E_exp_tmp_t] // not used

  let components_t = { grid: { input: _.sum(E_del_t_corr) } }; // Scalar

  VALIDORIGINS.map(origin => {
    components_t[origin] = { input: E_pr_t_byorigin[origin],
                             to_nEPB: E_exp_used_nEPus_t_byorigin[origin],
                             to_grid: E_exp_grid_t_byorigin[origin] };
  });

  return components_t;
}

// Calculate annual energy balance for carrier from timestep balance
//
//    Returns:
//
//        { 'grid': value1,
//          'INSITU': value2,
//          'COGENERACION': value3
//        }
//
function components_an_forcarrier(components_t) {
  let components_an = {};
  Object.keys(components_t).map(
    origin => {
      let components_t_byorigin = components_t[origin];
      Object.keys(components_t_byorigin).map(
        use => {
          let sumforuse = 0.0;
          if (origin === 'grid' && use === 'input') { // we have a scalar
            sumforuse = components_t_byorigin[use];
          } else { // we have a list
            sumforuse = _.sum(components_t_byorigin[use]);
          }
          if (!components_an.hasOwnProperty(origin)) { components_an[origin] = {}; }
          if (Math.abs(sumforuse) > 0.01) { // exclude smallish values
            components_an[origin][use] = sumforuse;
          }
        }
      );
    }
  );
  return components_an;
}

// Calculate timestep and annual energy composition by carrier
//
// carrierlist: list of energy components
//
//        [ {'carrier': carrier1, 'ctype': ctype1, 'originoruse': originoruse1, 'values': values1},
//          {'carrier': carrier2, 'ctype': ctype2, 'originoruse': originoruse2, 'values': values2},
//          ... ]
//
//        where:
//
//            * carrier is an energy carrier
//            * ctype is either 'PRODUCCION' or 'CONSUMO' por produced or used energy
//            * originoruse defines:
//              - the energy origin for produced energy (INSITU or COGENERACION)
//              - the energy end use (EPB or NEPB) for delivered energy
//            * values is a list of energy values, one for each timestep
//            * comment is a comment string for the vector
//
// k_rdel: redelivery factor [0, 1]
//
// Returns:
//      components[carrier] = { timestep: [vt1, ..., vtn]
//                              annual: vannual }
//      where timestep and annual are the timestep and annual
//      balanced values for carrier.
function energycomponents(carrierlist, k_rdel) {
  // Add all values of vectors with the same carrier ctype and originoruse
  // datadict[carrier][ctype][originoruse] -> values as np.array with length=numsteps
  const numsteps = Math.max(...carrierlist.map(datum => datum.values.length));

  let data = {};
  carrierlist.forEach(
    (datum, ii) => {
      const { carrier, ctype, originoruse } = datum;
      const values = datum.values.map(value => parseFloat(value));

      if (values.length !== numsteps) {
        throw new UserException(`All input must have the same number of timesteps.
                                Problem found in line ${ ii + 1 }: \t${ datum }`);
      }
      if (!data.hasOwnProperty(carrier)) {
        data[carrier] = { CONSUMO: { EPB: new Array(numsteps).fill(0.0),
                                     NEPB: new Array(numsteps).fill(0.0) },
                          PRODUCCION: { INSITU: new Array(numsteps).fill(0.0),
                                        COGENERACION: new Array(numsteps).fill(0.0) }
                         };
      }
      data[carrier][ctype][originoruse] = vecvecsum(data[carrier][ctype][originoruse], values);
    }
  );

  // Compute timestep and annual balance
  let components = {};
  Object.keys(data).map(carrier => {
    let bal_t = components_t_forcarrier(data[carrier], k_rdel);
    components[carrier] = { timestep: bal_t,
                            annual: components_an_forcarrier(bal_t) };
  });
  return components;
}

// Total delivered (or produced) weighted energy entering the assessment boundary in step A
//
// Energy is weighted depending on its origin (by source or grid).
//
// This function returns a data structure with keys 'ren' and 'nren' corresponding
// to the renewable and not renewable share of this weighted energy (step A).
function delivered_weighted_energy_stepA(components, fp) {
  let fpA = fp.filter(fpi => fpi.uso === 'input' && fpi.step === 'A');
  let delivered_wenergy_stepA = { ren: 0.0, nren: 0.0 };
  Object.keys(components).map(
    source => {
      let origins = components[source];
      if (origins.hasOwnProperty('input')) {
        let factor_paso_A = fpA.filter(fpi => fpi.fuente === source)[0];
        delivered_wenergy_stepA = { ren: delivered_wenergy_stepA.ren + factor_paso_A.fren * origins.input,
                                    nren: delivered_wenergy_stepA.nren + factor_paso_A.fnren * origins.input };
      }
    }
  );
  return delivered_wenergy_stepA;
}

// Total exported weighted energy going outside the assessment boundary in step A
//
// Energy is weighted depending on its destination (non-EPB uses or grid).
//
// This function returns a data structure with keys 'ren' and 'nren' corresponding
// to the renewable and not renewable share of this weighted energy (step A).
function exported_weighted_energy_stepA(components, fpA) {
  let to_nEPB = { ren: 0.0, nren: 0.0 },
      to_grid = { ren: 0.0, nren: 0.0 };
  let fpAnEPB = fpA.filter(fpi => fpi.uso === 'to_nEPB'),
      fpAgrid = fpA.filter(fpi => fpi.uso === 'to_grid');
  Object.keys(components).map(
    source => {
      let destinations = components[source];
      if (destinations.hasOwnProperty('to_nEPB')) {
        let fp_tmp = fpAnEPB.filter(fpi => fpi.fuente === source)[0] || 0.0;
        to_nEPB = { ren: to_nEPB.ren + fp_tmp.fren * destinations.to_nEPB,
                    nren: to_nEPB.nren + fp_tmp.fnren * destinations.to_nEPB };
      }

      if (destinations.hasOwnProperty('to_grid')) {
        let fp_tmp = fpAgrid.filter(fpi => fpi.fuente === source)[0] || 0.0;
        to_grid = { ren: to_grid.ren + fp_tmp.fren * destinations.to_grid,
                    nren: to_grid.nren + fp_tmp.fnren * destinations.to_grid };
      }
    }
  );
  return { ren: to_nEPB.ren + to_grid.ren,
           nren: to_nEPB.nren + to_grid.nren };
}

// Avoided weighted energy resources in the grid due to exported electricity
//
// The computation is done for a single energy carrier, considering the
// exported energy used for non-EPB uses (to_nEPB) and the energy exported
// to the grid (to_grid), each with its own weigting factors and k_exp.
//
// This function returns a data structure with keys 'ren' and 'nren' corresponding
// to the renewable and not renewable share of this weighted energy (step B).
function gridsavings_stepB(components, fp, k_exp) {
  let to_nEPB = { ren: 0.0, nren: 0.0 },
      to_grid = { ren: 0.0, nren: 0.0 };
  let fpA = fp.filter(fpi => fpi.step === 'A'),
      fpB = fp.filter(fpi => fpi.step === 'B');
  let fpAnEPB = fpA.filter(fpi => fpi.uso === 'to_nEPB'),
      fpAgrid = fpA.filter(fpi => fpi.uso === 'to_grid'),
      fpBnEPB = fpB.filter(fpi => fpi.uso === 'to_nEPB'),
      fpBgrid = fpB.filter(fpi => fpi.uso === 'to_grid');

  Object.keys(components).map(
    source => {
      let destinations = components[source];
      if (destinations.hasOwnProperty('to_nEPB')) {
        let fpA_tmp = fpAnEPB.filter(fpi => fpi.fuente === source)[0] || 0.0,
            fpB_tmp = fpBnEPB.filter(fpi => fpi.fuente === source)[0] || 0.0;
        to_nEPB = { ren: to_nEPB.ren + (fpB_tmp.fren - fpA_tmp.fren) * destinations.to_nEPB,
                    nren: to_nEPB.nren + (fpB_tmp.fnren - fpA_tmp.fnren) * destinations.to_nEPB };
      }
      if (destinations.hasOwnProperty('to_grid')) {
        let fpA_tmp = fpAgrid.filter(fpi => fpi.fuente === source)[0] || 0.0,
            fpB_tmp = fpBgrid.filter(fpi => fpi.fuente === source)[0] || 0.0;
        to_grid = { ren: to_grid.ren + (fpB_tmp.fren - fpA_tmp.fren) * destinations.to_grid,
                    nren: to_grid.nren + (fpB_tmp.fnren - fpA_tmp.fnren) * destinations.to_grid };
      }
    }
  );
  return { ren: k_exp * (to_nEPB.ren + to_grid.ren), nren: k_exp * (to_nEPB.nren + to_grid.nren) };
}

// Total weighted energy (step A + B) = used energy (step A) - saved energy (step B)
//
// The energy saved to the grid due to exportation (step B) is substracted
// from the the energy balance in the asessment boundary AB (step A).
// This is  computed for all energy carrier and all energy sources.
//
// This function returns a data structure with keys 'ren' and 'nren'
// corresponding to the renewable and not renewable parts of the balance.
//
// In the context of the CTE regulation weighted energy corresponds to
// primary energy.
//
// Reads energy input data from list and returns a data structure
//
// The list of energy components (data) has the following structure:
//
// [ {carrier: carrier1, ctype: ctype1, originoruse: originoruse1, values: [...values1], comment: comment1},
//   {carrier: carrier2, ctype: ctype2, originoruse: originoruse2, values: [...values2], comment: comment2},
//   ...
// ]
//
// * carrier is an energy carrier
// * ctype is either 'PRODUCCION' or 'CONSUMO' por produced or used energy
// * originoruse defines:
//   - the energy origin for produced energy (INSITU or COGENERACION)
//   - the energy end use (EPB or NEPB) for delivered energy
// * values is a list of energy values for each timestep
//
// fp is a list of lists of weighting factors
// k_rdel is the redelivery energy factor [0, 1]
// k_exp is the exported energy factor [0, 1]
export function weighted_energy(datalist, fp, k_rdel, k_exp) {
  let components = energycomponents(datalist, k_rdel);
  let EPA = { ren: 0.0, nren: 0.0 },
      EPB = { ren: 0.0, nren: 0.0 };

  Object.keys(components).map(
    carrier => {
      let fp_cr = fp.filter(elem => elem.vector === carrier);
      let components_cr_an = components[carrier].annual;
      let delivered_wenergy_stepA = delivered_weighted_energy_stepA(components_cr_an, fp_cr);
      let exported_wenergy_stepA = exported_weighted_energy_stepA(components_cr_an, fp_cr);
      let weighted_energy_stepA = { ren: delivered_wenergy_stepA.ren - exported_wenergy_stepA.ren,
                                    nren: delivered_wenergy_stepA.nren - exported_wenergy_stepA.nren };
      let gsavings_stepB = gridsavings_stepB(components_cr_an, fp_cr, k_exp);
      let weighted_energy_stepAB = { ren: weighted_energy_stepA.ren - gsavings_stepB.ren,
                                     nren: weighted_energy_stepA.nren - gsavings_stepB.nren };
      EPA = { ren: EPA.ren + weighted_energy_stepA.ren, nren: EPA.nren + weighted_energy_stepA.nren };
      EPB = { ren: EPB.ren + weighted_energy_stepAB.ren, nren: EPB.nren + weighted_energy_stepAB.nren };
    }
  );
  return { EP: EPB, EPpasoA: EPA };
}
