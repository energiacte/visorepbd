use cteepbd::{self, cte, types::RenNrenCo2, Balance, Components, Factors, VERSION};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn get_version() -> String {
    VERSION.to_string()
}

#[wasm_bindgen]
pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

// Convierte cadena a componentes
#[wasm_bindgen]
pub fn parse_components(datastring: &str) -> Result<JsValue, JsValue> {
    let comps: Components = datastring
        .parse::<Components>()
        .map_err(|e| e.to_string())?;
    let jscomps = JsValue::from_serde(&comps).map_err(|e| e.to_string())?;
    Ok(jscomps)
}

// Estructuras para gestión de factores de usuario
#[allow(non_snake_case)]
#[derive(Copy, Clone, Debug, Serialize, Deserialize)]
struct WFactorsCogenUserOptions {
    A_RED: Option<RenNrenCo2>,
    A_NEPB: Option<RenNrenCo2>,
}

#[allow(non_snake_case)]
#[derive(Copy, Clone, Debug, Serialize, Deserialize)]
struct WFactorsRedUserOptions {
    RED1: Option<RenNrenCo2>,
    RED2: Option<RenNrenCo2>,
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize)]
struct WFactorsUserOptions {
    cogen: Option<WFactorsCogenUserOptions>,
    red: Option<WFactorsRedUserOptions>,
    // strip_nepb: Option<bool>,
}

// Obtén factores a partir de la localización y los factores de usuario
//
// El campo de opciones tiene que ser al menos {}
#[wasm_bindgen]
pub fn new_wfactors(loc: &str, options: &JsValue) -> Result<JsValue, JsValue> {
    let defaults_wf = cte::CTE_USERWF;
    let rsoptions: WFactorsUserOptions = options.into_serde().map_err(|e| e.to_string())?;
    let red1 = rsoptions
        .red
        .and_then(|v| v.RED1)
        .or(Some(defaults_wf.red1));
    let red2 = rsoptions
        .red
        .and_then(|v| v.RED2)
        .or(Some(defaults_wf.red2));
    let cogen_to_grid = rsoptions.cogen.and_then(|v| v.A_RED).or(None);
    let cogen_to_nepb = rsoptions.cogen.and_then(|v| v.A_NEPB).or(None);
    let user_wf = cteepbd::UserWF {
        red1,
        red2,
        cogen_to_grid,
        cogen_to_nepb,
    };
    // Puede tener errores de parsing o de localidad
    let fp: Factors = cte::wfactors_from_loc(loc, &cte::CTE_LOCWF_RITE2014, user_wf, defaults_wf)
        .map_err(|e| e.to_string())?;
    let jsfactors = JsValue::from_serde(&fp).map_err(|e| e.to_string())?;
    Ok(jsfactors)
}

/// Calcula eficiencia energética
///
/// Calcula también la demanda renovable de ACS si es posible y agrega los datos al balance.
/// Si no se puede calcular esta demanda renovable balance.misc es un valor nulo (null en JS, None en Rust)
/// Si se puede agregar, se añade:
/// - balance.misc.demanda_anual_acs: demanda anual de ACS en kWh/a
/// - balance.misc.porcentaje_renovable_demanda_acs_nrb: fracción renovable de la demanda de ACS (kWh/kWh)
#[wasm_bindgen]
pub fn energy_performance(
    components: &JsValue,
    wfactors: &JsValue,
    kexp: f32,
    area: f32,
    dhw_needs: Option<f32>,
) -> Result<JsValue, JsValue> {
    let comps: Components = components.into_serde().map_err(|e| e.to_string())?;
    let wfacs: Factors = wfactors.into_serde().map_err(|e| e.to_string())?;
    let balance: Balance = cteepbd::energy_performance(&comps, &wfacs, kexp, area)
        .map(|b| cte::incorpora_demanda_renovable_acs_nrb(b, dhw_needs))
        .map_err(|e| e.to_string())?;
    let jsbalance = JsValue::from_serde(&balance).map_err(|e| e.to_string())?;
    Ok(jsbalance)
}
