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
    place: "",
    isCollect: false,
    id: "",
    jugeType:false, // 检查ISSN和ISBN类别
  },
  tapCollect() {
    let juge = this.data.isCollect
    let obj = {}
    obj.fkBookId = this.data.id
    let pbj = {}
    let arr = []
    arr.push(this.data.id)
    pbj.ids = arr
    if (juge) {
      this._cancelCollect(pbj)
    } else {
      this._addCollect(obj)
    }
    console.log('juege')
  },
  // api
  _search(params = {}) {
    let data = params
    let url = Ip + Api.index.detail
    axios(url, data, 'GET').then((res) => {
      console.log(res)
      if (res.state) {
        this.filterNull(res.row)
        console.log(res.row.hasOwnProperty('isbn'),'检查是图书还是期刊')
        let jugeType = res.row.hasOwnProperty('isbn')
        this.setData({
          detail: res.row,
          jugeType:jugeType
        })
      }
    })
  },
  _list(params = {}) {
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
  // 是否收藏
  _isCollect(params = {}) {
    let data = params
    let url = Ip + Api.index.isCollect
    axios(url, data, 'GET').then((res) => {
      console.log(res, '是否收藏')
      if (res.code == 200) {
        
        this.setData({
          isCollect: true
        })
        
      } else {
        
        this.setData({
          isCollect: false
        })
      }
    })
  },
  _addCollect(params = {}) {
    let data = params
    let url = Ip + Api.index.addCollect
    axios(url, data, "POST").then((res) => {
      if (res.state) {
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000
        })
        this.setData({
          isCollect: true
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  _cancelCollect(params = {}) {
    let data = params
    let url = Ip + Api.index.cancelCollect
    axios(url, data, "DELETE").then((res) => {
      if (res.state) {
        wx.showToast({
          title: '取消收藏成功',
          icon: 'success',
          duration: 2000
        })
        this.setData({
          isCollect: false
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  filterNull(obj) {
    for (let key in obj) {
      if (obj[key] || key == "coverPhotoUrl") {

      } else {
        obj[key] = '无数据'
      }
    }

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
    let token = Store.getItem('token')
    let id = option.fkCataBookId
    this.setData({
      place: place,
      id: id
    })
    let pos = Object.assign({
      place
    }, option)

    if (token) {
      let idObj = {}
      idObj.id = option.fkCataBookId
      this._isCollect(idObj)
    }
    this._search(obj)
    this._list(pos)
    console.log(option)
  }
})