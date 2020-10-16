const PENDING = 'pending'
const FULFILLED = 'fullfilled'
const REJECTED = 'rejected'


function MyPromise(fn) {
  const self = this
  self.value = null
  self.error = null
  self.status = PENDING
  self.onFulfilled = null
  self.onRejected = null

  function resolve(value) {
    if (self.status = PENDING) {
      setTimeout(() => {
        self.status = FULFILLED
        self.value = value
        self.onFulfilled(self.value)
      })
    }
  }

  function reject(error) {
    if (self.status = PENDING) {
      setTimeout(() => {
        self.status = REJECTED
        self.error = error
        self.onRejected(self.error)
      })
    }
  }

  fn(resolve, reject)
}
MyPromise.prototype.then = function(onFulfilled, onRejected) {
  if (this.status === PENDING) {
    this.onFulfilled = onFulfilled
    this.onRejected = onRejected
  } else if (this.status === FULFILLED) {
    onFulfilled(this.value)
  } else {
    onRejected(this.error)
  }
}
