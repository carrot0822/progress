const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios

Page({
    data: {
        title:'',
        phone:'',
        url:''
    },
    _search(params = {}) {
        let url = Ip + Api.index.aboutUs
        let data = params
        axios(url, data, 'GET').then((res) => {
            if (res.state) {
                let {title,phone,url} = res.row
                this.setData({
                    title,
                    phone,
                    url
                })
            }
        })
    },
    // 钩子函数
    onLoad() {
        this._search()
    },
})