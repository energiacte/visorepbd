import uuid from 'node-uuid';
import React from 'react';

import Component from './Component.jsx';

export default ({components}) => {
  return (
    <div>
      <ul>{components.map(component =>
        <li key={component.id}>
          <Component type={component.type}
                     originoruse={component.originoruse}
                     vector={component.vector}
                     values={component.values} />
        </li>
        )}</ul>
    </div>
  );
}
