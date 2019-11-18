//logs.js
const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Router = App.Router

Page({
  data: {
    list: []
  },
  toDetail(e){
    let {id} = e.currentTarget
    let obj = {}
    obj.fkCataBookId = id
    console.log(e,'如果拿的到',id)
    Router.push({
      path:"detail",
      query:obj,
      openType:'nav'
    })
  },
  _search(params={}){
      let {
        list
      } = this.data
      console.log(list)
      let data = params
      let url = Ip + Api.index.hot
      axios(url, data, 'GET').then((res) => {
        if(res.state){
          let arr = res.row
          this.setData({
            list:arr
          })
        }
        console.log(url, res)
      })

  },
  // 钩子函数
  onLoad(option){
    console.log(option,'是否有效')
    this._search()
  },
  
  
})
