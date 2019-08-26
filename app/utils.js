// Localizaciones válidas
export const CTE_VALID_LOCS = [
  "PENINSULA",
  "BALEARES",
  "CANARIAS",
  "CEUTAMELILLA"
];

// Actualiza o crea un metadato a partir de clave y valor
export const upsertmeta = (meta, key, value) => {
  const match = meta.find(c => c.key === key);
  if (match) {
    match.value = `${value}`;
  } else {
    meta.push({ key, value: `${value}` });
  }
  return meta;
};

export function location_from_meta(meta) {
  const m_location = meta.find(c => c.key === "CTE_LOCALIZACION");
  return m_location && CTE_VALID_LOCS.includes(m_location.value)
    ? m_location.value
    : CTE_VALID_LOCS[0];
}

// Serialize energy components (carrier data with metadata) to string
export function serialize_components(wfactors, cmeta, cdata) {
  // Actualiza metadatos de componentes a partir de factores de paso de usuario
  const red1 = wfactors.wdata.find(f => f.carrier === "RED1");
  const red2 = wfactors.wdata.find(f => f.carrier === "RED2");
  const cog = wfactors.wdata.find(
    f => f.source === "COGENERACION" && f.dest === "A_RED" && f.step === "A"
  );
  const cognepb =
    wfactors.wdata.find(
      f => f.source === "COGENERACION" && f.dest === "A_NEPB" && f.step === "A"
    ) || cog;

  // Actualiza factores en metadatos de componentes
  if (red1) {
    upsertmeta(
      cmeta,
      "CTE_RED1",
      `${red1.ren.toFixed(3)}, ${red1.nren.toFixed(3)}, ${red1.co2.toFixed(3)}`
    );
  }

  if (red2) {
    upsertmeta(
      cmeta,
      "CTE_RED2",
      `${red2.ren.toFixed(3)}, ${red2.nren.toFixed(3)}, ${red2.co2.toFixed(3)}`
    );
  }

  if (cog) {
    upsertmeta(
      cmeta,
      "CTE_COGEN",
      `${cog.ren.toFixed(3)}, ${cog.nren.toFixed(3)}, ${cog.co2.toFixed(3)}`
    );
  }

  if (cognepb) {
    upsertmeta(
      cmeta,
      "CTE_COGENNEPB",
      `${cognepb.ren.toFixed(3)}, ${cognepb.nren.toFixed(
        3
      )}, ${cognepb.co2.toFixed(3)}`
    );
  }

  // Serializar metadatos
  let cmetalines = cmeta.map(mm => `#META ${mm.key}: ${mm.value}`);

  // Serializar componentes energéticos
  const cdatalines = cdata
    .filter(e => e.active)
    .map(
      cc =>
        `${cc.carrier}, ${cc.ctype}, ${cc.csubtype}, ${
          cc.service
        }, ${cc.values.map(v => v.toFixed(2)).join(",")}${
          cc.comment !== "" ? " # " + cc.comment : ""
        }`
    );
  return [...cmetalines, ...cdatalines].join("\n");
}

export function userfactors_from_cmeta(wmeta) {
  const red1 = wmeta.find(c => c.key === "CTE_RED1");
  const red2 = wmeta.find(c => c.key === "CTE_RED2");
  const cog = wmeta.find(c => c.key === "CTE_COGEN");
  const cognepb = wmeta.find(c => c.key === "CTE_COGENNEPB");

  let userfactors = {
    cogen: {},
    red: {}
  };

  if (red1) {
    const v = red1.value.split(",").map(Number);
    if (v.length == 3) {
      userfactors.red = {
        ...userfactors.red,
        RED1: { ren: v[0], nren: v[1], co2: v[2] }
      };
    }
  }

  if (red2) {
    const v = red2.value.split(",").map(Number);
    if (v.length == 3) {
      userfactors.red = {
        ...userfactors.red,
        RED2: { ren: v[0], nren: v[1], co2: v[2] }
      };
    }
  }

  if (cog) {
    const v = cog.value.split(",").map(Number);
    let vn;
    if (cognepb) {
      vn = cognepb.value.split(",").map(Number);
    } else {
      vn = v;
    }
    if (v.length == 3) {
      userfactors.cogen = {
        A_RED: { ren: v[0], nren: v[1], co2: v[2] },
        A_NEPB: { ren: vn[0], nren: vn[1], co2: vn[2] }
      };
    }
  }
  return userfactors;
}

// Genera factores de usuario a partir de factores definidos en datos de wfactors
export function userfactors_from_wdata(wdata) {
  // Conserva factores de usuario actuales
  // TODO: ¿pueden no existir y estar indefinidos?
  const red1 = wdata.find(f => f.carrier === "RED1");
  const red2 = wdata.find(f => f.carrier === "RED2");
  const cog = wdata.find(
    f => f.source === "COGENERACION" && f.dest === "A_RED" && f.step === "A"
  );
  const cognepb = wdata.find(
    f => f.source === "COGENERACION" && f.dest === "A_NEPB" && f.step === "A"
  );

  // Regenera factores de localización
  const userfactors = {
    cogen: {
      A_RED: cog ? { ren: cog.ren, nren: cog.nren, co2: cog.co2 } : {},
      A_NEPB: cognepb
        ? { ren: cognepb.ren, nren: cognepb.nren, co2: cognepb.co2 }
        : {}
    },
    red: {
      RED1: red1 ? { ren: red1.ren, nren: red1.nren, co2: red1.co2 } : {},
      RED2: red2 ? { ren: red2.ren, nren: red2.nren, co2: red2.co2 } : {}
    }
  };
  return userfactors;
}
