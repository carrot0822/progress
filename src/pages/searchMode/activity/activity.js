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
  toArticle() {
    wx.navigateTo({
      url: "../article/article"
    })
  },
})