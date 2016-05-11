import React from 'react';

class Navigation extends React.Component {

  static contextTypes = {
    store: React.PropTypes.object
  }

  render() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href={ __EPBDURLPREFIX__ + '/#/' }>{ this.props.projectName }</a>
            <button className="navbar-toggle" type="button" />
          </div>
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <li className="active" role="presentation">
                <a href={ __EPBDURLPREFIX__ + '/#/' }>Inicio</a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li role="presentation"><a href={ __EPBDURLPREFIX__ + '/#/about' }>Créditos</a></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navigation;

