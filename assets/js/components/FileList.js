'use strict';

import React from 'react';
import FileEntry from './FileEntry';
import { getFiles } from '../dao';

export default class FileList extends React.Component {
  state = {fetched: false, error: null, loading: false, files: []};

  componentDidMount () {
    this.update();
  }

  componentDidUpdate () {
    this.update();
  }

  update () {
    if (this.state.loading) {
      return;
    }
    if (!this.props.expanded && this.state.fetched) {
      this.setState({files: []})
    }
    if (this.props.expanded && !this.state.fetched) {
      this.loadFiles();
    }
  }

  loadFiles () {
    this.setState({loading: true, error: null});
    return getFiles(this.props.path)
      .then(files => this.setState({loading: false, files: files.data, fetched: true}))
      .catch(e => this.setState({error: e.message, loading: false, fetched: true}));
  }

  getFileHtml (file) {
    return (
      <FileEntry
        dispatcher={this.props.dispatcher}
        key={file.filename}
        file={file}
        path={`${this.props.path}/${file.filename}`}
      />
    );
  }

  getFilesHtml () {
    if (this.state.error) {
      return <span style={{color:'red'}}>{this.state.error}</span>;
    }
    if (this.state.loading) {
      return <span>Loading ...</span>;
    }
    return (
      <ul>
        {this.state.files.map(this.getFileHtml.bind(this))}
      </ul>
    );
  }

  render () {
    return this.getFilesHtml();
  }
}
