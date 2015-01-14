var rendering = require('./rendering');
var VText = require("virtual-dom/vnode/vtext.js")
var domComponent = require('./domComponent');

function ComponentWidget(handlers, vdom) {
  this.handlers = handlers;
  if (typeof vdom === 'function') {
    this.render = vdom;
  } else {
    vdom = vdom || new VText('');
    this.render = function () {
      return vdom;
    }
  }
  this.component = domComponent();
  this.renderFinished = rendering.renderFinished;
}

ComponentWidget.prototype.type = 'Widget';

ComponentWidget.prototype.init = function () {
  var self = this;
  var element = this.component.create(this.render());

  if (self.handlers.onadd) {
    this.renderFinished.then(function () {
      self.handlers.onadd(element);
    });
  }

  return element;
};

ComponentWidget.prototype.update = function (previous) {
  var self = this;

  if (self.handlers.onupdate) {
    this.renderFinished.then(function () {
      self.handlers.onupdate(self.component.element);
    });
  }

  this.component = previous.component;
  return this.component.update(this.render());
};

ComponentWidget.prototype.destroy = function (element) {
  var self = this;

  if (self.handlers.onremove) {
    this.renderFinished.then(function () {
      self.handlers.onremove(element);
    });
  }
};

module.exports = function (handlers, vdom) {
  if (typeof handlers === 'function') {
    return new ComponentWidget({}, handlers);
  } else {
    return new ComponentWidget(handlers, vdom);
  }
};

module.exports.ComponentWidget = ComponentWidget;
