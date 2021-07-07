import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 将Message挂载在vue的属性对象上，并自定义$message变量来承载Message,后面直接this.$message就可以调用Message对象
Vue.prototype.$message = Message
