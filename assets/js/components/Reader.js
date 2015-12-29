'use strict';

import React from 'react';
import Browser from './Browser';
import Pages from './Pages';
import Viewer from './Viewer';

export default class Reader extends React.Component {

  generateComponent (ComponentClass) {
    const { dispatcher, appState } = this.props;

    return (
      <ComponentClass dispatcher={ dispatcher } appState={ appState } />
    );
  }
  render () {
    return (
      <div className="reader">
        
      </div>
    );
  }
}
