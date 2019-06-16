function createSmartObject(obj) {
  return obj;
}

function defineComputedField(obj, computedName, args, clb) {
  Object.defineProperty(obj, computedName, {
    get() {
      return clb(...args.map(x => this[x]));
    },
    set() {
      throw new Error('Assignment to computed property');
    },
    enumerable: true,
    // configurable: false, // false by default
  });
}
