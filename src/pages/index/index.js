//index.js
//获取应用实例
const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Store = App.Store
let Router = App.Router
let isAuth = Store.getItem('isAuth')
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    isAuth: 0,
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
    change: 0, // 左右判定
    swiperArr: [],
    place: "", // 位置 
  },
  //API处理

  //事件处理函数
  change(e) {
    let value = e.currentTarget.dataset.num
    this.setData({
      change: value
    })
    console.log(value, '点击的值是什么')
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
        for (let item of arr) {
          this.filterNull(item)
          item.introduction = this.filterStr(item.introduction)
        }
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
  _libSelect(params = {}) {
    let url = Ip + Api.libSelect.search
    let data = params
    axios(url, data, 'GET').then((res) => {
      let value = res.row[0]
      Store.setItem('lib', value)
      wx.setNavigationBarTitle({
        title: value.name
      })
      this.setData({
        place: value.name
      })
    })
  },
  _login(params = {}) {
    let url = Ip + Api.index.login
    let data = params
    axios(url, data, 'POST').then((res) => {
      App.globalData.card.openId = res.row.openId
      App.globalData.card.sessionKey = res.row.sessionKey
      App.globalData.card.skey = res.row.skey
      wx.setStorageSync('token', res.row.authorization)
      console.log('授权换token', res)
    })
  },

  // 过滤函数
  filterNull(obj) {
    for (let key in obj) {
      if (obj[key]) {

      } else {
        obj[key] = '无数据'
      }
    }
  },
  filterStr(str) {
    let len = str.length
    let result = str
    if (len > 60) {
      result = str.slice(0, 60) + '...'
    }
    return result
  },
  // 钩子函数 有点意思 onshow和onload vue里或者浏览器端有这个吗
  onLoad: function () {
    if (isAuth) {
      this._recommend()
    }
    this.initPlace()
    this._newBook()
    this._hot()
    console.log(App)
    console.log('进入首页')
  },
  onShow() {
    // 判断
    let pages = getCurrentPages()
    console.log(pages)
  },
  // 初始化参数
  initPlace() {
    let value = wx.getStorageSync('lib').name
    let isAuth = wx.getStorageSync('isAuth');
    if (value) {
      wx.setNavigationBarTitle({
        title: value
      })
      this.setData({
        place: value
      })
      console.log('值拿的到的吧', value)
    } else {
      this._libSelect()
    }
    this.setData({
      isAuth: isAuth
    })
  },
  onGotUserInfo(e) {
    console.log(e)


    if (e.detail.signature) {
      this.setData({
        isAuth: 1
      })
      this._recommend()
      // 开始存储信息 并且发送登录请求获取token
      App.globalData.userInfo = e.detail.userInfo
      App.globalData.user = e.detail
      let obj = {}
      obj.code = App.globalData.code
      obj = Object.assign(obj, e.detail)
      this._login(obj)
      wx.setStorageSync('isAuth', 1)
    } else {
      console.log('没授权吧')
    }
  },

})