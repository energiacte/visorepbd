import React from "react";
import { connect } from "react-redux";

import NavBar from "components/NavBar";
import EPChart from "components/EPChart";
import GlobalVarsControl from "components/GlobalVarsControl";
import Footer from "components/Footer";
import DetailsChart from "components/DetailsChart";
import DetailsJSON from "components/DetailsJSON";
import TabList from "components/TabList";

import { selectBalance } from "reducers/reducers";
import EnergyComponentsTable from "./EnergyComponentsTable";

// Página principal de la aplicación
class MainPageClass extends React.Component {
  render() {
    const { kexp, balance } = this.props;

    // Indicadores que se van a representar ------------------
    let data = {};
    if (balance.ep && balance.ep_acs_nrb) {
      // Energía primaria
      const { ren, nren, co2 } = balance.ep.balance_m2.B;
      // Cálculo para ACS en perímetro próximo
      const { ren: ren_acs, nren: nren_acs } = balance.ep_acs_nrb.balance_m2.B;
      // Datos agrupados
      data = { kexp, ren, nren, co2, ren_acs, nren_acs };
    }

    return (
      <div>
        <NavBar match={this.props.match} />
        <GlobalVarsControl />

        <div className="container-fluid">
          {/* Gráfica de resultados */}
          <div className="row">
            <div className="col">
              <EPChart {...data} />
            </div>
          </div>
          {/* Errores */}
          {balance.error ? <h1>Ha habido un error!: {balance.error}</h1> : null}
        </div>
        <div className="container-fluid">
          <TabList>
            {/* Desglose de resultados */}
            <div label="Desglose por servicios" className="tab-content">
              <DetailsChart balance={balance.ep} />
            </div>
            {/* Tabla de componentes energéticos */}
            <div label="Componentes energéticos" className="tab-content">
              <EnergyComponentsTable />
            </div>
            {/* Detalle en JSON */}
            <div label="Detalle de balance en JSON" className="tab-content">
              <DetailsJSON balance={balance}/>
            </div>
          </TabList>
        </div>
        <Footer />
      </div>
    );
  }
}

const MainPage = connect(state => ({
  kexp: state.kexp,
  balance: selectBalance(state)
}))(MainPageClass);

export default MainPage;
