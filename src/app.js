//app.js
let Api = require('./http/api');
let myAxios = require('./http/myaxios')
let Env_config = require('./env/index.js')
let Router = require('./utils/Router')
let Store = require('./utils/Store')

/*------ 版本发布修改环境配置 ------*/
let env = 'Dev';
let config = {}
config = Env_config[env]; // 环境更换配置
config.mockApi = Env_config.mockApi;
config.env = env;
let loginUrl = config.baseApi + Api.index.login
App({
  axios:myAxios,
  Api:Api,
  Router:Router,
  Store:Store,
  config:config,
  globalData: {
    code:"",
    user:{name:0},
    userInfo:{name:0},
    isAuth:0,
    card:{
      openId:'',
      sessionKey:'',
      skey:''
    }
    // 占位 以免被覆盖
  },
  onLaunch: function () {
    let that = this
    // 展示本地存储能力
    console.log(App.config,'这样调的到吗')
    console.log(App.myAxios)
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 登录
    
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let obj = {}
        
        obj.code = res.code
        that.globalData.code = res.code
        console.log(res,'resCode进行退换')
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              console.log(res.authSetting,'授权项目')
              wx.setStorageSync('isAuth',1)
              that.globalData.isAuth = 1
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  that.globalData.userInfo = res.userInfo
                  that.globalData.user = res
                    obj = Object.assign(obj,res)
                    console.log(res,'应该是传这个')
                    // 还要大括号
                    myAxios(loginUrl,obj,"POST").then((res)=>{
                      if(res.state){
                        that.globalData.card.openId =  res.row.openId
                        that.globalData.card.sessionKey = res.row.sessionKey
                        that.globalData.card.skey = res.row.skey
                        wx.setStorageSync('token',res.row.authorization)
                      }
                    })
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                    
                  }
                }
              })
            }else{
              this.globalData.isAuth = 0
              wx.setStorageSync('isAuth',0)
              
            }
          }
        })
      }
    })
    // 获取用户信息
    // 获取设备信息
  },
  
})