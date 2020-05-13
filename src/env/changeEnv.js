let Env_config = require('./index')
let Router = require('../utils/Router')
let Store = require('../utils/Store')
const App = getApp()

module.exports = function changeEnv(index){
    console.log('你调用了改变信息')
    let env = ['Dev','Test','Slave','Prod']
    App.config = Env_config[env[index]] // 选取对象的value值 返回的还是个对象
    App.config.env = env[index]
    Store.clear() // 清除所有信息 包括授权缓存
    console.log(App,'现在的APP实例')
    
}

