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

/* ENERGYCALCULATIONS - Implementation of the ISO EN 52000-1 standard

  Energy performance of buildings - Overarching EPB assessment - General framework and procedures

  This implementation has used the following assumptions:
  - weighting factors are constant for all timesteps
  - no priority is set for energy production (average step A weighting factor f_we_el_stepA)
  - all on-site produced energy from non cogeneration sources is considered as delivered
  - the load matching factor is constant and equal to 1.0

  TODO:
  - allow other values of load matching factor (or functions) (formula 32, B.32)
  - get results by use items (service), maybe using the reverse method E.3 (E.3.6, E.3.7)
  - make the input sanitizer (weighting factors) smarter
*/

// ---------------------------------------------------------------------------------------------------------
// Default values for energy efficiency calculation
//
// These are aimed towards energy efficiency evaluation in the spanish
// building code regulations (Código Técnico de la Edificación CTE).
//
// Weighting factors are based on primary energy use.
// Weighting factors are considered constant through timesteps
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
].map(([vector, source, use, step, fren, fnren]) => {
  return { vector, source, use, step, fren, fnren };
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
const zip = (...rows) => [...rows[0]].map((_, c) => rows.map(row => row[c]));

// Elementwise sum res[i] = vec1[i] + vec2[i] + ... + vecj[i]
function veclistsum(veclist) {
  return zip(...veclist).map(valsi => valsi.reduce((a, b) => a + b, 0));
}

// Elementwise minimum min res[i] = min(vec1[i], vec2[i])
function vecvecmin(vec1, vec2) {
  return vec1.map((el, ii) => Math.min(el, vec2[ii]));
}

// Elementwise sum of arrays
function vecvecsum(vec1, vec2) {
  return vec1.map((el, ii) => el + vec2[ii]);
}

// Elementwise difference res[i] = vec1[i] - vec2[i]
function vecvecdif(vec1, vec2) {
  return vec1.map((el, ii) => el - vec2[ii]);
}

// Elementwise multiplication res[i] = vec1[i] * vec2[i]
function vecvecmul(vec1, vec2) {
  return vec1.map((el, ii) => el * vec2[ii]);
}

// Multiply vector by scalar
function veckmul(vec1, k) {
  return vec1.map(v => v * k);
}

// Sum all elements in a vector
const vecsum = vec => vec.reduce((a, b) => a + b, 0);


// -----------------------------------------------------------------------------------
// Input/Output functions
// -----------------------------------------------------------------------------------

// Input parsing functions -----------------------------------------------------------

// Read energy input data from string and return a carrier data list
//
// The carrier data list has the following structure:
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
  const commentlines = datalines.filter(line => line.startsWith('#'));
  const componentlines = datalines.filter(line => !line.startsWith('#'));

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
            && Object.keys(VALIDDATA).indexOf(ctype) > -1
            && Object.keys(VALIDDATA[ctype]).indexOf(originoruse) > -1
            && VALIDDATA[ctype][originoruse].indexOf(carrier) > -1) {
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
      // TODO: allow here lists of numbers too
      const floatRegex = /^[+-]?([0-9]+([.,][0-9]*)?|[.,][0-9]+)$/;
      value = value.match(floatRegex) ? parseFloat(value) : value;
      meta[key] = value;
    });
  return { components, meta };
}

// Parse carrier data list and generate data object from it
// Add all values of vectors with the same carrier ctype and originoruse
// datadict[carrier][ctype][originoruse] -> values as np.array with length=numsteps
//
// carrierlist: list of energy carrier data
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
export function parse_carrier_list(carrierlist) {
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
  return data;
}

// Save energy data and metadata to string
// TODO: revisar con últimos cambios en formato de salida
export function saveenergystring(carrierdata, meta) {
  const metalines = [
    `#CTE_Name: EPBDpanel`,
    `#CTE_Datetime: ${ new Date().toLocaleString() }`,
    `#CTE_Area_ref: ${ meta.area.toFixed(1) }`,
    `#CTE_kexp: ${ meta.kexp.toFixed(2) }`
  ];
  const carrierlines = carrierdata
        .filter(cc => cc.active)
        .map(
          cc => {
            const { carrier, ctype, originoruse, values, comment } = cc;
            const valuelist = values.map(v=> v.toFixed(2)).join(',');
            return `${ carrier },${ ctype },${ originoruse },${ valuelist } #${ comment }`;
          }
        );
  return [...metalines, 'vector,tipo,src_dst', ...carrierlines].join('\n');
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
      let [ vector, source, use, step, fren, fnren ] = fieldslist;
      fren = parseFloat(fren);
      fnren = parseFloat(fnren);
      return { vector, source, use, step, fren, fnren, comment };
    });
}

// TODO: const fP = sanitize_weighting_factors(fp);
// TODO: Podría avisar si no existe un factor: ['MEDIOAMBIENTE', 'grid', 'input', 'A', 1.000, 0.000]
// TODO: podría considerar que to_nEPB es igual a to_grid si no se define
// TODO: podría considerar que to_grid es igual a input si no se define

// Utility output functions ---------------------------------------------------

// Format energy efficiency indicators as string from primary energy data
export function ep2string(EP, area = 1.0) {
  const areafactor = 1.0 / area;

  const eparen = areafactor * EP.EP.A.ren;
  const epanren = areafactor * EP.EP.A.nren;
  const epatotal = eparen + epanren;
  const eparer = epatotal ? eparen / epatotal : 0.0;

  const epren = areafactor * EP.EP.B.ren;
  const epnren = areafactor * EP.EP.B.nren;
  const eptotal = epren + epnren;
  const eprer = eptotal ? epren / eptotal : 0.0;

  return 'EP(step A)  , ren =' + eparen.toFixed(1) + ', nren=' + epanren.toFixed(1) + ', '
    + 'tot =' + epatotal.toFixed(1) + ', RER =' + eparer.toFixed(2) + '\n'
    + 'EP(step A+B), ren =' + epren.toFixed(1) + ', nren=' + epnren.toFixed(1) + ', '
    + 'tot =' + eptotal.toFixed(1) + ', RER =' + eprer.toFixed(2) + '\n';
}

// Convert EP object to epdict
export function ep2dict(EP, area = 1.0) {
  const areafactor = 1.0 / area;
  const EPAren = areafactor * EP.EP.A.ren;
  const EPAnren = areafactor * EP.EP.A.nren;
  const EPAtotal = EPAren + EPAnren;
  const EPArer = (EPAtotal === 0) ? 0 : EPAren / EPAtotal;
  const EPren = areafactor * EP.EP.B.ren;
  const EPnren = areafactor * EP.EP.B.nren;
  const EPtotal = EPren + EPnren;
  const EPrer = (EPtotal === 0) ? 0 : EPren / EPtotal;
  return { EPAren, EPAnren, EPAtotal, EPArer, EPren, EPnren, EPtotal, EPrer };
}

// --------------------------------------------------------------------
// Energy calculation functions
// --------------------------------------------------------------------

// ///////////// ByCarrier timestep and annual computations ////////////

// Calculate energy balance for carrier
//
//
//    carrierdata: { 'CONSUMO': { 'EPB': [vi1, ..., vin],
//                                'NEPB': [vj1, ..., vjn] },
//                   'PRODUCCION': { 'INSITU': [vk1, ..., vkn]},
//                                   'COGENERACION' : [vl1, ..., vln] }
//                  } // n: number of timesteps
//
//    k_exp: exported energy factor [0, 1]
//
//    fp_cr: weighting factors for carrier
//
//    This follows the ISO EN 52000-1 procedure for calculation of delivered,
//    exported and weighted energy balance.
//
function balance_cr(carrierdata, k_exp, fp_cr) {
  // ------------ Delivered and exported energy

  // * Energy used by technical systems for EPB services, for each time step
  const E_EPus_cr_t = carrierdata.CONSUMO.EPB;
  // * Energy used by technical systems for non-EPB services, for each time step
  const E_nEPus_cr_t = carrierdata.CONSUMO.NEPB;
  // * Produced on-site energy and inside the assessment boundary, by generator i (origin i)
  const E_pr_cr_pr_i_t = carrierdata.PRODUCCION;
  // Annually produced on-site energy from generator i (origin i)
  const E_pr_cr_pr_i_an = Object.keys(E_pr_cr_pr_i_t).reduce((obj, gen) =>
  ({ ...obj, [gen]: vecsum(E_pr_cr_pr_i_t[gen]) }),
  {});

  // PRODUCED ENERGY GENERATORS (ORIGINS)
  const pr_generators = Object.keys(E_pr_cr_pr_i_t); // INSITU + COGENERACION

  // * Energy produced on-site and inside the assessment boundary (formula 30)
  const E_pr_cr_t = veclistsum(pr_generators.map(gen => E_pr_cr_pr_i_t[gen]));
  const E_pr_cr_an = vecsum(E_pr_cr_t);

  // * Produced energy from all origins for EPB services for each time step (formula 31)
  // TODO: f_match_t constante para electricidad (formula 32)
  // let f_match_t = fmatch(E_pr_cr_t / E_EPus_cr_t)
  const f_match_t = E_EPus_cr_t.map(x => 1.0);

  const E_pr_cr_used_EPus_t = vecvecmul(f_match_t, vecvecmin(E_EPus_cr_t, E_pr_cr_t));

  // * Exported energy for each time step (produced energy not consumed in EPB uses) (formula 33)
  // E_pr_cr_t = E_pr_cr_used_EPus_t + E_exp_cr_used_nEPus_t + E_exp_cr_grid_t
  // E_exp_cr_t = E_exp_cr_used_nEPus_t + E_exp_cr_grid_t
  const E_exp_cr_t = vecvecdif(E_pr_cr_t, E_pr_cr_used_EPus_t);

  // * Exported energy used for non-EPB uses for each time step (formula 34)
  const E_exp_cr_used_nEPus_t = vecvecmin(E_exp_cr_t, E_nEPus_cr_t);

  // * Annualy exported energy used for non-EPB uses for carrier
  const E_exp_cr_used_nEPus_an = vecsum(E_exp_cr_used_nEPus_t);

  // * Energy exported to the grid for each interval (formula 35)
  const E_exp_cr_grid_t = vecvecdif(E_exp_cr_t, E_exp_cr_used_nEPus_t);

  // * Annualy exported energy to the grid for carrier (formula 36)
  const E_exp_cr_grid_an = vecsum(E_exp_cr_grid_t);

  // * Delivered energy (by the grid) for EP uses for each interval (formula 37)
  const E_del_cr_t = vecvecdif(E_EPus_cr_t, E_pr_cr_used_EPus_t);

  // * Annualy delivered energy (by the grid) for EP uses for carrier (formula 38)
  const E_del_cr_an = vecsum(E_del_cr_t);

  // ** Weighting depending on energy generator **

  // Exported energy by generator i i (origin) (9.6.6.2)
  // Implementation WITHOUT priorities on energy use

  // * Fraction of produced energy tipe i (origin from generator i) (formula 14)
  const f_pr_cr_i = pr_generators.reduce((obj, gen) =>
    ({ ...obj, [gen]: (E_pr_cr_an < 1e-3) ? 0 : E_pr_cr_pr_i_an[gen] / E_pr_cr_an }),
    {});

  // * Energy used for produced carrier energy type i (origin from generator i) (formula 15)
  const E_pr_cr_i_used_EPus_t = pr_generators.reduce((obj, gen) =>
    ({ ...obj, [gen]: veckmul(E_pr_cr_used_EPus_t, f_pr_cr_i[gen]) }),
    {});

  // * Exported energy from generator i (origin i) (formula 16)
  const E_exp_cr_pr_i_t = pr_generators.reduce((obj, gen) =>
    ({ ...obj, [gen]: vecvecdif(E_pr_cr_pr_i_t[gen], E_pr_cr_i_used_EPus_t[gen]) }),
    {});

  // * Annually exported energy from generator i (origin i)
  const E_exp_cr_pr_i_an = Object.keys(E_exp_cr_pr_i_t).reduce((obj, gen) =>
    ({ ...obj, [gen]: vecsum(E_exp_cr_pr_i_t[gen]) }),
    {});


  // -------- Weighted delivered and exported energy (11.6.2.1, 11.6.2.2, 11.6.2.3 + eq 2, 3)
  // NOTE: All weighting factors have been considered constant through all timesteps
  // NOTE: This allows using annual quantities and not timestep expressions

  // * Weighted energy for delivered energy: the cost of producing that energy

  // 1) Delivered energy from the grid
  // NOTE: grid delivered energy is energy which is used but not produced (on-site or nearby)
  const fpA_grid = fp_cr.find(fp =>
    fp.use === 'input'
    && fp.step === 'A'
    && fp.source === 'grid'
  );
  const E_we_del_cr_grid_an = {
    ren: E_del_cr_an * fpA_grid.fren,
    nren: E_del_cr_an * fpA_grid.fnren
  }; // formula 19, 39

  // 2) Delivered energy from non cogeneration sources
  const delivery_sources = Object.keys(E_pr_cr_pr_i_an).filter(s => s !== 'grid' && s !== 'COGENERACION');
  const E_we_del_cr_pr_an = delivery_sources.reduce(
    (obj, gen) => {
      const fpA_pr_i = fp_cr.find(fp => fp.use === 'input' && fp.step === 'A' && fp.source === gen);
      const E_pr_i = E_pr_cr_pr_i_an[gen];
      if (E_pr_i === 0) { return obj; }
      return {
        ren: obj.ren + E_pr_i * fpA_pr_i.fren,
        nren: obj.nren + E_pr_i * fpA_pr_i.fnren
      };
    },
    { ren: 0, nren: 0 }
  );

  // 3) Total delivered energy: grid + all non cogeneration
  const E_we_del_cr_an = {
    ren: E_we_del_cr_grid_an.ren + E_we_del_cr_pr_an.ren,
    nren: E_we_del_cr_grid_an.nren + E_we_del_cr_pr_an.nren
  }; // formula 19, 39


  // * Weighted energy for exported energy: depends on step A or B

  let E_we_exp_cr_an_A;
  let E_we_exp_cr_an_AB;
  let E_we_exp_cr_an;
  let E_we_exp_cr_used_nEPus_an_AB;
  let E_we_exp_cr_grid_an_AB;

  const E_exp_cr_an = E_exp_cr_used_nEPus_an + E_exp_cr_grid_an;
  if (E_exp_cr_an === 0) {
    // There's no exportation, either because the carrier cannot be exported
    // or there's no effective exportation
    E_we_exp_cr_an_A = { ren: 0.0, nren: 0.0 };
    E_we_exp_cr_an_AB = { ren: 0.0, nren: 0.0 };
    E_we_exp_cr_an = { ren: 0.0, nren: 0.0 };
    E_we_exp_cr_used_nEPus_an_AB = { ren: 0.0, nren: 0.0 };
    E_we_exp_cr_grid_an_AB = { ren: 0.0, nren: 0.0 };
  } else {
    // * Step A: weighting depends on exported energy generation (origin generator)
    // Factors are averaged weighting by production for each origin (no priority, 9.6.6.2.4)

     // * Fraction of produced energy tipe i (origin from generator i) that is exported (formula 14)
    // NOTE: simplified for annual computations (not valid for timestep calculation)
    const F_pr_i = pr_generators.reduce((obj, gen) => {
      if (E_exp_cr_pr_i_an[gen] === 0) { return obj; } // Don't store generators without generation
      return { ...obj, [gen]: vecsum(E_exp_cr_pr_i_t[gen]) / E_exp_cr_pr_i_an[gen] };
    },
    {});
    const exp_generators = Object.keys(F_pr_i);

    // Weighting factors for energy exported to nEP uses (step A) (~formula 24)
    let f_we_exp_cr_stepA_nEPus;
    if (E_exp_cr_used_nEPus_an === 0) { // No energy exported to nEP uses
      f_we_exp_cr_stepA_nEPus = { ren: 0, nren: 0 };
    } else {
      const fpA_nEPus_i = fp_cr.filter(fp => fp.use === 'to_nEPB' && fp.step === 'A');
      f_we_exp_cr_stepA_nEPus = exp_generators
        .reduce((acc, gen) => {
          const F_g = F_pr_i[gen];
          const fpA_g = fpA_nEPus_i.find(fp => fp.source === gen);
          return { ren: acc.ren + F_g * fpA_g.fren, nren: acc.nren + F_g * fpA_g.fnren };
        },
        { ren: 0.0, nren: 0.0 }
      ); // suma de todos los i: fpA_nEPus_i * F_pr_i[gen]
    }

    // Weighting factors for energy exported to the grid (step A) (~formula 25)
    let f_we_exp_cr_stepA_grid;
    if (E_exp_cr_grid_an === 0) { // No energy exported to grid
      f_we_exp_cr_stepA_grid = { ren: 0, nren: 0 };
    } else {
      const fpA_grid_i = fp_cr.filter(fp => fp.use === 'to_grid' && fp.step === 'A');
      f_we_exp_cr_stepA_grid = exp_generators
        .reduce((acc, gen) => {
          const F_g = F_pr_i[gen];
          const fpA_g = fpA_grid_i.find(fp => fp.source === gen);
          return { ren: acc.ren + F_g * fpA_g.fren, nren: acc.nren + F_g * fpA_g.fnren };
        },
        { ren: 0.0, nren: 0.0 }
      ); // suma de todos los i: fpA_grid_i * F_pr_i[gen];
    }

    // Weighted exported energy according to resources used to generate that energy (formula 23)
    E_we_exp_cr_an_A = {
      ren: E_exp_cr_used_nEPus_an * f_we_exp_cr_stepA_nEPus.ren // formula 24
           + E_exp_cr_grid_an * f_we_exp_cr_stepA_grid.ren, // formula 25
      nren: E_exp_cr_used_nEPus_an * f_we_exp_cr_stepA_nEPus.nren // formula 24
            + E_exp_cr_grid_an * f_we_exp_cr_stepA_grid.nren // formula 25
    };

    // * Step B: weighting depends on exported energy generation and avoided resources on the grid

    // Factors of contribution for energy exported to nEP uses (step B)
    let f_we_exp_cr_used_nEPus;
    if (E_exp_cr_used_nEPus_an === 0) { // No energy exported to nEP uses
      f_we_exp_cr_used_nEPus = { ren: 0, nren: 0 };
    } else {
      const fpB_nEPus_i = fp_cr.filter(fp => fp.use === 'to_nEPB' && fp.step === 'B');
      f_we_exp_cr_used_nEPus = exp_generators
        .reduce((acc, gen) => {
          const F_g = F_pr_i[gen];
          const fpB_g = fpB_nEPus_i.find(fp => fp.source === gen);
          return { ren: acc.ren + F_g * fpB_g.fren, nren: acc.nren + F_g * fpB_g.fnren };
        },
        { ren: 0.0, nren: 0.0 }
      ); // suma de todos los i: fpB_nEPus_i * F_pr_i[gen]
    }

    // Weighting factors for energy exported to the grid (step B)
    let f_we_exp_cr_grid;
    if (E_exp_cr_grid_an === 0) { // No energy exported to grid
      f_we_exp_cr_grid = { ren: 0, nren: 0 };
    } else {
      const fpB_grid_i = fp_cr.filter(fp => fp.use === 'to_grid' && fp.step === 'B');
      f_we_exp_cr_grid = exp_generators
        .reduce((acc, gen) => {
          const F_g = F_pr_i[gen];
          const fpB_g = fpB_grid_i.find(fp => fp.source === gen);
          return { ren: acc.ren + F_g * fpB_g.fren, nren: acc.nren + F_g * fpB_g.fnren };
        },
        { ren: 0.0, nren: 0.0 }
      ); // suma de todos los i: fpB_grid_i * F_pr_i[gen];
    }

    // Effect of exported energy on weighted energy performance (step B) (formula 26)

    E_we_exp_cr_used_nEPus_an_AB = {
      ren: E_exp_cr_used_nEPus_an * (f_we_exp_cr_used_nEPus.ren - f_we_exp_cr_stepA_nEPus.ren),
      nren: E_exp_cr_used_nEPus_an * (f_we_exp_cr_used_nEPus.nren - f_we_exp_cr_stepA_nEPus.nren)
    };

    E_we_exp_cr_grid_an_AB = {
      ren: E_exp_cr_grid_an * (f_we_exp_cr_grid.ren - f_we_exp_cr_stepA_grid.ren),
      nren: E_exp_cr_grid_an * (f_we_exp_cr_grid.nren - f_we_exp_cr_stepA_grid.nren)
    };

    E_we_exp_cr_an_AB = {
      ren: E_we_exp_cr_used_nEPus_an_AB.ren + E_we_exp_cr_grid_an_AB.ren,
      nren: E_we_exp_cr_used_nEPus_an_AB.nren + E_we_exp_cr_grid_an_AB.nren
    };

    // Contribution of exported energy to the annual weighted energy performance
    // 11.6.2.1, 11.6.2.2, 11.6.2.3
    E_we_exp_cr_an = {
      ren: E_we_exp_cr_an_A.ren + k_exp * E_we_exp_cr_an_AB.ren,
      nren: E_we_exp_cr_an_A.nren + k_exp * E_we_exp_cr_an_AB.nren
    }; // (formula 20)
  }

  // * Total result for step A
  const E_we_cr_an_A = {
    ren: E_we_del_cr_an.ren - E_we_exp_cr_an_A.ren,
    nren: E_we_del_cr_an.nren - E_we_exp_cr_an_A.nren
  }; // Partial result for carrier (formula 2)

  // * Total result for step B
  const E_we_cr_an = {
    ren: E_we_del_cr_an.ren - E_we_exp_cr_an.ren,
    nren: E_we_del_cr_an.nren - E_we_exp_cr_an.nren
  }; // Partial result for carrier (formula 2)

  const balance = {
    used_EPB: carrierdata.CONSUMO.EPB,
    used_nEPB: carrierdata.CONSUMO.NEPB,
    produced_bygen: carrierdata.PRODUCCION,
    produced_bygen_an: E_pr_cr_pr_i_an,
    produced: E_pr_cr_t,
    produced_an: E_pr_cr_an,
    f_match: f_match_t, // load matching factor
    exported: E_exp_cr_t, // exp_used_nEPus + exp_grid
    exported_an: E_exp_cr_an,
    exported_byorigin: E_exp_cr_pr_i_t,
    exported_byorigin_an: E_exp_cr_pr_i_an,
    exported_grid: E_exp_cr_grid_t,
    exported_grid_an: E_exp_cr_grid_an,
    exported_nEPB: E_exp_cr_used_nEPus_t,
    exported_nEPB_an: E_exp_cr_used_nEPus_an,
    delivered_grid: E_del_cr_t,
    delivered_grid_an: E_del_cr_an,
    // Weighted energy: { ren, nren }
    we_delivered_grid_an: E_we_del_cr_grid_an,
    we_delivered_prod_an: E_we_del_cr_pr_an,
    we_delivered_an: E_we_del_cr_an,
    we_exported_an_A: E_we_exp_cr_an_A,
    we_exported_nEPB_an_AB: E_we_exp_cr_used_nEPus_an_AB,
    we_exported_grid_and_AB: E_we_exp_cr_grid_an_AB,
    we_exported_an_AB: E_we_exp_cr_an_AB,
    we_exported_an: E_we_exp_cr_an,
    we_an_A: E_we_cr_an_A,
    we_an: E_we_cr_an
  };

  return balance;
}

// Compute overall energy performance aggregating results for all energy carriers
//
//
export function energy_performance(carrierdata, fp, k_exp) {
  // Compute balance
  let balance_cr_i = {};
  Object.keys(carrierdata).map(carrier => {
    let fp_cr = fp.filter(e => e.vector === carrier);
    balance_cr_i[carrier] = balance_cr(carrierdata[carrier], k_exp, fp_cr);
  });

  const EP = Object.keys(balance_cr_i)
    .reduce(
      (acc, cr) => ({
        // E_we_an =  E_we_del_an - E_we_exp_an; // formula 2 step A
        A: { ren: acc.A.ren + balance_cr_i[cr].we_an_A.ren,
             nren: acc.A.nren + balance_cr_i[cr].we_an_A.nren },
        // E_we_an =  E_we_del_an - E_we_exp_an; // formula 2 step B
        B: { ren: acc.B.ren + balance_cr_i[cr].we_an.ren,
             nren: acc.B.nren + balance_cr_i[cr].we_an.nren },
        // Weighted energy partials
        we_del: { ren: acc.we_del.ren + balance_cr_i[cr].we_delivered_an.ren,
                  nren: acc.we_del.nren + balance_cr_i[cr].we_delivered_an.nren },
        we_exp_A: { ren: acc.we_exp_A.ren + balance_cr_i[cr].we_exported_an_A.ren,
                    nren: acc.we_exp_A.nren + balance_cr_i[cr].we_exported_an_A.nren },
        we_exp: { ren: acc.we_exp.ren + balance_cr_i[cr].we_exported_an.ren,
                  nren: acc.we_exp.nren + balance_cr_i[cr].we_exported_an.nren }
      }),
    { A: { ren: 0, nren: 0 }, B: { ren: 0, nren: 0 },
      we_del: { ren: 0, nren: 0 }, we_exp_A: { ren: 0, nren: 0 }, we_exp: { ren: 0, nren: 0 } }
    );

  return {
    carrierdata,
    k_exp,
    fp,
    balance_cr_i,
    EP
  };
}
