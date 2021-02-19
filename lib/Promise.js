/* 
自定義 Promise 實踐 (IIFE)
*/

(function (window) {
  const PENDING = 'pending'
  const RESOLVED = 'resolved'
  const REJECTED = 'rejected'
  /* Promise 建構子 */
  function MyPromise (executor) {
    this.status = PENDING
    this.data = null
    this.callbacks = [] // 結構 { onResolved(){}, onRejected(){}}

    const resolve = (value) => {
      if (this.status !== PENDING) return // 狀態只能改一次 (不是pending時，代表已經被改過)
      this.status = RESOLVED
      this.data = value
      if (this.callbacks.length > 0) {
        // setTimeout(() => {
          this.callbacks.forEach(callback => {
            callback.onResolved(value)
          })
        // })
      }
    }
    const reject = (reason) => {
      if (this.status !== PENDING) return
      this.status = REJECTED
      this.data = reason
      if (this.callbacks.length > 0) {
        // setTimeout(() => {
          this.callbacks.forEach(callback => {
            callback.onRejected(reason)
          })
        // })
      }
    }

    // 立即同步執行 executor，內部邏輯由外面定義，依據業務邏輯回調 resolve 或 reject
    try {
      executor(resolve, reject)
    } catch (error) {
      // 如果 executor 拋錯，promise 物件的狀態改為失敗
      reject(error)
    }
  }
  /* 實踐 Promise 原型物件的 then 方法 */
  MyPromise.prototype.then = function (onResolved, onRejected) {
    onResolved = typeof onResolved === "function" 
      ? onResolved : (data) => data;
    onRejected = typeof onRejected === "function" 
      ? onRejected : (error) => { throw error };

    return new MyPromise((resolve, reject) => {
      const handle = (callback) => {
        try {
          const result = callback(this.data)
          if (result instanceof MyPromise) {
            result.then(
              value => resolve(value),
              reason => reject(reason)
            )
          } else {
            resolve(result)
          }
        } catch (error) {
          reject(error)
        }
      }

      if (this.status === RESOLVED)  {
        handle(onResolved)
      } else if (this.status === REJECTED) {
        handle(onRejected)
      } else if (this.status === PENDING) {
        this.callbacks.push({ 
          onResolved() {
            handle(onResolved)
          }, 
          onRejected() {
            handle(onRejected)
          } 
        })
      }
    })
  }
  /* 實踐 Promise 原型物件的 catch 方法 */
  MyPromise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected)
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
