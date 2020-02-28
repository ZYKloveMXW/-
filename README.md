# 外卖项目分析

> 注意文中的`挖坑`字眼，记得埋坑

## 1. 项目文件分类（只说最常用的src

* assets: 静态资源,比如 **js/css/小图片**
* components: 公用组件的地方（**注意区分路由组件**
* pages: 页面编写的地方(路由组件
* router: 配置路由的
* main.js （配置加载各种公共组件/UI库

### 多说一句：static是存储json/img的地方




## 2. iconfont/css预处理器的使用

### 2.1 iconfont

通过访问阿里的 [阿里](https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=1646899)iconfont库可以获得你想要的svg矢量图



### 2.2 css预处理器(stylus)

```js
//安装
cnpm install stylus stylus-loader --save-dev
//使用样式
<style lang="stylus">
```

**stylus的语法类似于python,用缩进替代了花括号，并且可以不写分号和冒号**

例:

```stylus
#app
    color red
    background blue
//1.其中后代关系也可以用缩进表示
#app
    color red
    #app_child
        color green
//2.子代关系用‘>’

//3.函数的使用
Color()
    border arguments
//这里的arguments表示传进的参数可以是任意形式，比如带逗号/空格的字符串
#app
    Color(1px red solid)
//分割线:以上等于------------------------
#app {
    border 1px red solid
}
```

1.定义变量并赋值(建议用`$`作为变量前缀), 如`$`width=3px
2.函数参数可以写默认值,类似于es6的解构赋值, 如 padding(top=1px,right=2px)
3.方法名加() 为调用函数,如 border()
4.建议变量定义在最上面, 然后是函数, 然后才是代码. 最好的方式是变量和函数定义成单独的文件, 然后通过@import variable.styl 导入
**5.使用@height 会冒泡查找值, 如自身有此属性则获取该属性值; 否则层层向上查找该属性, 如果都没有则报错**
6.可以使用运算符进行计算
**7.z-index 1 unless @z-index 表示默认 z-index=1 除非 @z-index 存在** (结合第5点的冒泡查找)



**再说个循环和条件分支得了，以后大概率只用这些，太深入的不需要~~**

```stylus
//一个情景：ul下面有6个li标签,要求它们全部都是红色字体,且奇数的li边框是蓝色的，偶数li边框是红色的
Border(arg)
    border 1px arg solid

ul
    for row in 1 2 3 4 5 6
    :nth-child({row})
        color red
    if row%2 ==0
        :nth-child({row})
            Border(red)
    else
        :nth-child({row})
            Border(blue)
```

**还有运算符什么的，我个人感觉不太需要到，现用现查吧..**




## 3.vuex使用的坑:注册，视图渲染,mutations用法
### 3.1 注册
* 首先你要在src下创建一个store文件夹,然后在里面创建一个`store.js`
* 然后在`store.js`里面引入Vue/Vuex包,并把vuex绑定在vue上
* 创建变量`store`来接受对象(`new Vuex.Store({})`,记得export导出包
* 最后在`main.js`里面引入store,然后在实例中注册

### 3.2视图渲染的坑
**即：vuex数据更新后，插件中使用数据的地方没有更新**

解决方法：在模板中直接使用 $store.state.AdminInfo 这样就能随时拿到最新的状态值了

> 原因：页面加载前 Data 获取 store 里的值赋给自己，这样 Data 只有一初始值，后续vuex中状态发生改变，并不会再次赋值给 tableData ，除非页面刷新重新加载，组件生命周期重新开始，才能拿到最新的值

### 3.3 mutations传值用法
#### 提交载荷（Payload）
你可以向 store.commit 传入额外的参数，即 mutation 的 载荷（payload）：
``` js
mutations: {
  increment (state, n) {
    state.count += n
  }
}
//下面是在组件中的写法
store.commit('increment', 10)
```
在大多数情况下，载荷应该是一个对象，这样可以包含多个字段并且记录的 mutation 会更易读：

```js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
store.commit('increment', {
  amount: 10
})
```



## 4.图片src的问题(require模块)

**多说一句，这是个坑啊,assets文件夹下的资源都是会经过webpack打包处理的，因此里面的资源是会被当做模块引用，所以在js中的图片地址不能是一个简单的字符串，而要用require把图片当成一个包引用进来**

当然，static文件夹下的图片就不用(它不用webpack打包，不过它是**绝对路径**



## 5.vant库相关问题：

### 5.1.

底部栏自定义图片的时候 用`<img slot="icon" slot-scope="props" :src="props.active ? icon.active : icon.inactive" />`vant给好的插槽进行运用,其中props是作用域插槽传来的值(父组件的值data)

### 5.2

如果觉得组件库里面的样式不合你意，可以自己创建一个全局样式，获取你要改的那个组件名，然后在全局样式里面覆盖即可



### 5.3

局部scroll的方法：核心思想就是脱离文档流，给定`margin-bottom`和`top`高度即可

``` css
#recommend {
  position: fixed;
  width: 100%;
  top: 300px;
  bottom: 0;
  margin-bottom: 50px;
  overflow: scroll;
}
```

## 6.`router`和`route`的对比
### 6.1 router
`router`是vueRouter的实例，就是一个全局的路由器对象，**它是包括route的**

`router`最常用的是`router.push()/go()`

> 事实上，`route`就是`router`下面的每一个页面的路由子对象

### 6.2 route
`$route`对象表示当前的路由信息，里面常用的信息有：`path`,`params`,`query`,`meta`(这个meta/路由元信息挺重要的感觉，很多的条件判断都用到它)


## 7.watch和nextTick()
### 7.1 watch
基本用法如下
``` js
watch: {
  //msg是你想监听的数据
  msg: function(new,old) {
    ......
  }
}
```
由于上面的方法需要触发数据更新后才能调动，如果有需求立即调用的话,可以用如下方法
``` js
watch: {
  msg: {
    handler(new,old) {

    },
    immediate: true   //这里是false的话和上面例子一样
  }
}
```
如果要监听数组/对象内部的数据更新
> 加个deep属性即可  注意：**这样的方法对性能影响很大,修改obj里面任何一个属性都会触发这个监听器里的 handler**

解决方法：直接监听你想要的那个对象里面的属性：`watch:{obj.msg}`
### 7.2 Vue.nextTick()/this.$nextTick()
**定义:** 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM
查阅文档可知：支持`promise`写法：
``` js
Vue.nextTick()
  .then(function() {
    ...
  })
```
**使用场景:** 
* Vue生命周期的created()钩子函数进行的DOM操作一定要放在Vue.nextTick()的回调函数中，原因是在created()钩子函数执行的时候DOM 其实并未进行任何渲染，而此时进行DOM操作无异于徒劳
* 当项目中你想在改变DOM元素的数据后基于新的dom做点什么，对新DOM一系列的js操作都需要放进Vue.nextTick()的回调函数中

## 8.mutations
### 8.1 上面已经说过的提交载荷
多说一句,提交一个对象时应该使用**对象风格**的提交
``` js
store.commit({
  type: 'increment',    //以前是store.commit('increment',{ amount })
  amount: 10
})
//下面是store.js里面的
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```
### 8.2 多人协作开发下的风格

例如：

``` js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

``` js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

### 8.3修改(增加)state中的对象

简单修改基础类型的状态数据倒是简单，没什么限制，但是如果修改的是对象，那就要注意了 

```csharp
const store = new Vuex.Store({
  state: {
    student: {
      name: '小明',
      sex: '女'
    }
  }
})
```

这个时候，我们如果想要给 `student` 添加一个年龄 `age: 18` 属性，怎么办呢？

是的，直接在 `sex` 下面把这个字段加上去不就行了，能这样当然最好了。但是如果我们要动态的修改呢？那就得遵循 Vue 的规则了。如下：

```csharp
mutations: {
  addAge (state) {
    Vue.set(state.student, 'age', 18)
    // 或者：
    // state.student = { ...state.student, age: 18 }
  }
}
```

原因：Vuex 的 store 中的状态是响应式的，那么当我们变更状态时，监视状态的 Vue 组件也会自动更新。这也意味着 Vuex 中的 mutation 也需要与使用 Vue 一样遵守一些注意事项：

1. 最好提前在你的 store 中初始化好所有所需属性。
2. 当需要在对象上添加新属性时，你应该

- 使用 `Vue.set(obj, 'newProp', 123)`, 或者
- 以新对象替换老对象。例如，利用**对象展开运算符**

***

> 这里补充一下展开运算符(ES6语法)
>
> **来看一下几个使用情景**



* 1. 函数中的形参是个体，但是实参是一个个体组成的数组：

``` js
function test(a, b, c) { }
var args = [0, 1, 2];
//这个时候可以想到apply的特性，对数组进行特殊转换
test.apply(null, args);
```

* 不过有了ES6，我们就可以更加简洁地来传递数组参数：

```js
function test(a,b,c) { }
var args = [0,1,2];
test(...args);
```

* 2.合并数组/对象

``` js
var arr1=['a','b','c'];
var arr2=['d','e'];
arr1.push(...arr2); //['a','b','c','d','e']
//分割线
let a={x:1,y:2};
let b={z:3};
let ab={...a,...b};
ab //{x:1,y:2,z:3}
```

* 3.解构赋值

``` js
let [arg1,arg2,...arg3] = [1, 2, 3, 4];
arg1 //1
arg2 //2
arg3 //['3','4']
```

不过要注意，解构赋值中展开运算符只能用在最后：

```js
let [arg1,...arg2,arg3] = [1, 2, 3, 4]; //报错
```

> 多说一句,解构赋值涉及到浅拷贝/深拷贝的问题：shortcuts2 = shortcuts这种写法，放在以前我们知道对于引用类型来说赋值操作其实传递的只是这个对象的地址（粗浅的说），意味着如果按照shortcuts2 = shortcuts的写法的话当改变shortcuts2中的属性的值的话shortcuts也会同样改变。换言之shortcuts和shortcuts2两个变量指向了同一段内存地址。**但是如果是 shortcuts2 = {...shortcuts}，这样的写的话，由于shortcuts中的属性类型都是基本类型，相当于是新建了一个对象，此时改变shortcuts2中的属性值，shortcuts将不受影响——某种意义上实现了对象之间的深拷贝**.当然，如果对象里面的`value`也是引用类型，那么就算你是解构赋值，对象里面的`value`.value修改后也是会影响到原来的数据（**挖坑，深拷贝/浅拷贝的代码实现**

## 9.action

### 9.1 什么是action(附上参数解构)

其实很多人说action是为了解决mutation中不能使用异步处理的问题，但是根据vue原作者尤雨溪所说：

> action是为了解决异步mutation无法使用dev-tools进行跟踪的问题，事实上，抛开dev-tools，你完全可以在mutation中使用异步操作

OK~话不多说，我们直接上代码：

```js
const store = new Vuex.Store({
    state: {
        msg: '汕头市潮阳区'
    },
    mutations: {
        getMsg: (state, obj) => {
            state.msg = obj.msg
        }
    },
    // actions的事件名称和mutations不一样
    actions: {
        //这里用到了对象参数解构：参数context是一个对象，里面有commit来提交一个mutation
        sendMsg: ({ commit }) => {
            axios.get('http://localhost:3000/picture')
                .then(res => {
                    commit({
                        //	提交'getMsg'的mutation
                        type: 'getMsg',
                        msg: res.data[2].url
                    })
                })
        }
    }
})
//在.vue文件里面的methods，我们这样写
get() {
    this.$store.dispatch('sendMsg')	//action里面的函数名
}
```



## 10 asnyc/await(我一直想解决这个坑)

### 10.1 基础:promise

[这个大佬讲的特别好]: https://juejin.im/post/5a93eb146fb9a0633611779a



### 10.2

吐了..越看坑越多/任务队列？微任务？宏任务？

## 跨域

## @的作用
## 记录一下stylus的坑：子级元素的css必须在父级元素之下(雾...)

## npm run build生产环境打包的情况下记得在config/index.js更改下路径
