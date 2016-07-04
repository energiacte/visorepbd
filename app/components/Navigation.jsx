import React from 'react';

export default class Navigation extends React.Component {

  static defaultProps = { projectName: 'DB-HE NZEB' }

  render() {
    const currpath = this.props.route.path;
    const activeIfCurrent = path => currpath === path ? 'active' : '';
    const urlForPath = path => __EPBDURLPREFIX__ + '/#' + path;

    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href={ urlForPath('/') }>{ this.props.projectName }</a>
            <button className="navbar-toggle" type="button" />
          </div>
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <li className={ activeIfCurrent('/') } role="presentation">
                <a href={ urlForPath('/') }>Inicio</a>
              </li>
              <li className={ activeIfCurrent('/weightingfactors') } role="presentation">
                <a href={ urlForPath('/weightingfactors') }>Factores de paso</a>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li className={ activeIfCurrent('/about') } role="presentation">
                <a href={ urlForPath('/about') }>Créditos</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
