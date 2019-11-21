let App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Store = App.Store
Page({
    data: {
        inputMode: {
            inputValue: "",

        },
        list: [],
        clearShow: false,
        page: 1,
        height: 0
    },

    // 事件触发函数
    toIndex() {
        console.log("??")
        wx.switchTab({
            url: '/pages/index/index',
            success() {
                let page = getCurrentPages().pop();
                console.log('那么这里拿到的页面信息', page)
                if (page == undefined || page == null) return;
                page.onLoad()
            }
        })
    },
    watchInput(event) {
        let detail = event.detail

        if (this.data.clearShow) {
            console.log('已经是true了')
        } else {
            if (detail.cursor) {
                this.setData({
                    clearShow: true
                })
            } else {
                this.setData({
                    clearShow: false
                })
            }
        }

        console.log('输入的话', event.detail, detail.cursor)
    },
    clear() {
        this.setData({
            clearShow: false,
            inputMode: {
                inputValue: ''
            }
        })
        console.log('肯定没执行')
    },
    select(e) {
        // 把name存在本地
        let data = e.currentTarget.dataset.item
        let front = Store.getItem('lib') || {
            name: ''
        }
        if (front.name == data.name) {
            wx.switchTab({
                url: '/pages/index/index',
            })
        } else {
            Store.setItem('lib', data)
            this.toIndex()
        }

        console.log(e, '数据肯定是这里拿啊')
    },
    searchBtn(e) {
        let obj = {}
        obj.name = e.detail.value
        this._search(obj)

    },
    // api
    _search(params) {
        let data = params || {}
        let url = Ip + Api.libSelect.search
        axios(url, data, 'GET').then((res) => {
            let list = res.row
            this.setData({
                list: list
            })
            console.log(url, App, this.data.list)
        })
    },

    onLoad() {
        let that = this
        console.log("???")
        this._search()
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
    },

})