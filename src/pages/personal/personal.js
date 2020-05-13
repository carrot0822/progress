const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Store = App.Store
let Router = App.Router

Page({
    data: {
        userInfo: {
            avatarUrl: '',
            nickName: '',
        },
        cardInfo: {
            his: "", // 已借阅
            log: "", //  待还
        },
        cardNum: "",
        isBind: false,
        isAuth: 0,
        flag: false, // 测试是否是第一次进来是否授权了

    },
    // 更多资料
    toMyInfo() {
        wx.navigateTo({
            url: "../userMode/myInfo/myInfo",
            events: {

            },
            success() {
                console.log('调换成功')
            }
        })
    },
    // 路由跳转
    toCollect() {
        wx.navigateTo({
            url: "/pages/userMode/collect/collect",
            events: {

            },
            success() {
                console.log('调换成功')
            }
        })
    },
    toBorRet() {
        wx.navigateTo({
            url: "../../component/tab/index",
            events: {

            },
            success() {
                console.log('调换成功')
            }
        })
    },
    toReaderCard() {

        wx.navigateTo({
            url: "../userMode/readerCard/readerCard",
            events: {

            },
            success() {
                console.log('调换成功')
            }
        })
    },
    toUnbind() {
        wx.navigateTo({
            url: "../userMode/unBindCard/unBindCard",
        })
    },
    toBill() {
        wx.navigateTo({
            url: "../userMode/bill/bill",
        })
    },
    toAboutUs() {
        wx.navigateTo({
            url: "../userMode/about/about",
        })
    },
    toSuggestion() {
        wx.navigateTo({
            url: "../userMode/suggestion/suggestion",
        })
    },
    init() {
        // 判定是否授权 授权后渲染头像和名字
        let isAuth = wx.getStorageSync('isAuth') || 0;
        console.log(isAuth, '到底授权没')
        let token = wx.getStorageSync('token') || ''
        this.setData({
            isAuth: isAuth
        })
        // 判定是否授权
        if (isAuth) {
            let {
                avatarUrl,
                nickName
            } = App.globalData.userInfo
            console.log(avatarUrl, nickName)
            this.setData({
                userInfo: App.globalData.userInfo
            })
        }
        // 判定是否绑卡
        if (token) {
            Store.setItem('entry', true); // 第一次进来是否授权
            this.setData({
                isBind: true,

            })
            this._getUserInfo()
            this._getNumbers()
        } else {
            Store.setItem('entry', false);
        }
        // 判定是否绑定卡号 授权后 调取用户信息
        console.log(App, '开始获取用户信息')
    },
    toBindCard() {
        wx.navigateTo({
            url: "../bindCard/bindCard",
        })
    },
    // API
    _getNumbers(params = {}) {
        let url = Ip + Api.index.numbers
        let data = params
        axios(url, data, 'GET').then((res) => {
            if (res.state) {
                let data = res.row
                this.setData({
                    cardInfo: data
                })
            }
            // 停止下拉动画
            wx.stopPullDownRefresh()
            console.log(res, '借阅数量')
        })
    },
    // 登录授权
    _login(params = {}) {
        let url = Ip + Api.index.login
        let data = params
        axios(url, data, 'POST').then((res) => {
            if (res.state) {
                App.globalData.card.openId = res.row.openId
                App.globalData.card.sessionKey = res.row.sessionKey
                App.globalData.card.skey = res.row.skey
                wx.setStorageSync('token', res.row.authorization)
                // 判定是否绑了卡 绑卡开始刷新页面
                let token = res.row.authorization
                if (token) {
                    this.setData({
                        isBind: true,
                    })
                    this._getUserInfo()
                    this._getNumbers()
                } else {
                    this.setData({
                        isBind: false,
                    })
                }
            }




            console.log('授权换token', res)
        })
    },
    _getUserInfo(params = {}) {
        let url = Ip + Api.index.getUser
        let data = params
        axios(url, data, 'GET').then((res) => {
            if (res.state) {

                let number = res.row.cardNumber
                this.setData({
                    cardNum: number
                })
            }


            console.log(res, '用户信息')
        })
    },
    onGotUserInfo(e) {
        if (e.detail.signature) {
            this.setData({
                isAuth: 1
            })
            // 开始存储信息 并且发送登录请求获取token
            App.globalData.userInfo = e.detail.userInfo
            App.globalData.user = e.detail
            let obj = {}
            obj.code = App.globalData.code
            obj = Object.assign(obj, e.detail)
            wx.setStorageSync('isAuth', 1)
            let {
                avatarUrl,
                nickName
            } = App.globalData.userInfo
            console.log(avatarUrl, nickName)
            this.setData({
                userInfo: App.globalData.userInfo
            })
            this._login(obj)
        } else {
            console.log('没授权吧')
        }
    },
    // 钩子函数
    onLoad() {
        this.init()
    },
    // 每次展现出来
    onShow() {
        let juge = Store.getItem('entry') // 可以考虑存全局
        let token = wx.getStorageSync('token') || ''
        console.log(juge, '授权？', token, 'token')
        if (token) {
            if (!juge) {
                this.setData({
                    isBind: true,
                })
                Store.setItem('entry', true);
                this._getUserInfo()
                this._getNumbers()
            } else {
                Store.setItem('entry', true);
                //this._getNumbers()
                console.log('第一次进来已经授权了')
            }
        }
    },
    /**
     * 判定是否绑定看读者卡 flag 绑定了就不跳转
     */
    // 下拉刷新
    onPullDownRefresh(){
        let juge = Store.getItem('entry') // 可以考虑存全局
        let token = wx.getStorageSync('token') || ''
        console.log(juge, '授权？', token, 'token')
        if (token) {
            if (juge) {
                this._getNumbers()
            }
        }
    }
})