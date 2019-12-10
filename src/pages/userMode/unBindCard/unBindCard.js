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
      if (res.state) {
        wx.showToast({
          title: '解绑成功',
          icon: 'success',
          duration: 2000,
          success() {

          }
        })
        Store.setItem('token', '')
        setTimeout(() => {
          wx.reLaunch({
            url: "/pages/index/index"
          })
        }, 2000)
      }else{
        wx.showToast({
          title: res.msg,
          duration: 2000,
          success() {

          }
        })
      }
    })
  }
})