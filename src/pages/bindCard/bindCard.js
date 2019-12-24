const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Store = App.Store
let Router = App.Router

Page({
  data: {
    account: "",
    password: ""
  },
  onLoad: function () {
    wx.login({
      timeout: 10000,
      success: (res) => {
        console.log(res)
      },
      fail: () => {},
      complete: () => {}
    });
  },
  accountBtn(e) {

  },
  pswBtn(e) {

  },

  // form表单 非空校检
  submit(e) {
    let url = Ip + Api.index.bindCard
    let obj = {

    }
    obj.openid = App.globalData.card.openId
    obj = Object.assign(obj, e.detail.value)
    console.log(e.detail.value, obj, '绑卡')
    axios(url, obj, 'POST').then((res) => {
      if (res.state) {
        let toekn = res.row.authorization
        Store.setItem('token', toekn)
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 2000
        })
        console.log(Store.getItem('token'), "准备跳转到首页")
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,

            success() {
              let page = getCurrentPages().pop();
              console.log('那么这里拿到的页面信息', page)
              if (page == undefined || page == null) return;
              page.onLoad()
            }
          })
        }, 2000)


      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
      console.log(res, '绑定')
    })
    console.log(this.data.account, this.data.password)
    console.log('绑定成功后回跳页面', App.globalData.card.openId)
  },
})