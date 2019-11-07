//app.js
let fetchApi = require('./http/fetch.js');
let Api = require('./http/api.js');
let myAxios = require('./http/myaxios')
let loginUrl = require("./http/user")
let Env_config = require('./env/index.js')
console.log(loginUrl,'调用')
/*------ 版本发布修改环境配置 ------*/
let env = 'Test';
App.config = Env_config[env]; // 环境更换配置
App.config.mockApi = Env_config.mockApi;
App.config.env = env;
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 登录
    
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let obj = {}
        obj.code = res.code
        this.globalData.code = res.code
        console.log(res,'resCode进行退换')
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              console.log(res.authSetting,'授权项目')
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                    this.globalData.userInfo = res.userInfo
                    this.globalData.user = res
                    obj = Object.assign(obj,res)
                    console.log(res,'应该是传这个')
                    // 还要大括号
                    myAxios(loginUrl.login,obj,"POST").then((res)=>{
                      console.log(res)
                    })
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                    
                  }
                }
              })
            }else{
              console.log("123456")
            }
          }
        })
      }
    })
    // 获取用户信息
    
  },
  globalData: {
    userInfo: null,
    code:"",
    user:{}
  }
})