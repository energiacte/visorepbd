import { createStore } from "redux";
import reducer from "reducers/reducers.js";
import { new_wfactors } from "wasm-cteepbd";

const EXAMPLE_COMPONENTS = {
  cmeta: [
    { key: "CTE_LOCALIZACION", value: "PENINSULA" },
    { key: "CTE_KEXP", value: "0" },
    { key: "CTE_AREAREF", value: "200" }
  ],
  cdata: [
    // Energy components array (ejemplo3PVBdC.csv)
    {
      active: true,
      carrier: "ELECTRICIDAD",
      ctype: "PRODUCCION",
      csubtype: "INSITU",
      service: "NDEF",
      values: [
        34.21,
        41.94,
        64.94,
        73.88,
        88.44,
        88.64,
        91.04,
        76.15,
        52.84,
        39.26,
        27.43,
        26.26
      ],
      comment: "PV 5m2 (5kWp)"
    },
    {
      active: true,
      carrier: "MEDIOAMBIENTE",
      ctype: "PRODUCCION",
      csubtype: "INSITU",
      service: "ACS",
      values: [
        41.05,
        50.33,
        77.92,
        88.66,
        106.13,
        106.36,
        109.25,
        91.38,
        63.4,
        47.11,
        32.92,
        31.51
      ],
      comment: "PST 2m2, n=0.30"
    },
    {
      active: true,
      carrier: "MEDIOAMBIENTE",
      ctype: "CONSUMO",
      csubtype: "EPB",
      service: "ACS",
      values: [
        41.05,
        50.33,
        77.92,
        88.66,
        106.13,
        106.36,
        109.25,
        91.38,
        63.4,
        47.11,
        32.92,
        31.51
      ],
      comment: "PST 2m2, n=0.30"
    },
    {
      active: true,
      carrier: "ELECTRICIDAD",
      ctype: "CONSUMO",
      csubtype: "EPB",
      service: "ACS",
      values: [
        53.94,
        49.74,
        47.57,
        42.69,
        24.37,
        34.64,
        33.33,
        31.08,
        54.17,
        61.58,
        57.66,
        68.67
      ],
      comment: "BdC ind. aire-agua n_gen=2.5 n_d+e+c=0.88"
    },
    {
      active: true,
      carrier: "MEDIOAMBIENTE",
      ctype: "CONSUMO",
      csubtype: "EPB",
      service: "ACS",
      values: [
        80.92,
        74.61,
        71.36,
        64.04,
        36.56,
        51.97,
        50,
        46.62,
        81.26,
        92.36,
        86.48,
        103
      ],
      comment: "BdC ind. aire-agua n_gen=2.5 n_d+e+c=0.88"
    },
    {
      active: true,
      carrier: "ELECTRICIDAD",
      ctype: "CONSUMO",
      csubtype: "EPB",
      service: "CAL",
      values: [
        269.05,
        167.46,
        87.63,
        18.85,
        12.93,
        0,
        0,
        0,
        0,
        6.19,
        60.04,
        240.41
      ],
      comment: "BdC ind. aire-agua n_gen=3.0 n_d+e+c=0.95"
    },
    {
      active: true,
      carrier: "MEDIOAMBIENTE",
      ctype: "CONSUMO",
      csubtype: "EPB",
      service: "CAL",
      values: [
        538.1,
        334.93,
        175.26,
        37.69,
        25.85,
        0,
        0,
        0,
        0,
        12.37,
        120.08,
        480.83
      ],
      comment: "BdC ind. aire-agua n_gen=3.0 n_d+e+c=0.95"
    },
    {
      active: true,
      carrier: "ELECTRICIDAD",
      ctype: "CONSUMO",
      csubtype: "EPB",
      service: "REF",
      values: [0, 0, 0, 0, 0, 2.04, 23.34, 13.02, 17.72, 0, 0, 0],
      comment: "BdC ind. aire-agua n_gen=2.5 n_d+e+c=0.95"
    },
    {
      active: true,
      carrier: "ELECTRICIDAD",
      ctype: "CONSUMO",
      csubtype: "EPB",
      service: "VEN",
      values: [
        98.74,
        89.18,
        98.74,
        95.55,
        98.74,
        95.55,
        98.74,
        98.74,
        95.55,
        98.74,
        95.55,
        98.74
      ],
      comment: "Extractor simple flujo"
    },
    {
      active: true,
      carrier: "MEDIOAMBIENTE",
      ctype: "PRODUCCION",
      csubtype: "INSITU",
      service: "ACS",
      values: [
        80.92,
        74.61,
        71.36,
        64.04,
        36.56,
        51.97,
        50,
        46.62,
        81.26,
        92.36,
        86.48,
        103.0
      ],
      comment:
        "Equilibrado de energía térmica insitu (MEDIOAMBIENTE) consumida y sin producción declarada"
    },
    {
      active: true,
      carrier: "MEDIOAMBIENTE",
      ctype: "PRODUCCION",
      csubtype: "INSITU",
      service: "CAL",
      values: [
        538.1,
        334.93,
        175.26,
        37.69,
        25.85,
        0,
        0,
        0,
        0,
        12.37,
        120.08,
        480.83
      ],
      comment:
        "Equilibrado de energía térmica insitu (MEDIOAMBIENTE) consumida y sin producción declarada"
    }
  ]
};

const initialState = {
  // Último elemento seleccionado
  storedcomponent: EXAMPLE_COMPONENTS.cdata[0],
  // Elemento seleccionado (índice)
  selectedkey: 0,
  // Factor de exportación
  kexp: 0.0,
  // Área de referencia
  area: 200,
  // Localización
  location: "PENINSULA",
  // TODO: usar esto en lugar de wfactors_ep y wfactors_co2 pero esperar a definir
  // TODO: factores como triplas de ren, nren y co2 en cteepbd
  // Factores definidos por el usuario
  // user_wfactors: {
  //   cogen: {
  //     A_RED: { ren: 0.0, nren: 2.5, co2: 0.3 },
  //     A_NEPB: { ren: 0.0, nren: 2.5, co2: 0.3 }
  //   },
  //   red: {
  //     RED1: { ren: 0.0, nren: 1.3, co2: 0.3 },
  //     RED2: { ren: 0.0, nren: 1.3, co2: 0.3 }
  //   }
  // },
  // Factores de paso a energía primaria
  wfactors_ep: new_wfactors("PENINSULA", "EP", {}),
  // Factores de paso a emisiones
  wfactors_co2: new_wfactors("PENINSULA", "CO2", {}),
  // Componentes energéticos (energía final)
  components: EXAMPLE_COMPONENTS,
  // Nombre de archivo actual
  currentfilename: "VisorEPBD.csv"
};

export default createStore(reducer, initialState);
