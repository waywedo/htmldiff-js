module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(2);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/classCallCheck.js
var classCallCheck = __webpack_require__(0);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/createClass.js
var createClass = __webpack_require__(1);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass);

// CONCATENATED MODULE: ./src/Action.js
var Action = {
  equal: 0,
  delete: 1,
  insert: 2,
  none: 3,
  replace: 4
};
/* harmony default export */ var src_Action = (Action);
// CONCATENATED MODULE: ./src/Match.js



var Match_Match = function () {
  function Match(startInOld, startInNew, size) {
    classCallCheck_default()(this, Match);

    this.startInOld = startInOld;
    this.startInNew = startInNew;
    this.size = size;
  }

  createClass_default()(Match, [{
    key: "endInOld",
    get: function get() {
      return this.startInOld + this.size;
    }
  }, {
    key: "endInNew",
    get: function get() {
      return this.startInNew + this.size;
    }
  }]);

  return Match;
}();


;
// CONCATENATED MODULE: ./src/Utils.js
var tagRegex = /^\s*<\/?[^>]+>\s*$/;
var tagWordRegex = /<[^\s>]+/;
var whitespaceRegex = /^(\s|&nbsp;)+$/;
var wordRegex = /[\w#@]+/;
var specialCaseWordTags = ["<img", "<iframe", "</iframe"];

function isTag(item) {
  if (specialCaseWordTags.some(function (tag) {
    return item !== null && item.indexOf(tag) === 0;
  })) {
    return false;
  }

  return tagRegex.test(item);
}

function stripTagAttributes(word) {
  var tag = tagWordRegex.exec(word)[0];
  word = tag + (word.indexOf("/>", word.length - 2) !== -1 ? "/>" : ">");
  return word;
}

function wrapText(text, tagName, cssClass) {
  return "<".concat(tagName, " class=\"").concat(cssClass, "\">").concat(text, "</").concat(tagName, ">");
}

function isStartOfTag(val) {
  return val === "<";
}

function isEndOfTag(val) {
  return val === ">";
}

function isStartOfEntity(val) {
  return val === "&";
}

function isEndOfEntity(val) {
  return val === ";";
}

function isWhiteSpace(value) {
  return whitespaceRegex.test(value);
}

function stripAnyAttributes(word) {
  if (isTag(word)) {
    return stripTagAttributes(word);
  }

  return word;
}

function isWord(text) {
  return wordRegex.test(text);
}


// CONCATENATED MODULE: ./src/MatchFinder.js





function putNewWord(block, word, blockSize) {
  block.push(word);

  if (block.length > blockSize) {
    block.shift();
  }

  if (block.length !== blockSize) {
    return null;
  }

  return block.join("");
}

var MatchFinder_MatchFinder = function () {
  function MatchFinder(oldWords, newWords, startInOld, endInOld, startInNew, endInNew, options) {
    classCallCheck_default()(this, MatchFinder);

    this.oldWords = oldWords;
    this.newWords = newWords;
    this.startInOld = startInOld;
    this.endInOld = endInOld;
    this.startInNew = startInNew;
    this.endInNew = endInNew;
    this.options = options;
  }

  createClass_default()(MatchFinder, [{
    key: "indexNewWords",
    value: function indexNewWords() {
      this.wordIndices = new Map();
      var block = [];

      for (var i = this.startInNew; i < this.endInNew; i++) {
        var word = this.normalizeForIndex(this.newWords[i]);
        var key = putNewWord(block, word, this.options.blockSize);

        if (key === null) {
          continue;
        }

        if (this.wordIndices.has(key)) {
          this.wordIndices.get(key).push(i);
        } else {
          this.wordIndices.set(key, [i]);
        }
      }
    }
  }, {
    key: "normalizeForIndex",
    value: function normalizeForIndex(word) {
      word = stripAnyAttributes(word);

      if (this.options.IgnoreWhiteSpaceDifferences && isWhiteSpace(word)) {
        return " ";
      }

      return word;
    }
  }, {
    key: "findMatch",
    value: function findMatch() {
      var _this = this;

      this.indexNewWords();
      this.removeRepeatingWords();

      if (this.wordIndices.length === 0) {
        return null;
      }

      var bestMatchInOld = this.startInOld;
      var bestMatchInNew = this.startInNew;
      var bestMatchSize = 0;
      var matchLengthAt = new Map();
      var blockSize = this.options.blockSize;
      var block = [];

      var _loop = function _loop(indexInOld) {
        var word = _this.normalizeForIndex(_this.oldWords[indexInOld]);

        var index = putNewWord(block, word, blockSize);

        if (index === null) {
          return "continue";
        }

        var newMatchLengthAt = new Map();

        if (!_this.wordIndices.has(index)) {
          matchLengthAt = newMatchLengthAt;
          return "continue";
        }

        var wordIndex = _this.wordIndices.get(index);

        wordIndex.forEach(function (indexInNew) {
          var newMatchLength = (matchLengthAt.has(indexInNew - 1) ? matchLengthAt.get(indexInNew - 1) : 0) + 1;
          newMatchLengthAt.set(indexInNew, newMatchLength);

          if (newMatchLength > bestMatchSize) {
            bestMatchInOld = indexInOld - newMatchLength - blockSize + 2;
            bestMatchInNew = indexInNew - newMatchLength - blockSize + 2;
            bestMatchSize = newMatchLength;
          }
        });
        matchLengthAt = newMatchLengthAt;
      };

      for (var indexInOld = this.startInOld; indexInOld < this.endInOld; indexInOld++) {
        var _ret = _loop(indexInOld);

        if (_ret === "continue") continue;
      }

      return bestMatchSize !== 0 ? new Match_Match(bestMatchInOld, bestMatchInNew, bestMatchSize + blockSize - 1) : null;
    }
  }, {
    key: "removeRepeatingWords",
    value: function removeRepeatingWords() {
      var _this2 = this;

      var threshold = this.newWords.length + this.options.repeatingWordsAccuracy;
      var repeatingWords = [];
      this.wordIndices.forEach(function (value, key) {
        if (value.length > threshold) {
          repeatingWords.push(key);
        }
      });
      repeatingWords.forEach(function (w) {
        _this2.wordIndices.delete(w);
      });
    }
  }]);

  return MatchFinder;
}();


// CONCATENATED MODULE: ./src/Operation.js


var Operation_Operation = function Operation(action, startInOld, endInOld, startInNew, endInNew) {
  classCallCheck_default()(this, Operation);

  this.action = action;
  this.startInOld = startInOld;
  this.endInOld = endInOld;
  this.startInNew = startInNew;
  this.endInNew = endInNew;
};


// CONCATENATED MODULE: ./src/MatchOptions.js


var MatchOptions_MatchOptions = function MatchOptions() {
  classCallCheck_default()(this, MatchOptions);

  this.blockSize = 0;
  this.repeatingWordsAccuracy = 0.0;
  this.ignoreWhitespaceDifferences = false;
};


// CONCATENATED MODULE: ./src/Mode.js
var Mode = {
  character: 0,
  tag: 1,
  whitespace: 2,
  entity: 3
};
/* harmony default export */ var src_Mode = (Mode);
// CONCATENATED MODULE: ./src/WordSplitter.js



function convertHtmlToListOfWords(text, blockExpressions) {
  var state = {
    mode: src_Mode.character,
    currentWord: [],
    words: []
  };
  var blockLocations = findBlocks(text, blockExpressions);
  var isBlockCheckRequired = !!blockLocations.size;
  var isGrouping = false;
  var groupingUntil = -1;

  for (var i = 0; i < text.length; i++) {
    var character = text[i];

    if (isBlockCheckRequired) {
      if (groupingUntil === i) {
        groupingUntil = -1;
        isGrouping = false;
      }

      var until = 0;

      if (blockLocations.has(i)) {
        until = blockLocations.get(i);
        isGrouping = true;
        groupingUntil = until;
      }

      if (isGrouping) {
        state.currentWord.push(character);
        state.mode = src_Mode.character;
        continue;
      }
    }

    switch (state.mode) {
      case src_Mode.character:
        if (isStartOfTag(character)) {
          addClearWordSwitchMode(state, "<", src_Mode.tag);
        } else if (isStartOfEntity(character)) {
          addClearWordSwitchMode(state, character, src_Mode.entity);
        } else if (isWhiteSpace(character)) {
          addClearWordSwitchMode(state, character, src_Mode.whitespace);
        } else if (isWord(character) && (state.currentWord.length === 0 || isWord(state.currentWord[state.currentWord.length - 1]))) {
          state.currentWord.push(character);
        } else {
          addClearWordSwitchMode(state, character, src_Mode.character);
        }

        break;

      case src_Mode.tag:
        if (isEndOfTag(character)) {
          state.currentWord.push(character);
          state.words.push(state.currentWord.join(""));
          state.currentWord = [];
          state.mode = isWhiteSpace(character) ? src_Mode.whitespace : src_Mode.character;
        } else {
          state.currentWord.push(character);
        }

        break;

      case src_Mode.whitespace:
        if (isStartOfTag(character)) {
          addClearWordSwitchMode(state, character, src_Mode.tag);
        } else if (isStartOfEntity(character)) {
          addClearWordSwitchMode(state, character, src_Mode.entity);
        } else if (isWhiteSpace(character)) {
          state.currentWord.push(character);
        } else {
          addClearWordSwitchMode(state, character, src_Mode.character);
        }

        break;

      case src_Mode.entity:
        if (isStartOfTag(character)) {
          addClearWordSwitchMode(state, character, src_Mode.tag);
        } else if (isWhiteSpace(character)) {
          addClearWordSwitchMode(state, character, src_Mode.whitespace);
        } else if (isEndOfEntity(character)) {
          var switchToNextMode = true;

          if (state.currentWord.length !== 0) {
            state.currentWord.push(character);
            state.words.push(state.currentWord.join(""));

            if (state.words.length > 2 && isWhiteSpace(state.words[state.words.length - 2]) && isWhiteSpace(state.words[state.words.length - 1])) {
              var w1 = state.words[state.words.length - 2];
              var w2 = state.words[state.words.length - 1];
              state.words.splice(state.words.length - 2, 2);
              state.currentWord = [(w1 + w2).split()];
              state.mode = src_Mode.whitespace;
              switchToNextMode = false;
            }
          }

          if (switchToNextMode) {
            state.currentWord = [];
            state.mode = src_Mode.character;
          }
        } else if (isWord(character)) {
          state.currentWord.push(character);
        } else {
          addClearWordSwitchMode(state, character, src_Mode.character);
        }

        break;
    }
  }

  if (state.currentWord.length !== 0) {
    state.words.push(state.currentWord.join(""));
  }

  return state.words;
}

function addClearWordSwitchMode(state, character, mode) {
  if (state.currentWord.length !== 0) {
    state.words.push(state.currentWord.join(""));
  }

  state.currentWord = [character];
  state.mode = mode;
}

function findBlocks(text, blockExpressions) {
  var blockLocations = new Map();

  if (blockExpressions === null) {
    return blockLocations;
  }

  blockExpressions.forEach(function (exp) {
    var m;

    while ((m = exp.exec(text)) !== null) {
      if (blockLocations.has(m.index)) {
        throw new Error("One or more block expressions result in a text sequence that overlaps. Current expression: " + exp.toString());
      }

      blockLocations.set(m.index, m.index + m[0].length);
    }
  });
  return blockLocations;
}


// CONCATENATED MODULE: ./src/Diff.js










var MatchGranuarityMaximum = 4;
var specialCaseClosingTags = new Map([["</strong>", 0], ["</em>", 0], ["</b>", 0], ["</i>", 0], ["</big>", 0], ["</small>", 0], ["</u>", 0], ["</sub>", 0], ["</strike>", 0], ["</s>", 0], ["</dfn>", 0]]);
var specialCaseOpeningTagRegex = /<((strong)|(b)|(i)|(dfn)|(em)|(big)|(small)|(u)|(sub)|(sup)|(strike)|(s))[>\s]+/gi;

var Diff_HtmlDiff = function () {
  function HtmlDiff(oldText, newText) {
    classCallCheck_default()(this, HtmlDiff);

    this.content = [];
    this.newText = newText;
    this.oldText = oldText;
    this.specialTagDiffStack = [];
    this.newWords = [];
    this.oldWords = [];
    this.matchGranularity = 0;
    this.blockExpressions = [];
    this.repeatingWordsAccuracy = 1.0;
    this.ignoreWhiteSpaceDifferences = false;
    this.orphanMatchThreshold = 0.0;
  }

  createClass_default()(HtmlDiff, [{
    key: "build",
    value: function build() {
      var _this = this;

      if (this.oldText === this.newText) {
        return this.newText;
      }

      if (typeof this.oldText === "undefined" || this.oldText === null) {
        return this.newText;
      }

      if (typeof this.newText === "undefined" || this.newText === null) {
        return this.oldText;
      }

      this.splitInputsIntoWords();
      this.matchGranularity = Math.min(MatchGranuarityMaximum, this.oldWords.length, this.newWords.length);
      var operations = this.operations();
      operations.forEach(function (item) {
        _this.performOperation(item);
      });
      return this.content.join("");
    }
  }, {
    key: "addBlockExpression",
    value: function addBlockExpression(exp) {
      this.blockExpressions.push(exp);
    }
  }, {
    key: "splitInputsIntoWords",
    value: function splitInputsIntoWords() {
      this.oldWords = convertHtmlToListOfWords(this.oldText, this.blockExpressions);
      this.oldText = null;
      this.newWords = convertHtmlToListOfWords(this.newText, this.blockExpressions);
      this.newText = null;
    }
  }, {
    key: "performOperation",
    value: function performOperation(opp) {
      switch (opp.action) {
        case src_Action.equal:
          this.processEqualOperation(opp);
          break;

        case src_Action.delete:
          this.processDeleteOperation(opp, "diffdel");
          break;

        case src_Action.insert:
          this.processInsertOperation(opp, "diffins");
          break;

        case src_Action.none:
          break;

        case src_Action.replace:
          this.processReplaceOperation(opp);
          break;
      }
    }
  }, {
    key: "processReplaceOperation",
    value: function processReplaceOperation(opp) {
      this.processDeleteOperation(opp, "diffmod");
      this.processInsertOperation(opp, "diffmod");
    }
  }, {
    key: "processInsertOperation",
    value: function processInsertOperation(opp, cssClass) {
      var text = this.newWords.filter(function (s, pos) {
        return pos >= opp.startInNew && pos < opp.endInNew;
      });
      this.insertTag("ins", cssClass, text);
    }
  }, {
    key: "processDeleteOperation",
    value: function processDeleteOperation(opp, cssClass) {
      var text = this.oldWords.filter(function (s, pos) {
        return pos >= opp.startInOld && pos < opp.endInOld;
      });
      this.insertTag("del", cssClass, text);
    }
  }, {
    key: "processEqualOperation",
    value: function processEqualOperation(opp) {
      var result = this.newWords.filter(function (s, pos) {
        return pos >= opp.startInNew && pos < opp.endInNew;
      });
      this.content.push(result.join(""));
    }
  }, {
    key: "insertTag",
    value: function insertTag(tag, cssClass, words) {
      while (words.length) {
        var nonTags = this.extractConsecutiveWords(words, function (x) {
          return !isTag(x);
        });
        var specialCaseTagInjection = "";
        var specialCaseTagInjectionIsbefore = false;

        if (nonTags.length !== 0) {
          var text = wrapText(nonTags.join(""), tag, cssClass);
          this.content.push(text);
        } else {
          if (specialCaseOpeningTagRegex.test(words[0])) {
            var matchedTag = words[0].match(specialCaseOpeningTagRegex);
            matchedTag = "<" + matchedTag[0].replace(/(<|>| )/g, "") + ">";
            this.specialTagDiffStack.push(matchedTag);
            specialCaseTagInjection = "<ins class=\"mod\">";

            if (tag === "del") {
              words.shift();

              while (words.length > 0 && specialCaseOpeningTagRegex.test(words[0])) {
                words.shift();
              }
            }
          } else if (specialCaseClosingTags.has(words[0])) {
            var openingTag = this.specialTagDiffStack.length === 0 ? null : this.specialTagDiffStack.pop();

            if (openingTag === null || openingTag !== words[words.length - 1].replace(/\//g, "")) {} else {
              specialCaseTagInjection = "</ins>";
              specialCaseTagInjectionIsbefore = true;
            }

            if (tag === "del") {
              words.shift();

              while (words.length > 0 && specialCaseClosingTags.has(words[0])) {
                words.shift();
              }
            }
          }

          if (words.length === 0 && specialCaseTagInjection.length === 0) {
            break;
          }

          if (specialCaseTagInjectionIsbefore) {
            this.content.push(specialCaseTagInjection + this.extractConsecutiveWords(words, isTag).join(""));
          } else {
            this.content.push(this.extractConsecutiveWords(words, isTag).join("") + specialCaseTagInjection);
          }
        }
      }
    }
  }, {
    key: "extractConsecutiveWords",
    value: function extractConsecutiveWords(words, condition) {
      var indexOfFirstTag = null;

      for (var i = 0; i < words.length; i++) {
        var word = words[i];

        if (i === 0 && word === " ") {
          words[i] = "&nbsp;";
        }

        if (!condition(word)) {
          indexOfFirstTag = i;
          break;
        }
      }

      if (indexOfFirstTag !== null) {
        var items = words.filter(function (s, pos) {
          return pos >= 0 && pos < indexOfFirstTag;
        });

        if (indexOfFirstTag > 0) {
          words.splice(0, indexOfFirstTag);
        }

        return items;
      } else {
        var _items = words.filter(function (s, pos) {
          return pos >= 0 && pos < words.length;
        });

        words.splice(0, words.length);
        return _items;
      }
    }
  }, {
    key: "operations",
    value: function operations() {
      var positionInOld = 0;
      var positionInNew = 0;
      var operations = [];
      var matches = this.matchingBlocks();
      matches.push(new Match_Match(this.oldWords.length, this.newWords.length, 0));
      var matchesWithoutOrphans = this.removeOrphans(matches);
      var matchResult;
      var match;

      while (!(matchResult = matchesWithoutOrphans.next()).done) {
        match = matchResult.value;
        var matchStartsAtCurrentPositionInOld = positionInOld === match.startInOld;
        var matchStartsAtCurrentPositionInNew = positionInNew === match.startInNew;
        var action = void 0;

        if (!matchStartsAtCurrentPositionInOld && !matchStartsAtCurrentPositionInNew) {
          action = src_Action.replace;
        } else if (matchStartsAtCurrentPositionInOld && !matchStartsAtCurrentPositionInNew) {
          action = src_Action.insert;
        } else if (!matchStartsAtCurrentPositionInOld) {
          action = src_Action.delete;
        } else {
          action = src_Action.none;
        }

        if (action !== src_Action.none) {
          operations.push(new Operation_Operation(action, positionInOld, match.startInOld, positionInNew, match.startInNew));
        }

        if (match.length !== 0) {
          operations.push(new Operation_Operation(src_Action.equal, match.startInOld, match.endInOld, match.startInNew, match.endInNew));
        }

        positionInOld = match.endInOld;
        positionInNew = match.endInNew;
      }

      return operations;
    }
  }, {
    key: "removeOrphans",
    value: regenerator_default.a.mark(function removeOrphans(matches) {
      var prev, curr, ix, next, tmp, sumLength, oldDistanceInChars, newDistanceInChars, currMatchLengthInChars;
      return regenerator_default.a.wrap(function removeOrphans$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              prev = null;
              curr = null;
              ix = 0;

            case 3:
              if (!(ix < matches.length)) {
                _context.next = 27;
                break;
              }

              next = matches[ix];

              if (!(curr === null)) {
                _context.next = 9;
                break;
              }

              prev = new Match_Match(0, 0, 0);
              curr = next;
              return _context.abrupt("continue", 24);

            case 9:
              if (!(prev.endInOld === curr.startInOld && prev.endInNew === curr.startInNew || curr.endInOld === next.startInOld && curr.endInNew === next.startInNew)) {
                _context.next = 15;
                break;
              }

              _context.next = 12;
              return curr;

            case 12:
              tmp = prev = curr;
              curr = next;
              return _context.abrupt("continue", 24);

            case 15:
              sumLength = function sumLength(t, n) {
                return t + n.length;
              };

              oldDistanceInChars = this.oldWords.slice(prev.endInOld, next.startInOld).reduce(sumLength, 0);
              newDistanceInChars = this.newWords.slice(prev.endInNew, next.startInNew).reduce(sumLength, 0);
              currMatchLengthInChars = this.newWords.slice(curr.startInNew, curr.endInNew).reduce(sumLength, 0);

              if (!(currMatchLengthInChars > Math.max(oldDistanceInChars, newDistanceInChars) * this.orphanMatchThreshold)) {
                _context.next = 22;
                break;
              }

              _context.next = 22;
              return curr;

            case 22:
              prev = curr;
              curr = next;

            case 24:
              ix++;
              _context.next = 3;
              break;

            case 27:
              _context.next = 29;
              return curr;

            case 29:
            case "end":
              return _context.stop();
          }
        }
      }, removeOrphans, this);
    })
  }, {
    key: "matchingBlocks",
    value: function matchingBlocks() {
      var matchingBlocks = [];
      this.findMatchingBlocks(0, this.oldWords.length, 0, this.newWords.length, matchingBlocks);
      return matchingBlocks;
    }
  }, {
    key: "findMatchingBlocks",
    value: function findMatchingBlocks(startInOld, endInOld, startInNew, endInNew, matchingBlocks) {
      var match = this.findMatch(startInOld, endInOld, startInNew, endInNew);

      if (match !== null) {
        if (startInOld < match.startInOld && startInNew < match.startInNew) {
          this.findMatchingBlocks(startInOld, match.startInOld, startInNew, match.startInNew, matchingBlocks);
        }

        matchingBlocks.push(match);

        if (match.endInOld < endInOld && match.endInNew < endInNew) {
          this.findMatchingBlocks(match.endInOld, endInOld, match.endInNew, endInNew, matchingBlocks);
        }
      }
    }
  }, {
    key: "findMatch",
    value: function findMatch(startInOld, endInOld, startInNew, endInNew) {
      for (var i = this.matchGranularity; i > 0; i--) {
        var options = new MatchOptions_MatchOptions();
        options.blockSize = i;
        options.repeatingWordsAccuracy = this.repeatingWordsAccuracy;
        options.ignoreWhitespaceDifferences = this.ignoreWhiteSpaceDifferences;
        var finder = new MatchFinder_MatchFinder(this.oldWords, this.newWords, startInOld, endInOld, startInNew, endInNew, options);
        var match = finder.findMatch();

        if (match !== null) {
          return match;
        }
      }

      return null;
    }
  }]);

  return HtmlDiff;
}();

Diff_HtmlDiff.execute = function (oldText, newText) {
  return new Diff_HtmlDiff(oldText, newText).build();
};

/* harmony default export */ var Diff = __webpack_exports__["default"] = (Diff_HtmlDiff);

/***/ })
/******/ ]);