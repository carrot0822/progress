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
    allId:[], // 存储当前的ID
    pageSize: 10,
    currentPage: 1,

    toBottom: false,
    loading: false,
    errorTxt: '出现异常',
    first: false, // 可用来判定是不是第一次进来
    
    checkMap:{}, // 最终被选中的数组 用于提交
    allChecked:false, // 控制是否全选
    height:0,
  },

  singeChange(e){
     let map = this.data.checkMap
    // 单个选择
    if(e.detail.value[0]){
      console.log(e.detail.value[0])
      map.set(e.currentTarget.id,e.detail.value[0])
    }else{
      map.delete(e.currentTarget.id)
    }
    
    console.log(e,'单个延迟',map)
  },
  checkboxChange(e){
    
    // 全选则把所有数据加入到checkArr 取消全选则初始化checkArr
    if(e.detail.value[0]){
      this.setData({
        allChecked:true,
        checkMap:this.data.allId
      })
    }else{
      this.setData({
        allChecked:false,
        checkMap:new Map()
      })
    }
    console.log(e,'事件对象',this.data.checkMap)
  },
  submit(){
    let obj = {}
    let ids =[...this.data.checkMap.keys()]
    obj.ids = ids
    this._cancelCollet(obj)
    console.log(ids,'是否')
  },
  // 控制打开和关闭移除
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
  _initSearch(params={}){
    let data = params
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
        let arr = res.row // 如果arr就是哈希 那就可以直接调用delete删除了
        let allId = new Map()
        for(let item of arr){
          allId.set(item.id,item.bookName)
        }
        this.setData({
          list: arr,
          allId: allId
        })
        console.log(this.data.list, '现在的数据', allId)
      } else {}

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
        

        let arr = this.data.list.concat(res.row)
        let allId = new Map()
        for(let item of arr){
          allId.set(item.id,item.bookName)
        }
        this.setData({
          list: arr,
          allId: allId
        })
        console.log(this.data.list, '现在的数据', allId)
      } else {}

    })

  },
  _cancelCollet(params = {}){
    let data = params
    let url = Ip + Api.index.batchCancel
    axios(url,data,'DELETE').then((res)=>{
      if(res.state){
        this.data.checkMap = new Map()
        this.setData({
          allChecked:false
        })
        console.log(this.data.checkMap)
        this._initSearch()
        // 成功之后调整参数 然后进行搜索刷新
      }else{

      }

      wx.showToast({
        title: res.msg,
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
      console.log(res)
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
    let that = this
    wx.getSystemInfo({
      success(res) {
          let multiple = 750 / res.windowWidth
          let height = Math.floor(multiple * res.windowHeight) - 100;
          that.setData({
              height: height + 'rpx'
          })
          console.log(that.data.height, '比较后高度')
      }
  })
    console.log(option, '是否有效')
    let map = new Map()
    
    this.data.checkMap = map
    console.log(this.data.checkMap,'哈希是怎么样的')
    this._search()
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