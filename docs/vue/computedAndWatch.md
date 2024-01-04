---
description: computed写法
tag:
 - vue
top: 1
comment: true
---

### computed的简述

::: tip
`computed`是一个计算属性，通过对其内部数据的加工，来得到新的数据，且内部依赖的数据发生变化时，`computed`的值也会重新计算；此外`computed`的值有缓存的功能，即当页面内第一次获取`computed`的值时会去计算得到结果，并将这个结果值缓存起来，此后如果`computed`值内部所依赖的值没有发生变化，那么此后引用`computed`的值时，不会再去计算，而是直接获取缓存的值
:::

~~~kotlin
// 普通写法
computed：{
  // computed计算属性名
  test:{
      // a和b为依赖的属性
      return this.a + this.b
  }
}

// 操作计算属性的获取和赋值
computed：{
  test:{
    get:function(){
       // 当访问计算属性test时触发的方法
       return this.a + this.b
    }，
    set:function(newVal){
        // 当给计算属性test赋值时触发的方法
       // newVal为this.test ="adc"的“adc"
    }
  }
}
~~~

### computed的原理

* 初始化计算属性时，遍历`computed`对象，给其中每一个计算属性分别生成唯一`computed watcher`，并将该watcher中的`dirty`设置为true（初始化时，计算属性并不会立即计算（vue做的优化之一），只有当获取的计算属性值才会进行对应计算）

* 将`Dep.target`设置成当前的`computed watcher`，将`computed watcher`添加到所依赖data值对应的`dep`中（`依赖收集的过程`）
* 页面内第一次访问`computed`的值时， 计算`computed`对应的值，然后将`dirty`改成false

* 当`computed`中所依赖的数值发生变化时，调用set方法触发`dep`的`notify`方法，将`computed watcher`中的`dirty`设置为`true`

* 下次获取计算属性值时，若`dirty`为`true`, 重新计算属性的值

* `dirty`是控制缓存的关键，当所依赖的数据发生变化，`dirty`设置为`true`，当`computed`属性再次被获取时，就会重新计算

### computed的源码

~~~kotlin
// 空函数
const noop = () => {};
// computed初始化的Watcher传入lazy: true，就会触发Watcher中的dirty值为true
const computedWatcherOptions = { lazy: true };
//Object.defineProperty 默认value参数
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};
// 初始化computed
class initComputed {
  constructor(vm, computed) {
    //新建存储watcher对象，挂载在vm对象执行
    const watchers = (vm._computedWatchers = Object.create(null));
    // 遍历computed
    for (const key in computed) {
      const userDef = computed[key];
      //getter值为computed中key的监听函数或对象的get值
      let getter = typeof userDef === "function" ? userDef : userDef.get;
      // 新建computed watcher
      watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions);
      if (!(key in vm)) {
        // 定义计算属性
        this.defineComputed(vm, key, userDef);
      }
    }
  }

  // 重新定义计算属性  对get和set劫持
  // 利用Object.defineProperty来对计算属性的get和set进行劫持
  defineComputed(target, key, userDef) {
    // 如果是一个函数，需要手动赋值到get上
    if (typeof userDef === "function") {
      sharedPropertyDefinition.get = this.createComputedGetter(key);
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? userDef.cache !== false
          ? this.createComputedGetter(key)
          : userDef.get
        : noop;
      // 如果有设置set方法则直接使用，否则赋值空函数
      sharedPropertyDefinition.set = userDef.set ? userDef.set : noop;
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  // 计算属性的getter 获取计算属性的值时会调用
  createComputedGetter(key) {
    return function computedGetter() {
      // 获取对应的计算属性watcher
      const watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        // dirty为true,计算属性需要重新计算
        if (watcher.dirty) {
          watcher.evaluate();
        }
        // 获取依赖
        if (Dep.target) {
          watcher.depend();
        }
        //返回计算属性的值
        return watcher.value;
      }
    };
  }
}

~~~



### watch的简述

`watch`是监听已有数据发生变化时，执行我们传入的回调函数的方法，在这个回调函数中可以获取到监听的数据改变前和改变后的两个数值。`watch`中3大属性，分别是`handle`（传入的回调函数）、`immediate`（布尔值，判断是否在数据初始化时就监听数据改动）和 `deep`（布尔值，判断是否对监听的数据进行深层的观察，例如对象内的任意一层数据发生改变，执行传入的回调函数）

~~~kotlin
// 简单写法
new Vue({
  el: '#root',
  data: {
    cityName: 'shanghai'
  },
  watch: {
    cityName(newName, oldName) {
      // newName得到的值为cityName改变后的值
      // oldName得到的值为cityName改变前的值
    }
  } 
})


// 高级写法
new Vue({
  el: '#root',
  data: {
    cityName: {
        name:{
            data:''
        }
    }
  },
  watch: {
    cityName: {
    　　handler(newName, oldName) {
      　　// ...
    　　},
    　　immediate: true,
       deep:true, // 这个为true时，当cityName.name.data的值发生改变时，也会执行回调函数
    }
  } 
})
~~~



### watch的原理

* 遍历`watch`对象， 给其中每一个watch属性，生成对应的`user watcher`

* 调用`watcher`中的`get`方法，将`Dep.target`设置成当前的`user watcher`，并将`user watcher`添加到监听`data`值对应的dep中（依赖收集的过程）

* 当所监听`data`中的值发生变化时，会调用`set`方法触发`dep`的`notify`方法，执行`watcher`中定义的方法

* 设置成`deep：true`的情况，递归遍历所监听的对象，将`user watcher`添加到对象中每一层key值的dep对象中，这样无论当对象的中哪一层发生变化，`wacher`都能监听到。通过对象的递归遍历，实现了深度监听功能



### watch和computed的区别

* `watch`是针对监听数据改变时进行的一系列操作，`computed`是对监听的值进行加工得到一个新的值
* `watch`不会产生一个可以访问的新值（即通过`this`可以访问到的值），`computed`会得到一个新值，可以通过`this`访问到这个值，或者对这个值进行赋值
* `watch`并不会被缓存，`computed`的值是有缓存的



### watch（immediate: true）和computed的执行顺序

例子：

```javascript
// main.js
import Vue from "vue";

new Vue({
  el: "#app",
  template: `<div>
    <div>{{computedCount}}</div>
  </div>`,
  data() {
    return {
      count: 1,
    }
  },
  watch: {
    count: {
      handler() {
        console.log('watch');
      },
      immediate: true,
    }
  },
  computed: {
    computedCount() {
      console.log('computed');
      return this.count + 1;
    }
  },
  created() {
    console.log('created');
  },
});
```

当前例子的执行顺序为：`watch` --> `created` --> `computed`

在`new Vue`的实例化过程中，会执行初始化方法`this._init`，其中有代码：

```kotlin
Vue.prototype._init = function (options) {
    // ...
    initState(vm);
    // ...
    callHook(vm, 'created');
    // ...
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}
```

按照代码先执行`initComputed(vm, opts.computed)`，然后执行`initWatch(vm, opts.watch)`，再执行`callHook(vm, 'created')`，那结果应该为`computed` --> `watch` --> `created`


#### 关于`initComputed`

```kotlin
const computedWatcherOptions = { lazy: true }
function initComputed (vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    // ...
    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
        // ...
    }
  }
}
```

在通过`initComputed`初始化计算属性的时候，通过遍历的方式去处理当前组件中的`computed`。首先，在进行计算属性实例化的时候，将`{ lazy: true }`作为参数传入，并且实例化的`Watcher`中的`getter`就是当前例子中的`computedCount`函数；其次，通过`defineComputed(vm, key, userDef)`的方式在当前组件实例`vm`上为`key`进行`userDef`的处理。具体为：

```kotlin
export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef)
    sharedPropertyDefinition.set = noop
  }
  // ...
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}

```

从以上可以看出，这里通过`Object.defineProperty(target, key, sharedPropertyDefinition)`的方式，将函数`computedGetter`作为`get`函数，只有当对`key`进行访问的时候，才会触发其内部的逻辑。内部逻辑`watcher.evaluate()`为：

```kotlin
evaluate () {
    this.value = this.get()
    this.dirty = false
}

```

`get`中有主要逻辑：

```kotlin
value = this.getter.call(vm, vm)
```

这里的`this.getter`就是当前例子中的:

```kotlin
computedCount() {
  console.log('computed');
  return this.count + 1;
}
```

所以只有当获取`computedCount`的时候才会触发`computed`的计算，也就是在进行`vm.$mount(vm.$options.el)`阶段才会执行到`console.log('computed')`

#### 关于`initWatch`

```kotlin
function initWatch (vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
function createWatcher (
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}
```

在通过`initWatch`初始化侦听器的时候，如果`watch`为数组，则遍历执行`createWatcher`，否则直接执行`createWatcher`。如果`handler`是对象或者字符串时，将其进行处理，最终作为参数传入`vm.$watch`中去，具体为：

```kotlin
Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value)
      } catch (error) {
        handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
      }
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }
```

这里获取到的`options`中会有`immediate: true`的键值，同时通过`options.user = true`设置`user`为`true`，再将其作为参数传入去进行`Watcher`的实例化

当前例子中`options.immediate`为`true`，所以会执行`cb.call(vm, watcher.value)`，也就是以`vm`为主体，立刻执行`cb`。当前例子中`cb`就是`handler`：

```kotlin
handler() {
    console.log('watch');
},
```

所以当前例子中`console.log('watch')`是最先执行的

然后，执行完`initComputed`和`initWatch`以后，就会通过`callHook(vm, 'created')`执行到生命周期中的`console.log('created')`了

最后通过`vm.$mount(vm.$options.el)`进行页面渲染的时候，会先去创建`vNode`，这时就需要获取到`computedCount`的值，进而触发其`get`函数的后续逻辑，最终执行到`console.log('computed')`

#### 总结

* `computed`只会在其被调用的时候执行，所以在组件初始化时，执行到mount阶段，生成虚拟`DOM`时候才会取获取值，从而触发函数
* `watch`会在数值发生改变后，立即执行回调函数，而`watch(immediate:true)`代表在数值初始化后立刻执行回调，所以其执行的顺序先于钩子函数
