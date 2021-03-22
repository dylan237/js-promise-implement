(function (window) {
    var PENDING = 'pending';
    var FULFILLED = 'fulfilled';
    var REJECTED = 'rejected';
    var MyPromise = /** @class */ (function () {
        function MyPromise(executor) {
            var _this = this;
            this.status = PENDING;
            this.data = null;
            this.callbacks = [];
            var resolve = function (result) {
                if (_this.status !== PENDING)
                    return;
                _this.status = FULFILLED;
                _this.data = result;
                if (_this.callbacks.length > 0) {
                    _this.callbacks.forEach(function (callback) {
                        callback.onFulfilled(result);
                    });
                }
            };
            var reject = function (reason) {
                if (_this.status !== PENDING)
                    return;
                _this.status = REJECTED;
                _this.data = reason;
                if (_this.callbacks.length > 0) {
                    _this.callbacks.forEach(function (callback) {
                        callback.onRejected(reason);
                    });
                }
            };
            try {
                executor(resolve, reject);
            }
            catch (e) {
                reject(e);
            }
        }
        MyPromise.prototype.then = function (onFulfilled, onRejected) {
            var _this = this;
            if (onFulfilled === void 0) { onFulfilled = function (data) { return data; }; }
            if (onRejected === void 0) { onRejected = function (reason) { throw reason; }; }
            return new MyPromise(function (resolve, rejected) {
                var handle = function (callback) {
                    try {
                        var result = callback(_this.data);
                        if (result instanceof MyPromise) {
                            result.then(resolve, rejected);
                        }
                        else {
                            resolve(result);
                        }
                    }
                    catch (e) {
                        rejected(e);
                    }
                };
                if (_this.status === FULFILLED) {
                    handle(onFulfilled);
                }
                else if (_this.status === REJECTED) {
                    handle(onRejected);
                }
                else {
                    _this.callbacks.push({
                        onFulfilled: function () {
                            handle(onFulfilled);
                        },
                        onRejected: function () {
                            handle(onRejected);
                        }
                    });
                }
            });
        };
        return MyPromise;
    }());
    if (window) {
        window['MyPromise'] = MyPromise;
    }
})(window);
