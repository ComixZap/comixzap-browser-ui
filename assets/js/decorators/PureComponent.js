'use strict';

export default (target) => {
  target.prototype.dispatchAction = function (payload) {
    this.props.dispatcher.dispatch(payload);
  };

  target.prototype.componentShouldUpdate = function () {
    
  };
}
