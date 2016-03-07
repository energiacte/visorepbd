import React, { PropTypes } from 'react';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Navigation from 'components/Navigation.jsx';
import { ComponentList, ComponentEdit } from 'components/ComponentList';

class Base extends React.Component {
  render() {
    return (
      <div>
        <Navigation projectName="DB-HE NZEB" />
        <div className="container">
          <PageHeader>{this.props.headertitle}</PageHeader>
          <p className="lead">Energía suministrada y producida:</p>
          <ComponentList state={this.props.state} />
          <ComponentEdit state={this.props.state} />
        </div>
      </div>
    );
  }
}

export default Base;
