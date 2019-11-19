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
    newBook: [],
    change:0, // 左右判定
    swiperArr: [],
    place: "", // 位置 
  },
  //API处理

  //事件处理函数
  change(e){
    let value  = e.currentTarget.dataset.num
    this.setData({
      change:value
    })
    console.log(value,'点击的值是什么')
  },
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
      path: 'hotRecommend',
      query: {
        id: 123
      },
      openType: 'nav'
    })
  },
  // 
  toDetail(e) {
    let {
      id
    } = e.currentTarget
    let obj = {}
    obj.fkCataBookId = id
    console.log(e, '如果拿的到', id)
    Router.push({
      path: "detail",
      query: obj,
      openType: 'nav'
    })
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
    let obj = {}
    obj.place = this.data.place
    let data = Object.assign(obj, params)
    let url = Ip + Api.index.hot
    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        let arr = res.row.slice(0, 5)
        this.setData({
          hotRead: arr
        })
      }
    })
  },
  _recommend(params = {}) {
    let obj = {}
    obj.place = this.data.place
    let data = Object.assign(obj, params)
    let url = Ip + Api.index.recommend
    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        let arr = res.row
        this.setData({
          recommend: arr
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
        })
      }
    })
  },
  _newBook(params = {}) {
    let obj = {}
    obj.place = this.data.place
    let data = Object.assign(obj, params)
    let url = Ip + Api.index.newBook
    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        let arr = res.row
        this.setData({
          newBook: arr
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',

        })
      }
    })
  },
  // 钩子函数 有点意思 onshow和onload vue里或者浏览器端有这个吗
  onLoad: function () {


    console.log('进入首页')
  },
  onShow() {
    // 判断
    this.initPlace()
    this._recommend()
    this._newBook()
    this._hot()
  },
  initPlace() {
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
      Store.setItem('lib', {
        name: ''
      })
    }
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