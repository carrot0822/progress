//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    inputValue:"", 
    hotRead:[],
    recommend:[],
    swiperArr:[],

  },
  //事件处理函数
  bindViewTap: function() {
    
  },
  toRecommend(){
    console.log('前往查看更多')
    wx.navigateTo({
      url: '../list/list'
    })
  },
  tohotBro(){
    console.log('前往热门借阅')
  },
  
  onLoad: function () {
    console.log('进入首页')
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
