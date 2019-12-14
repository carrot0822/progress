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
    isOk:false,
    toBottom: false,
    loading: false,
    errorTxt: '出现异常',
    first: false, // 可用来判定是不是第一次进来
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

  // 事件
  renewBtn(e) {
    
      
    let arr = []
    arr.push(e.currentTarget.id)
    let obj = {}
    obj.logids = arr
    this._renew(obj)
    
    console.log(e)
  },
  _renew(params = {}) {

    let data =  params
    let url = Ip + Api.index.renew

    axios(url, data, 'POST').then((res) => {
      if (res.state) {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000
        })
        this._initSearch()
        console.log("????")
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
      
      
      
    })
  },
  _initSearch(params = {}) {
    let obj = {
      pageSize: 10,
      currentPage: 1,
      toBottom:false
    }
    this.setData({
      pageSize:obj.pageSize,
      currentPage:obj.currentPage
    })
    let data = Object.assign(obj, params)
    let url = Ip + Api.index.myBro
    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        // 判断是否还有下一页 可以用page来判定
        if (res.row.length < 10) {
          this.setData({
            toBottom: true
          })
        }
        console.log(this.data.list, '现在的数据', res)

        let arr = res.row
        this.setData({
          list: arr
        })
        console.log(this.data.list, '现在的数据', res)
      } else {}
    })
  },
  _search(params = {}) {
    let obj = {
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage
    }
    let data = Object.assign(obj, params)
    let url = Ip + Api.index.myBro
    // 请求开始
    /* this.setData({
      loading: true
    }) */
    wx.showLoading({
      title: '正在加载',
    })
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
        this.setData({
          list: arr
        })
        console.log(this.data.list, '现在的数据', res)
      } else {}
      wx.hideLoading();
      /* this.setData({
        loading: false
      }) */
    })

  },
  // 过滤函数
  filterNull(obj) {
    for (let key in obj) {
      if (obj[key]) {

      } else {
        obj[key] = '无数据'
      }
    }
  },
  // 钩子函数
  onLoad(option) {
    console.log(option, '是否有效')
    this._initSearch()
  },
  // 用户上拉触底
  onReachBottom(e) {
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
    let url = Ip + Api.index.myBro
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