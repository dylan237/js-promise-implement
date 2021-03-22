(function (window: Window): void {
  const PENDING: string = 'pending'
    const FULFILLED: string = 'fulfilled'
    const REJECTED: string = 'rejected'
    interface ICallback {
      onFulfilled: Function,
      onRejected: Function,
    }
  class MyPromise {
    status: string
    data: unknown
    callbacks: ICallback[]
    constructor(executor: Function) {
      this.status = PENDING
      this.data = null
      this.callbacks = []
      const resolve: (result) => void = (result: unknown): void => {
        if (this.status !== PENDING) return 
        this.status = FULFILLED
        this.data = result
        if (this.callbacks.length > 0) {
          this.callbacks.forEach(callback => {
            callback.onFulfilled(result)
          })
        }
      }
      const reject: (reason) => void = (reason: unknown): void => {
        if (this.status !== PENDING) return 
        this.status = REJECTED
        this.data = reason
        if (this.callbacks.length > 0) {
          this.callbacks.forEach(callback => {
            callback.onRejected(reason)
          })
        }
      }

      try {
        executor(resolve, reject)
      } catch (e) {
        reject(e)
      }
    }
    public then(
      onFulfilled: Function = (data) => data,
      onRejected: Function = (reason) => { throw reason }
    ) {
      return new MyPromise((resolve: Function, rejected: Function) => {
        const handle: (callback: Function) => void = (callback: Function) => {
          try {
            const result: unknown = callback(this.data)
            if (result instanceof MyPromise) {
              result.then(resolve, rejected)
            } else {
              resolve(result)
            }
          } catch(e) {
            rejected(e)
          }
        }
        if (this.status === FULFILLED) {
          handle(onFulfilled)
        } else if (this.status === REJECTED) {
          handle(onRejected)
        } else {
          this.callbacks.push({
            onFulfilled() {
              handle(onFulfilled)
            },
            onRejected() {
              handle(onRejected)
            },
          })
        }
      }) 
    }
  }
  if (window) {
    window['MyPromise'] = MyPromise
  }
})(window)
