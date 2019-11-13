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
    imgUrls:['https://game.gtimg.cn/images/c2/web201801/pc/slider1.jpg',
            'https://game.gtimg.cn/images/c2/web201801/pc/slider2.jpg',
            'https://game.gtimg.cn/images/c2/web201801/pc/slider3.jpg',
            'https://game.gtimg.cn/images/c2/web201801/pc/slider4.jpg',
            'https://game.gtimg.cn/images/c2/web201801/pc/slider5.jpg',

          ],
    inputValue:"", 
    hotRead:[],
    recommend:[],
    swiperArr:[],

  },
  
  //事件处理函数
  bindViewTap: function() {
    
  },
  // 扩展四个小功能
  toBorrow(){
    wx.navigateTo({
      url: '../userMode/myBorrow/myBorrow'
    })
  },
  toBorrowHis(){
    wx.navigateTo({
      url:"../userMode/borrowHis/borrowHis"
    })
  },
  toActivity(){
    wx.navigateTo({
      url:"../searchMode/activity/activity"
    })
  },
  toLibSelect(){
    wx.navigateTo({
      url:"../searchMode/libSelect/libSelect"
    })
  },
  // 前往搜索
  toHot(){
    wx.navigateTo({
      url:"../searchMode/hotRecommend/hotRecommend"
    })
  },
  // 
  toDetail(){
    wx.navigateTo({
      url:"../detail/detail"
    })
  },
  toSearch(){
    wx.navigateTo({
      url:"../searchMode/searchInput/searchInput"
    })
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
