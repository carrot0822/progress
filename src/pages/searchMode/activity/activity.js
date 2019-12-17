const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Router = App.Router
let Store = App.Store

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
  toArticle(e) {
    let {
      id
    } = e.currentTarget
    let obj = {}
    obj.id = id
    console.log(e, '如果拿的到', id)
    Router.push({
      path: "article",
      query: obj,
      openType: 'nav'
    })
  },
  // 初始查询
  _initSearch(){
    let data = {}
    let url = Ip + Api.index.activeList
    // 请求开始
    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        // 判断是否还有下一页 可以用page来判定
        if (res.row.length < 10) {
          this.setData({
            toBottom: true
          })
        }
        for(let item of res.row){
          item.introducation = this.filterStr(item.introducation)
          item.date = this.filterDate(item.createTime)
        }
        this.setData({
          list: res.row
        })
        console.log(this.data.list, '现在的数据', res)
      } else {}

    })
  },
  /**
   * 
   * @param {string} date 
   * 2019-12-03 10:43:27
   */
  filterDate(date){
    let year = date.slice(0,4)
    let month = date.slice(5,7)
    let day = date.slice(8,10)
    let ym = year + '年' + month + '月'
    let obj = {
      ym:ym,
      day:day
    }
    console.log(obj)
    return obj
  },
  /**
   * 
   * @param {string} str 
   */
  filterStr(str) {
    let len = str.length
    let result = str
    if (len > 60) {
      result = str.slice(0, 60) + '...'
    }
    return result
  },
  // 查询
  _search(params = {}) {
    let obj = {
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage
    }
    let data = Object.assign(obj, params)
    let url = Ip + Api.index.activeList
    // 请求开始
    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        // 判断是否还有下一页 可以用page来判定
        if (res.row.length < 10) {
          this.setData({
            toBottom: true
          })
        }
        for(let item of res.row){
          item.introducation = this.filterStr(item.introducation)
          item.date = this.filterDate(item.createTime)
        }
        let arr = this.data.list.concat(res.row)
        this.setData({
          list: arr
        })
        console.log(this.data.list, '现在的数据', res)
      } else {}

    })

  },
  onLoad() {
    this._initSearch()
  },
  // 下拉加载更多
  onReachBottom() {
    let juge = this.data.toBottom
    let currentPage = ++this.data.currentPage
    if (!juge) {
      this.setData({
        currentPage: currentPage
      })
      this._search()
    }
    console.log('一脸懵逼的看着你')
  },

})