### 普通插槽

在父组件中为子组件嵌入一部分内容

```kotlin
//子组件 ： (假设名为：child)
<template>
  <div class= 'child'>
      <slot>这就是默认值</slot> //这里填写的就是当父组件没有嵌入内容时，此处默认展示什么
  </div>
</template>

//父组件：（引用子组件 child）
<template>
  <div class= 'app'>
   <child>
     <div>测试</div>
   </child>
  </div>
</template>

// 实际上子组件渲染为
<div class= 'child'>
   <div>测试</div>
</div>
```

### 具名插槽

当调用者希望写入的内容能展示在不同区域时使用

```kotlin
//子组件 ： (假设名为：child)
<template>
  <div class= 'child'>
    <div><slot name ='header'></slot></div>
    <div><slot name ='foot'></slot></div>
  </div>
</template>

//父组件：（引用子组件 child）
<template>
  <div class= 'app'>
   <child>
    <template v-slot:header></template>
    <template v-slot:foot></template>
   </child>
  </div>
</template>

// 没有其他命名时，插槽的默认名称为defalut
```

### 作用域插槽

当调用者想使用插槽组件内部数据时使用

```kotlin
<template>
  <div class= 'child'>
    <div><slot name ='header' :data1='child1'></slot></div>
    <div><slot name ='foot' :data2='child2'></slot></div>
  </div>
</template>
new Vue({
  el:'child',
  data:{
    child1:'数据1',
    child2:'数据2'
  }
})

//父组件：（引用子组件 child）
<template>
  <div class= 'app'>
   <child>
    <template v-slot:header='header'>{{header.data1}}</template>
    <template v-slot:foot='foot'>{{foot.data2}}</template>
   </child>
  </div>
</template>
```

### 普通插槽的解析

```kotlin
//子组件 ： (假设名为：child)
<template>
  <div class='child'>
      我在子组件里面
      <slot></slot>
      <slot name="one"></slot>
  </div>
</template>

//父组件：（引用子组件 child）
<template>
  <div class= 'app'>
     <child>
        这是插入到默认插槽的内容 {{parent}}
        <template v-slot:"one"> 这是插入到one插槽的内容 {{parent}}</template>
     </child>
  </div>
</template>

new Vue({
  el:'.app',
  data:{
    parent:'父组件的值'
  }
})
```

1. 父组件先解析，把 `child` 当做子元素处理，把 插槽当做 `child` 的子元素处理，并且在父组件作用域内得出了 parent 变量的值，生成这样的节点：

```kotlin
{
  tag: "div",
   children: [{
      tag: "child",
      children: ['这是插入到默认插槽的内容 父组件的值',
                  '这是插入到one插槽的内容 父组件的值']
  }]
}
```

2. 子组件解析，`slot` 作为一个占位符，会被解析成一个函数，大概意思像 解析成下面

```kotlin
{
    tag: "div",
    children: [
        '我在子组件里面',
        _t('default'), // 匿名插槽，默认名称为default
        _t('one') // 具名插槽，名称为one
    ]
}
```

3. \_t 函数需要传入插槽名称，默认是`default`，具名插槽则传入`name`，这个函数的作用，是把第一步解析得到的插槽节点拿到，然后返回解析后的节点，那么子组件的节点就完整了，插槽也成功认了爹——`div`标签

```kotlin
{
    tag: "div",
    children: ['我在子组件里面',
                '这是插入到默认插槽的内容 父组件的值',
                '这是插入到one插槽的内容 父组件的值']
}

```

### 作用域插槽解析

```kotlin
//子组件 ： (假设名为：child)
<template>
  <div class= 'child'>
      <slot :value1='child1' :value2='child1'></slot>
      <slot name='one' :value1='child2' :value2='child2'></slot>
  </div>
</template>

new Vue({
  el:'child',
  data:{
    child1: '子数据1',
    child2: '子数据2'
  }
})

//父组件：（引用子组件 child）
<template>
  <div class='app'>
     <child>
         <template v-slot:default='slotde'>
            插入默认 slot 中{{ slotde.value1 }}{{ slotde.value2 }}
        </template>
        <template v-slot:one='slotone'>
            插入one slot 中{{ slotone.value1 }}{{ slotone.value2 }}
        </template>
     </child>
  </div>
</template>
```

1. 过程很复杂，这里就通俗点讲了，父组件先解析，遇到作用域插槽，会将此插槽封装成一个函数保存到子元素 `child` 下

```kotlin
{
 tag: "div",
  children: [{
     tag: "child"
     scopeSlots:{
         default (data) { // 记住这个data参数
             return ['插入one slot 中插入默认 slot 中' + data.value1 + data.value2]
         },
         one (data) { // 记住这个data参数
             return ['插入one slot 中' + data.value1 + data.value2]
         }
     }
    }]
}
```

2. 轮到子组件解析了，这个时候 t 函数又登场了，并且子组件将对应的插槽数据包装成一个对象，传进 t 函数

```kotlin
{
 tag: "div",
   children: [
     '我在子组件里面',
      _t('default',{value1: '子数据1', value2: '子数据1'}),
      _t('one',{value1: '子数据2', value2: '子数据2'})

    ]
  }
```

3. 接下来就是\_t 内部执行，包装后的对象被当做 data 参数传入了`scopeSlots`中的对应的各个函数，解析成：

```kotlin
{
  tag: "div",
   children: [
      '我在子组件里面',
      '插入默认 slot 中 子数据1 子数据1',
      '插入one slot 中 子数据2 子数据2'
   ]
}
```

子组件中生成的 slot 的虚拟节点都存放在$slots 对象中

### $slots 对象

在插槽组件内获取父对象传入的标签

```kotlin
//父组件：（引用子组件 child）
<template>
  <div class= 'app'>
   <child>
     <div>测试</div>
   </child>
  </div>
</template>

//子组件 ： (假设名为：child)
<template>
  <div class= 'child'>
      <slot></slot> /
  </div>
</template>
this.$slots.defalut //获取得到<div>测试</div>这个标签，defalut代表的是默认的插槽
```
