use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use cteepbd::{self, cte, Balance, Components, Factors, RenNrenCo2, VERSION};

#[wasm_bindgen]
pub fn get_version() -> String {
    return VERSION.to_string();
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
    let comps: Components = cte::parse_components(datastring).map_err(|e| e.to_string())?;
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
    let defaults_wf = cte::WF_RITE2014;
    let rsoptions: WFactorsUserOptions = options.into_serde().map_err(|e| e.to_string())?;
    let red1 = rsoptions
        .red
        .and_then(|v| v.RED1)
        .or(Some(defaults_wf.user.red1));
    let red2 = rsoptions
        .red
        .and_then(|v| v.RED2)
        .or(Some(defaults_wf.user.red2));
    let cogen_to_grid = rsoptions.cogen.and_then(|v| v.A_RED).or(None);
    let cogen_to_nepb = rsoptions.cogen.and_then(|v| v.A_NEPB).or(None);
    let user_wf = cte::CteUserWF {
        red1,
        red2,
        cogen_to_grid,
        cogen_to_nepb,
    };
    // XXX: Puede tener errores de parsing o de localidad
    let fp: Factors =
        cte::wfactors_from_loc(loc, &user_wf, &defaults_wf).map_err(|e| e.to_string())?;
    let jsfactors = JsValue::from_serde(&fp).map_err(|e| e.to_string())?;
    Ok(jsfactors)
}

// Calcula eficiencia energética
#[wasm_bindgen]
pub fn energy_performance(
    components: &JsValue,
    wfactors: &JsValue,
    kexp: f32,
    area: f32,
) -> Result<JsValue, JsValue> {
    let comps: Components = components.into_serde().map_err(|e| e.to_string())?;
    let wfacs: Factors = wfactors.into_serde().map_err(|e| e.to_string())?;
    let balance: Balance =
        cteepbd::energy_performance(&comps, &wfacs, kexp, area).map_err(|e| e.to_string())?;
    let jsbalance = JsValue::from_serde(&balance).map_err(|e| e.to_string())?;
    Ok(jsbalance)
}

// Calcula eficiencia energética para el perímetro próximo y servicio de ACS
#[wasm_bindgen]
pub fn energy_performance_acs_nrb(
    components: &JsValue,
    wfactors: &JsValue,
    kexp: f32,
    area: f32,
) -> Result<JsValue, JsValue> {
    let comps: Components = components.into_serde().map_err(|e| e.to_string())?;
    let wfacs: Factors = wfactors.into_serde().map_err(|e| e.to_string())?;

    // componentes para ACS
    let comps_acs = cte::components_by_service(&comps, cteepbd::Service::ACS);
    let wfacs_nrb = cte::wfactors_to_nearby(&wfacs);
    let balance: Balance = cteepbd::energy_performance(&comps_acs, &wfacs_nrb, kexp, area).unwrap();
    let jsbalance = JsValue::from_serde(&balance).map_err(|e| e.to_string())?;
    Ok(jsbalance)
}
