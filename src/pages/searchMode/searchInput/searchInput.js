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
        clearShow: false, // 点叉了吗
        page: 1,
        height: 0,
        list: [],
        noResult:false, // 没有结果
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
                currentPage: 1,
                noResult:false,
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
        this._initSearch(obj)
        console.log(event)
    },
    clearHis() {
        this.setData({
            searchHis: [],
            noResult:false,
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
        let searchHis =this.data.searchHis
        console.log(searchHis,'转为set之后')
        // 空值搜索不记录历史
        if (searchHis.length > 5) {
            searchHis.unshift(event.detail.value)
            searchHis.pop()
        } else {
            searchHis.unshift(event.detail.value)
        }
        searchHis = new Set(searchHis)
        console.log(searchHis,'去重结束了吗')
        let arr = [...searchHis]
        Store.setItem('history',arr)
        this.setData({
            historyShow: false,
            searchHis: arr
        })
        this._initSearch(obj)
        console.log(event.detail, '点击搜索的话', arr, '搜索历史')
    },
    // 过滤函数
    filterNull(obj) {
        for (let key in obj) {
            if (obj[key] || key== "coverPhotoUrl") {

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
    // api
    _initSearch(params = {}){
        let place = this.data.place
        let obj = {
            place: place,
            pageSize: 10,
            currentPage: 1
        }
        this.setData({
            pageSize: 10,
            currentPage: 1
        })
        let data = Object.assign(obj, params)
        let url = Ip + Api.index.search
        // 请求开始
        axios(url, data, 'GET').then((res) => {
            if (res.state) {
                // 判断是否还有下一页 可以用page来判定
                if (res.row.length < 10) {
                    this.setData({
                        toBottom: true
                    })
                    console.log(this.data.toBottom)
                }
                
                let arr = res.row
                for (let item of arr) {
                    this.filterNull(item)
                    item.introduction = this.filterStr(item.introduction)
                }
                
                let len = arr.length
                let noResult = len?false:true;
                this.setData({
                    list: arr,
                    noResult:noResult
                })
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000,
                })
            }
        })
    },
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
        axios(url, data, 'GET').then((res) => {
            if (res.state) {
                // 判断是否还有下一页 可以用page来判定
                if (res.row.length < 10) {
                    this.setData({
                        toBottom: true
                    })
                }
                let arr = res.row
                for (let item of arr) {
                    this.filterNull(item)
                    item.introduction = this.filterStr(item.introduction)
                }
                let newArr = this.data.list.concat(res.row)
                let len = newArr.length
                let noResult = len?false:true;
                this.setData({
                    list: newArr,
                    noResult:noResult
                })
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000,
                })
            }
        })

    },
    //数据过滤函数
    toBottom(e) {
        let juge = this.data.toBottom
        let obj = {}
        obj.anyWord = this.data.inputValue
        if (!juge) {
            let currentPage = ++this.data.currentPage
            
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