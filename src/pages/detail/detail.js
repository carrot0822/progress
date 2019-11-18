//logs.js
const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Store = App.Store
let Router = App.Router
Page({
  data: {
    detail: {},
    list: [],
    place:""
  },
  // api
  _search(params) {
    let data = params
    let url = Ip + Api.index.detail
    axios(url, data, 'GET').then((res) => {
      console.log(res)
      if (res.state) {
        this.setData({
          detail: res.row
        })
      }
    })
  },
  _list(params) {
    let data = params
    let url = Ip + Api.index.posList
    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        let filterArr = this.filterList(res.row)
        this.setData({
          list: filterArr
        })
      } else {

      }
      console.log(res, '馆藏')
    })
  },
  filterList(arr) {
    let map = ['无', '在架', '借出']
    let result = []
    if (arr.length) {
      for (let item of arr) {
        let obj = {}
        obj.callNumber = item.callNumber
        let i = item.lendState
        obj.lendState = map[i]
        let pos = item.stoTbLocation
        obj.position = `${pos.fkStoreName}楼${pos.fkRegionName}区${pos.colNum}架${pos.direction}面${pos.divNum}列${pos.laysNum}层`
        result.push(obj)
      }
    }
    console.log(result, '结果')
    return result
  },
  onLoad: function (option) {
    let obj = option
    let place = Store.getItem('lib').name
    this.setData({
      place:place
    })
    let pos = Object.assign({
      place
    }, option)
    this._search(obj)
    this._list(pos)
    console.log(option)
  }
})