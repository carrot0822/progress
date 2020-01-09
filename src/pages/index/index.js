//index.js
//获取应用实例
const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Store = App.Store
let Router = App.Router
let isAuth = Store.getItem('isAuth')
let colorArr = ['ff2424', 'ff6021', 'ff9b24', 'ffba13', 'fbc133']
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    isAuth: 0,
    imgUrls: [],
    inputValue: "",
    hotRead: [],
    recommend: [],
    newBook: [],
    change: 0, // 左右判定
    swiperArr: [],
    linkArr: [], // 广告
    place: "", // 位置 

  },
  //API处理
  imgError(e) {
    console.log('baocuo', e)
  },
  //事件处理函数
  change(e) {
    let value = e.currentTarget.dataset.num
    this.setData({
      change: value
    })
    console.log(value, '点击的值是什么')
  },
  toLink(e) {
    let {
      linkType,
      link
    } = e.currentTarget.dataset.link
    let obj = {}

    if (linkType == '0') {
      obj.id = link
      Router.push({
        path: "article",
        query: obj,
        openType: 'nav'
      })
    } else {
      wx.navigateTo({
        url: `/pages/link/link?link=${link}`
      })
      /* obj.link = link
      Router.push({
        path:"link",
        query:obj,
        openType:'nav'
      }) */
    }
    console.log('链接跳转', e)
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
  init() {
    this._banner()
    this._hot()
    this._recommend()
    this._newBook()
    this.initPlace()
  },
  // API
  _banner(params = {}) {
    let url = Ip + Api.index.banner
    let data = params
    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        console.log(res.row.linkArr, '广告')
        this.setData({
          linkArr: res.row.linkArr
        })
      }
    })
  },
  _hot(params = {}) {
    let obj = {}
    obj.place = wx.getStorageSync('lib').name
    let data = Object.assign(obj, params)
    let url = Ip + Api.index.hot
    axios(url, data, 'GET').then((res) => {
      if (res.state) {

        let arr = res.row.slice(0, 5)
        for (let [index, item] of arr.entries()) {
          item.color = colorArr[index]
        }
        console.log(arr, '过滤后的热门')
        this.setData({
          hotRead: arr
        })
      }
    })
  },
  _recommend(params = {}) {
    let obj = {}
    obj.place = wx.getStorageSync('lib').name
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
    obj.place = wx.getStorageSync('lib').name
    let data = Object.assign(obj, params)
    let url = Ip + Api.index.newBook
    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        let arr = res.row
        for (let item of arr) {
          this.filterNull(item)
          item.introduction = this.filterStr(item.introduction)
        }
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
      this._recommend()
      this._newBook()
      this._hot()
      console.log(value, )
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
      if (obj[key] || key == "coverPhotoUrl") {

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
    /*   if (isAuth) {
        this._recommend()
      } */
    this.initPlace()
    this._banner()


    console.log(App)
    console.log('进入首页')
  },
  onShow() {
    // 判断
    let fromLib = wx.getStorageSync('fromLib')
    if (fromLib) {
      this.init()
      Store.setItem('fromLib', false)
      console.log('从馆藏选择过来的')
    }
    let isAuth = wx.getStorageSync('isAuth');
    this.setData({
      isAuth: isAuth
    })
  },
  onReady() {

  },
  // 初始化参数
  initPlace() {
    let value = wx.getStorageSync('lib').name
    let isAuth = wx.getStorageSync('isAuth') || 0;
    console.log(value, 'nmd值应该拿到了啊')
    if (value) {
      wx.setNavigationBarTitle({
        title: value
      })
      this.setData({
        place: value
      })
      this._recommend()
      this._newBook()
      this._hot()
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