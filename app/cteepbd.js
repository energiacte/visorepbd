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
export const FACTORESDEPASO = [
        // FpA - weighting factors accounting for the resources used to produce this energy
        // FpB - weighting factors accounting for the resources avoided by the external grid due to the export
        //  Energy carrier       source          dest        step Fpren  Fpnren
        ['ELECTRICIDAD',        'RED',          'input',     'A', 0.414, 1.954], // Delivered energy
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

        ['ELECTRICIDADBALEARES','RED',          'input',     'A', 0.082, 2.968], // Delivered energy
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

        ['ELECTRICIDADCANARIAS','RED',          'input',     'A', 0.070, 2.924], // Delivered energy
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

        ['ELECTRICIDADCEUTAMELILLA','RED',      'input',     'A', 0.072, 2.718], // Delivered energy
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

        ['MEDIOAMBIENTE',       'RED',          'input',     'A', 1.000, 0.000], // Grid is able to deliver this carrier
        ['MEDIOAMBIENTE',       'INSITU',       'input',     'A', 1.000, 0.000], // in-situ production of this carrier
        ['MEDIOAMBIENTE',       'INSITU',       'to_grid',   'A', 0.000, 0.000], // export to grid is not accounted for
        ['MEDIOAMBIENTE',       'INSITU',       'to_nEPB',   'A', 1.000, 0.000], // export to nEPB uses in step A
        ['MEDIOAMBIENTE',       'INSITU',       'to_grid',   'B', 0.000, 0.000], // Savings to the grid when exporting to grid
        ['MEDIOAMBIENTE',       'INSITU',       'to_nEPB',   'B', 1.000, 0.000], // Savings to the grid when exporting to nEPB uses

        // BIOCARBURANTE == BIOMASA DENSIFICADA (PELLETS)
        ['BIOCARBURANTE',       'RED',          'input',     'A', 1.028, 0.085], // Delivered energy
        ['BIOMASA',             'RED',          'input',     'A', 1.003, 0.034], // Delivered energy
        ['BIOMASADENSIFICADA',  'RED',          'input',     'A', 1.028, 0.085], // Delivered energy
        ['CARBON',              'RED',          'input',     'A', 0.002, 1.082], // Delivered energy
        // FUELOIL == GASOLEO
        ['FUELOIL',             'RED',          'input',     'A', 0.003, 1.179], // Delivered energy
        ['GASNATURAL',          'RED',          'input',     'A', 0.005, 1.190], // Delivered energy
        ['GASOLEO',             'RED',          'input',     'A', 0.003, 1.179], // Delivered energy
        ['GLP',                 'RED',          'input',     'A', 0.030, 1.201], // Delivered energy
        ['RED1',                'RED',          'input',     'A', 0.000, 1.300], // User defined!, district heating/cooling carrier
        ['RED2',                'RED',          'input',     'A', 0.000, 1.300]  // User defined!, district heating/cooling carrier
].map(([carrier, source, dest, step, ren, nren]) => {
  return { type: 'FACTOR', carrier, source, dest, step, ren, nren };
});

// TODO: function cte_weighting_factors(loc, extradata=null) {}
// TODO: función que genere lista de factores de paso según localización (PENINSULA, CANARIAS, BALEARES, CEUTAYMELILLA)
// TODO: y factores de paso de cogeneración, y factores para RED1 y RED2
// TODO: usa META, LOCALIZACION, xxxx
// TODO: Podría aplicar criterios CTE:
// TODO:    - el factor en paso B para exportación es igual al de paso A para la importación de red
// TODO:    - el factor input de cogeneración es 0.0, 0.0
// TODO:    - se considera igual la exportación a la red (to_grid) que a usos NEPB (to_nEPB)
// TODO:    - MEDIOAMBIENTE, RED, input es 1.0, 0.0

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


// Validate carrier data coherence
export function carrier_isvalid(carrier_obj) {
  const { type, carrier, ctype, csubtype } = carrier_obj;
  if (type !== 'CARRIER') return false;
  let validcarriers;
  try {
    validcarriers = VALIDDATA[ctype][csubtype];
  } catch (e) {
    return false;
  }
  if (validcarriers.includes(carrier)) return true;
  return false;
}


// TODO: const fP = sanitize_weighting_factors(fp);
// TODO: Podría avisar si no existe un factor: ['MEDIOAMBIENTE', 'RED', 'input', 'A', 1.000, 0.000]
// TODO: podría considerar que to_nEPB es igual a to_grid si no se define
// TODO: podría considerar que to_grid es igual a input si no se define
