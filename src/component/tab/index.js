const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Store = App.Store
let Router = App.Router



Page({
  data: {
    borrow: [],
    history: [],
    historyObj:{

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
  _borrow(params = {}) {
    let obj = {}
    let data = Object.assign(obj, params)
    let url = Ip + Api.index.myBro
    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        let arr = res.row

        this.setData({
          borrow: arr
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
        })
      }
    })
  },
  _history(params = {}) {
    let obj = {}

    let data = Object.assign(obj, params)
    let url = Ip + Api.index.broHis
    axios(url, data, 'GET').then((res) => {
      if (res.state) {
        let arr = res.row
        this.setData({
          history: arr
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',

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
  historyBottom(){

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
      console.log(res, '获取设备信息', len, tabs)
    } catch (e) {

    }
    this._borrow()
    this._history()

  }
})