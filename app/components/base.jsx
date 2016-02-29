import React from 'react';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Navigation from './navigation.jsx';

class Base extends React.Component {
    render() {
      return <div>
               <Navigation projectName="react-bootstrap-starter" />
               <div className="container">
                 <PageHeader>{this.props.headertitle}</PageHeader>
                 <div className="page">
                   <p className="lead">Use this document as a way to quickly start any new project.</p>
                   <p>All you get is this text and a mostly barebones HTML document.</p>
                 </div>
                 <input type="range" min="0" max="100" step="1" data-buffer="60" /><p>prueba</p>
               </div>
             </div>;
    }
}

export default Base;
