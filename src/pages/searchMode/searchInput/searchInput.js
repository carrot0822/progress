const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Router = App.Router
let Store = App.Store
Page({
    data: {

        inputValue: "",
        inputFocus: true,
        searchHis: [],
        historyShow: true,
        clearShow: false,
        page: 1,
        height: 0,
        list: [],
        // 分页
        toBottom: false, //判断是否有下一页 是否到底了
        pageSize: 10,
        currentPage: 1,
        place: '',
        anyWord: ''

    },

    // 事件触发函数
    clear() {
        this.setData({
            inputValue: '',
            clearShow: false,
            historyShow: true,
            list: [],
            currentPage: 1
        })
        console.log('小图标不配绑定事件？')
    },
    toIndex() {
        console.log("??")
        wx.switchTab({
            url: '../../index/index'
        })
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
    watchInput(event) {
        let juge = this.data.clearShow
        if (!juge) {
            this.setData({
                clearShow: true,
            })
        }
        // 如果没有输入值 那么搜索结果和X都该消失
        if (!event.detail.cursor) {
            this.setData({
                clearShow: false,
                list: [],
                historyShow: true,
                currentPage: 1
            })
        }
        console.log('输入的话', event.detail)
    },
    searchHis(event) {
        let obj = {}
        let value = event.currentTarget.dataset.item
        obj.anyWord = value
        this.setData({
            historyShow: false,
            clearShow: true,
            inputValue: value
        })
        this._search(obj)
        console.log(event)
    },
    clearHis() {
        this.setData({
            searchHis: []
        })
        Store.setItem('history', [])
    },
    search(event) {
        if (!event.detail.value) {
            wx.showToast({
                title: '请输入关键词',
                icon: 'none',
                duration: 2000,
            })
            return
        }
        let obj = {}
        obj.anyWord = event.detail.value
        // 存入本地 并且关闭历史
        let searchHis = this.data.searchHis
        // 空值搜索不记录历史
        if (searchHis.length > 5) {
            searchHis.unshift(event.detail.value)
            searchHis.pop()
        } else {
            searchHis.unshift(event.detail.value)
        }

        this.setData({
            historyShow: false,
            searchHis: searchHis
        })
        this._search(obj)
        console.log(event.detail, '点击搜索的话', searchHis, '搜索历史')
    },
    // api
    _search(params = {}) {
        // 初始参数配置
        let place = this.data.place
        let obj = {
            place: place,
            pageSize: this.data.pageSize,
            currentPage: this.data.currentPage
        }
        let data = Object.assign(obj, params)
        let url = Ip + Api.index.search
        // 请求开始
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
                let arr = this.data.list.concat(res.row)
                this.setData({
                    list: arr
                })
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000,
                })
            }
            console.log('????啥 你阻塞了？')
            wx.hideLoading();
        })

    },
    //数据过滤函数
    toBottom(e) {
        let juge = this.data.toBottom
        let currentPage = ++this.data.currentPage
        let obj = {}
        obj.anyWord = this.data.inputValue
        if (!juge) {
            this.setData({
                currentPage: currentPage
            })
            this._search(obj)
        }
        console.log("上拉刷新会怎么样 那个logo", e)
    },
    // 生命周期函数
    init() {
        let that = this
        let place = Store.getItem('lib').name || ""
        let history = Store.getItem('history') || []
        this.setData({
            place: place,
            searchHis: history
        })
        wx.getSystemInfo({
            success(res) {
                let multiple = 750 / res.windowWidth
                let height = Math.floor(multiple * res.windowHeight) - 120;
                that.setData({
                    height: height + 'rpx'
                })
                console.log(that.data.height, '比较后高度')
            }
        })
        console.log(place, history, '初始化')
    },
    onLoad() {

        console.log("???")
        this.init()


    },
    onUnload() {
        let searchHis = this.data.searchHis
        Store.setItem('history', searchHis)
        console.log('页面离开后')
    },

})