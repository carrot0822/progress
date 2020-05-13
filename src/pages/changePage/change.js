//logs.js
let change = require('../../env/changeEnv')

Page({
  data: {
    logs: []
  },
  toIndex(){
    wx.navigateTo({
      url: '/pages/index/index',
      success() {
        console.log('调换成功')
      }
    })
  },
  onLoad: function () {
    change(0)
    wx.switchTab({
      url:'/pages/index/index'
    })
    console.log(change, '直接是函数吗')
  }
})