const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Store = App.Store
let Router = App.Router

Page({
  data: {
    account:"",
    password:""
  },
  onLoad: function () {
    
  },
  accountBtn(e){

  },
  pswBtn(e){

  },
  // form表单 非空校检
  submit(e){
    let url = Ip + Api.index.bindCard
    let obj = {

    }
    obj.openid = App.globalData.card.openId
    obj = Object.assign(obj,e.detail.value)
    console.log(e.detail.value)
    axios(url,obj,'POST').then((res)=>{
      console.log(res,'绑定')
    })
    console.log( this.data.account, this.data.password)
    console.log('绑定成功后回跳页面',App.globalData.card.openId)
  }
})
