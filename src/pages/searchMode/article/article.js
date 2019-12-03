var WxParse = require('../../../wxParse/wxParse.js');
const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Router = App.Router
let Store = App.Store

Page({
    data:{
        picture:'',
        detail:{},
        content:""
    },
    _selectOne(params={}){
        let data = params
        let url = Ip + Api.index.article
        axios(url, data, 'GET').then((res)=>{
            if(res.state){
                let pic = res.row.picture
                let article = res.row.content
                var that = this;
                this.setData({
                    picture:pic,
                    detail:res.row
                })
                WxParse.wxParse('article', 'html', article, that, 5);
            }
            console.log(res,'数据')
        })
    },
    onLoad(option){
        console.log(option,'参数')
        let obj = option
        this._selectOne(obj)
    }

})
