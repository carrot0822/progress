const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Router = App.Router
let Store = App.Store
Page({
    data: {
        inputMode: {
            inputValue: "",
            inputFocus: true
        },
        searchHis: ['社会心理学', '但是说不清', '测试应该够了', '再来几条', '有丶无聊啊'],
        clearShow: true,
        page: 1,
        height: 0,
        list:[],
        // 分页
        pageSize: 10,
        currentPage: 1,
        place: '',
        anyWord: ''

    },

    // 事件触发函数
    toIndex() {
        console.log("??")
        wx.switchTab({
            url: '../../index/index'
        })
    },
    watchInput(event) {
        console.log('输入的话', event.detail)
    },
    searchHis(event) {
        console.log(event)
    },
    search(event) {
        let obj = {}
        obj.anyWord = event.detail.value
        this._search(obj)
        console.log(event.detail, '点击搜索的话')
    },
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
                let height = Math.floor(multiple * res.windowHeight) - 33;
                that.setData({
                    height: height + 'rpx'
                })
                console.log(that.data.height, '比较后高度')
                console.log(res.model)
                console.log(res.pixelRatio)
                console.log(res.windowWidth)
                console.log(res.windowHeight)
                console.log(res.language)
                console.log(res.version)
                console.log(res.platform)
            }
        })
        console.log(place, history, '初始化')
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
                if (res.row.length < 15) {
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

                })
            }
            console.log('????啥 你阻塞了？')
            wx.hideLoading();
        })

    },
    //数据过滤函数
    // 生命周期函数
    //钩子函数
    toBottom() {
        var that = this
        let page = this.data.page + 1
        let testArr = ['1111', '2222', '3333', '4444']
        let data = this.data.searchHis.concat(testArr)
        that.setData({
            page: page,
            searchHis: data
        })
        console.log("已经到底了", this.data.page)
    },
    onLoad() {
        
        console.log("???")
        this.init()
        
        
    },

    onReachBottom() {
        var that = this
        let page = this.data.page + 1
        let testArr = ['1111', '2222', '3333', '4444']
        let data = this.data.searchHis.concat(testArr)
        that.setData({
            page: page,
            searchHis: data
        })
        console.log("已经到底了", this.data.page)
    }
})