(function(window) {
  const PENDING = 'pending'
  const RESOLVED = 'resolved'

  class MyPromise {
    constructor(executor) {
      this.status = PENDING
      this.data = null
      this.cb = null

      const resolve = (value) => {
        if (this.status !== PENDING) return 
        this.status = RESOLVED
        this.data = value
        if (this.cb) {
          this.cb(value)
        }
      }
      executor(resolve)
    }

    then(onResolved) {
      return new MyPromise((resolve) => {
        const handle = (callback) => {
          const result = callback(this.data)
          if (result instanceof MyPromise) {
            result.then(resolve)
          } else {
            resolve(result)
          }
        }
        if (this.status === PENDING) {
          this.cb = function() { handle(onResolved) }
        } else if (this.status === RESOLVED) {
          handle(onResolved)
        }
      })
    }
  }
  window && (window.MyPromise = MyPromise)
})(window)