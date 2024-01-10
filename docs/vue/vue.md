---
title: vue基础
description: 对vue2的基础代码解析
tags:
  - vue
readingTime: true
author: 'LackMent'
top: 1
---

#

## vue2 生命周期

::: info

- beforCreate // 此时所有的数据并未写入，可在此时做初始化操作
- Created // 此时 data 和 method 已经存在，可发送请求，进行数值的处理,this.$data已经存在，this.$data === data.prototype，数据的绑定、watch 和 event 的回调、computed 的计算也已经完成
- beforMount // 此时虚拟 Dom 已经完成，但是未渲染到 Dom 中, 完成模板的解析以及指令的运行。
- Mounted // 创建期的最后一个钩子，此时 Dom 已经渲染完毕，this.$el 可获取，其为`<div id =‘app’> </div>`
- beforUpdate // 此时 vue 中 Data 的数据已更新完了，但是页面中的数据并未重新渲染
- Updated // 更新完毕，页面中数据和 Data 中的数据保持一致
- beforDestroy // vue 销毁前的最后一刻，data 和 method 都可以使用
- destroy // 被销毁
  :::

## Axios 请求

```javascript
// get请求
axios.get(url,{params:{要发送的数据}}).then(res => {
   // 如果没有拦截那么这里拿到的是响应对象
}).catch(err => {

})

// psot请求
axios.post(url,{
    // 传递的内容
    data:{},
    // 设置请求头内容
    headers:{
        // 传送的数据为json类型
        'content-type':'application/json;'
    }
}).then(res => {

}).catch(err => {

})

// 统一写法
axios({
  url:"",
  method: ,
  headers:{},
  responseType :" " // 响应类型，默认为json
 params or data  // 根据请求的方法来选择
}).then(res => {

}).catch(err => {

})

// 同时发送多个请求
axios.all([axios(),axios()]).then(data => {
   // data是一个数据，分别包含前面两个请求的结果对象
}).catch(err => {
})

// 全局属性
axios.defaults.timeOut= 5000 //规定请求时间
axios.defaults.baseURL = '' //规定每次请求的域名和端口，每次请求会附加上这串

// 实例化
const a = axios.create({
       baseURL:''
})

// 请求和响应拦截 (一般写在创建axios的文件中)
axios.intercptors.request.use( config => {
   // 拿到请求对象，可以做类似于判断是否带token的操作
   return config //一定要返回这个，要不然请求会一直卡在这
})

axios.intercpotors.response.use( res => {
  // 拿到响应对象
  return res.data //这样就可以不用每次请求是在去res.data拿数据，而是直接res即可
})

```

## keep-alive（组件状态保留）

```javascript
// keep-alive实际上是将要保留状态的组件的vnode保存进cache对象中，当要使用这个组件时，就从cache中拿出来渲染页面
// 使用了LRU算法,会将最近最久会使用的组件状态销毁

<keep-alive
  include=""
  exclude=""
  max="2"
></keep-alive>
// 确定哪些组件要被保留状态，哪些不用，里面填入的name，即在每个组件中script中定义name
// include表明哪些组件的状态需要保留
// exclude表明哪些组件的状态不需要保留
// max表明最多可以保存多少个组件的状态
// 可以放<component></component> 或者 <router-view></router-view>
```

## component 组件

```javascript
// 全局组件的两种创建方式
// 第一种
let te = Vue.extend({
    template:''
})
Vue.component('组件名字'，te)

// 第二种
Vue.component('组件名字',{template:'#id'})
<template id = 'id'> </template>

// 私有组件
let vm = new Vue({
   components:{
   }
})

// 父向子组件的传值
<son :data = “msg”> </son>
let parent = new Vue ({
     data:{
        msg
     }
})

let Son = new Vue({
  props:{
     data:{
          type:string;
          defalut:'ss'
     }
  }
})

<div>{{data}}</div>


// 子向父组件传方法

<son @data = “father”> </son>
let parent = new Vue ({
      methods：{
       father（data）{

    }
    }
})

let Son = new Vue({
       methods:{
         useFahter（）{
          this.$emit('data',参数1)
    }

  }
})


// 父向孙传递方法一致，但需要在子组件上做处理
<div :data='' @father=''></div> 父
<div :data = '$attrs' @father='$listeners'></div> 子
<div @click = "uesFather">{{data}}</div> 孙

```

## render 渲染

```javascript
import componentOne from ''
<div id="app"></div>
// 用componentOne组件替换原来的
app let app = new Vue({ el:'#app', render(el){return el(componentOne)} })
```

## filter 过滤器

```javascript
Vue.filter('过滤器名'，function(data){
  // data参数为固定值，为要进行过滤的数据
  })

// 调用方式（只能在v-bind和{{}}中调用）
{{ data | 过滤器名 }}
```

## directive 指令

```javascript
Vue.directive('命令名',
{
  inserted(el){
    //绑定此命令的元素插入进Dom中时执行
    //el为绑定此命令的dom元素
    },
   bind（el）{ //当此命令绑定到元素上时执行
    }
   updated（el）{ //此元素发生改变后执行
   }
  })
// 调用
<div v-命令名></div>

// 快捷写法
Vue.directive('命令名', function(el,bing){
  //此方法代表bind和updated方法
  // bing.value可得到 v-命令名 = ‘’中等号后面的值
  })
```

## mixin 混入

用于功能的复用

```javascript
// 局部定义：
let  mixin  = {
   created(){
       //混入中的钩子函数要比使用它的组件的钩子函数先触发，然后再触发组件的钩子函数
}
 data(){
     return {
         //若混入中data中定义的变量名与组件中的一致，那么只使用组件中的，而不使用混入中的
   }
  }
 methods{
    // 若混入中的方法名与组件中的方法名一样，则使用组件中的方法
   }
}

let vue = new Vue({
    mixins:[mixin]
})

// 全局定义：
vue.mixin('混入名',{

})

// 全局定义的混入对每一个组件都有效
let a = 'b'

let vue = new Vue({
  data(){
    return {
    b : this.$options.a //那么b的值为'b'
    }
   }
})
```

## $options 对象

用于获取不在 vue 独有方法（例如 data、method）中定义的方法或者属性

```javascript
export default {
  s: '2',
  testB: function () {},
  methods: {
    change() {
      console.log(this.$options.s, 888) //得到s的值为'2'
    },
  },
}
```

## $event 事件对象

```javascript
// $event的使用
// 原生事件中代表事件对象
<div @click = "test">

</div>
test(){
   //默认第一个对象是事件对象 $event
   $event.target.xxx  //获取此标签上的各种东西
   $event.srcElement //获取原生的Dom标签
}

// 如果是自定义的事件，则代表$emit传过来的第一个参数
// 例一：
//父组件
<children @event = "test($event)">
</children>

test(tes){
     tes //等于子组件传过来的第一个参数值
}

// 子组件
  <div @click = 'test'>

 </div>
 test() {
  this.$emit（"event",'a'）
}

// 例二：
// 父组件
<children @event = 'tes = $event '> tes就等于子组件传来的第一个参数值</children>

 data(){
    return {
      tes:''
     }
}
// 子组件
 <input type = "text" @input = "$emit('event',$event.target.value)"> </input>

```

## $mount 对象挂载

适用情况：在一个 vue 实例中需要在某个标签上挂载另外一个 vue 实例时

```javascript
<template>
  <div id="app"></div>
</template>

import needMountVue from " "
export default {
    methods:{
        test(){
            let tempVue = new Vue(needMountVue); //这里得到的tempVue实际上就是needMountVue中的this
            tempVue.test = '23'
           // 这样在needMountVue中就可以通过this获取到test的值，但是这种传值方式这能用于beforeMount、mounted时才能获取到
           tempVue.$mount("#app")
           }
        }
    }

// 也可以按照以下方式写
import testMountVue from '';
export default {
    methods:{
        test(){
            let testMount = Vue.extend(testMountVue);
            const instation = new testMount().$mount("#app");
           }
      }
  }
```

## $refs 对象

```javascript
// 用在原生标签上时
<div ref = 'sed'></div>
this.$refs.sed //得到div这个Dom对象

// 用在组件上时
// 子组件
 data (){
  return {
    a: 'c'
  }
}

<children ref='son'></children>
this.$refs.son.a  //得到c,获取到的是组件对象，但这种只能在mounted（）钩子中获取，不可在渲染期获取

// 用在v-for循环的对象时：
<div v-for='item in 3' :key = item ref='te'> </div>
this.$refs.te //得到一个数组，数组内是3个div的Dom对象
```

## $el 对象

```javascript
;<template>
  <div>
    <p id="test"></p>
  </div>
</template>

import Test from ''
export default {
  el: '#test', //这个表明要挂载在id为test的标签上
  mounted() {
    //$el在组件创建的阶段中,只有mounted的钩子函数中才能获取到
    //如果在vue文件中有明确的写出el，那么下面的$el就会使绑定的html，即,<p></p>
    //如果没有明确的写出el，那么vue会默认的把除<template></template>这个标签剩下的html当做el，即<div><p></p></div>
    console.log(this.$el)

    //Test文件中有<template>
    //       <div>
    //        222
    //     </div>
    // </template>
    let test = new Vue(Test) //根据Test文件获取得到一个vue对象
    //手动的完成vue对象的创建，同时返回vue对象，即this
    //$mount('#test') 传入的#test,实际上就是去寻找id为test的dom节点，并将vue对象挂载在这个节点上
    // 最终得到的vue
    //<template>
    //      <diV>
    //     <p id="test">
    //       <div>
    //        222
    //     </div>
    // </p>
    // </diV>
    //</template>
    test.$mount('#test')
  },
}

// 通过$el进行挂载
new Vue({
  el: '#app',
  data() {
    return {
      message: 'Hello Vue!',
    }
  },
  template: `
    <div id="rendered">{{ message }}</div>
  `,
})

//上面等同于
const app = new Vue({
  data() {
    return {
      message: 'Hello Vue!',
    }
  },
  template: `
    <div id="rendered">{{ message }}</div>
  `,
})

app.$mount('#app')
```

## new Vue 之后进行的操作

::: details

- 划定作用域，使当前组件无法访问其他组件的数据
- 确定父子组件关系，同时为当前组件赋予一些属性和生命周期标识（ref，$parent,$children 等）
- 对父类传进来的事件添加监听
- 声明 solt()、createElement()等
- inject 注入从外部传进来的数据
- 响应数据的初始化,包括 data、methods、props、computer、watch
- provide 提供数据给子组件
- 进行挂载

先 inject 数据再 provide 数据，是因为

- 外部传入的数据需要跟 data 中的数据进行比对，当同名时给予不同其权重，剔除重复的数据
- 提供给子代数据，先要获取到这个数据，才能提供给子代
  :::

## vue2 的数据双向绑定（观察者模式）

核心是利用 Object.defineProperty 方法的 get 和 set 属性

```javascript
//obesever:观察者，当数据发生了改变就通知dep去重新渲染页面。
function obesever(obj) {
  for (let item in obj) {
    let dep = new _dep()
    let value = obj[item]
    if (Object.prototype.toString.call(value) === '[object,object]')
      obesever(value)
    Object.defineProperty(obj, item, {
      configurable: true,
      enumerable: true,
      get: function reactiveGetter() {
        if (_dep.target) dep.addWatch(_dep.target)
        return value
      },
      set: function reactiveSetter(newVal) {
        if (newVal === value) return value
        value = newVal
        dep.notifyAll()
      },
    })
  }
}

//dep:连接者，对象的每一个属性都对应着一个dep，dep内有一个数组，数组中是和此属性有关联的watch对象
function _dep() {
  this.watchList = []
  //为这个属性添加更新者
  this.addWatch = function (watch) {
    if (_dep.target && !this.watch.includes(_dep.target))
      this.watchList.push(watch)
  }
  this.notifyAll = function () {
    this.watch.forEach((item) => {
      item.upDate()
    })
  }
}

//watch:更新者，第一个初始化调用时会被加入进对应的dep中，dep循环数组后，在数组中的watch调用upDate方法更新数据和重新渲染

function watch(fn) {
  this.upDate = function () {
    fn() //这个回调函数中循环监听对象中的所有属性，并获取它们的属性值
  }
  this.initialize = function () {
    _dep.target = this //静态成员，为_dep对象添加一个静态成员
    fn() //这一步即是为每个属性创建一个_dep对象，且在每个_dep对象的数组内加入watch
    _dep.target = null //防止后面更新时，再次往_dep对象的数组内加入watch
  }
  this.initialize()
}

new __watcher(() => {
  var html = String(this.__originHTML || '')
    .replace(/"/g, '\\"')
    .replace(/\s+|\r|\t|\n/g, ' ')
    .replace(/\{\{(.)*?\}\}/g, function (value) {
      return value.replace('{{', '"+(').replace('}}', ')+"')
    })
  html = `var targetHTML = "${html}";return targetHTML;`
  var parsedHTML = new Function(...Object.keys(this.$data), html)(
    ...Object.values(this.$data)
  )
  this.__root.innerHTML = parsedHTML
})
```

## 父子组件的渲染顺序和销毁顺序

- 组件的调用顺序都是`先父后子`,渲染完成的顺序是`先子后父`。

- 组件的销毁操作是`先父后子`，销毁完成的顺序是`先子后父`

::: info
父子组件的渲染顺序：
父 beforCreate -> 父 created -> 父 beforMount -> 子 beforCreate-> 子 created -> 子 beforMount -> 子 mounted -> 父 mounted
子组件的更新：
父 beforUpDate -> 子 beforUpdate ->子 updated -> 父 updated
父组件更新：
父 beforUpDate -> 父 updated
父子组件的销毁:
父 beforDestory -> 子 beforDestory ->子 destoried -> 父 destoried
:::

## 组件的各类传值方式

```javascript

// $是vue中内置属性和方法的前缀，用于分开自定义的属性和方法。
this.$data 相等于 vue中定义的 data：{}

// 父向孙传值：
this.$attrs //获取到当前组件父组件上传给其的绑定属性，除开当前组件中props已经定义的属性
$props //不可以通过this.$props获取到，其与当前组件中的props一样，props中定义好的属性，在组件创建好后会进入data中，所以可以用this来获取
this.$listeners //获取到当前组件的父组件上传给其的绑定方法,其里面的方法也不能通过this直接调用，只用this.$emit("方法名")来调用

// 父组件:
<template>
  <chidrens :data = "msg" @test="test">
  </chidrens>
</template>
data:{
  msg:'de'
}

// 子组件:
<template>
    <grandson v-bind="$attrs" v-on="$listeners">
      // 这里的v-bind 其实等于 data =‘$attrs.data’,v-on等于 @test=‘$listeners.test’
    </grandson>
</template>
// 通过 this.$emit("test")调用父组件方法

//孙子组件:
<template>
  <span>{{$attrs.data}}</span>

  // 也可以这样(要加上props)
  <span>{{data}}</span>

</template>
props：['data']
//通过 this.$emit("test")调用父组件方法

// 兄弟组件的传值方法：
$on //用于执行当前实例上的方法
$emit //用于调用当前实例上的方法，此方法也可以是不在method中定义的，不过这样的话需要使用$on执行

// 在全局定义一个vue实例
this.bus = new Vue();

// 兄弟组件一：
host(){
 this.bus.$emit("test",'sd')
}

// 兄弟组件二:
hostTwo(){
this.bus.$on('test',function(data){

})
}

// 父向子、孙子或者更下级的组件传值:
父组件:
export defalut {
  provide(){
   return {
      test:this
 }
 }
}

// 孙子组件：
export defalut {
inject:['test']
}

// 父组件:
export defalut {
  provide (){
  return {
   reload:this.reload
  }
},
 methods :{
  reload () {
      this.$nextTick(() => {})
  }
 }
}

// 孙子组件:
 inject:['reload']
//需要刷新页面的方法
 needReLoad(){
 this.reload();
}

// 父子组件之间的通信：
// 父组件：
 <template>
 <chlidrenOne></chlidrenOne>
<childrenTwo></childrenTwo>
</template>
this.$children // 得到一个数组，数组内部是子组件一和二的vue实例对象即this

子组件:
this.$parnet //得到父组件的vue实例对象即this
```

## $nextTick 方法

::: info

- 适用情况：用于在下次 dom 更新循环结束后，执行回调函数，获取更改后的 dom 元素，实际上是利用微任务优先的方式使用异步任务执行 nextTick 包裹的方法
- vue 在进行 dom 更新的时候是异步的，当发现有数据发生改变，就会开启一个队列，并缓冲同一事件内发生变动的所有数据，当一个数据在同一个事件内多次改变，只会推入队列中一次，这样就避免多余的数据计算和 dom 操作，同时 nextTick 会在缓冲队列中加入回调函数，确保回调函数在缓冲队列中所有的 watch 触发执行完后再执行，从而获取最新的 dom
- 具体使用: this.$nextTick(() => {})
  :::

## vue 组件的继承

```javascript

// 方法一 父组件
<template>
  <div>haha</div>
</template>
export default { methods:{ test(){ } } }

// 子组件：
<template></template>
import fatherComponent from '';
export default{
  extends:fatherComponent // 会继承父组件中的methods、data和template中的内容，但是如果子组件中有对应的方法和变量名的话，父组件的会被替换，且如果子组件的template中有内容的话就会替换继承来的父组件中的template中的内容
}

// 方法二 父组件：
<template>
  <div>haha</div>
</template>
export default { methods:{ test(){ } } }
//子组件:
import fatherComponent from'',
export default { mixins:[fatherComponent] } //使用混入继承
```

## .sync 修饰词和 v-model 的用法

.sync 主要用于当父组件向子组件传递了一个数据后，当子组件改变了这个数据，父组件也相应的改变这个数据

```javascript
// 父组件：
<template>
    <son :name.sync='msg'></son>
</template>
<script>
import son form '';
export default {
      data() {
          return {
              msg:'1'
          }
      },
}
</script>

// 子组件：
<template>
 <button @click="changeFatherData"></button>
</template>
<script>

export default {
      props:['name'],
      methods: {
          changeFatherData(){
              //通过emit进行改变
              this.$emit('update:name',23)
          }
      },
}
</script>
```

v-model 用于表单标签时，能实现数据的双向绑定，但用于自定义组件上时，能实现和.sync 一样的效果

```javascript
// 父组件：
<template>
     <son v-model="msg"></son>
     <!-- 等同于 -->
     <son :value='msg' @input='msg = $event'></son>
     <!-- 这里的$event其实就是子组件调用input方法时传入的第一个参数 -->
</template>
<script>
import son from " "
export default {
    components:{
        son
    },
    data(){
        return {
            msg:''
        }
    }
}
</script>

// 子组件：
<template>
</template>
<script>
export default {
    model:{
       prop:title, //这里修改从父组件中继承过来的value值的名字为title
       event:change, // 这里修改从父组件中继承过来方法的名字为change，即input变为了change
        //   <son :title='msg' @change='msg = $event'></son>
    },
    props:{
        value:{
            type:String,
            default:'',
        },
        title:{
             type:String,
            default:'',
        }
    },
    mounted() {
        this.$emit('input','sss')

    },
}
</script>
```

## 非 prop 传入的 Arrtibute 数据($attrs)

```javascript
// 父组件
<template>
 <children :testA="testA" :testB="testB"  testD='testD' class="testC" style="color:red"></children>
</template>
<script>
import children from "./about/index";
export default {
    components: {
        children,
    },
    data(){
        return {
            testA:'a',
            testB:'b'
        }
    },
};
</script>

// 子组件
<template>
    <!-- 从父组件处接受到了绑定的属性testA、testB，不绑定的属性testD class 和style -->
    <!-- 在单根元素的子组件内，除写在props内的属性，其他的属性都会由根元素继承 -->
    <div></div>
    <!-- 即以上的div会变为<div testB="testB"  testD='testD' class="testC" style="color:red"></div>
    -->
    <!-- 注意没有写入props中的绑定属性，在根元素继承时，会变为不绑定的属性 -->

    <!-- 如果是多根元素的子组件，则不会发生继承，例如以下情况 -->
    <div></div>
    <p></p>

    <!-- 想要指定子组件中特定的标签来继承父组件的属性，则需要$attrs和inheritAttrs
     -->
     <div>
         <!-- 通过$attrs来将父组件的属性转接到p标签上 -->
         <p v-bind="$attrs"></p>
     </div>
</template>
<script>
export default {
    props: ["testA"],
    // inheritAttrs表明父组件的属性是否由根元素来继承，true则由根元素继承，false则不是
    inheritAttrs:false,

};
</script>
```
