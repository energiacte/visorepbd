import React from 'react';
import { Link } from 'react-router';

export default class NavBar extends React.Component {

  static defaultProps = { projectName: 'VisorEPBD' }

  render() {
    const currpath = this.props.route.path;
    const activeIfCurrent = path => currpath === path ? 'active' : '';

    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <Link className="navbar-brand" to='/'>{ this.props.projectName }</Link>
            <button className="navbar-toggle" type="button" />
          </div>
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <li className={ activeIfCurrent('/') } role="presentation">
                <Link to='/'><span className="glyphicon glyphicon-home" aria-hidden="true"></span> Inicio</Link>
              </li>
              <li className={ activeIfCurrent('/weightingfactors') } role="presentation">
                <Link to='/weightingfactors'>Factores de paso</Link>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li className={ activeIfCurrent('/help') } role="presentation">
                <Link to='/help'><span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Ayuda</Link>
              </li>
              <li className={ activeIfCurrent('/about') } role="presentation">
                <Link to='/about'><span className="glyphicon glyphicon-question-sign" aria-hidden="true"></span> Créditos</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
