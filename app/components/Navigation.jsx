import React from 'react';

class Navigation extends React.Component {

  render() {
    const currpath = this.props.route.path;
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href={ __EPBDURLPREFIX__ + '/#/' }>{ this.props.projectName }</a>
            <button className="navbar-toggle" type="button" />
          </div>
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <li className={ currpath === '/'?"active":"" } role="presentation">
                <a href={ __EPBDURLPREFIX__ + '/#/' }>Inicio</a>
              </li>
              <li className={ currpath === '/weightingfactors'?"active":"" } role="presentation">
                <a href={ __EPBDURLPREFIX__ + '/#/weightingfactors' }>Factores de paso</a>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li className={ currpath === '/about'?"active":"" } role="presentation">
                <a href={ __EPBDURLPREFIX__ + '/#/about' }>Créditos</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navigation;

