"use strict";
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise(executor) {
  if (typeof executor !== "function") {
    throw new TypeError("Promise resolver executor is not a function");
  }

  this._state = "pending";
  this._value = undefined;
  this._handlerGroups = [];

  executor(this._internalResolve.bind(this), this._internalReject.bind(this));
}

$Promise.prototype._internalResolve = function (value) {
  if (this._state === "pending") {
    this._state = "fulfilled";
    this._value = value;
    this._callHandlers();
  }
};

$Promise.prototype._internalReject = function (reason) {
  if (this._state === "pending") {
    this._state = "rejected";
    this._value = reason;
    this._callHandlers();
  }
};

$Promise.prototype.then = function (successCb, errorCb) {
  if (typeof successCb !== "function") {
    successCb = false;
  }
  if (typeof errorCb !== "function") {
    errorCb = false;
  }
  const downstreamPromise = new $Promise(() => {});
  this._handlerGroups.push({ successCb, errorCb, downstreamPromise });
  if (this._state !== "pending") {
    this._callHandlers();
  }
  return downstreamPromise;
};

$Promise.prototype._callHandlers = function () {
  while (this._handlerGroups.length) {
    let current = this._handlerGroups.shift();
    if (this._state === "fulfilled") {
      if (!current.successCb) {
        current.downstreamPromise._internalResolve(this._value);
      } else {
        try {
          const result = current.successCb(this._value);
          if (result instanceof $Promise) {
            return result.then(
              (value) => current.downstreamPromise._internalResolve(value),
              (error) => current.downstreamPromise._internalReject(error)
            );
          } else {
            current.downstreamPromise._internalResolve(result);
          }
        } catch (err) {
            current.downstreamPromise._internalReject(err);
        }
      }
      
    } else if (this._state === "rejected") {
      if (!current.errorCb) {
        current.downstreamPromise._internalReject(this._value);
      } else {
        try {
          const result = current.errorCb(this._value);
            if (result instanceof $Promise) {
                return result.then(
                    (value) => current.downstreamPromise._internalResolve(value),
                    (error) => current.downstreamPromise._internalReject(error)
                );
                } else {
                    current.downstreamPromise._internalResolve(result);
                }
        } catch (err) {
            current.downstreamPromise._internalReject(err);
        }
      }
      
    }
  }
};

$Promise.prototype.catch = function (errorCb) {
  return this.then(null, errorCb);
};

/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
