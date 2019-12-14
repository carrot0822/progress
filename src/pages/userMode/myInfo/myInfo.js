//logs.js
const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Store = App.Store
let Router = App.Router

Page({
    data:{
        userInfo:{
            cardNumber:"",
            readerName:""
        }
    },
    toMail() {
        wx.navigateTo({
            url:"../../userMode/reviseMail/reviseMail"
        })
    },
    toPhone(){
        wx.navigateTo({
            url:"../../userMode/revisePhone/revisePhone"
        })
        
    },
    _getUserInfo(params={}){
        let url = Ip + Api.index.getUser
        let data = params
        axios(url,data,'GET').then((res)=>{
           
                res.row.filterSex = this.filterSex(res.row.readerSex)
            
            if(res.state){
                this.setData({
                    userInfo:res.row
                })
            }
            console.log(res,'用户信息')
        })
    },
    filterSex(sex){
        let arr = ['女','男']
        return arr[sex]
    },
    onLoad(){
        this._getUserInfo()
    }
})