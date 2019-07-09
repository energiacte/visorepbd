import React from 'react';
import { Link } from 'react-router-dom';

export default class NavBar extends React.Component {

  static defaultProps = { projectName: 'VisorEPBD' }

  render() {
    const currpath = this.props.match.path;
    const activeIfCurrent = path => currpath === path ? 'active' : '';

    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <Link className="navbar-brand" to="/">{ this.props.projectName }</Link>
            <button className="navbar-toggle" type="button" />
          </div>
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <li className={ activeIfCurrent('/') } role="presentation">
                <Link className="nav-link" to="/"><span className="fa fa-home" aria-hidden="true"/> Inicio</Link>
              </li>
              <li className={ activeIfCurrent('/weightingfactors') } role="presentation">
                <Link className="nav-link" to="/weightingfactors"><span className="fa fa-exchange" aria-hidden="true"/> Factores de paso</Link>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li className={ activeIfCurrent('/help') } role="presentation">
                <Link className="nav-link" to="/help"><span className="fa fa-info-circle" aria-hidden="true"/> Ayuda</Link>
              </li>
              <li className={ activeIfCurrent('/about') } role="presentation">
                <Link className="nav-link" to="/about"><span className="fa fa-question-circle" aria-hidden="true"/> Créditos</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
