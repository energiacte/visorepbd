import React from 'react';

import Navigation from 'components/Navigation';
import Footer from 'components/Footer';
import mfomlogo from 'img/logomfom.png';
import ietcclogo from 'img/logoietcccsic.png';

export default React.createClass({

  render() {
    return (
      <div>
        <Navigation projectName="DB-HE NZEB" />
        <div className="container">
          <div className="page-header">
            <h1>Factores de paso CTE DB-HE</h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
});
