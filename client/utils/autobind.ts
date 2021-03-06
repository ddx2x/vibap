// Decorator for binding class methods
type Constructor<T = {}> = new (...args: any[]) => T;

export function classbind() {
  return function (target: Constructor | object) {
    if (target instanceof Function) return bindClass(target);
  };
}

export function methodbind() {
  return function (
    target: object,
    prop?: string,
    descriptor?: PropertyDescriptor
  ) {
    return bindMethod(target, prop, descriptor);
  };
}

function bindClass<T extends Constructor>(constructor: T) {
  const proto = constructor.prototype;
  const descriptors = Object.getOwnPropertyDescriptors(proto);

  const skipMethod = (methodName: string) => {
    return (
      methodName === 'constructor' ||
      typeof descriptors[methodName].value !== 'function'
    );
  };

  Object.keys(descriptors).forEach(prop => {
    if (skipMethod(prop)) return;
    const boundDescriptor = bindMethod(proto, prop, descriptors[prop]);
    Object.defineProperty(proto, prop, boundDescriptor);
  });
}

function bindMethod(
  target: object,
  prop?: string,
  descriptor?: PropertyDescriptor
) {
  if (!descriptor || typeof descriptor.value !== 'function') {
    throw new Error(`@autobind() must be used on class or method only`);
  }
  const {value: func, enumerable, configurable} = descriptor;
  const boundFunc = new WeakMap<object, Function>();

  return Object.defineProperty(target, prop, {
    enumerable,
    configurable,
    get() {
      if (this === target) return func; // direct access from prototype
      if (!boundFunc.has(this)) boundFunc.set(this, func.bind(this));
      return boundFunc.get(this);
    },
  });
}
