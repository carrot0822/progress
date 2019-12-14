//logs.js
const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Router = App.Router
let Store = App.Store
Page({
  data: {
    list: [],
    pageSize: 15,
    currentPage: 1,

    toBottom: false,
    loading: false,
    errorTxt: '出现异常',
    first: false, // 可用来判定是不是第一次进来
  },
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
  _search(params = {}) {
    // 初始参数配置
    let place = Store.getItem('lib').name
    let obj = {
      place: place,
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage
    }
    let data = Object.assign(obj, params)
    let url = Ip + Api.index.hot


    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        // 判断是否还有下一页 可以用page来判定
        
        let arr = res.row
        this.setData({
          list: arr
        })
      } else {

      }
    })

  },
  // 钩子函数
  onLoad(option) {
    console.log(option, '是否有效')
    this._search()
  },
  // 用户上拉触底
  onReachBottom(e) {
  },
  // 用户下拉动作
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    let place = Store.getItem('lib').name || ''
    let data = {
      pageSize: this.data.pageSize,
      currentPage: 1,
      place: place
    }
    let url = Ip + Api.index.hot
    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        let arr = res.row // 直接初始化
        this.setData({
          list: arr
        })
      }
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();

      console.log(url, res)
    })
  }
})