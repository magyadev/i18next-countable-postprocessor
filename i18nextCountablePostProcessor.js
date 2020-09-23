(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.i18nextCountablePostProcessor = factory());
}(this, (function () { 'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};













var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};





















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var index = {
  name: 'countable',
  type: 'postProcessor',

  options: {
    variantSeparator: '_',
    countVariableName: 'count'
  },

  setOptions: function setOptions(options) {
    var _this = this;

    Object.keys(options).forEach(function (optionKey) {
      if (typeof _this.options[optionKey] === 'string') {
        _this.options[optionKey] = options[optionKey];
      }
    });
  },


  buildTryKeysList: function buildTryKeysList(_ref) {
    var translationKey = _ref.translationKey,
        variantSeparator = _ref.variantSeparator,
        count = _ref.count;

    var countString = String(count);

    var tryKeys = ['' + translationKey + variantSeparator + countString];

    if (countString.length > 2) {
      tryKeys.push('' + translationKey + variantSeparator + '*' + countString.substr(-3));
    }

    if (countString.length > 1) {
      tryKeys.push('' + translationKey + variantSeparator + '*' + countString.substr(-2));
    }

    tryKeys.push('' + translationKey + variantSeparator + '*' + countString);

    if (count > 1) {
      tryKeys.push('' + translationKey + variantSeparator + 'plural');
    }

    tryKeys.push(translationKey);

    return tryKeys;
  },

  process: function process(value, key, options, translator) {
    var _options$options = _extends({}, this.options, options),
        postProcess = _options$options.postProcess,
        variantSeparator = _options$options.variantSeparator,
        translationKeyword = _options$options.translationKeyword,
        forwardOptions = objectWithoutProperties(_options$options, ['postProcess', 'variantSeparator', 'translationKeyword']);

    var countVariableName = forwardOptions.countVariableName;
    var count = forwardOptions[countVariableName];

    if (typeof count === 'undefined') {
      return value;
    }

    var keys = Array.isArray(key) ? key : [key];
    var tryKeys = [];

    for (var i = 0; i < keys.length; i++) {
      tryKeys = [].concat(toConsumableArray(tryKeys), toConsumableArray(this.buildTryKeysList({ translationKey: keys[i], count: count, variantSeparator: variantSeparator })));
    }

    return translator.translate(tryKeys, forwardOptions) || value;
  }
};

return index;

})));
