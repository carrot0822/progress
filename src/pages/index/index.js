//index.js
//获取应用实例
const app = getApp()
let myAxios = require('../../http/myaxios')
Page({
  data: {

    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    inputValue:"", 
    hotRead:[],
    recommend:[],
    swiperArr:[],
    getUrl:"http://t.yushu.im/v2/movie/top250",
    bookUrl:'https://t.yushu.im/v2/book/search'
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
  _getBook(url){
    let par= url
    let data = {
      tag:'犯罪',
      start:'0',
      count:'3'
    }
    
    myAxios(par,data).then((res) => {
      console.log('这个接口调用成功了吗',res)
    })
  },
  onLoad: function () {
    this._getBook(this.data.bookUrl)



    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    
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
