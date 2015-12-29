'use strict';

import React from 'react';
import FileList from './FileList';

export default class FileEntry extends React.Component {
  state = {expanded: false};
  
  onDirectoryClick () {
    this.setState({expanded: !this.state.expanded});
  }

  onFileClick (event) {
    const { path, file } = this.props;
    const directory = file.directory;

    this.dispatchPath(path, directory);

    if (this.props.file.directory) {
      this.onDirectoryClick(event);
    }
  }

  dispatchPath (path, directory) {
    const type = 'path';

    this.props.dispatcher.dispatch({ type, path, directory });
  }

  getDirectoryHtml () {
    return (
      <li>
        {this.getFilenameHtml()}
        <FileList dispatcher={this.props.dispatcher} path={this.props.path} expanded={this.state.expanded} />
      </li>
    );
  }

  getFileHtml () {
    return (
      <li>
        {this.getFilenameHtml()}
      </li>
    );
  }

  getFilenameHtml () {
    return (
      <div>
        <a onClick={this.onFileClick.bind(this)}>{this.props.file.filename}</a>
      </div>
    );
  }

  render () {
    return this.props.file.directory ? this.getDirectoryHtml() : this.getFileHtml();
  }
}
