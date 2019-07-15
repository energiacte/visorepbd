// Copia de epbdjs para ver qué usos se hacen de la librería y analizar interfaz con cteepbd

// Reexports
import { energy_performance, cte } from "epbdjs";
export const {
  parse_components,
  new_wfactors
} = cte;
export { energy_performance };

// Código nuevo para aislar acceso a librería

// Cálculo para ACS en perímetro próximo
export function energy_performance_acs_nrb(components, wfactors, kexp, area) {
  const wfactors_nrb = cte.wfactors_to_nearby(wfactors);
  const components_acs = cte.components_by_service(components, "ACS");
  return energy_performance(components_acs, wfactors_nrb, kexp, area);
}


// ================ Código traído de epbjs ==============
// Epbdjs.js ----------------------------

// Utility constructors
export const new_meta = (key, value) => ({ key, value });
export const new_carrier = (
  carrier,
  ctype,
  csubtype,
  service,
  values,
  comment = ""
) => ({ carrier, ctype, csubtype, service, values, comment });
export const new_factor = (
  carrier,
  source,
  dest,
  step,
  ren,
  nren,
  comment = ""
) => ({ carrier, source, dest, step, ren, nren, comment });

// Serialize basic types to string
export const meta2string = mm => `#META ${mm.key}: ${mm.value}`;
export function carrier2string(cc) {
  const { carrier, ctype, csubtype, service, values, comment } = cc;
  const valuelist = values.map(v => v.toFixed(2)).join(",");
  return `${carrier}, ${ctype}, ${csubtype}, ${service}, ${valuelist}${
    comment !== "" ? " # " + comment : ""
  }`;
}
export function fp2string(ff) {
  const { carrier, source, dest, step, ren, nren, comment } = ff;
  return `${carrier}, ${source}, ${dest}, ${step}, ${ren.toFixed(
    3
  )}, ${nren.toFixed(3)}${comment !== "" ? " # " + comment : ""}`;
}

// Convert components (carrier data with metadata) to string
export function serialize_components(components) {
  const cmetas = components.cmeta.map(meta2string);
  const carriers = components.cdata.map(carrier2string);
  return [...cmetas, ...carriers].join("\n");
}

// epbdjs/cte.js ------------------------------------------
// Localizaciones válidas para CTE
export const CTE_LOCS = ["PENINSULA", "BALEARES", "CANARIAS", "CEUTAMELILLA"];
export const CTE_VALIDDATA = {
  CONSUMO: {
    EPB: [
      "BIOCARBURANTE",
      "BIOMASA",
      "BIOMASADENSIFICADA",
      "CARBON",
      "ELECTRICIDAD",
      "FUELOIL",
      "GASNATURAL",
      "GASOLEO",
      "GLP",
      "MEDIOAMBIENTE",
      "RED1",
      "RED2"
    ],
    NEPB: [
      "BIOCARBURANTE",
      "BIOMASA",
      "BIOMASADENSIFICADA",
      "CARBON",
      "ELECTRICIDAD",
      "FUELOIL",
      "GASNATURAL",
      "GASOLEO",
      "GLP",
      "MEDIOAMBIENTE",
      "RED1",
      "RED2"
    ]
  },
  PRODUCCION: {
    INSITU: ["ELECTRICIDAD", "MEDIOAMBIENTE"],
    COGENERACION: ["ELECTRICIDAD"]
  }
};

export const CTE_VALIDSERVICES = [
  "ACS",
  "CAL",
  "REF",
  "VEN",
  "ILU",
  "HU",
  "DHU",
  "NDEF"
];

// Actualiza objeto de metadatos con nuevo valor de la clave o inserta clave y valor si no existe
export function updatemeta(metaobj, key, value) {
  const match = metaobj.find(c => c.key === key);
  if (match) {
    match.value = value;
  } else {
    metaobj.push(new_meta(key, value));
  }
  return metaobj;
}
