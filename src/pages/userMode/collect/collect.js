//log

const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Store = App.Store
let Router = App.Router

Page({
  data: {
    list: [],
    pageSize: 10,
    currentPage: 1,

    toBottom: false,
    loading: false,
    errorTxt: '出现异常',
    first: false, // 可用来判定是不是第一次进来
  },
  // 控制打开和关闭移除
  control(){
    wx.navigateTo({
      url: './../collectM/collectM',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
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
    let obj = {
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage
    }
    let data = Object.assign(obj, params)
    let url = Ip + Api.index.collect
    // 请求开始
    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        // 判断是否还有下一页 可以用page来判定
        if (res.row.length < 10) {
          this.setData({
            toBottom: true
          })
        }
        console.log(this.data.list, '现在的数据', res)

        let arr = this.data.list.concat(res.row)
        for (let item of arr){
          this.filterNull(item)
          //item.introduction = this.filterStr(item.introduction)
        }
        this.setData({
          list: arr
        })
        console.log(this.data.list, '现在的数据', res)
      } else {}

    })

  },
  _initSearch(params = {}){

    let data =  params
    let url = Ip + Api.index.collect
    // 请求开始
    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        // 判断是否还有下一页 可以用page来判定
        if (res.row.length < 10) {
          this.setData({
            toBottom: true
          })
        }
        let arr = res.row
        for (let item of arr){
          this.filterNull(item)
          //item.introduction = this.filterStr(item.introduction)
        }
        this.setData({
          list: arr
        })
        console.log(this.data.list, '初始化', res)
      } else {}

    })
  },
  // 过滤函数
  filterNull(obj) {
    for (let key in obj) {
      if (obj[key]||key == 'url') {

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
  // 钩子函数
  onLoad(option) {
    
  },
  onShow(){
    console.log( '是否有效')
    this._initSearch()
  },
  // 用户上拉触底
  toBottom(e) {
    let juge = this.data.toBottom
    let currentPage = ++this.data.currentPage
    if (!juge) {
      this.setData({
        currentPage: currentPage
      })
      this._search()
    }
    console.log("上拉刷新会怎么样 那个logo", e)
  },
  // 用户下拉动作
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    let data = {
      pageSize: this.data.pageSize,
      currentPage: 1,
    }
    let url = Ip + Api.index.collect
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