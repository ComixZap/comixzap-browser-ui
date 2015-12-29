'use strict';

import React from 'react';
import { Dispatcher } from 'flux';
import { createHashHistory } from 'history';
import masterReducer from '../actions/masterReducer';
import Reader from './Reader';

class Application extends React.Component {
  state = {dispatcher: new Dispatcher(), history: createHashHistory({ queryKey: false }), appState: {}};

  getReaderHtml () {
    const { dispatcher, appState } = this.state;

    return (
      <Reader dispatcher={ dispatcher } appState={ appState } />
    );
  }

  componentWillMount () {
    const { dispatcher } = this.state;

    dispatcher.register(payload => {

    });
  }

  componentDidMount () {
    const { history } = this.state;
    this.listener = history.listen(location => {
      console.log(location)
    });
  }

  render () {
    return this.getReaderHtml();
  }
};

export default Application;
