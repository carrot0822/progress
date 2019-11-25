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
        height:0,
        change: 0, // 左右判定
    },

    //
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
    change(e) {
        let value = e.currentTarget.dataset.num
        this.setData({
            change: value
        })
        console.log(value, '点击的值是什么')
    },
    toBottom(e) {
        
        console.log("上拉刷新会怎么样 那个logo", e)
    },
    init() {
        let that = this
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
        
    },
    onLoad() {
        this._history()
        this._borrow()
        this.init()
    }
})