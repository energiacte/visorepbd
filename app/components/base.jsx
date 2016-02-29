import uuid from 'node-uuid';
import React from 'react';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Navigation from './navigation.jsx';

class Base extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      notes: [
        {
          id: uuid.v4(),
          task: 'Learn Webpack'
        },
        {
          id: uuid.v4(),
          task: 'Learn React'
        },
        {
          id: uuid.v4(),
          task: 'Do laundry'
        }
      ]
    };
  }

  render() {
    const notes = this.state.notes;

    return <div>
      <Navigation projectName="react-bootstrap-starter" />
      <div className="container">
        <PageHeader>{this.props.headertitle}</PageHeader>
        <div className="page">
          <p className="lead">Use this document as a way to quickly start any new project.</p>
          <p>All you get is this text and a mostly barebones HTML document.</p>
        </div>
        <input type="range" min="0" max="100" step="1" data-buffer="60" /><p>prueba</p>
        <div>
          <button onClick={this.addNote}>+</button>
          <ul>{notes.map(note =>
            <li key={note.id}>{note.task}</li>
            )}</ul>
        </div>
      </div>
    </div>;
  }

  // We are using an experimental feature known as property
  // initializer here. It allows us to bind the method `this`
  // to point at our *App* instance.
  //
  // Alternatively we could `bind` at `constructor` using
  // a line, such as this.addNote = this.addNote.bind(this);
  addNote = () => {
    // It would be possible to write this in an imperative style.
    // I.e., through `this.state.notes.push` and then
    // `this.setState({notes: this.state.notes})` to commit.
    //
    // I tend to favor functional style whenever that makes sense.
    // Even though it might take more code sometimes, I feel
    // the benefits (easy to reason about, no side effects)
    // more than make up for it.
    //
    // Libraries, such as Immutable.js, go a notch further.
    this.setState({
      notes: this.state.notes.concat([{
        id: uuid.v4(),
        task: 'New task'
      }])
    }
      , () => console.log('set state!')
    );
  };
}

export default Base;
