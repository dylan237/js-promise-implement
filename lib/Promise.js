/* 
自定義 Promise 實踐 (IIFE)
*/

(function (window) {
  
  /* Promise 建構子 */
  function MyPromise (executor) {

    function resolve(value) {

    }
    function reject(reason) {

    }
    // 立即同步執行 executor，內部邏輯由外面定義，依據業務邏輯回調 resolve 或 reject
    executor(resolve, reject)
  }
  /* 實踐 Promise 原型物件的 then 方法 */
  MyPromise.prototype.then = function (onResolved, onRejected) {

  }
  /* 實踐 Promise 原型物件的 catch 方法 */
  MyPromise.prototype.catch = function (onRejected) {

  }
  /* resolve - Promise 建構子物件的 static method */
  MyPromise.resolve = function (value) {
    
  }
  /* reject - Promise 建構子物件的 static method */
  MyPromise.reject = function (reason) {

  }
  /* all - Promise 建構子物件的 static method */
  MyPromise.all = function (promises) {

  }
  /* race - Promise 建構子物件的 static method */
  MyPromise.race = function (promises) {

  }

  window && (window.MyPromise = MyPromise)
})(window)
