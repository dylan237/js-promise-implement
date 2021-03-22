(function (window) {
    const PENDING = 'pending'
    const FULFILLED = 'fulfilled'
    const REJECTED = 'rejected'

  class MyPromise {
    constructor(executor) {
      this.status = PENDING
      this.data = null
      this.callbackQueue = []

      const resolve = (result) => {
        if (this.status !== PENDING) return
        this.status = FULFILLED
        this.data = result
        this.callbackQueue.forEach(callback => {
          callback.onFulfilled(result)
        })
      }
      const reject = (reason) => {
        if (this.status !== PENDING) return 
        this.status = REJECTED
        this.data = reason
        this.callbackQueue.forEach(callback => {
          callback.onRejected(reason)
        })
      }
      try {
        executor(resolve, reject)
      } catch (e) {
        reject(e)
      }
    }
    
    then(onFulfilled, onRejected) {

      onFulfilled = typeof onFulfilled === "function" 
        ? onFulfilled : (data) => data;
      onRejected = typeof onRejected === "function" 
        ? onRejected : (reason) => { throw reason };

      return new MyPromise((resolve, reject) => {

        const handle = (callback) => {
          try {
            const result = callback(this.data)
            if (result instanceof MyPromise) {
              result.then(
                data => resolve(data),
                reason => reject(reason)
              )
            } else {
              resolve(result)
            }
          } catch (e) {
            reject(e)
          }
        }

        if (this.status === FULFILLED) {
          handle(onFulfilled)
        } else if (this.status === REJECTED) {
          handle(onRejected)
        } else {
          this.callbackQueue.push({
            onFulfilled() { handle(onFulfilled) },
            onRejected() { handle(onRejected) }
          })
        }
      })
    }
    catch (onRejected) {
      return this.then(null, onRejected)
    }
  }
  window && (window.MyPromise = MyPromise)
})(window)