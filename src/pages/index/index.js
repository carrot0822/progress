//index.js
//获取应用实例
const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Store = App.Store
let Router = App.Router
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgUrls: ['https://game.gtimg.cn/images/c2/web201801/pc/slider1.jpg',
      'https://game.gtimg.cn/images/c2/web201801/pc/slider2.jpg',
      'https://game.gtimg.cn/images/c2/web201801/pc/slider3.jpg',
      'https://game.gtimg.cn/images/c2/web201801/pc/slider4.jpg',
      'https://game.gtimg.cn/images/c2/web201801/pc/slider5.jpg',

    ],
    inputValue: "",
    hotRead: [],
    recommend: [],
    swiperArr: [],
    place: "", // 位置 
  },
  //API处理

  //事件处理函数
  bindViewTap: function () {

  },
  // 扩展四个小功能
  toBorrow() {
    wx.navigateTo({
      url: '../userMode/myBorrow/myBorrow'
    })
  },
  toBorrowHis() {
    wx.navigateTo({
      url: "../userMode/borrowHis/borrowHis"
    })
  },
  toActivity() {
    wx.navigateTo({
      url: "../searchMode/activity/activity"
    })
  },
  toLibSelect() {
    wx.navigateTo({
      url: "../searchMode/libSelect/libSelect"
    })
  },
  // 前往搜索
  toHot() {
    Router.push({
      path:'hotRecommend',
      query:{id:123},
      openType:'nav'
    })
  },
  // 
  toDetail(e) {
    
    let {id} = e.currentTarget.dataset
    console.log(e,'事件处理')
    console.log(e,'事件处理',id)
    /*
    wx.navigateTo({
      url: "../detail/detail"
    })*/
  },
  toSearch() {
    wx.navigateTo({
      url: "../searchMode/searchInput/searchInput"
    })
  },
  toRecommend() {
    console.log('前往查看更多')
    wx.navigateTo({
      url: '../list/list'
    })
  },

  tohotBro() {
    console.log('前往热门借阅')
  },
  // API
  _hot(params = {}) {
    let {
      place
    } = this.data
    console.log(place)
    let data = params
    let url = Ip + Api.index.hot
    axios(url, data, 'GET').then((res) => {
      if(res.state){
        let arr = res.row.slice(0,5)
        this.setData({
          hotRead:arr
        })
      }
      console.log(url, res)
    })
  },
  // 钩子函数
  onLoad: function () {
    let value = wx.getStorageSync('lib').name
    if (value) {
      wx.setNavigationBarTitle({
        title: value
      })
      this.setData({
        place: value
      })
      console.log('值拿的到的吧', value)
    } else {

    }
    this._hot()
    console.log('进入首页')
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})