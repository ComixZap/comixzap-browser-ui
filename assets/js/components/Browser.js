'use strict';

import React from 'react';
import FileList from './FileList';

export default class Browser extends React.Component {

  render () {
    const { dispatcher, appState } = this.props;
    return (
      <div className="browser">
        <FileList className="browser" appState={ appState } dispatcher={ dispatcher } path="" expanded={true} />
      </div>
    );
  }
}
