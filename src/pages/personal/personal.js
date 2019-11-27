const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Store = App.Store
let Router = App.Router

Page({
    data: {
        userInfo:{
            avatarUrl:'',
            nickName:'',
        },
        cardInfo:{
            his:"", // 已借阅
            log:"", //  待还
        },
        cardNum:"",
        isBind:false,
        isAuth:0,
    },
    // 更多资料
    toMyInfo(){
        wx.navigateTo({
            url:"../userMode/myInfo/myInfo",
            events:{

            },
            success(){
                console.log('调换成功')
            }
        })
    },
    // 路由跳转
    toCollect(){
        wx.navigateTo({
            url:"/pages/userMode/collect/collect",
            events:{

            },
            success(){
                console.log('调换成功')
            }
        })
    },
    toBorRet(){
        wx.navigateTo({
            url:"../../component/tab/index",
            events:{

            },
            success(){
                console.log('调换成功')
            }
        })
    },
    toReaderCard(){
        
        wx.navigateTo({
            url:"../userMode/readerCard/readerCard",
            events:{

            },
            success(){
                console.log('调换成功')
            }
        })
    },
    toUnbind(){
        wx.navigateTo({
            url:"../userMode/unBindCard/unBindCard",
        })
    },
    toBill(){
        wx.navigateTo({
            url:"../userMode/bill/bill",
        })
    },
    toAboutUs(){
        wx.navigateTo({
            url:"../userMode/about/about",
        })
    },
    toSuggestion(){
        wx.navigateTo({
            url:"../userMode/suggestion/suggestion",
        })
    },
    init(){
        // 判定是否授权 授权后渲染头像和名字
        let isAuth = wx.getStorageSync('isAuth')||0;
        console.log(isAuth,'到底授权没')
        let token  = wx.getStorageSync('token')||''
        this.setData({
            isAuth: isAuth
        })
        if(isAuth){
            let {avatarUrl,nickName} = App.globalData.userInfo
            console.log(avatarUrl,nickName)
            this.setData({
                userInfo:App.globalData.userInfo
            })
        }
        if(token){
            this._getUserInfo()
            this._getNumbers()
        }
        // 判定是否绑定卡号 授权后 调取用户信息
        console.log(App,'开始获取用户信息')
    },
    toBindCard(){
        wx.navigateTo({
            url:"../bindCard/bindCard",
        })
    },
    // API
    _getNumbers(params = {}){
        let url = Ip + Api.index.numbers
        let data = params
        axios(url,data,'GET').then((res)=>{
            if(res.state){
                let data = res.row
                this.setData({
                    cardInfo:data
                })
            }
            console.log(res,'借阅数量')
        })
    },
    // 登录授权
    _login(params = {}) {
        let url = Ip + Api.index.login
        let data = params
        axios(url, data, 'POST').then((res) => {
          App.globalData.card.openId = res.row.openId
          App.globalData.card.sessionKey = res.row.sessionKey
          App.globalData.card.skey = res.row.skey
          wx.setStorageSync('token', res.row.authorization)
          
          // 那么就要开始换数据了 调用换取数据接口 如果toekn不为空的话
          
          console.log('授权换token', res)
        })
    },
    _getUserInfo(params={}){
        let url = Ip + Api.index.getUser
        let data = params
        axios(url,data,'GET').then((res)=>{
            if(res.state){
                this.setData({
                    isBind:true,
                })
                let number = res.row.cardNumber
                this.setData({
                    cardNum:number
                })
            }
            
            
            console.log(res,'用户信息')
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
          this._login(obj)
        } else {
          console.log('没授权吧')
        }
      },
    // 钩子函数
    onLoad(){
        this.init() 
    },
    onShow(){
        
    }
    /**
     * 判定是否绑定看读者卡 flag 绑定了就不跳转
     */

})