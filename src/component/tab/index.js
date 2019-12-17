const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Store = App.Store
let Router = App.Router
let filter = require('../../utils/util')


Page({
  data: {
    borrow: [],
    history: [],
    historyObj: {
      toBottom: false,
      pageSize: 10,
      currentPage: 1,
    },
    borrowObj: {
      toBottom: false,
      pageSize: 10,
      currentPage: 1,
    },
    tabs: ['我的借阅', '历史借阅'],
    tabsCount: 0, // tabs个数
    stv: {
      windowWidth: 0, // 设备宽度
      lineWidth: 0, // 线条宽度
      offset: 0, // 线条和slider滑动的距离
      tStart: false // 滑动控制器 滑动开始控制的样式
    },
    activeTab: 0, // 当前触发的tab
  },
  // API
  _initBorrow(params = {}){
    let {
      borrowObj
    } = this.data
    let obj = {
      pageSize: 10,
      currentPage: 1,
      toBottom:false
    }
    this.setData({
      borrowObj:obj
    })
    let data = Object.assign(obj, params)
    let url = Ip + Api.index.myBro
    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        // 判断是否还有下一页 可以用page来判定
        if (res.row.length < 10) {
          borrowObj.toBottom = true
          this.setData({
            borrowObj: borrowObj
          })
        }
        for(let item of res.row){
          item.toDate = filter.formatTime(item.planReturnTimeLong,'yyyy-MM-dd')
        }
        let arr = res.row
        this.setData({
          borrow: arr
        })
        console.log(this.data.borrow, '现在的数据', res)
      } else {}
    })
  },
  _borrow(params = {}) {
    let {
      borrowObj
    } = this.data
    let obj = {
      pageSize: borrowObj.pageSize,
      currentPage: borrowObj.currentPage
    }
    let data = Object.assign(obj, params)
    let url = Ip + Api.index.myBro
    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        // 判断是否还有下一页 可以用page来判定
        if (res.row.length < 10) {
          borrowObj.toBottom = true
          this.setData({
            borrowObj: borrowObj
          })
        }
        console.log(this.data.borrow, '现在的数据', res)
        for(let item of res.row){
          item.toDate = filter.formatTime(item.planReturnTimeLong,'yyyy-MM-dd')
        }
        let arr = this.data.borrow.concat(res.row)
        this.setData({
          borrow: arr
        })
        console.log(this.data.borrow, '现在的数据', res)
      } else {}
    })
  },
  _history(params = {}) {
    let {
      historyObj
    } = this.data
    let obj = {
      pageSize: historyObj.pageSize,
      currentPage: historyObj.currentPage
    }
    let data = Object.assign(obj, params)
    let url = Ip + Api.index.broHis
    // 请求开始
    /* this.setData({
      loading: true
    }) */
    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        // 判断是否还有下一页 可以用page来判定
        if (res.row.length < 10) {
          historyObj.toBottom = true
          this.setData({
            historyObj: historyObj
          })
        }
        console.log(this.data.history, '现在的数据', res)
        
        let arr = this.data.history.concat(res.row)
        this.setData({
          history: arr
        })
        console.log(this.data.history, '现在的数据', res)
      } else {}
      /* this.setData({
        loading: false
      }) */
    })
  },
  _renew(params = {}) {

    let data = params
    let url = Ip + Api.index.renew
    let that = this
    axios(url, data, 'POST').then((res) => {
      if (res.state) {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000,
          success: (result)=>{
            setTimeout(()=>{
              that._initBorrow()
            },1000)
            
          },
        })
        
        console.log("????")
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000
        })
      }



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
  filterStr(str) {
    let len = str.length
    let result = str
    if (len > 60) {
      result = str.slice(0, 60) + '...'
    }
    return result
  },
  //上拉
  historyBottom(e) {
    let {
      historyObj
    } = this.data
    let juge = historyObj.toBottom
    historyObj.currentPage = ++historyObj.currentPage
    if (!juge) {
      this.setData({
        historyObj: historyObj
      })
      this._borrow()
    }
    console.log("上拉刷新会怎么样 那个logo", e)
  },
  borrowBoottom(e) {
    let {
      borrowObj
    } = this.data
    let juge = borrowObj.toBottom
    borrowObj.currentPage = ++borrowObj.currentPage
    if (!juge) {
      this.setData({
        borrowObj: borrowObj
      })
      this._history()
    }
    console.log("上拉刷新会怎么样 那个logo", e)
  },
  renewBtn(e) {
    let arr = []
    arr.push(e.currentTarget.id)
    let obj = {}
    obj.logids = arr
    this._renew(obj)
    console.log(e)
  },
  // 非业务代码
  _updateSelectedPage(page) {
    let {
      stv,
      activeTab
    } = this.data
    activeTab = page // 更改当前指向
    stv.offset = stv.windowWidth * activeTab
    this.setData({
      stv,
      activeTab
    })
  },
  handlerTabTap(e) {
    let index = e.currentTarget.dataset.index
    this._updateSelectedPage(index)
  },
  // 滑动事件
  handlerStart(e) {
    // 记录滑动初始距离
    let {
      clientX,
      clientY
    } = e.touches[0];
    this.startX = clientX;
    this.tapStartX = clientX;
    this.tapStartY = clientY;
    this.tapStartTime = e.timeStamp;
    this.data.stv.tStart = true;
    this.setData({
      stv: this.data.stv
    })
    console.log(e.touches, '触摸事件', e.timeStamp)
    console.log(this, '页面实例直接赋值啊- -')

  },
  // 这里不停的触发 是否需要一个函数节流
  handlerMove(e) {
    let {
      clientX,
      clientY
    } = e.touches[0];
    let {
      stv
    } = this.data
    let offsetX = this.startX - clientX; // 偏移的距离 这里涉及到一个左滑右滑的判定 左滑正负的问题
    console.log(offsetX, '偏移距离', this.startX, clientX)
    this.startX = clientX // 移动刷新clientX
    stv.offset += offsetX // 移动更新offsetX
    if (stv.offset <= 0) {
      stv.offset = 0;
    } else if (stv.offset >= stv.windowWidth * (this.tabsCount - 1)) {
      stv.offset = stv.windowWidth * (this.tabsCount - 1); // 这个边界问题 如果 减1是正确的 0才是第一张 最后一张是 n-1*偏移量
    }
    this.setData({
      stv: stv
    });
  },
  handlerCancel(e) {
    console.log(e, '触摸结束')
  },
  handlerEnd(e) {
    let {
      clientX,
      clientY
    } = e.changedTouches[0];
    let endTime = e.timeStamp;
    let {
      tabs,
      stv,
      activeTab
    } = this.data;
    let {
      offset,
      windowWidth
    } = stv;
    let intervalTime = endTime - this.tapStartTime // 间隔时间
    // 快速滑动
    /*
    if(intervalTime <=300){
      // 向左滑动?
      
      if(Math.abs(this.tapStartY - clientY) < 50 ){
        // X轴平移距离5为界限 300ms内滑动的距离过大 直接页面加一 主要是这个判定距离的问题 如果只有两个就不需要
        if(this.tapStartX - clientX > 5){
          if(activeTab < this.tabsCount -1) {
            this.setData({activeTab: ++activeTab})
          }
        } else {
          if(activeTab > 0) {
            this.setData({activeTab: --activeTab})
          }
        }
        stv.offset = stv.windowWidth*activeTab;
      } else {
        // 快速滑动 Y距离大于50 判断Y？ 左右滑动？
        let page = Math.round(offset/windowWidth)
        if (activeTab != page) {
          this.setData({activeTab: page})
        }
        stv.offset = stv.windowWidth*page;
      }
     
    } else {
      // 慢速移动
      let page = Math.round(offset/windowWidth); // 滑动的页面次数 向更大的整数取整 四舍五入
      // 修改当前activeTab
      if(activeTab != page){
        this.setData({activeTab: page})
      }
      // 偏移
      stv.offset = stv.windowWidth*page
    }
    */
    // 去除快速移动就正常了
    let page = Math.round(offset / windowWidth); // 滑动的页面次数 向更大的整数取整 四舍五入
    // 修改当前activeTab
    if (activeTab != page) {
      this.setData({
        activeTab: page
      })
    }
    // 偏移
    stv.offset = stv.windowWidth * page
    stv.tStart = false;
    this.setData({
      stv: this.data.stv
    })
  },
  onLoad: function () {
    // 获取初始的tab各个边框的长度和线条长度分配
    try {
      let {
        tabs
      } = this.data
      let len = tabs.length
      let res = wx.getSystemInfoSync()

      this.data.stv.lineWidth = res.windowWidth / len
      this.data.stv.windowWidth = res.windowWidth
      this.data.tabsCount = len
      this.tabsCount = len
      this.setData({
        stv: this.data.stv
      })
      console.log(filter.formatTime(1576461876147,'yyyy-MM-dd'),'转换时间')
      console.log(res, '获取设备信息', len, tabs)
    } catch (e) {

    }
    this._initBorrow()
    this._history()

  }
})