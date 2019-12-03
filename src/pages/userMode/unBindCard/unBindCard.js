const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Store = App.Store
let Router = App.Router

Page({
  submit() {
    let url = Ip + Api.index.unBind
    let obj = {}
    axios(url, obj, 'PUT').then((res) => {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        success() {

        }
      })
      Store.setItem('token', '')
      wx.reLaunch({
        url: "/pages/index/index"
      })

    })
  }
})