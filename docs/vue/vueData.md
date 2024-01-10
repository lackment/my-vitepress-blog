---
title: vue的全局状态
description: vue的全局数据状态处理
tags:
  - vue
readingTime: true
author: 'LackMent'
---

#

## vueX 状态管理

用于解决不相关组件之间的传值

```javascript
  let Store = new Vue.store({
            state: {
                a: 'a'
                //公共数据
                调用方法 this.$store.state.a
            }
            mutations: {
                //任何想要改变state中数据的行为必须调用mutations的对应的方法
                test(state) {
                    通过state.a的方式获取state中的数据
                }
                通过this.$store.commit('mutations中的方法名'，
                    参数) 来调用
            }
            getters： {
                //对state中的数据进行加工来返回给调用者，但是不修改state中的数据
                test（ state） {
                    return state.a + 'b'

                }
                //通过this.$store.getters.test来调用
            }
            actions： {
                //所有的异步方法都写在这中
                test（ store） {
                    得到store对象， 调用其数据与上面所写调用方法一样

                }
                //通过this.$store.dispatch('方法名'，参数)来调用

            }
        })
```

### `module`多状态管理

```javascript
let store = new Vue.store({
   modules:{
       moduleA:{
              namespaced: true, //因为vuex中mutations、gettes和actions不管是多少个模块，都是处在同一个执行环境中，即通过对应的方法名就可以调用，而加上这个就需要在调用的时候加上模块名
              state:{
                  a:"1"
                  //通过this.$store.state.moduelA.a 来调用
              },
             mutations:{
                 getA(state){
                     //state代表模块内部中的state
                 }
                 //有namespaced时，通过this.$store.commit("moduleA/getA")来调用
                 //没有namespaced时，通过this.$store.commit("getA")来调用
             },
             getters:{
                 getA(state,getters,rootState){
                     //state代表模块内部是state数据
                     //getters可以用于调用其他模块的getters中的方法，即getter['moduleB/getA']
                     //rootstate可以用于调用主模块中state的数据
                 }
                 //有namespaced时，通过this.$store.getters["moduleA/getA"]来调用
                 //没有namespaced时，通过this.$store.getters.getA来调用
             },
             actions:{
                 async getA({state,commit,dispatch,getters,rootState}){
                      //state代表模块内部是state数据
                     //getters可以用于调用其他模块的getters中的方法，即getter['moduleB/getA']
                     //commit可以用于调用其他模块的mutations中的方法，即commit('moduleB/getA')
                     //dispatch可以用于调用其他模块的actions中的方法，即dispatch('moduleB/getA')
                     //rootstate可以用于调用主模块中state的数据
                 }
                  //有namespaced时，通过this.$store.dispatch("moduleA/getA")来调用
                 //没有namespaced时，通过this.$store.dispatch("getA")来调用

             }
       //比较特殊的一点，Actions中的函数是可以返回一个promise对象的，然后用dispatch调用时，可以用then方法设置回调函数
           actions: {
               testA() {
                   return new Promise(function(resolve, reject) {});
               },
               testB({ dispatch }) {
                   dispatch('moduleA/testA').then(res => {

                   })
               },
               //也可以这样写
               async testB({ dispatch }) {
                   const res = await dispatch('moduleA/testA');

               }
           }
       }
   }

})
```

### mapState、mapMutation、mapGetters 和 mapActions 辅助函数的使用

```javascript
//在要使用的vue文件中
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    //mapState的作用在于，当要多次调用state中不同的数据时，一个个在computed中写的话，会造成代码臃肿的问题
    //mapState,mapMutations,mapGetters,mapActions都返回一个对象
    //如果调用模块有namespaced则，第一个参数为模块名，后面的为要调用的数据,如果没有，则不需要传
    ...mapState('moduleA', ['testA']),
    //这等同于在computed中增加了一个testA对象
    testA() {
      return this.$store.state.moduleA.testA
    },
    //还可以通过对象来来传入内容
    ...mapState('moduleA', {
      testA: 'testA',
      //或者
      testA: (state) => state.testA,
    }),
  },
  methods: {
    //mapMutations,mapGetters,mapActions都是要通过在methods中写才有用
    ...mapMutations('moduleA', ['testA']),
    ...mapGetters('moduleA', ['testA']),
    ...mapActions('moduleA', ['testA']),
    //也可以通过传入对象的方式来写
    //通过this.testA()就可以调用方法
  },
}
```

## observable（轻量数据管理中心）

相对于 vuex 来说很轻量，且使用方法也很简单

```javascript
// 这样就使obj这个数据具有了响应的特性
let obj = Vue.observable({
  a: 'a',
  d: 'v',
})

//和vuex类似，要想改变内部state的数据，需要通过方法
function changeA(data) {
  obj.a = data
}

// 导出这个响应的数据，方便不同地方引用
export default {
  obj,
  changeA,
}
```
