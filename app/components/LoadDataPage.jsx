import React from "react";
import { connect } from "react-redux";
import { loadEnergyComponents } from "actions/actions.js";
import { selectErrors } from "reducers/reducers";

// http://pressbin.com/tools/urlencode_urldecode/
// ejemplo: localhost:8080/#/load/%23META Name%3A N_R09_unif%0A%23META Datetime%3A 23%2F08%2F2017 09%3A56%0A%23META Weather_file%3A C1_peninsula%0A%23META PaqueteSistemas%3A S3T1F1%0A%23META CTE_AREAREF%3A 400.0%0A%23META CTE_KEXP%3A 0%0A%23META CTE_LOCALIZACION%3A PENINSULA%0A%23META CTE_COGEN%3A 0%2C 2.5%2C 0.3%0A%23META CTE_RED1%3A 0%2C 1.3%2C 0.3%0A%23META CTE_RED2%3A 0%2C 1.3%2C 0.3%0AELECTRICIDAD%2C PRODUCCION%2C INSITU%2C NDEF%2C 34.21%2C 41.94%2C 64.94%2C 73.88%2C 88.44%2C 88.64%2C 91.04%2C 76.15%2C 52.84%2C 39.26%2C 27.43%2C 26.26 %23 Paneles solares fotovoltaicos 5m2 (5kWp)%0AMEDIOAMBIENTE%2C PRODUCCION%2C INSITU%2C ACS%2C 41.05%2C 50.33%2C 77.92%2C 88.66%2C 106.13%2C 106.36%2C 109.25%2C 91.38%2C 63.40%2C 47.11%2C 32.92%2C 31.51 %23 Paneles solares térmicos 2m2%2C n%3D0.30%0AMEDIOAMBIENTE%2C CONSUMO%2C EPB%2C ACS%2C 41.05%2C 50.33%2C 77.92%2C 88.66%2C 106.13%2C 106.36%2C 109.25%2C 91.38%2C 63.40%2C 47.11%2C 32.92%2C 31.51 %23 ACS%2C Paneles solares térmicos 2m2%2C n%3D0.30%0AELECTRICIDAD%2C CONSUMO%2C EPB%2C ACS%2C 53.94%2C 49.74%2C 47.57%2C 42.69%2C 24.37%2C 34.64%2C 33.33%2C 31.08%2C 54.17%2C 61.58%2C 57.66%2C 68.67 %23 ACS%2C BdC ind. aire-agua n_gen%3D2.5 n_d%2Be%2Bc%3D0.88%0AMEDIOAMBIENTE%2C CONSUMO%2C EPB%2C ACS%2C 80.92%2C 74.61%2C 71.36%2C 64.04%2C 36.56%2C 51.97%2C 50.00%2C 46.62%2C 81.26%2C 92.36%2C 86.48%2C 103.00 %23 ACS%2C BdC ind. aire-agua n_gen%3D2.5 n_d%2Be%2Bc%3D0.88%0AELECTRICIDAD%2C CONSUMO%2C EPB%2C CAL%2C 269.05%2C 167.46%2C 87.63%2C 18.85%2C 12.93%2C 0.00%2C 0.00%2C 0.00%2C 0.00%2C 6.19%2C 60.04%2C 240.41 %23 CALEFACCIÓN%2C BdC ind. aire-agua n_gen%3D3.0 n_d%2Be%2Bc%3D0.95%0AMEDIOAMBIENTE%2C CONSUMO%2C EPB%2C CAL%2C 538.10%2C 334.93%2C 175.26%2C 37.69%2C 25.85%2C 0.00%2C 0.00%2C 0.00%2C 0.00%2C 12.37%2C 120.08%2C 480.83 %23 CALEFACCIÓN%2C BdC ind. aire-agua n_gen%3D3.0 n_d%2Be%2Bc%3D0.95%0AELECTRICIDAD%2C CONSUMO%2C EPB%2C REF%2C 0.00%2C 0.00%2C 0.00%2C 0.00%2C 0.00%2C 2.04%2C 23.34%2C 13.02%2C 17.72%2C 0.00%2C 0.00%2C 0.00 %23 REFRIGERACIÓN%2C BdC ind. aire-agua n_gen%3D2.5 n_d%2Be%2Bc%3D0.95%0AELECTRICIDAD%2C CONSUMO%2C EPB%2C VEN%2C 98.74%2C 89.18%2C 98.74%2C 95.55%2C 98.74%2C 95.55%2C 98.74%2C 98.74%2C 95.55%2C 98.74%2C 95.55%2C 98.74 %23 VENTILACIÓN

// Carga de datos a través de una query
// Usa la ruta app/loadData/?data=URIENCODEDDATA
class LoadDataPageClass extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { loadComponents, match } = this.props;

    // Leer parámetros de la ruta
    const {
      params: { epbddata },
    } = match;

    let data;

    try {
      data = decodeURIComponent(epbddata);
      // console.log("Datos decodificados: ", data);
    } catch (e) {
      // console.error("Error al decodificar: ", epbddata);
      data = "";
    }
    loadComponents(data);
    this.props.history.push("/");
  }

  // Dummy render
  render() {
    return null;
  }
}

const LoadDataPage = connect(
  (state) => ({
    errors: selectErrors(state),
  }),
  (dispatch) => ({
    loadComponents: (datastr) => dispatch(loadEnergyComponents(datastr)),
  })
)(LoadDataPageClass);

export default LoadDataPage;
